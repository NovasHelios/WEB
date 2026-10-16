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

// 행정구역 검색 결과를 제외하고 지번·건물 번호가 있는 상세 주소 후보를 모두 반환합니다.
export function searchDetailedLandAddresses(
  address,
  { requireRoadAddress = false } = {}
) {
  return new Promise((resolve) => {
    const services = window.kakao?.maps?.services;
    if (!services?.Geocoder) return resolve([]);
    // 일부 주소도 검색할 수 있도록 공백만 정리하고 원문 검색어를 유지합니다.
    const normalizedInput = normalizeAddressText(address);
    if (!normalizedInput) return resolve([]);

    const timeout = window.setTimeout(() => resolve([]), 10000);
    try {
      new services.Geocoder().addressSearch(normalizedInput, (results, status) => {
        window.clearTimeout(timeout);
        if (status !== services.Status.OK || !Array.isArray(results)) {
          resolve([]);
          return;
        }

        // 상세 번호가 있고 필요 시 도로명 주소도 존재하는 결과만 선택합니다.
        const detailedResults = results.filter((item) => {
          // 지번 또는 건물번호가 있는 상세 주소인지 먼저 확인합니다.
          const hasDetailedNumber =
            [item.address?.main_address_no, item.road_address?.main_building_no]
              .some((value) => Number(value) > 0);
          if (!["REGION_ADDR", "ROAD_ADDR"].includes(item.address_type) || !hasDetailedNumber) {
            return false;
          }

          // 토지 등록 후보에는 사용자가 선택할 전체 도로명 주소가 반드시 있어야 합니다.
          return !requireRoadAddress || Boolean(item.road_address?.address_name);
        });

        // 같은 도로명 주소가 중복 반환되면 첫 번째 결과만 목록에 남깁니다.
        const seenAddresses = new Set();
        resolve(detailedResults.filter((item) => {
          const candidateAddress = normalizeAddressText(
            item.road_address?.address_name || item.address?.address_name || item.address_name
          );
          if (!candidateAddress || seenAddresses.has(candidateAddress)) return false;
          seenAddresses.add(candidateAddress);
          return true;
        }));
      });
    } catch {
      window.clearTimeout(timeout);
      resolve([]);
    }
  });
}

// 검색된 상세 주소 중 입력 조건과 일치하는 한 건을 기존 검증 흐름에 반환합니다.
export async function findDetailedLandAddress(
  address,
  { requireFullRoadAddress = false } = {}
) {
  // 엄격 검증에서도 도로명 주소가 포함된 후보만 비교합니다.
  const results = await searchDetailedLandAddresses(address, {
    requireRoadAddress: requireFullRoadAddress,
  });

  // 일반 검증은 기존처럼 첫 번째 상세 지번 또는 도로명 주소를 사용합니다.
  if (!requireFullRoadAddress) return results[0] || null;

  // 토지 등록에서는 시·도 표기만 통일한 전체 도로명 주소가 같아야 통과합니다.
  const normalizedInput = normalizeRoadAddressText(address);
  return results.find((item) => {
    const fullRoadAddress = normalizeRoadAddressText(
      item.road_address?.address_name
    );

    return Boolean(fullRoadAddress && normalizedInput === fullRoadAddress);
  }) || null;
}

// 수정 화면에서는 상세 주소 검색의 성공 여부만 사용합니다.
export async function validateLandAddress(address) {
  return Boolean(await findDetailedLandAddress(address));
}
