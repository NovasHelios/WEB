// 공시지가 값을 화면에 표시할 형식으로 변환합니다.
export const formatOfficialLandPrice = (value, fallback = "-") => {
  if (value === null || value === undefined || value === "") return fallback;

  const numericValue = Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(numericValue) || numericValue < 0) return fallback;

  return `${Math.round(numericValue).toLocaleString("ko-KR")}원/㎡`;
};
