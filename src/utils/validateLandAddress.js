// 주소 비교 전에 연속 공백과 앞뒤 공백을 정리합니다.
const normalizeAddressText = (value) =>
  String(value || "").replace(/\s+/g, " ").trim();

// 공식 시·도 명칭과 Kakao 주소 응답의 축약 명칭을 같은 값으로 비교합니다.
const REGION_NAME_ALIASES = {
  서울특별시: "서울",
  부산광역시: "부산",
  대구광역시: "대구",
  인천광역시: "인천",
  광주광역시: "광주",
  대전광역시: "대전",
  울산광역시: "울산",
  세종특별자치시: "세종",
  경기도: "경기",
  강원특별자치도: "강원",
  강원도: "강원",
  충청북도: "충북",
  충청남도: "충남",
  전북특별자치도: "전북",
  전라북도: "전북",
  전라남도: "전남",
  경상북도: "경북",
  경상남도: "경남",
  제주특별자치도: "제주",
  제주도: "제주",
};

// 전체 주소의 첫 번째 시·도 명칭만 축약형으로 통일합니다.
const normalizeRoadAddressText = (value) => {
  // 연속 공백을 정리한 뒤 행정구역과 나머지 주소를 분리합니다.
  const [regionName, ...addressParts] = normalizeAddressText(value).split(" ");
  if (!regionName) return "";

  // 알려진 공식 명칭은 Kakao 축약형으로 바꾸고 나머지 주소는 그대로 유지합니다.
  const normalizedRegionName = REGION_NAME_ALIASES[regionName] || regionName;
  return [normalizedRegionName, ...addressParts].join(" ");
};

// 행정구역 검색 결과를 제외하고 지번·건물 번호가 있는 실제 주소만 허용합니다.
export function findDetailedLandAddress(
  address,
  { requireFullRoadAddress = false } = {}
) {
  return new Promise((resolve) => {
    const services = window.kakao?.maps?.services;
    if (!services?.Geocoder) return resolve(null);
    // 검색과 표준 주소 비교에 동일하게 사용할 입력 주소를 정리합니다.
    const normalizedInput = normalizeAddressText(address);
    const timeout = window.setTimeout(() => resolve(null), 10000);
    try {
      new services.Geocoder().addressSearch(normalizedInput, (results, status) => {
        window.clearTimeout(timeout);
        resolve(status === services.Status.OK && Array.isArray(results) ? results.find((item) => {
          // 지번 또는 건물번호가 있는 상세 주소인지 먼저 확인합니다.
          const hasDetailedNumber =
            [item.address?.main_address_no, item.road_address?.main_building_no]
              .some((value) => Number(value) > 0);
          if (!["REGION_ADDR", "ROAD_ADDR"].includes(item.address_type) || !hasDetailedNumber) {
            return false;
          }

          // 엄격 검증이 아니면 기존처럼 상세 지번과 도로명 주소를 모두 허용합니다.
          if (!requireFullRoadAddress) return true;

          // 토지 등록에서는 시·도 표기만 통일한 전체 도로명 주소가 같아야 통과합니다.
          const fullRoadAddress = normalizeRoadAddressText(
            item.road_address?.address_name
          );
          return Boolean(
            fullRoadAddress &&
            normalizeRoadAddressText(normalizedInput) === fullRoadAddress
          );
        }) || null : null);
      });
    } catch {
      window.clearTimeout(timeout);
      resolve(null);
    }
  });
}

// 수정 화면에서는 상세 주소 검색의 성공 여부만 사용합니다.
export async function validateLandAddress(address) {
  return Boolean(await findDetailedLandAddress(address));
}
