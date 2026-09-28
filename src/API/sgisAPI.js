const SERVICE_ID = import.meta.env.VITE_SGIS_SERVICE_ID;
const SECURITY_KEY = import.meta.env.VITE_SGIS_SECURITY_KEY;

let cachedAccessToken = null;

// SGIS 지역 목록을 상위 지역 코드별로 저장합니다.
const cachedRegionsByCode = new Map();

// 아직 응답이 끝나지 않은 SGIS 지역 요청을 상위 지역 코드별로 저장합니다.
const pendingRegionsByCode = new Map();

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
  const response = await fetch(
    `/sgis/OpenAPI3/auth/authentication.json?${params}`
  );

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
  // 최상위 시도 목록은 code가 없으므로 ROOT key로 구분합니다.
  const cacheKey = code || "ROOT";

  // 이미 조회한 지역 목록이면 SGIS를 다시 호출하지 않고 캐시를 반환합니다.
  if (cachedRegionsByCode.has(cacheKey)) {
    return cachedRegionsByCode.get(cacheKey);
  }

  // 같은 지역 코드 요청이 이미 진행 중이면 기존 요청 Promise를 재사용합니다.
  if (pendingRegionsByCode.has(cacheKey)) {
    return pendingRegionsByCode.get(cacheKey);
  }

  // 이미 조회한 지역 목록이면 SGIS를 다시 호출하지 않고 캐시를 반환합니다.
  if (cachedRegionsByCode.has(cacheKey)) {
    return cachedRegionsByCode.get(cacheKey);
  }

  // 실제 SGIS 지역 요청을 Promise로 만들어 중복 요청에서 재사용합니다.
  const requestPromise = (async () => {
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

    // SGIS에서 받은 지역 조회 요청 코드와 원본 응답을 확인합니다.
    console.log("SGIS 지역 조회 요청 코드:", code);
    console.log("SGIS 지역 조회 원본 응답:", data);
    console.log("SGIS 지역 목록:", data.result);

    // SGIS 에러 응답이면 화면에서 처리할 수 있도록 에러를 발생시킵니다.
    if (String(data.errCd) !== "0") {
      throw new Error(data.errMsg || "SGIS 지역 조회에 실패했습니다.");
    }

    // UI가 SGIS 원본 필드명을 알지 않도록 공통 지역 형식으로 변환합니다.
    const regions = data.result.map((region) => ({
      code: region.cd,
      name: region.addr_name,
    }));

    // 다음에 같은 지역 코드를 요청하면 SGIS를 다시 호출하지 않도록 캐시에 저장합니다.
    cachedRegionsByCode.set(cacheKey, regions);

    // 변환된 지역 목록을 반환합니다.
    return regions;
  })();

  // 같은 지역 코드 요청이 동시에 들어오면 이 Promise를 재사용하도록 저장합니다.
  pendingRegionsByCode.set(cacheKey, requestPromise);

  try {
    // SGIS 지역 요청 결과를 반환합니다.
    return await requestPromise;
  } finally {
    // 요청이 성공하거나 실패하면 진행 중 요청 캐시에서 제거합니다.
    pendingRegionsByCode.delete(cacheKey);
  }
};

// 필요할 때 SGIS AccessToken과 지역 요청 캐시를 초기화합니다.
export const clearSgisAccessToken = () => {
  // SGIS AccessToken 캐시를 비웁니다.
  cachedAccessToken = null;

  // 저장된 지역 목록 캐시를 비웁니다.
  cachedRegionsByCode.clear();

  // 진행 중인 지역 요청 캐시를 비웁니다.
  pendingRegionsByCode.clear();
};
