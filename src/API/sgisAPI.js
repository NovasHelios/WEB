const SERVICE_ID = import.meta.env.VITE_SGIS_SERVICE_ID;
const SECURITY_KEY = import.meta.env.VITE_SGIS_SECURITY_KEY;

let cachedAccessToken = null;

// SGIS AccessToken을 발급받고 재사용합니다.
export const getSgisAccessToken = async () => {
  // 이미 발급받은 토큰이 있으면 같은 토큰을 재사용합니다.
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  // SGIS 인증 API에 전달할 서비스 ID와 보안 KEY를 구성합니다.
  const params = new URLSearchParams({
    consumer_key: SERVICE_ID,
    consumer_secret: SECURITY_KEY,
  });

  // 개발 환경에서는 Vite 프록시를 통해 SGIS 인증 API를 호출합니다.
  const response = await fetch(`https://sgisapi.kostat.go.kr/OpenAPI3/addr/stage.json?${params}`);

  // SGIS 인증 응답을 JSON으로 변환합니다.
  const data = await response.json();

  // SGIS 에러 응답이면 화면에서 처리할 수 있도록 에러를 발생시킵니다.
  if (String(data.errCd) !== "0") {
    throw new Error(data.errMsg || "SGIS AccessToken 발급에 실패했습니다.");
  }

  // 발급된 토큰을 캐시에 저장합니다.
  cachedAccessToken = data.result.accessToken;

  // 지역 조회 API에서 사용할 AccessToken을 반환합니다.
  return cachedAccessToken;
};

// SGIS 단계별 주소 API에서 지역 목록을 조회합니다.
export const getRegions = async (code = null) => {
  // 지역 조회 전에 SGIS AccessToken을 준비합니다.
  const accessToken = await getSgisAccessToken();

  // 단계별 주소 조회에 필요한 기본 파라미터를 구성합니다.
  const params = new URLSearchParams({
    accessToken,
    pg_yn: "0",
  });

  // 상위 지역 코드가 있으면 다음 단계 지역 목록을 요청합니다.
  if (code) {
    params.append("cd", code);
  }

  // 개발 환경에서는 Vite 프록시를 통해 SGIS 단계별 주소 API를 호출합니다.
  const response = await fetch(`/sgis/OpenAPI3/addr/stage.json?${params}`);

  // SGIS 지역 조회 응답을 JSON으로 변환합니다.
  const data = await response.json();

  // SGIS 에러 응답이면 화면에서 처리할 수 있도록 에러를 발생시킵니다.
  if (String(data.errCd) !== "0") {
    throw new Error(data.errMsg || "SGIS 지역 조회에 실패했습니다.");
  }

  // UI가 SGIS 원본 필드명을 알지 않도록 공통 지역 형식으로 변환합니다.
  return data.result.map((region) => ({
    code: region.cd,
    name: region.addr_name,
  }));
};

// 필요할 때 SGIS AccessToken 캐시를 초기화합니다.
export const clearSgisAccessToken = () => {
  cachedAccessToken = null;
};
