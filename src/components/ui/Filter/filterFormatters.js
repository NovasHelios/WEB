// 숫자 가격을 필터 표시 문구로 변환합니다.
export const formatMoneyLabel = (value) => {
  // 값이 없으면 전체로 표시합니다.
  if (value === null || value === undefined) return "전체";

  // 1억 이상이면 억 단위로 표시합니다.
  if (value >= 100000000) return `${value / 100000000}억`;

  // 1천만원 이상이면 천만원 단위로 표시합니다.
  if (value >= 10000000) return `${value / 10000}만`;

  // 기본은 만원 단위로 표시합니다.
  return `${value / 10000}만`;
};

// 숫자 면적을 필터 표시 문구로 변환합니다.
export const formatAreaLabel = (value) => {
  // 값이 없으면 전체로 표시합니다.
  if (value === null || value === undefined) return "전체";

  // 제곱미터 단위로 표시합니다.
  return `${value}㎡`;
};

// 금액 범위 표시 문구를 생성합니다.
export const formatMoneyRangeLabel = (range, defaultMin, defaultMax) => {
  // 최소 핸들의 현재 값을 가져옵니다.
  const minValue = range.min ?? defaultMin;

  // 최대 핸들의 현재 값을 가져옵니다.
  const maxValue = range.max ?? defaultMax;

  // 양쪽 핸들이 모두 끝에 있으면 전체 조건입니다.
  if (minValue === defaultMin && maxValue === defaultMax) {
    return "전체";
  }

  // 왼쪽 핸들이 최소 끝에 있으면 오른쪽 값 이하 조건입니다.
  if (minValue === defaultMin) {
    return `${formatMoneyLabel(maxValue)} 이하`;
  }

  // 오른쪽 핸들이 최대 끝에 있으면 왼쪽 값 이상 조건입니다.
  if (maxValue === defaultMax) {
    return `${formatMoneyLabel(minValue)} 이상`;
  }

  // 양쪽 핸들이 모두 끝이 아니면 범위 조건입니다.
  return `${formatMoneyLabel(minValue)} ~ ${formatMoneyLabel(maxValue)}`;
};

// 면적 범위 표시 문구를 생성합니다.
export const formatAreaRangeLabel = (range, defaultMin, defaultMax) => {
  // 최소 핸들의 현재 값을 가져옵니다.
  const minValue = range.min ?? defaultMin;

  // 최대 핸들의 현재 값을 가져옵니다.
  const maxValue = range.max ?? defaultMax;

  // 양쪽 핸들이 모두 끝에 있으면 전체 조건입니다.
  if (minValue === defaultMin && maxValue === defaultMax) {
    return "전체";
  }

  // 왼쪽 핸들이 최소 끝에 있으면 오른쪽 값 이하 조건입니다.
  if (minValue === defaultMin) {
    return `${formatAreaLabel(maxValue)} 이하`;
  }

  // 오른쪽 핸들이 최대 끝에 있으면 왼쪽 값 이상 조건입니다.
  if (maxValue === defaultMax) {
    return `${formatAreaLabel(minValue)} 이상`;
  }

  // 양쪽 핸들이 모두 끝이 아니면 범위 조건입니다.
  return `${formatAreaLabel(minValue)} ~ ${formatAreaLabel(maxValue)}`;
};

// 슬라이더 값이 전체 범위에서 차지하는 퍼센트를 계산합니다.
export const getRangePercent = (value, config) => {
  // input range와 표시 바 위치 계산에 함께 사용합니다.
  return ((value - config.min) / (config.max - config.min)) * 100;
};
