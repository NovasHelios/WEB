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

  const response = await fetch(
    `https://sgisapi.mods.go.kr/OpenAPI3/auth/authentication.json?${params}`
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

  const response = await fetch(
    `https://sgisapi.mods.go.kr/OpenAPI3/addr/stage.json?${params}`
  );

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
