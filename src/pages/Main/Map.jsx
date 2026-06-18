import { useEffect, useRef, useState } from "react";
import SideBar from "@/components/layout/box/SideBar";
import NavBar from "@/components/layout/box/NavBar";
import {
  MapPage,
  MapContainer,
  SideBarArea,
  NavBarArea,
} from "./Map.styled";
import markupImage from "@/images/markup.png";


function Map() {
  // VWorld 지도가 렌더링될 DOM 요소를 참조하기 위한 ref
  const mapElementRef = useRef(null);

  // 생성된 VWorld 지도 객체를 저장하기 위한 ref
  // useRef를 쓰면 컴포넌트가 리렌더링되어도 값이 유지됨
  const mapInstanceRef = useRef(null);

  // 등록된 토지 마커를 담을 OpenLayers 레이어
  const landMarkerLayerRef = useRef(null);

  // 등록된 토지 경계선을 표시할 OpenLayers 레이어
  const landBoundaryLayerRef = useRef(null);

  // 검색창에 입력한 주소 값을 저장하는 state
  const [keyword, setKeyword] = useState("");

  // 검색 결과 패널에 보여줄 지역 추천 목록
  const [regionSuggestions, setRegionSuggestions] = useState([]);

  // 지역 추천 패널 표시 여부
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

  useEffect(() => {
    // VWorld API와 OpenLayers API가 정상적으로 로드되었는지 확인
    if (!window.vw || !window.vw.ol3 || !window.ol) {
      console.error("VWorld 또는 OpenLayers API가 로드되지 않았습니다.");
      return;
    }

    // 이미 지도가 생성되어 있으면 다시 만들지 않음
    if (mapInstanceRef.current) return;

    // 서울 한강 근방 좌표
    // EPSG:4326은 일반 위도/경도 좌표계
    // EPSG:900913은 VWorld/OpenLayers 지도에서 사용하는 좌표계
    const seoulCenter = window.ol.proj.transform(
      [126.995, 37.52],
      "EPSG:4326",
      "EPSG:900913"
    );

    // VWorld 지도의 초기 중심 좌표 설정
    window.vw.ol3.CameraPosition.center = seoulCenter;

    // VWorld 지도의 초기 줌 레벨 설정
    window.vw.ol3.CameraPosition.zoom = 12;

    // VWorld 지도 생성 옵션
    const options = {
      // 일반 그래픽 지도 사용
      basemapType: window.vw.ol3.BasemapType.GRAPHIC,

      // 기본 컨트롤 UI 밀도 설정
      controlDensity: window.vw.ol3.DensityType.EMPTY,

      // 지도 드래그/줌 같은 기본 상호작용 설정
      interactionDensity: window.vw.ol3.DensityType.BASIC,

      // 지도 컨트롤 자동 정렬
      controlsAutoArrange: true,

      // 홈 버튼을 눌렀을 때 이동할 위치
      homePosition: window.vw.ol3.CameraPosition,

      // 지도 처음 로딩 시 위치
      initPosition: window.vw.ol3.CameraPosition,
    };

    // id가 vworld-map인 DOM 요소에 VWorld 지도 생성
    const map = new window.vw.ol3.Map("vworld-map", options);

    // 생성한 지도 객체를 ref에 저장
    mapInstanceRef.current = map;

    // 필지 GeoJSON을 지도에 파란색 경계로 표시
    const renderLandBoundary = (geojson, landId) => {
      if (!landBoundaryLayerRef.current || !geojson) return;

      const source = landMarkerLayerRef.current.getSource();
      const boundarySource = landBoundaryLayerRef.current?.getSource();

      source.clear();
      boundarySource?.clear();

      const features = new window.ol.format.GeoJSON().readFeatures(geojson, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:900913",
      });

      features.forEach((feature) => {
        feature.set("landId", landId);
        source.addFeature(feature);
      });
    };

    // 등록된 토지 마커를 표시할 벡터 소스 생성
    const landMarkerSource = new window.ol.source.Vector();

    // 등록된 토지 마커를 표시할 벡터 레이어 생성
    const landMarkerLayer = new window.ol.layer.Vector({
      source: landMarkerSource,
    });

    // 지도와 마커 레이어가 준비된 뒤 등록된 토지 목록 조회
    map.addLayer(landMarkerLayer);
    landMarkerLayerRef.current = landMarkerLayer;

    // 등록된 토지 필지 경계를 표시할 벡터 소스
    const landBoundarySource = new window.ol.source.Vector();

    // 등록된 토지 필지 경계를 표시할 벡터 레이어
    const landBoundaryLayer = new window.ol.layer.Vector({
      source: landBoundarySource,
      style: new window.ol.style.Style({
        stroke: new window.ol.style.Stroke({
          color: "#168BFF",
          width: 3,
        }),
        fill: new window.ol.style.Fill({
          color: "rgba(22, 139, 255, 0.18)",
        }),
      }),
    });

    // 지도에 필지 경계 레이어 추가
    map.addLayer(landBoundaryLayer);

    // 나중에 필지 경계를 추가/삭제할 수 있도록 ref에 저장
    landBoundaryLayerRef.current = landBoundaryLayer;

    fetchRegisteredLands();

    // 지도 컨테이너 크기를 다시 계산
    // 레이아웃 위에 사이드바/검색창이 올라갈 때 지도 타일 깨짐을 줄이기 위함
    setTimeout(() => {
      map.updateSize();
    }, 100);

    // VWorld 지도 내부의 OpenLayers View 객체 가져오기
    // View는 지도 중심, 줌 레벨 같은 화면 상태를 관리함
    const view = map.getView();

    // 남한 주변으로 지도 이동 가능 범위 제한
    // [최소 경도, 최소 위도, 최대 경도, 최대 위도]
    const koreaExtent = window.ol.proj.transformExtent(
      [125.0, 33.0, 130.0, 38.3],
      "EPSG:4326",
      "EPSG:900913"
    );

    // 지도 중심을 서울 한강 근방으로 설정
    view.setCenter(seoulCenter);

    // 시작 줌 레벨 설정
    view.setZoom(12);

    // 줌 변경 이벤트 등록
    // OpenLayers에서는 줌 변경이 resolution 변경으로 감지됨
    view.on("change:resolution", () => {
      // 현재 줌 레벨 가져오기
      const zoom = view.getZoom();

      // 너무 멀리 축소하지 못하게 제한
      if (zoom < 9) {
        view.setZoom(9);
      }

      // 너무 많이 확대하지 못하게 제한
      if (zoom > 20) {
        view.setZoom(20);
      }
    });

    // 지도 중심 이동 이벤트 등록
    view.on("change:center", () => {
      // 현재 지도 중심 좌표 가져오기
      const center = view.getCenter();

      // 중심 좌표가 없으면 종료
      if (!center) return;

      // 현재 중심 좌표가 남한 범위를 벗어나지 않도록 보정
      const clampedCenter = [
        Math.min(Math.max(center[0], koreaExtent[0]), koreaExtent[2]),
        Math.min(Math.max(center[1], koreaExtent[1]), koreaExtent[3]),
      ];

      // 중심 좌표가 범위 밖이면 범위 안 좌표로 다시 이동
      if (center[0] !== clampedCenter[0] || center[1] !== clampedCenter[1]) {
        view.setCenter(clampedCenter);
      }
    });
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

  // PNU를 이용해 VWorld 연속지적도에서 필지 경계 polygon을 가져옴
  const fetchLandBoundaryByPnu = async (pnu) => {
    const apiKey = import.meta.env.VITE_VWORLD_API_KEY;

    if (!apiKey || !pnu) return null;

    const url =
      `/vworld-api/req/data?service=data` +
      `&request=GetFeature` +
      // VWorld 연속지적도 데이터셋
      `&data=LT_C_LHBLPN` +
      // PNU가 정확히 일치하는 필지 조회
      `&attrFilter=pnu:=:${encodeURIComponent(pnu)}` +
      `&geometry=true` +
      `&crs=EPSG:4326` +
      `&format=json` +
      `&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      const geojson = result.response?.result?.featureCollection;

      console.log("필지 경계 조회:", pnu, result);

      if (!geojson) return null;

      return geojson;
    } catch (error) {
      console.error("필지 경계 조회 실패:", pnu, error);
      return null;
    }
  };

  // 등록된 토지 목록을 OpenLayers 마커로 지도에 표시
  const renderLandMarkers = async (lands) => {
    if (!landMarkerLayerRef.current) return;

    const source = landMarkerLayerRef.current.getSource();

    // 기존 마커 제거
    source.clear();

    for (const land of lands) {
      // 주소가 없으면 마커를 만들 수 없으므로 건너뜀
      if (!land.address) continue;

      // 서버 주소를 VWorld로 좌표 변환
      const point = await geocodeAddress(land.address);

      console.log("마커 생성 대상:", land.address, point);

      // 좌표 변환 실패 시 건너뜀
      if (!point) continue;

      const coordinate = window.ol.proj.transform(
        [point.lon, point.lat],
        "EPSG:4326",
        "EPSG:900913"
      );

      const feature = new window.ol.Feature({
        geometry: new window.ol.geom.Point(coordinate),
        landId: land.id,
        address: land.address,
        area: land.area,
        desiredPrice: land.desiredPrice,
        status: land.status,
      });

      feature.setStyle(
        new window.ol.style.Style({
          image: new window.ol.style.Icon({
            src: markupImage,
            anchor: [0.5, 1],
            scale: 0.7,
          }),
          text: new window.ol.style.Text({
            // 서버 area 값을 임시로 평수처럼 표시
            text: `${land.area}평`,
            offsetY: -28,
            font: "700 13px sans-serif",
            fill: new window.ol.style.Fill({
              color: "#111111",
            }),
            stroke: new window.ol.style.Stroke({
              color: "#ffffff",
              width: 3,
            }),
          }),
        })
      );
      source.addFeature(feature);
    }
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

  // // 서버에서 등록된 토지 목록을 가져와 지도 마커로 표시
  // const fetchRegisteredLands = async () => {
  //   try {
  //     const response = await fetch("/api/lands");
  //     const result = await response.json();

  //     // 서버 응답 구조에서 실제 토지 배열만 꺼냄
  //     const lands = result.data || [];

  //     await renderLandMarkers(lands);
  //   } catch (error) {
  //     console.error("등록된 토지 목록 조회 실패:", error);
  //   }
  // };

  // 서버에서 등록된 토지 목록을 가져와 지도 마커로 표시 === 임시
  const fetchRegisteredLands = async () => {
    // TODO: 서버 연동 전 임시 목 데이터
    const mockLands = [
      {
        id: 1,
        ownerEmail: "test1@example.com",
        address: "서울특별시 중구 세종대로 110",
        area: 120,
        desiredPrice: 300000000,
        description: "서울 테스트 토지",
        status: "AVAILABLE",
      },
      {
        id: 2,
        ownerEmail: "test2@example.com",
        address: "경기도 수원시 팔달구 효원로 241",
        area: 85,
        desiredPrice: 210000000,
        description: "수원 테스트 토지",
        status: "AVAILABLE",
      },
      {
        id: 3,
        ownerEmail: "test3@example.com",
        address: "대구광역시 달성군 구지면 창리로11길 93",
        area: 240,
        desiredPrice: 500000000,
        description: "대구 테스트 토지",
        status: "AVAILABLE",
      },
    ];

    await renderLandMarkers(mockLands);
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
      <SideBarArea>
        <SideBar />
      </SideBarArea>
    </MapPage>
  );
}

export default Map;
