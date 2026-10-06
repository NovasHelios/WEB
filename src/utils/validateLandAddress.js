// 행정구역 검색 결과를 제외하고 지번·건물 번호가 있는 실제 주소만 허용합니다.
export function findDetailedLandAddress(address) {
  return new Promise((resolve) => {
    const services = window.kakao?.maps?.services;
    if (!services?.Geocoder) return resolve(null);
    const timeout = window.setTimeout(() => resolve(null), 10000);
    try {
      new services.Geocoder().addressSearch(address.trim(), (results, status) => {
        window.clearTimeout(timeout);
        resolve(status === services.Status.OK && Array.isArray(results) ? results.find((item) =>
          ["REGION_ADDR", "ROAD_ADDR"].includes(item.address_type) &&
          [item.address?.main_address_no, item.road_address?.main_building_no]
            .some((value) => Number(value) > 0)) || null : null);
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
