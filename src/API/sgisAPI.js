// Helios 백엔드 API 기본 주소를 준비합니다.
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://www.helioss.site"
).replace(/\/$/, "");

// 백엔드 지역 proxy 응답에서 실제 지역 배열을 꺼냅니다.
const extractRegions = (data) => {
  // 백엔드가 SGIS 원본 result 배열을 그대로 반환하는 경우입니다.
  if (Array.isArray(data?.result)) {
    return data.result;
  }

  // 백엔드가 공통 응답 data 배열로 반환하는 경우입니다.
  if (Array.isArray(data?.data)) {
    return data.data;
  }

  // 백엔드가 data.result 배열로 감싸서 반환하는 경우입니다.
  if (Array.isArray(data?.data?.result)) {
    return data.data.result;
  }

  // 예상하지 못한 응답이면 빈 배열을 사용합니다.
  return [];
};

// SGIS 단계별 주소 API를 Helios 백엔드 proxy를 통해 조회합니다.
export const getRegions = async (code = null) => {
  // 백엔드 지역 proxy API에 전달할 파라미터를 구성합니다.
  const params = new URLSearchParams();

  // 상위 지역 코드가 있으면 다음 단계 지역 목록을 요청합니다.
  if (code) {
    params.append("cd", code);
  }

  // query string이 있을 때만 URL 뒤에 붙입니다.
  const queryString = params.toString();

  // 브라우저에서 SGIS를 직접 호출하지 않고 Helios 백엔드를 호출합니다.
  const response = await fetch(
    `${API_BASE_URL}/api/regions/stage${queryString ? `?${queryString}` : ""}`
  );

  // 백엔드 응답을 JSON으로 변환합니다.
  const data = await response.json();

  // HTTP 응답이 실패하면 화면에서 처리할 수 있도록 에러를 발생시킵니다.
  if (!response.ok) {
    throw new Error(
      data?.errMsg || data?.message || "SGIS 지역 조회에 실패했습니다."
    );
  }

  // SGIS 원본 에러 코드가 실패이면 화면에서 처리할 수 있도록 에러를 발생시킵니다.
  if (data?.errCd !== undefined && String(data.errCd) !== "0") {
    throw new Error(data.errMsg || "SGIS 지역 조회에 실패했습니다.");
  }

  // 공통 응답 status가 실패이면 화면에서 처리할 수 있도록 에러를 발생시킵니다.
  if (data?.status !== undefined && Number(data.status) >= 400) {
    throw new Error(data.message || "SGIS 지역 조회에 실패했습니다.");
  }

  // 백엔드 응답 구조에서 지역 배열을 꺼냅니다.
  const regions = extractRegions(data);

  // UI가 서버 원본 필드명을 알지 않도록 공통 지역 형식으로 변환합니다.
  return regions.map((region) => ({
    // SGIS 원본 cd 또는 백엔드 변환 code를 지역 코드로 사용합니다.
    code: region.cd || region.code,

    // SGIS 원본 addr_name 또는 백엔드 변환 name을 지역 이름으로 사용합니다.
    name: region.addr_name || region.name,
  }));
};

// 백엔드 proxy 방식에서는 프론트 SGIS AccessToken 캐시를 사용하지 않습니다.
export const clearSgisAccessToken = () => {};
