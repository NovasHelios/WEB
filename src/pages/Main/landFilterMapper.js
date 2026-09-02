// 시작점에 있는 최소값은 서버에 조건 없음으로 전달합니다.
const normalizeMinValue = (value, defaultMin) => {
  // null이거나 기본 최소값이면 필터 조건을 보내지 않습니다.
  if (value === null || value === defaultMin) return null;

  // 사용자가 움직인 값만 서버에 전달합니다.
  return value;
};

// 끝점에 있는 최대값은 서버에 조건 없음으로 전달합니다.
const normalizeMaxValue = (value, defaultMax) => {
  // null이거나 기본 최대값이면 필터 조건을 보내지 않습니다.
  if (value === null || value === defaultMax) return null;

  // 사용자가 움직인 값만 서버에 전달합니다.
  return value;
};

// 화면 필터 상태와 현재 지도 영역을 백엔드 /api/lands/filter request body로 변환합니다.
export const createLandFilterBody = (filters, map) => {
  // Kakao 지도 객체에서 현재 화면 영역 bounds를 가져옵니다.
  const bounds = map?.getBounds?.();

  // bounds의 남서쪽 좌표입니다.
  const southWest = bounds?.getSouthWest?.();

  // bounds의 북동쪽 좌표입니다.
  const northEast = bounds?.getNorthEast?.();

  // 지역 필터는 선택된 단계의 이름을 서버 필드에 맞춰 나누어 전달합니다.
  const selectedRegion = filters.region || {};

  // 서버가 요구하는 필터 request body를 생성합니다.
  return {
    // 현재 화면의 왼쪽 위 경도입니다.
    topLeftX: southWest ? southWest.getLng() : 0,

    // 현재 화면의 왼쪽 위 위도입니다.
    topLeftY: northEast ? northEast.getLat() : 0,

    // 현재 화면의 오른쪽 아래 경도입니다.
    bottomRightX: northEast ? northEast.getLng() : 0,

    // 현재 화면의 오른쪽 아래 위도입니다.
    bottomRightY: southWest ? southWest.getLat() : 0,

    // 상태 조건은 현재 화면 필터에 없으므로 전체 상태를 조회하도록 null을 전달합니다.
    status: null,

    // 거래 유형이 전체이면 서버에 조건 없음으로 전달합니다.
    transactionType:
      filters.transactionType && filters.transactionType !== "ALL"
        ? filters.transactionType
        : null,

    // 매매가 최소 조건입니다. 시작점이면 null을 전달합니다.
    saleMinPrice: normalizeMinValue(filters.salePrice.min, 0),

    // 매매가 최대 조건입니다. 끝점이면 null을 전달합니다.
    saleMaxPrice: normalizeMaxValue(filters.salePrice.max, 4000000000),

    // 임대가 최소 조건입니다. 시작점이면 null을 전달합니다.
    leaseMinPrice: normalizeMinValue(filters.rentPrice.min, 0),

    // 임대가 최대 조건입니다. 끝점이면 null을 전달합니다.
    leaseMaxPrice: normalizeMaxValue(filters.rentPrice.max, 5000000),

    // 면적 최소 조건입니다. 시작점이면 null을 전달합니다.
    minArea: normalizeMinValue(filters.area.min, 0),

    // 면적 최대 조건입니다. 끝점이면 null을 전달합니다.
    maxArea: normalizeMaxValue(filters.area.max, 500),

    // 선택된 시도 이름입니다.
    sido: selectedRegion.sido?.name || null,

    // 선택된 시군구 이름입니다.
    sigungu: selectedRegion.sigungu?.name || null,

    // 선택된 읍면동 이름입니다.
    eupmyeondong: selectedRegion.emd?.name || null,
  };
};
