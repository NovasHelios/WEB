const SERVICE_ID = import.meta.env.VITE_SGIS_SERVICE_ID;
const SECURITY_KEY = import.meta.env.VITE_SGIS_SECURITY_KEY;

let cachedAccessToken = null;

export const getSgisAccessToken = async () => {
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  const params = new URLSearchParams({
    consumer_key: SERVICE_ID,
    consumer_secret: SECURITY_KEY,
  });

  // 개발 환경에서는 Vite 프록시를 통해 SGIS 인증 API를 호출합니다.
  const response = await fetch(
    `/sgis/OpenAPI3/auth/authentication.json?${params}`
  );

  const data = await response.json();

  if (String(data.errCd) !== "0") {
    throw new Error(data.errMsg || "SGIS AccessToken 발급에 실패했습니다.");
  }

  cachedAccessToken = data.result.accessToken;

  return cachedAccessToken;
};

export const getRegions = async (code = null) => {
  const accessToken = await getSgisAccessToken();

  const params = new URLSearchParams({
    accessToken,
    pg_yn: "0",
  });

  if (code) {
    params.append("cd", code);
  }

  // 개발 환경에서는 Vite 프록시를 통해 SGIS 단계별 주소 API를 호출합니다.
  const response = await fetch(`/sgis/OpenAPI3/addr/stage.json?${params}`);

  const data = await response.json();

  if (String(data.errCd) !== "0") {
    throw new Error(data.errMsg || "SGIS 지역 조회에 실패했습니다.");
  }

  return data.result.map((region) => ({
    code: region.cd,
    name: region.addr_name,
  }));
};

export const clearSgisAccessToken = () => {
  cachedAccessToken = null;
};
