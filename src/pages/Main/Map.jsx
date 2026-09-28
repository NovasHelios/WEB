import { useEffect, useRef, useState } from "react";
import NavBar from "@/components/layout/box/NavBar";
import AiChat from "@/components/ui/AiChat/AiChat";
import Preview from "@/components/ui/PreviewComponent/Preview";
import Filter from "@/components/ui/Filter/Filter";
// 검색한 지역 안의 등록 토지 목록을 표시하는 패널입니다.
import SearchPreview from "./component/SearchPreview";
import {
  MapPage,
  MapContainer,
  NavBarArea,
  FilterArea,
  DetailPanelArea,
} from "./Map.styled";

import markupImage from "@/images/markup.png";
import { renderLandMarkers, updateLandLayerByZoom } from "./component/mapMarker";
import {
  fetchAllLandList,
  fetchFilteredLandList,
  fetchLandDetail,
} from "./landApi";
import { createLandFilterBody } from "./landFilterMapper";

function Map() {
  // Kakao 지도가 렌더링될 DOM 요소를 참조하기 위한 ref입니다.
  const mapElementRef = useRef(null);

  // 생성된 Kakao 지도 객체를 저장하기 위한 ref입니다.
  const mapInstanceRef = useRef(null);

  // 등록된 토지 Kakao 마커 목록을 담는 ref입니다.
  const landMarkerLayerRef = useRef(null);

  // 지오코딩까지 끝난 토지 데이터를 저장해두는 ref
  const landDisplayDataRef = useRef([]);

  // 가장 최근에 시작한 필터 요청을 구분하기 위한 번호입니다.
  const filterRequestIdRef = useRef(0);

  // 가장 최근에 클릭한 토지 상세 요청을 구분하기 위한 번호입니다.
  const landDetailRequestIdRef = useRef(0);

  // 가장 최근에 실행한 주소 검색을 구분하기 위한 번호입니다.
  const searchRequestIdRef = useRef(0);

  // 현재 지도에 적용된 필터 조건을 저장하는 state입니다.
  const [appliedFilters, setAppliedFilters] = useState({
    // 거래 유형 필터입니다.
    transactionType: "ALL",

    // 지역 선택 필터입니다.
    region: {
      sido: null,
      sigungu: null,
      emd: null,
    },

    // 매매가 범위 필터입니다.
    salePrice: {
      min: null,
      max: null,
    },

    // 임대가 범위 필터입니다.
    rentPrice: {
      min: null,
      max: null,
    },

    // 토지 면적 범위 필터입니다.
    area: {
      min: null,
      max: null,
    },
  });

  // 지도 이벤트에서도 최신 필터 값을 읽기 위한 ref입니다.
  const appliedFiltersRef = useRef(appliedFilters);

  // 현재 적용된 필터 state와 ref를 함께 갱신합니다.
  const updateAppliedFilters = (nextFilters) => {
    // 지도 idle 이벤트에서 최신 필터를 읽을 수 있도록 ref를 먼저 갱신합니다.
    appliedFiltersRef.current = nextFilters;

    // 화면 필터 컴포넌트에 전달되는 state도 함께 갱신합니다.
    setAppliedFilters(nextFilters);
  };

  // 기존 필터 값에 사용자가 적용한 필터 값을 병합합니다.
  const mergeAppliedFilters = (prevFilters, nextFilters) => {
    return {
      // 거래 유형은 새 값이 있으면 반영하고, 없으면 기존 값을 유지합니다.
      transactionType:
        nextFilters.transactionType ?? prevFilters.transactionType,

      // 지역 필터는 새 객체가 없으면 기존 객체를 유지합니다.
      region: {
        ...prevFilters.region,
        ...(nextFilters.region || {}),
      },

      // 매매가 필터는 새 객체가 없으면 기존 객체를 유지합니다.
      salePrice: {
        ...prevFilters.salePrice,
        ...(nextFilters.salePrice || {}),
      },

      // 임대가 필터는 새 객체가 없으면 기존 객체를 유지합니다.
      rentPrice: {
        ...prevFilters.rentPrice,
        ...(nextFilters.rentPrice || {}),
      },

      // 면적 필터는 새 객체가 없으면 기존 객체를 유지합니다.
      area: {
        ...prevFilters.area,
        ...(nextFilters.area || {}),
      },
    };
  };

  // 검색창에 입력한 주소 값을 저장하는 state
  const [keyword, setKeyword] = useState("");

  // 마커를 클릭했을 때 상세 패널에 보여줄 토지 정보
  const [selectedLand, setSelectedLand] = useState(null);

  // 주소 검색 결과 패널의 표시 상태와 조회 결과를 관리합니다.
  const [searchPreviewState, setSearchPreviewState] = useState({
    // 주소 검색 전에는 결과 패널을 표시하지 않습니다.
    isOpen: false,

    // 결과 패널에 표시할 검색어입니다.
    keyword: "",

    // 검색된 지도 영역 안의 등록 토지 목록입니다.
    lands: [],

    // 검색 결과를 불러오는 중인지 나타냅니다.
    isLoading: false,

    // 검색 결과 조회 실패 문구입니다.
    error: "",
  });

  // 검색 결과 패널에 보여줄 지역 추천 목록
  const [regionSuggestions, setRegionSuggestions] = useState([]);

  // 지역 추천 패널 표시 여부
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

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

        // Kakao 검색 결과의 좌표와 행정구역 이름을 반환합니다.
        resolve({
          // Kakao result.x는 경도입니다.
          lon: Number(result[0].x),

          // Kakao result.y는 위도입니다.
          lat: Number(result[0].y),

          // 검색 위치가 속한 시도 이름입니다.
          sido: result[0].address?.region_1depth_name || null,

          // 검색 위치가 속한 시군구 이름입니다.
          sigungu: result[0].address?.region_2depth_name || null,

          // 검색 위치가 속한 읍면동 이름입니다.
          emd: result[0].address?.region_3depth_name || null,
        });
      });
    });
  };

  // 행정구역 검색어를 filter API에서 사용할 지역 조건으로 변환합니다.
  const getSearchRegion = (searchKeyword, point) => {
    // 검색어의 마지막 지역명을 비교 기준으로 사용합니다.
    const lastWord = searchKeyword.trim().split(/\s+/).at(-1);

    // 읍면동 이름으로 끝나는 검색이면 세 단계 지역을 모두 전달합니다.
    if (point.emd && point.emd.endsWith(lastWord)) {
      return {
        sido: { name: point.sido },
        sigungu: { name: point.sigungu },
        emd: { name: point.emd },
      };
    }

    // 시군구 이름으로 끝나는 검색이면 시도와 시군구를 전달합니다.
    if (point.sigungu && point.sigungu.endsWith(lastWord)) {
      return {
        sido: { name: point.sido },
        sigungu: { name: point.sigungu },
        emd: null,
      };
    }

    // 시도 이름으로 끝나는 검색이면 시도만 전달합니다.
    if (point.sido && point.sido.endsWith(lastWord)) {
      return {
        sido: { name: point.sido },
        sigungu: null,
        emd: null,
      };
    }

    // 도로명과 상세 지번 검색은 기존 지도 범위 조회를 유지합니다.
    return null;
  };

  // 전체 토지 중 검색한 행정구역에 포함되는 토지만 판별합니다.
  const isLandInSearchRegion = (land, searchKeyword, searchRegion) => {
    // 지역 필드가 없을 때 비교할 주소 문자열입니다.
    const address = String(land?.address || "");

    // 행정구역 검색이 아니면 입력한 주소가 포함된 토지만 반환합니다.
    if (!searchRegion) return address.includes(searchKeyword);

    // 가장 상세하게 검색한 지역명을 비교 대상으로 선택합니다.
    const targetRegionName =
      searchRegion.emd?.name ||
      searchRegion.sigungu?.name ||
      searchRegion.sido?.name;

    // 비교할 지역명이 없으면 검색 결과에서 제외합니다.
    if (!targetRegionName) return false;

    // 검색 단계에 맞는 서버 지역 필드를 선택합니다.
    const landRegionName = searchRegion.emd
      ? land?.regionEupmyeondong
      : searchRegion.sigungu
        ? land?.regionSigungu
        : land?.regionSido;

    // 구조화된 지역 필드를 우선 비교하고 없으면 주소 문자열로 보완합니다.
    return landRegionName
      ? String(landRegionName).includes(targetRegionName)
      : address.includes(targetRegionName);
  };

  // 전체 조회 API에서 검색 지역에 포함된 토지 목록을 가져옵니다.
  const fetchSearchLands = async ({ searchRequestId, searchKeyword, searchRegion }) => {
    try {
      // 검색할 때만 GET /api/lands 전체 조회 API를 호출합니다.
      const allLands = await fetchAllLandList();

      // 더 최신 검색이 시작됐다면 이전 전체 조회 결과를 반영하지 않습니다.
      if (searchRequestId !== searchRequestIdRef.current) return;

      // 전체 토지에서 검색한 지역에 포함되는 토지만 남깁니다.
      const matchingLands = allLands.filter((land) =>
        isLandInSearchRegion(land, searchKeyword, searchRegion)
      );

      // 필터링된 토지 목록을 검색 결과 패널에 표시합니다.
      setSearchPreviewState({
        isOpen: true,
        keyword: searchKeyword,
        lands: matchingLands,
        isLoading: false,
        error: "",
      });
    } catch (error) {
      // 전체 조회 실패 내용을 개발자 도구에서 확인합니다.
      console.error("검색용 전체 토지 목록 조회 실패:", error);

      // 더 최신 검색이 시작됐다면 이전 오류도 화면에 반영하지 않습니다.
      if (searchRequestId !== searchRequestIdRef.current) return;

      // 검색 결과 패널에 조회 실패 문구를 표시합니다.
      setSearchPreviewState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "검색 결과를 불러오지 못했습니다.",
      }));
    }
  };

  // 마커와 검색 결과 카드가 함께 사용하는 토지 상세보기 함수입니다.
  const openLandPreview = async (land) => {
    // 토지 정보가 없으면 상세 조회를 실행하지 않습니다.
    if (!land) return;

    // 이번 클릭에 고유 번호를 부여해 이전 상세 응답과 구분합니다.
    const detailRequestId = ++landDetailRequestIdRef.current;

    // 필터 API별 토지 식별자 필드를 하나의 값으로 정리합니다.
    const landId = land.id ?? land.landId;

    // 서버에서 landId 기준 단일 상세 정보를 조회합니다.
    const landDetail = await fetchLandDetail(landId);

    // 다른 토지를 더 나중에 클릭했다면 이전 상세 응답을 반영하지 않습니다.
    if (detailRequestId !== landDetailRequestIdRef.current) return;

    // 상세 API 정보와 지도 표시용 좌표 정보를 합쳐 미리보기에 전달합니다.
    setSelectedLand({
      ...land,
      ...(landDetail || {}),
      position: land.position,
      lat: land.lat,
      lon: land.lon,
    });
  };

  // 검색 결과 카드를 클릭하면 해당 토지로 이동하고 상세보기를 엽니다.
  const handleSelectSearchLand = async (land) => {
    // 지도 또는 선택한 토지 정보가 없으면 이동하지 않습니다.
    if (!mapInstanceRef.current || !land) return;

    // 마커 렌더링 때 저장한 Kakao 좌표 객체를 우선 사용합니다.
    let position = land.position;

    // 좌표 객체가 없을 때를 대비해 숫자 위도와 경도로 다시 생성합니다.
    if (!position) {
      // 표시용 좌표 또는 서버 원본 좌표를 숫자로 변환합니다.
      const lat = Number(land.lat ?? land.y);
      const lon = Number(land.lon ?? land.x);

      // 유효한 좌표가 있을 때만 Kakao 좌표 객체를 생성합니다.
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        position = new window.kakao.maps.LatLng(lat, lon);
      }
    }

    // 이동 가능한 좌표가 없으면 상세보기를 열지 않습니다.
    if (!position) return;

    // 선택한 토지가 화면 중앙에 오도록 지도를 이동합니다.
    mapInstanceRef.current.setCenter(position);

    // 선택한 토지 마커가 잘 보이도록 지도를 확대합니다.
    mapInstanceRef.current.setLevel(3);

    // 기존 마커 클릭과 동일한 상세 조회 함수를 실행합니다.
    await openLandPreview({
      ...land,
      position,
    });
  };

  // 서버에서 받은 토지 목록을 지도 마커로 렌더링합니다.
  const renderFilteredLands = async (lands, isStale) => {
    // 백엔드가 필터링한 토지만 지도 마커로 다시 렌더링합니다.
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

      // 더 최신 필터 요청이 시작되었는지 확인하는 함수입니다.
      isStale,

      // 마커 클릭도 검색 결과 카드와 같은 상세보기 함수를 사용합니다.
      onMarkerClick: openLandPreview,

      // 마커 렌더링 후 현재 지도 레벨에 맞춰 표시 상태를 갱신합니다.
      onAfterRender: () =>
        updateLandLayerByZoom({
          // Kakao 지도 객체 ref입니다.
          mapRef: mapInstanceRef,

          // Kakao 마커 목록 ref입니다.
          markerLayerRef: landMarkerLayerRef,
        }),
    });
  };

  // 서버에서 등록된 토지 목록을 가져와 지도 마커로 표시
  async function fetchRegisteredLands(
    filters = appliedFiltersRef.current
  ) {
    // 이번 요청에 고유 번호를 부여해 응답 순서를 판별합니다.
    const requestId = ++filterRequestIdRef.current;

    // 현재 요청보다 더 최신 요청이 시작되었는지 확인합니다.
    const isStale = () => requestId !== filterRequestIdRef.current;

    try {
      // 현재 적용된 필터 조건과 현재 지도 영역을 서버 요청 body로 변환합니다.
      const requestBody = createLandFilterBody(
        // 지도 idle 이벤트에서도 최신 필터 조건을 사용합니다.
        filters,
        mapInstanceRef.current
      );

      // 초기 조회 또는 지도 이동 시 서버로 보내는 요청 body를 확인합니다.
      console.log("초기/지도 이동 필터 요청 body:", requestBody);

      // /api/lands/filter API로 현재 화면에 보여줄 토지 목록을 조회합니다.
      const { ok, result } = await fetchFilteredLandList(requestBody);

      // 더 최신 요청이 시작됐다면 현재 응답을 화면에 반영하지 않습니다.
      if (isStale()) return;

      // 실패 응답은 기존 지도 마커를 유지한 채 무시합니다.
      if (!ok) return;

      // 서버 응답 data가 배열이면 마커 목록으로 사용하고, 아니면 빈 배열을 사용합니다.
      const lands = Array.isArray(result.data) ? result.data : [];

      // 필터 API 원본 응답 전체를 확인합니다.
      console.log("필터 API 원본 응답:", result);

      // 필터 API 응답 data 배열 길이를 확인합니다.
      console.log(
        "필터 API 응답 개수:",
        Array.isArray(result.data) ? result.data.length : "data가 배열 아님"
      );

      // 서버에서 받은 토지 목록을 지도 마커로 렌더링합니다.
      await renderFilteredLands(lands, isStale);

    } catch (error) {
      console.error("등록된 토지 목록 조회 실패:", error);
    }
  }

  // 필터 컴포넌트에서 적용 버튼을 눌렀을 때 백엔드에 필터 조건을 전달합니다.
  const handleApplyFilters = async (nextFilters) => {
    // 기존 필터 값에 새로 적용한 필터 값을 병합합니다.
    const mergedFilters = mergeAppliedFilters(
      appliedFiltersRef.current,
      nextFilters
    );

    // 병합된 필터 state와 ref를 함께 갱신합니다.
    updateAppliedFilters(mergedFilters);

    // 공통 조회 함수를 사용해 최신 필터 요청만 지도에 반영합니다.
    await fetchRegisteredLands(mergedFilters);
  };

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

      // 지도 이동 또는 확대/축소가 끝났을 때 현재 화면 영역 기준으로 마커를 다시 조회합니다.
      window.kakao.maps.event.addListener(map, "idle", () => {
        // 현재 필터 조건과 지도 영역을 기준으로 /api/lands/filter API를 다시 호출합니다.
        fetchRegisteredLands(appliedFiltersRef.current);
      });

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
        });
      });

      // 지도 빈 곳을 클릭하면 선택된 토지 상태를 초기화합니다.
      window.kakao.maps.event.addListener(map, "click", () => {
        // 진행 중인 이전 토지 상세 요청이 화면을 다시 열지 못하도록 무효화합니다.
        landDetailRequestIdRef.current += 1;

        // 선택된 토지를 비워 미리보기 패널을 닫습니다.
        setSelectedLand(null);
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
    // Kakao 지도 초기화는 최초 마운트 때만 실행합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    // 검색어가 행정구역 이름인지 확인합니다.
    const searchRegion = getSearchRegion(trimmedKeyword, point);

    // 이번 검색에 고유 번호를 부여해 이전 검색 응답과 구분합니다.
    const searchRequestId = ++searchRequestIdRef.current;

    // 새 검색이 시작되면 이전 상세 응답과 선택된 토지를 초기화합니다.
    landDetailRequestIdRef.current += 1;
    setSelectedLand(null);

    // 검색 결과 패널을 열고 새 결과를 불러오는 상태로 전환합니다.
    setSearchPreviewState({
      isOpen: true,
      keyword: trimmedKeyword,
      lands: [],
      isLoading: true,
      error: "",
    });

    // 검색된 위치로 지도 중심을 이동합니다.
    map.setCenter(moveLatLng);

    // 검색어 상세도에 맞춰 Kakao 지도 확대 레벨을 설정합니다.
    // Kakao는 숫자가 작을수록 더 확대됩니다.
    map.setLevel(getSearchLevel(trimmedKeyword));

    // 전체 토지 목록에서 검색 지역에 포함된 토지를 별도로 조회합니다.
    void fetchSearchLands({
      searchRequestId,
      searchKeyword: trimmedKeyword,
      searchRegion,
    });
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

      {/* 주소 검색 후 현재 지도 영역의 등록 토지 목록을 왼쪽에 표시합니다. */}
      {searchPreviewState.isOpen && (
        <SearchPreview
          // 사용자가 검색한 주소 또는 지역명입니다.
          keyword={searchPreviewState.keyword}
          // 검색 시점의 지도 영역에서 조회된 토지 목록입니다.
          lands={searchPreviewState.lands}
          // 검색 결과 조회 중 여부입니다.
          isLoading={searchPreviewState.isLoading}
          // 검색 결과 조회 실패 문구입니다.
          error={searchPreviewState.error}
          // 현재 상세보기에 선택된 토지 카드 강조에 사용합니다.
          selectedLandId={selectedLand?.id ?? selectedLand?.landId}
          // 카드 클릭 시 해당 토지 위치로 이동하고 상세보기를 엽니다.
          onSelectLand={handleSelectSearchLand}
        />
      )}

      {/* 지도 위 필터 컴포넌트 영역입니다. */}
      <FilterArea>
        <Filter
          // 현재 적용된 필터 조건입니다.
          filters={appliedFilters}
          // 필터 적용 시 실행할 함수입니다.
          onApplyFilters={handleApplyFilters}
        />
      </FilterArea>

      {/* 마커 클릭 시 표시되는 특정 토지 미리보기 패널입니다. */}
      <DetailPanelArea>
        <Preview
          // 선택한 토지가 바뀌면 Preview의 이미지와 요청 상태를 새로 초기화합니다.
          key={selectedLand?.id ?? selectedLand?.landId ?? "none"}
          land={selectedLand}
        />
      </DetailPanelArea>

      {/* AI 채팅은 미리보기보다 뒤, 지도보다 앞에 표시합니다. */}
      <AiChat />
    </MapPage>
  );
}

export default Map;
