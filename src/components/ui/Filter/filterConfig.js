// 거래 유형 옵션입니다.
export const transactionOptions = [
  { label: "전체", value: "ALL" },
  { label: "매매", value: "SALE" },
  { label: "임대", value: "LEASE" },
  { label: "사업희망", value: "BUSINESS_HOPE" },
];

// 드래그 범위 필터별 최소값, 최대값, 이동 단위, 표시 라벨입니다.
export const rangeConfig = {
  // 매매가는 최소/최대 끝값을 조건 없음으로 해석하고, 중간 라벨은 실제 값과 맞춥니다.
  salePrice: {
    min: 0,
    max: 4000000000,
    step: 10000000,
    labels: [
      { label: "최소", value: 0 },
      { label: "10억", value: 1000000000 },
      { label: "20억", value: 2000000000 },
      { label: "30억", value: 3000000000 },
      { label: "최대", value: 4000000000 },
    ],
  },

  // 임대가는 5만원 단위로 움직이고, 중간 라벨은 실제 값과 맞춥니다.
  rentPrice: {
    min: 0,
    max: 5000000,
    step: 50000,
    labels: [
      { label: "최소", value: 0 },
      { label: "100만", value: 1000000 },
      { label: "200만", value: 2000000 },
      { label: "300만", value: 3000000 },
      { label: "400만", value: 4000000 },
      { label: "최대", value: 5000000 },
    ],
  },

  // 면적은 최소/최대 끝값을 조건 없음으로 해석합니다.
  area: {
    min: 0,
    max: 500,
    step: 10,
    labels: [
      { label: "최소", value: 0 },
      { label: "100㎡", value: 100 },
      { label: "200㎡", value: 200 },
      { label: "300㎡", value: 300 },
      { label: "400㎡", value: 400 },
      { label: "최대", value: 500 },
    ],
  },
};
