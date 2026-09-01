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

// 화면 필터 상태를 백엔드 /api/lands/filter request body로 변환합니다.
export const createLandFilterBody = (filters) => {
  // 지역 필터는 선택된 단계의 이름을 서버 필드에 맞춰 나누어 전달합니다.
  const selectedRegion = filters.region || {};

  // 서버가 요구하는 필터 request body를 생성합니다.
  return {
    // 상태 조건은 현재 화면 필터에 없으므로 전체 상태를 조회하도록 null을 전달합니다.
    status: null,
    // 거래 유형이 전체이면 서버에 조건 없음으로 전달합니다.
    transactionType:
      filters.transactionType && filters.transactionType !== "ALL"
        ? filters.transactionType
        : null,
    // 매매가 범위 조건입니다.
    saleMinPrice: normalizeMinValue(filters.salePrice.min, 0),
    saleMaxPrice: normalizeMaxValue(filters.salePrice.max, 4000000000),
    // 임대가 범위 조건입니다.
    leaseMinPrice: normalizeMinValue(filters.rentPrice.min, 0),
    leaseMaxPrice: normalizeMaxValue(filters.rentPrice.max, 5000000),
    // 면적 범위 조건입니다.
    minArea: normalizeMinValue(filters.area.min, 0),
    maxArea: normalizeMaxValue(filters.area.max, 500),
    // 지역 선택 조건입니다.
    sido: selectedRegion.sido?.name || null,
    sigungu: selectedRegion.sigungu?.name || null,
    eupmyeondong: selectedRegion.emd?.name || null,
  };
};
