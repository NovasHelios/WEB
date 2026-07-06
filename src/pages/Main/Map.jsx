import { useEffect, useRef, useState } from "react";
import SideBar from "@/components/layout/box/SideBar";
import NavBar from "@/components/layout/box/NavBar";
import SpecificLand from "@/components/ui/SpecificLand/SpecificLand";
import { MapPage, MapContainer, SideBarArea, NavBarArea } from "./Map.styled";
import markupImage from "@/images/markup.png";
import useSidebarOpen from "@/hooks/useSidebarOpen";
import { renderLandMarkers, updateLandLayerByZoom } from "./mapMarker";

function MainMap() {
  // VWorld 지도가 렌더링될 DOM 요소를 참조하기 위한 ref
  const mapElementRef = useRef(null);

  // 생성된 VWorld 지도 객체를 저장하기 위한 ref
  // useRef를 쓰면 컴포넌트가 리렌더링되어도 값이 유지됨
  const mapInstanceRef = useRef(null);

  // 등록된 토지 마커를 담을 OpenLayers 레이어
  const landMarkerLayerRef = useRef(null);

  // 등록된 토지 경계선을 표시할 OpenLayers 레이어
  const landBoundaryLayerRef = useRef(null);

  // 구 단위 집계 마커를 표시할 레이어
  const landGroupLayerRef = useRef(null);

  // 지오코딩까지 끝난 토지 데이터를 저장해두는 ref
  const landDisplayDataRef = useRef([]);

  // 검색창에 입력한 주소 값을 저장하는 state
  const [keyword, setKeyword] = useState("");

  // 마커를 클릭했을 때 상세 패널에 보여줄 토지 정보
  const [selectedLand, setSelectedLand] = useState(null);

  // 좌측 사이드바 열림/닫힘 상태
  const [sidebarOpen, setSidebarOpen] = useSidebarOpen();

  // 검색 결과 패널에 보여줄 지역 추천 목록
  const [regionSuggestions, setRegionSuggestions] = useState([]);

  // 지역 추천 패널 표시 여부
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

  useEffect(() => {
    const initMap = () => {
      // 이미 지도가 생성되어 있으면 다시 만들지 않음
      if (mapInstanceRef.current) return;

      // 대구소프트웨어마이스터고등학교 근방 좌표
      const startingPoint = window.ol.proj.transform(
        [128.415, 35.664],
        "EPSG:4326",
        "EPSG:900913"
      );

      // VWorld 지도의 초기 중심 좌표 설정
      window.vw.ol3.CameraPosition.center = startingPoint;

      // VWorld 지도의 초기 줌 레벨 설정
      window.vw.ol3.CameraPosition.zoom = 14;

      // VWorld 지도 생성 옵션
      const options = {
        basemapType: window.vw.ol3.BasemapType.GRAPHIC,
        controlDensity: window.vw.ol3.DensityType.EMPTY,
        interactionDensity: window.vw.ol3.DensityType.BASIC,
        controlsAutoArrange: true,
        homePosition: window.vw.ol3.CameraPosition,
        initPosition: window.vw.ol3.CameraPosition,
      };

      // id가 vworld-map인 DOM 요소에 VWorld 지도 생성
      const map = new window.vw.ol3.Map("vworld-map", options);

      // 기존 마우스 휠 줌 interaction 제거
      map.getInteractions().forEach((interaction) => {
        if (interaction instanceof window.ol.interaction.MouseWheelZoom) {
          map.removeInteraction(interaction);
        }
      });

      // 감도를 낮춘 마우스 휠 줌 interaction 추가
      map.addInteraction(
        new window.ol.interaction.MouseWheelZoom({
          duration: 250,
          timeout: 120,
          maxDelta: 0.35,
        })
      );

      // 생성한 지도 객체를 ref에 저장
      mapInstanceRef.current = map;

      // 등록된 토지 필지 경계를 표시할 벡터 소스
      const landBoundarySource = new window.ol.source.Vector();

      // 등록된 토지 필지 경계를 표시할 벡터 레이어
      const landBoundaryLayer = new window.ol.layer.Vector({
        source: landBoundarySource,
        style: new window.ol.style.Style({
          stroke: new window.ol.style.Stroke({
            color: "#E53935",
            width: 3,
          }),
          fill: new window.ol.style.Fill({
            color: "rgba(229, 57, 53, 0.22)",
          }),
        }),
      });

      // 필지 경계 레이어를 먼저 추가
      map.addLayer(landBoundaryLayer);
      landBoundaryLayerRef.current = landBoundaryLayer;

      // 등록된 토지 마커를 표시할 벡터 소스 생성
      const landMarkerSource = new window.ol.source.Vector();

      // 등록된 토지 마커를 표시할 벡터 레이어 생성
      const landMarkerLayer = new window.ol.layer.Vector({
        source: landMarkerSource,
      });

      // 마커 레이어는 경계 레이어 뒤에 추가해서 위에 보이게 함
      map.addLayer(landMarkerLayer);
      landMarkerLayerRef.current = landMarkerLayer;

      // 축소 시 구/군/시 단위 집계 마커를 표시할 벡터 소스
      const landGroupSource = new window.ol.source.Vector();

      // 축소 시 구/군/시 단위 집계 마커를 표시할 벡터 레이어
      const landGroupLayer = new window.ol.layer.Vector({
        source: landGroupSource,
      });

      // 처음에는 확대 상태의 개별 마커를 보여줄 것이므로 집계 레이어는 숨김
      landGroupLayer.setVisible(false);

      // 지도에 집계 레이어 추가
      map.addLayer(landGroupLayer);

      // 나중에 줌 레벨에 따라 표시/숨김을 바꿀 수 있도록 ref에 저장
      landGroupLayerRef.current = landGroupLayer;

      // 지도와 레이어가 준비된 뒤 등록된 토지 목록 조회
      fetchRegisteredLands();

      // 지도 컨테이너 크기를 다시 계산
      setTimeout(() => {
        map.updateSize();
      }, 100);

      // VWorld 지도 내부의 OpenLayers View 객체 가져오기
      const view = map.getView();

      // 남한 주변으로 지도 이동 가능 범위 제한
      const koreaExtent = window.ol.proj.transformExtent(
        [125.0, 33.0, 130.0, 38.3],
        "EPSG:4326",
        "EPSG:900913"
      );

      // 지도 시작 지점
      view.setCenter(startingPoint);

      // 시작 줌 레벨 설정
      view.setZoom(17);

      // 줌 변경 이벤트 등록
      view.on("change:resolution", () => {
        const zoom = view.getZoom();

        // 더 넓은 범위까지 볼 수 있도록 최소 줌을 낮춤
        if (zoom < 9) {
          view.setZoom(9);
        }

        if (zoom > 20) {
          view.setZoom(20);
        }

        // 줌 레벨에 따라 개별 마커/읍면동 집계 마커 전환
        updateLandLayerByZoom({
          mapRef: mapInstanceRef,
          markerLayerRef: landMarkerLayerRef,
          boundaryLayerRef: landBoundaryLayerRef,
          groupLayerRef: landGroupLayerRef,
          displayDataRef: landDisplayDataRef,
        });
      });

      // 지도 중심 이동 이벤트 등록
      view.on("change:center", () => {
        const center = view.getCenter();

        if (!center) return;

        const clampedCenter = [
          Math.min(Math.max(center[0], koreaExtent[0]), koreaExtent[2]),
          Math.min(Math.max(center[1], koreaExtent[1]), koreaExtent[3]),
        ];

        if (center[0] !== clampedCenter[0] || center[1] !== clampedCenter[1]) {
          view.setCenter(clampedCenter);
        }
      });

      // 등록된 토지 마커 클릭 시 해당 위치로 최대 확대
      map.on("singleclick", async (event) => {
        const markerFeature = map.forEachFeatureAtPixel(
          event.pixel,
          (feature) => feature,
          {
            // 개별 마커 레이어와 그룹 레이어 모두 클릭 가능하게 설정
            layerFilter: (layer) =>
              layer === landMarkerLayerRef.current ||
              layer === landGroupLayerRef.current,
          }
        );

        if (!markerFeature) return;

        const geometry = markerFeature.getGeometry();
        if (!geometry) return;

        const coordinate = geometry.getCoordinates();

        // 개별 마커는 land를 가지고 있고,
        // 겹친 원형 마커는 latestLand를 가지고 있음
        const land = markerFeature.get("land");
        const latestLand = markerFeature.get("latestLand");

        // 겹친 마커면 최신 토지 1개를 상세 패널에 표시하고,
        // 일반 마커면 해당 토지를 표시
        const clickedLand = latestLand || land;

        if (clickedLand) {
          setSelectedLand(clickedLand);
        }

        const view = map.getView();

        if (clickedLand?.pnu) {
          const geojson = await fetchLandBoundaryByPnu(clickedLand.pnu);
          const extent = renderSelectedLandBoundary(geojson);

          if (extent) {
            view.fit(extent, {
              padding: [120, 80, 80, 520],
              duration: 500,
              maxZoom: 19,
            });

            return;
          }
        }

        view.setCenter(coordinate);
        view.setZoom(18);
      });
    };

    // VWorld/OpenLayers가 로드될 때까지 기다림
    const waitForVWorld = setInterval(() => {
      if (!window.vw || !window.vw.ol3 || !window.ol) {
        console.log("VWorld 또는 OpenLayers API 로드 대기 중...");
        return;
      }

      clearInterval(waitForVWorld);
      initMap();
    }, 100);

    // 컴포넌트가 사라질 때 interval 정리
    return () => {
      clearInterval(waitForVWorld);
    };
  }, []);

  // 입력된 시도 축약명 또는 정식명을 VWorld/내부 로직에서 사용할 정식 시도명으로 변환
  const normalizeSido = (keyword) => {
    // 앞뒤 공백 제거
    const value = keyword.trim();

    // 사용자가 입력할 수 있는 축약명/정식명을 모두 정식 시도명으로 매핑
    const aliases = {
      서울: "서울특별시",
      서울특별시: "서울특별시",

      경기: "경기도",
      경기도: "경기도",

      인천: "인천광역시",
      인천광역시: "인천광역시",

      부산: "부산광역시",
      부산광역시: "부산광역시",

      대구: "대구광역시",
      대구광역시: "대구광역시",

      대전: "대전광역시",
      대전광역시: "대전광역시",

      광주: "광주광역시",
      광주광역시: "광주광역시",

      울산: "울산광역시",
      울산광역시: "울산광역시",

      세종: "세종특별자치시",
      세종특별자치시: "세종특별자치시",

      제주: "제주특별자치도",
      제주특별자치도: "제주특별자치도",

      강원: "강원특별자치도",
      강원특별자치도: "강원특별자치도",

      충북: "충청북도",
      충청북도: "충청북도",

      충남: "충청남도",
      충청남도: "충청남도",

      전북: "전북특별자치도",
      전북특별자치도: "전북특별자치도",

      전남: "전라남도",
      전라남도: "전라남도",

      경북: "경상북도",
      경상북도: "경상북도",

      경남: "경상남도",
      경상남도: "경상남도",
    };

    // 매핑되는 값이 있으면 정식 시도명 반환, 없으면 원래 입력값 반환
    return aliases[value] || value;
  };

  // VWorld 행정구역 코드에서 시도 앞 2자리 코드
  // LT_C_ADSIGG_INFO의 sig_cd는 이 코드로 시작함
  const sidoCodeMap = {
    서울특별시: "11",
    부산광역시: "26",
    대구광역시: "27",
    인천광역시: "28",
    광주광역시: "29",
    대전광역시: "30",
    울산광역시: "31",
    세종특별자치시: "36",
    경기도: "41",
    강원특별자치도: "51",
    충청북도: "43",
    충청남도: "44",
    전북특별자치도: "52",
    전라남도: "46",
    경상북도: "47",
    경상남도: "48",
    제주특별자치도: "50",
  };

  // "경기", "경기도", "서울"처럼 시도 단위 검색어인지 확인
  const isSidoKeyword = (keyword) => {
    const sidoName = normalizeSido(keyword);
    return Boolean(sidoCodeMap[sidoName]);
  };

  // 주소 문자열을 VWorld Search API로 위도/경도 좌표로 변환
  const geocodeAddress = async (address) => {
    const apiKey = import.meta.env.VITE_VWORLD_API_KEY;

    if (!apiKey || !address) return null;

    const searchByCategory = async (category) => {
      const url =
        `/vworld-api/req/search?service=search` +
        `&request=search` +
        `&version=2.0` +
        `&crs=EPSG:4326` +
        `&size=1` +
        `&page=1` +
        `&query=${encodeURIComponent(address)}` +
        `&type=address` +
        `&category=${category}` +
        `&format=json` +
        `&key=${apiKey}`;

      const response = await fetch(url);
      const result = await response.json();

      return result.response?.result?.items?.[0] || null;
    };

    try {
      // 도로명 주소 먼저 검색
      let item = await searchByCategory("parcel");

      // 도로명 검색 실패 시 지번 주소 검색
      if (!item) {
        item = await searchByCategory("road");
      }

      if (!item) return null;

      return {
        lon: Number(item.point.x),
        lat: Number(item.point.y),

        // 나중에 토지 경계 조회에 사용할 수 있음
        pnu: item.id,
      };
    } catch (error) {
      console.error("주소 좌표 변환 실패:", address, error);
      return null;
    }
  };

  // PNU로 VWorld 지적도 경계를 조회
  const fetchLandBoundaryByPnu = async (pnu) => {
    const apiKey = import.meta.env.VITE_VWORLD_API_KEY;

    if (!apiKey || !pnu) return null;

    const url =
      `/vworld-api/req/data?service=data` +
      `&request=GetFeature` +
      `&data=LP_PA_CBND_BUBUN` +
      `&attrFilter=pnu:=:${encodeURIComponent(pnu)}` +
      `&geometry=true` +
      `&crs=EPSG:4326` +
      `&format=json` +
      `&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      return result.response?.result?.featureCollection || null;
    } catch (error) {
      console.error("토지 경계 조회 실패:", error);
      return null;
    }
  };

  // 조회한 토지 경계를 지도에 표시
  const renderSelectedLandBoundary = (geojson) => {
    if (!landBoundaryLayerRef.current || !geojson) return null;

    const source = landBoundaryLayerRef.current.getSource();

    // 이전에 표시한 토지 경계 제거
    source.clear();

    const features = new window.ol.format.GeoJSON().readFeatures(geojson, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:900913",
    });

    console.log("필지 feature 개수:", features.length);

    if (!features.length) return null;

    features.forEach((feature) => {
      source.addFeature(feature);
    });

    const extent = window.ol.extent.createEmpty();

    features.forEach((feature) => {
      window.ol.extent.extend(extent, feature.getGeometry().getExtent());
    });

    return extent;
  };

  // 시도 단위 검색어를 입력했을 때 VWorld에서 하위 시군구 목록을 가져옴
  const fetchRegionSuggestions = async (keyword) => {
    const apiKey = import.meta.env.VITE_VWORLD_API_KEY;

    if (!apiKey) return [];

    // 예: "경기" -> "경기도"
    const sidoName = normalizeSido(keyword);

    // 예: "경기도" -> "41"
    const sidoCode = sidoCodeMap[sidoName];

    if (!sidoCode) return [];

    const url =
      `/vworld-api/req/data?service=data` +
      `&request=GetFeature` +
      `&data=LT_C_ADSIGG_INFO` +
      // sig_cd가 시도 코드로 시작하는 시군구만 조회
      // 예: 경기도는 sig_cd가 41로 시작
      `&attrFilter=sig_cd:like:${encodeURIComponent(`${sidoCode}%`)}` +
      `&geometry=false` +
      `&crs=EPSG:4326` +
      `&size=1000` +
      `&page=1` +
      `&format=json` +
      `&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      const features =
        result.response?.result?.featureCollection?.features || [];

      return features
        .map((feature) => feature.properties?.sig_kor_nm)
        .filter(Boolean)
        .map((sigunguName) => `${sidoName} ${sigunguName}`);
    } catch (error) {
      console.error("지역 추천 목록 조회 실패:", error);
      return [];
    }
  };

  // 서버에서 등록된 토지 목록을 가져와 지도 마커로 표시
  const fetchRegisteredLands = async () => {
    try {
      const response = await fetch("/api/lands");
      const result = await response.json();

      // 서버 응답 구조에서 실제 토지 배열만 꺼냄
      const lands = result.data || [];

      await renderLandMarkers({
        lands,
        markerLayerRef: landMarkerLayerRef,
        displayDataRef: landDisplayDataRef,
        geocodeAddress,
        markupImage,
        onAfterRender: () =>
          updateLandLayerByZoom({
            mapRef: mapInstanceRef,
            markerLayerRef: landMarkerLayerRef,
            boundaryLayerRef: landBoundaryLayerRef,
            groupLayerRef: landGroupLayerRef,
            displayDataRef: landDisplayDataRef,
          }),
      });
    } catch (error) {
      console.error("등록된 토지 목록 조회 실패:", error);
    }
  };

  // 입력된 지역명으로 VWorld 행정구역 경계를 조회한 뒤 지도 화면을 해당 영역에 맞춤
  const fitArea = async (keyword) => {
    if (!keyword.trim()) return false;

    // VWorld API 키 가져오기
    const apiKey = import.meta.env.VITE_VWORLD_API_KEY;
    if (!apiKey) return false;

    // 입력값을 공백 기준으로 나누고, 마지막 단어를 시군구 검색어로 사용
    // 예: "경기도 성남시" -> "성남시"
    const words = keyword.trim().split(/\s+/);
    const lastWord = words[words.length - 1];
    const sidoName = normalizeSido(keyword);

    // 먼저 시군구 데이터에서 검색하고, 실패하면 시도 데이터에서 검색
    const normalizedSido = normalizeSido(keyword);

    // 여기서는 "수원시", "영등포구", "성남시" 같은 시군구만 검색
    const targets = [["LT_C_ADSIGG_INFO", "sig_kor_nm", lastWord]];

    // 검색 대상 데이터셋을 순서대로 조회
    for (const [data, field, value] of targets) {
      // VWorld 행정구역 경계 조회 URL 생성
      const url =
        `/vworld-api/req/data?service=data` +
        `&request=GetFeature` +
        `&data=${data}` +
        `&attrFilter=${field}:=:${encodeURIComponent(value)}` +
        `&geometry=true` +
        `&crs=EPSG:4326` +
        `&format=json` +
        `&key=${apiKey}`;

      // VWorld API 호출
      let result;

      try {
        const response = await fetch(url);
        result = await response.json();
      } catch (error) {
        const geojson = result.response?.result?.featureCollection;
        console.log("행정구역 검색 결과:", data, field, value, result);
        if (!geojson) continue;
      }

      // 응답에서 GeoJSON FeatureCollection 추출
      const geojson = result.response?.result?.featureCollection;

      // 조회 결과가 없으면 다음 대상 검색
      if (!geojson) continue;

      // GeoJSON 좌표계(EPSG:4326)를 현재 지도 좌표계(EPSG:900913)로 변환해 Feature 생성
      const features = new window.ol.format.GeoJSON().readFeatures(geojson, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:900913",
      });

      // 변환된 Feature가 없으면 다음 대상 검색
      if (!features.length) continue;

      // 여러 Feature가 있을 수 있으므로 전체 영역을 담을 빈 extent 생성
      const extent = window.ol.extent.createEmpty();

      // 모든 Feature의 geometry extent를 하나의 extent로 합침
      features.forEach((feature) => {
        window.ol.extent.extend(extent, feature.getGeometry().getExtent());
      });

      // 계산된 행정구역 영역에 맞게 지도 화면 이동/확대
      mapInstanceRef.current.getView().fit(extent, {
        padding: [90, 40, 40, 220],
        duration: 500,
        maxZoom: 10,
      });

      // 하나라도 성공하면 true 반환
      return true;
    }

    // 시군구/시도 검색 모두 실패한 경우
    return false;
  };

  // === 주소 검색 함수 ===
  const searchAddress = async (searchKeyword = keyword) => {
    // 검색어가 얼마나 상세한 주소인지에 따라 지도 확대 레벨을 결정
    const getSearchZoom = (keyword) => {
      const value = keyword.trim();

      // 입력된 단어들을 공백 기준으로 분리
      const words = value.split(/\s+/);

      // 마지막 단어가 숫자이거나 숫자-숫자 형태면 상세 번지로 판단
      // 예: "93", "93-1"
      const hasDetailNumber = /\d+(-\d+)?$/.test(words[words.length - 1]);

      // 도로명 주소가 포함되어 있는지 판단
      // 예: "창리로11길", "테헤란로", "세종대로"
      const hasRoadName = words.some((word) => /(로|길)\d*(번길)?$/.test(word));

      // 읍/면/동/리 단위까지만 입력했는지 판단
      // 예: "대구광역시 달성군 구지면"
      const hasTownLevel = words.some((word) => /(읍|면|동|리)$/.test(word));

      // 상세 번지까지 있으면 가장 크게 확대
      if (hasDetailNumber) return 18;

      // 도로명까지 있으면 중간 정도 확대
      if (hasRoadName) return 16;

      // 읍/면/동/리까지만 있으면 넓게 보기
      if (hasTownLevel) return 13;

      // 기본값
      return 14;
    };

    // 검색어 확인용 로그
    console.log("검색 실행:", searchKeyword);

    // 검색어 앞뒤 공백 제거
    const trimmedKeyword = searchKeyword.trim();

    // 검색어가 비어 있으면 실행하지 않음
    if (!trimmedKeyword) {
      setIsSuggestionOpen(false);
      setRegionSuggestions([]);
      return;
    }

    // 경기도, 서울특별시처럼 너무 넓은 시도 단위 검색어면 지도 이동하지 않고 목록 표시
    if (isSidoKeyword(trimmedKeyword)) {
      const suggestions = await fetchRegionSuggestions(trimmedKeyword);

      setRegionSuggestions(suggestions);
      setIsSuggestionOpen(true);

      return;
    }

    setIsSuggestionOpen(false);
    setRegionSuggestions([]);

    // 1. 서울, 경기도, 영등포구 같은 행정구역이면 여기서 처리
    const areaFound = await fitArea(trimmedKeyword);
    if (areaFound) return;

    // .env 파일에 저장한 VWorld API 키 가져오기
    const apiKey = import.meta.env.VITE_VWORLD_API_KEY;

    // API 키가 없으면 안내 후 종료
    if (!apiKey) {
      alert("VWorld API 키가 설정되지 않았습니다.");
      return;
    }

    // VWorld Search API 요청 URL 생성
    const url =
      `/vworld-api/req/search?service=search` +
      `&request=search` +
      `&version=2.0` +
      `&crs=EPSG:4326` +
      `&size=10` +
      `&page=1` +
      `&query=${encodeURIComponent(trimmedKeyword)}` +
      `&type=address` +
      `&category=road` +
      `&format=json` +
      `&key=${apiKey}`;

    // VWorld 서버에 주소 검색 요청
    const response = await fetch(url);

    // 응답 데이터를 JSON으로 변환
    const data = await response.json();

    // 응답 확인용 로그
    console.log("VWorld 응답:", data);

    // 검색 결과 중 첫 번째 주소 가져오기
    const item = data.response?.result?.items?.[0];

    // 검색 결과가 없으면 안내 후 종료
    if (!item) {
      alert("검색 결과가 없습니다.");
      return;
    }

    // VWorld 검색 결과의 경도, 위도 값
    const lon = Number(item.point.x);
    const lat = Number(item.point.y);

    // 위도/경도 좌표를 VWorld/OpenLayers 지도 좌표계로 변환
    const coordinate = window.ol.proj.transform(
      [lon, lat],
      "EPSG:4326",
      "EPSG:900913"
    );

    // 저장해둔 지도 객체 가져오기
    const map = mapInstanceRef.current;

    // 지도가 아직 준비되지 않았으면 종료
    if (!map) {
      alert("지도가 아직 준비되지 않았습니다.");
      return;
    }

    // 지도 View 객체 가져오기
    const view = map.getView();

    // 검색된 위치로 지도 중심 이동
    view.setCenter(coordinate);

    // 검색된 위치가 잘 보이도록 확대
    view.setZoom(getSearchZoom(trimmedKeyword));
  };

  // 추천 지역 클릭 시 해당 지역명으로 검색 실행
  const handleSuggestionClick = async (suggestion) => {
    setKeyword(suggestion);
    setIsSuggestionOpen(false);
    setRegionSuggestions([]);

    await searchAddress(suggestion);
  };

  return (
    <MapPage>
      {/* VWorld 지도가 렌더링될 영역 */}
      <MapContainer id="vworld-map" ref={mapElementRef} />

      {/* 지도 위 왼쪽에 표시할 네비게이트바 */}
      <NavBarArea>
        <NavBar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          keyword={keyword}
          onChangeKeyword={setKeyword}
          onSearch={searchAddress}
          isSuggestionOpen={isSuggestionOpen}
          regionSuggestions={regionSuggestions}
          onCloseSuggestions={() => {
            setIsSuggestionOpen(false);
            setRegionSuggestions([]);
          }}
          onSuggestionClick={handleSuggestionClick}
          normalizeSido={normalizeSido}
        />
      </NavBarArea>

      {/* 지도 위 왼쪽에 표시할 사이드바 */}
      <SideBarArea $expanded={sidebarOpen}>
        <SideBar expanded={sidebarOpen} />

        {/* 마커 클릭 시 표시되는 특정 토지 상세 패널 */}
        <SpecificLand
          land={selectedLand}
          onClose={() => setSelectedLand(null)}
        />
      </SideBarArea>
    </MapPage>
  );
}

export default MainMap;
