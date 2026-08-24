import { useEffect, useRef, useState } from "react";
import NavBar from "@/components/layout/box/NavBar";
import Preview from "@/components/ui/PreviewComponent/Preview";
import Specific from "@/components/ui/SpecificPopUp/Specific";
import {
  MapPage,
  MapContainer,
  NavBarArea,
  FilterArea,
  FilterToggleButton,
  FilterPanel,
  FilterTabs,
  FilterTab,
  FilterRangeGroup,
  FilterRangeLine,
  FilterRangeHandle,
  FilterRangeLabels,
  DetailPanelArea,
} from "./Map.styled";
import markupImage from "@/images/markup.png";
import filterIcon from "@/images/filter.png";
import { renderLandMarkers, updateLandLayerByZoom } from "./mapMarker";

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

  // 구 단위 집계 마커를 표시할 레이어
  const landGroupLayerRef = useRef(null);

  // 지오코딩까지 끝난 토지 데이터를 저장해두는 ref
  const landDisplayDataRef = useRef([]);

  // 검색창에 입력한 주소 값을 저장하는 state
  const [keyword, setKeyword] = useState("");

  // 마커를 클릭했을 때 상세 패널에 보여줄 토지 정보
  const [selectedLand, setSelectedLand] = useState(null);

  // 필터 패널이 열려 있는지 저장하는 state입니다.
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 상세보기 팝업이 열려 있는지 저장하는 state입니다.
  const [isSpecificOpen, setIsSpecificOpen] = useState(false);

  // 검색 결과 패널에 보여줄 지역 추천 목록
  const [regionSuggestions, setRegionSuggestions] = useState([]);

  // 지역 추천 패널 표시 여부
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

  useEffect(() => {
    // Kakao Maps SDK가 로드된 뒤 지도를 초기화하는 함수입니다.
    const initMap = () => {
      // Kakao Maps SDK가 아직 로드되지 않았으면 초기화를 중단합니다.
      if (!window.kakao || !window.kakao.maps) {
        console.log("Kakao Maps API 로드 대기 중...");
        return false;
      }

      // 이미 지도 인스턴스가 생성되어 있으면 중복 생성하지 않습니다.
      if (mapInstanceRef.current) return true;

      // 지도를 렌더링할 DOM 요소를 가져옵니다.
      const container = mapElementRef.current;

      // 지도 컨테이너가 없으면 지도를 생성하지 않습니다.
      if (!container) return false;

      // 초기 중심 좌표를 생성합니다.
      const center = new window.kakao.maps.LatLng(35.664, 128.415);

      // Kakao 지도 생성 옵션을 설정합니다.
      const options = {
        // 지도 중심 좌표입니다.
        center,

        // Kakao 지도 확대 레벨입니다.
        level: 3,
      };

      // Kakao 지도 인스턴스를 생성합니다.
      const map = new window.kakao.maps.Map(container, options);

      // 생성한 Kakao 지도 객체를 ref에 저장합니다.
      mapInstanceRef.current = map;

      // 지도 크기를 다시 계산합니다.
      setTimeout(() => {
        map.relayout();
      }, 100);

      // 등록된 토지 목록을 불러옵니다.
      fetchRegisteredLands();

      // Kakao 지도 줌 변경 이벤트를 등록합니다.
      window.kakao.maps.event.addListener(map, "zoom_changed", () => {
        // 줌 레벨에 따라 마커 표시 방식을 갱신합니다.
        updateLandLayerByZoom({
          mapRef: mapInstanceRef,
          markerLayerRef: landMarkerLayerRef,
          boundaryLayerRef: landBoundaryLayerRef,
          groupLayerRef: landGroupLayerRef,
          displayDataRef: landDisplayDataRef,
        });
      });

      // 지도 빈 곳을 클릭하면 선택된 토지 상태를 초기화합니다.
      window.kakao.maps.event.addListener(map, "click", () => {
        // 선택된 토지를 비워 미리보기 패널을 닫습니다.
        setSelectedLand(null);

        // 상세보기 팝업도 닫습니다.
        setIsSpecificOpen(false);

        // 지도 위 붉은색 경계 레이아웃을 제거합니다.
        clearSelectedLandBoundary();
      });

      // 지도 초기화가 끝났음을 반환합니다.
      return true;
    };

    // SDK가 script에서 늦게 준비될 수 있으므로 짧은 간격으로 확인합니다.
    const waitForKakao = setInterval(() => {
      // 지도 초기화에 성공하면 대기를 멈춥니다.
      if (initMap()) {
        clearInterval(waitForKakao);
      }
    }, 100);

    // 컴포넌트가 사라질 때 interval을 정리합니다.
    return () => {
      clearInterval(waitForKakao);
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

  // 주소 문자열을 Kakao 주소 검색 API로 위도/경도 좌표로 변환합니다.
  const geocodeAddress = async (address) => {
    // 주소가 없으면 좌표 변환을 하지 않습니다.
    if (!address) return null;

    // Kakao Maps SDK 또는 services 라이브러리가 없으면 좌표 변환을 하지 않습니다.
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      console.error("Kakao Maps services 라이브러리가 로드되지 않았습니다.");
      return null;
    }

    // Kakao 주소 검색 서비스를 생성합니다.
    const geocoder = new window.kakao.maps.services.Geocoder();

    // Kakao 주소 검색은 콜백 방식이므로 Promise로 감쌉니다.
    return new Promise((resolve) => {
      // 입력된 주소를 Kakao 주소 검색 API로 검색합니다.
      geocoder.addressSearch(address, (result, status) => {
        // 검색 결과가 없거나 실패하면 null을 반환합니다.
        if (status !== window.kakao.maps.services.Status.OK || !result[0]) {
          resolve(null);
          return;
        }

        // Kakao 검색 결과의 경도와 위도를 반환합니다.
        resolve({
          // Kakao result.x는 경도입니다.
          lon: Number(result[0].x),

          // Kakao result.y는 위도입니다.
          lat: Number(result[0].y),

          // Kakao 주소 검색 결과에는 VWorld PNU가 없으므로 null로 둡니다.
          pnu: null,
        });
      });
    });
  };

  // 현재 지도 위에 표시된 붉은색 토지 경계 레이아웃을 제거합니다.
  const clearSelectedLandBoundary = () => {
    // 기존 Kakao Polygon이 없으면 제거할 것이 없으므로 종료합니다.
    if (!landBoundaryLayerRef.current) return;

    // 기존 Polygon을 지도에서 제거합니다.
    landBoundaryLayerRef.current.setMap(null);

    // ref에 남아 있는 Polygon 참조를 비웁니다.
    landBoundaryLayerRef.current = null;
  };

  // PNU를 기준으로 VWorld에서 토지 경계 좌표를 조회합니다.
  const fetchLandBoundaryByPnu = async (pnu) => {
    // PNU가 없으면 경계 조회를 할 수 없으므로 null을 반환합니다.
    if (!pnu) return null;

    // VWorld API 키를 환경변수에서 가져옵니다.
    const apiKey = import.meta.env.VITE_VWORLD_API_KEY;

    // API 키가 없으면 경계 조회를 할 수 없으므로 null을 반환합니다.
    if (!apiKey) {
      console.error(
        "VWorld API 키가 없습니다. VITE_VWORLD_API_KEY를 확인하세요."
      );
      return null;
    }

    // PNU로 지적도 경계 데이터를 조회하는 VWorld API URL입니다.
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
      // VWorld API에 경계 데이터를 요청합니다.
      const response = await fetch(url);

      // 응답을 JSON으로 변환합니다.
      const result = await response.json();

      // 응답에서 GeoJSON FeatureCollection을 꺼냅니다.
      const geojson = result.response?.result?.featureCollection;

      // 경계 데이터가 없으면 null을 반환합니다.
      if (!geojson?.features?.length) return null;

      // 첫 번째 필지 경계 geometry를 반환합니다.
      return geojson.features[0].geometry;
    } catch (error) {
      // 경계 조회 실패 원인을 콘솔에 남깁니다.
      console.error("PNU 기반 토지 경계 조회 실패:", error);

      // 실패 시 null을 반환합니다.
      return null;
    }
  };

  // GeoJSON 좌표를 Kakao Polygon path 형식으로 변환합니다.
  const convertGeoJsonToKakaoPath = (geometry) => {
    // geometry가 없으면 빈 배열을 반환합니다.
    if (!geometry) return [];

    // Polygon이면 첫 번째 외곽 링 좌표를 사용합니다.
    if (geometry.type === "Polygon") {
      return geometry.coordinates[0].map(
        ([lon, lat]) => new window.kakao.maps.LatLng(lat, lon)
      );
    }

    // MultiPolygon이면 첫 번째 Polygon의 첫 번째 외곽 링 좌표를 사용합니다.
    if (geometry.type === "MultiPolygon") {
      return geometry.coordinates[0][0].map(
        ([lon, lat]) => new window.kakao.maps.LatLng(lat, lon)
      );
    }

    // 지원하지 않는 geometry 타입이면 빈 배열을 반환합니다.
    return [];
  };

  // 선택된 토지의 PNU를 기준으로 붉은색 경계 레이아웃을 표시합니다.
  const renderSelectedLandBoundary = async (land) => {
    // 기존에 표시된 경계 레이아웃을 먼저 제거합니다.
    clearSelectedLandBoundary();

    // 지도 객체가 없으면 경계를 그릴 수 없으므로 종료합니다.
    if (!mapInstanceRef.current) return;

    // 선택한 토지의 PNU로 경계 geometry를 조회합니다.
    const geometry = await fetchLandBoundaryByPnu(land?.pnu);

    // GeoJSON geometry를 Kakao Polygon path로 변환합니다.
    const path = convertGeoJsonToKakaoPath(geometry);

    // 좌표가 부족하면 Polygon을 만들 수 없으므로 종료합니다.
    if (path.length < 3) return;

    // 붉은색 토지 경계 Polygon을 생성합니다.
    const polygon = new window.kakao.maps.Polygon({
      // Polygon이 표시될 지도입니다.
      map: mapInstanceRef.current,

      // Polygon 경계 좌표입니다.
      path,

      // 붉은색 선 두께입니다.
      strokeWeight: 3,

      // 붉은색 선 색상입니다.
      strokeColor: "#ff2b2b",

      // 선 투명도입니다.
      strokeOpacity: 0.95,

      // 실선 스타일입니다.
      strokeStyle: "solid",

      // 내부 채움 색상입니다.
      fillColor: "#ff2b2b",

      // 내부 채움 투명도입니다.
      fillOpacity: 0.22,
    });

    // 나중에 제거할 수 있도록 Polygon을 ref에 저장합니다.
    landBoundaryLayerRef.current = polygon;

    // Polygon 전체 영역을 계산하기 위한 bounds를 생성합니다.
    const bounds = new window.kakao.maps.LatLngBounds();

    // Polygon의 모든 좌표를 bounds에 포함합니다.
    path.forEach((position) => {
      bounds.extend(position);
    });

    // 선택된 토지 경계가 잘 보이도록 지도를 해당 영역으로 이동합니다.
    mapInstanceRef.current.setBounds(bounds);
  };

  // 서버에서 등록된 토지 목록을 가져와 지도 마커로 표시
  const fetchRegisteredLands = async () => {
    try {
      const response = await fetch("/api/lands");
      const result = await response.json();

      // 서버 응답 구조에서 실제 토지 배열만 꺼냄
      const lands = result.data || [];

      await renderLandMarkers({
        // Kakao 지도 객체를 사용할 수 있도록 ref를 전달합니다.
        mapRef: mapInstanceRef,

        // 등록된 토지 목록입니다.
        lands,

        // Kakao 마커 목록을 저장할 ref입니다.
        markerLayerRef: landMarkerLayerRef,

        // 지도에 표시 가능한 토지 데이터를 저장할 ref입니다.
        displayDataRef: landDisplayDataRef,

        // 주소를 좌표로 변환하는 함수입니다.
        geocodeAddress,

        // 기존 인자를 유지하되, Kakao 마커에서는 사용하지 않을 수 있습니다.
        markupImage,

        onMarkerClick: async (land) => {
          // 클릭된 토지 정보를 미리보기 패널에 표시합니다.
          setSelectedLand(land);

          // 상세보기 팝업은 마커 변경 시 닫습니다.
          setIsSpecificOpen(false);

          // 클릭된 토지의 PNU를 기준으로 붉은색 경계 레이아웃을 표시합니다.
          await renderSelectedLandBoundary(land);
        },

        // 마커 렌더링 후 현재 지도 레벨에 맞춰 표시 상태를 갱신합니다.
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

  // === 주소 검색 함수 ===
  const searchAddress = async (searchKeyword = keyword) => {
    // 검색어가 얼마나 상세한 주소인지에 따라 지도 확대 레벨을 결정
    const getSearchLevel = (keyword) => {
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

      // 상세 번지까지 있으면 가장 크게 확대합니다.
      if (hasDetailNumber) return 3;

      // 도로명까지 있으면 중간 정도로 확대합니다.
      if (hasRoadName) return 4;

      // 읍/면/동/리까지만 있으면 넓게 봅니다.
      if (hasTownLevel) return 6;

      // 기본 검색 결과는 중간 확대 레벨로 봅니다.
      return 5;
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

    // 입력된 검색어를 Kakao 주소 검색으로 좌표 변환합니다.
    const point = await geocodeAddress(trimmedKeyword);

    // 검색 결과가 없으면 안내 후 종료합니다.
    if (!point) {
      alert("검색 결과가 없습니다.");
      return;
    }

    // 저장해둔 Kakao 지도 객체를 가져옵니다.
    const map = mapInstanceRef.current;

    // 지도가 아직 준비되지 않았으면 안내 후 종료합니다.
    if (!map) {
      alert("지도가 아직 준비되지 않았습니다.");
      return;
    }

    // Kakao 지도에서 사용할 중심 좌표를 생성합니다.
    const moveLatLng = new window.kakao.maps.LatLng(point.lat, point.lon);

    // 검색된 위치로 지도 중심을 이동합니다.
    map.setCenter(moveLatLng);

    // 검색어 상세도에 맞춰 Kakao 지도 확대 레벨을 설정합니다.
    // Kakao는 숫자가 작을수록 더 확대됩니다.
    map.setLevel(getSearchLevel(trimmedKeyword));
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
      {/* Kakao 지도가 렌더링될 영역입니다. */}
      <MapContainer id="kakao-map" ref={mapElementRef} />

      {/* 시안의 흰색 상단 네비게이션 영역입니다. */}
      <NavBarArea>
        <NavBar
          keyword={keyword}
          onChangeKeyword={setKeyword}
          onSearch={searchAddress}
          isSuggestionOpen={isSuggestionOpen}
          regionSuggestions={regionSuggestions}
          onCloseSuggestions={() => {
            // 추천 목록을 닫습니다.
            setIsSuggestionOpen(false);

            // 추천 목록 데이터를 초기화합니다.
            setRegionSuggestions([]);
          }}
          onSuggestionClick={handleSuggestionClick}
          normalizeSido={normalizeSido}
        />
      </NavBarArea>

      {/* 필터 버튼과 필터 패널은 현재 화면 디자인만 표시합니다. */}
      <FilterArea>
        {/* 필터 패널을 열고 닫는 아이콘 버튼입니다. */}
        <FilterToggleButton
          type="button"
          aria-label="필터"
          onClick={() => {
            // 현재 열림 상태를 반대로 바꿔 필터 패널을 토글합니다.
            setIsFilterOpen((prev) => !prev);
          }}
        >
          {/* 이미지 폴더에 추가된 필터 아이콘을 표시합니다. */}
          <img src={filterIcon} alt="" />
        </FilterToggleButton>

        {/* 필터가 열린 상태일 때만 옵션 패널을 표시합니다. */}
        {isFilterOpen && (
          <FilterPanel>
            {/* 거래 유형 선택 탭입니다. */}
            <FilterTabs>
              <FilterTab type="button">전체</FilterTab>
              <FilterTab type="button">매매</FilterTab>
              <FilterTab type="button">임대</FilterTab>
              <FilterTab type="button">사업희망</FilterTab>
            </FilterTabs>

            {/* 가격 범위 필터입니다. */}
            <FilterRangeGroup>
              <FilterRangeLine>
                <FilterRangeHandle $side="left" />
                <FilterRangeHandle $side="right" />
              </FilterRangeLine>

              <FilterRangeLabels>
                <span>~1000만</span>
                <span>5000만</span>
                <span>1억</span>
                <span>5억</span>
                <span>최대</span>
              </FilterRangeLabels>
            </FilterRangeGroup>

            {/* 임대료 범위 필터입니다. */}
            <FilterRangeGroup>
              <FilterRangeLine>
                <FilterRangeHandle $side="left" />
                <FilterRangeHandle $side="right" />
              </FilterRangeLine>

              <FilterRangeLabels>
                <span>~100만</span>
                <span>200만</span>
                <span>300만</span>
                <span>400만</span>
                <span>최대</span>
              </FilterRangeLabels>
            </FilterRangeGroup>

            {/* 면적 범위 필터입니다. */}
            <FilterRangeGroup>
              <FilterRangeLine>
                <FilterRangeHandle $side="left" />
                <FilterRangeHandle $side="right" />
              </FilterRangeLine>

              <FilterRangeLabels>
                <span>~100m²</span>
                <span>500m²</span>
                <span>1000m²</span>
                <span>5000m²</span>
                <span>최대</span>
              </FilterRangeLabels>
            </FilterRangeGroup>
          </FilterPanel>
        )}
      </FilterArea>

      {/* 마커 클릭 시 표시되는 특정 토지 상세 패널입니다. */}
      <DetailPanelArea>
        <Preview
          land={selectedLand}
          onClose={() => {
            // 선택된 토지를 비워 미리보기 패널을 닫습니다.
            setSelectedLand(null);

            // 미리보기 패널이 닫히면 상세보기 팝업도 함께 닫습니다.
            setIsSpecificOpen(false);
          }}
          onOpenSpecific={() => {
            // 상세보기 팝업을 엽니다.
            setIsSpecificOpen(true);
          }}
        />

        {/* 상세보기 팝업이 열렸을 때 표시합니다. */}
        {isSpecificOpen && (
          <Specific
            land={selectedLand}
            onClose={() => {
              // 상세보기 팝업을 닫습니다.
              setIsSpecificOpen(false);
            }}
          />
        )}
      </DetailPanelArea>
    </MapPage>
  );
}

export default Map;
