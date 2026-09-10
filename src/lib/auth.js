const ACCESS_TOKEN_KEY = "accessToken";
const LOGIN_NOTICE_KEY = "loginNotice";
const USER_DISPLAY_NAME_KEY = "userDisplayName";
export const USER_DISPLAY_NAME_CHANGED_EVENT = "helios:user-display-name-changed";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

const normalizeAccessToken = (token) => {
  // 서버가 Bearer 접두어를 포함해 내려줘도 순수 JWT만 저장합니다.
  return String(token || "").replace(/^Bearer\s+/i, "").trim();
};

export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, normalizeAccessToken(token));
};

export const getStoredUserDisplayName = () => localStorage.getItem(USER_DISPLAY_NAME_KEY) || "";

export const setStoredUserDisplayName = (name) => {
  // navbar가 페이지 이동 중에도 사용자 이름을 바로 표시할 수 있게 캐시합니다.
  const normalizedName = String(name || "").trim();
  if (!normalizedName) return;
  localStorage.setItem(USER_DISPLAY_NAME_KEY, normalizedName);
  window.dispatchEvent(new CustomEvent(USER_DISPLAY_NAME_CHANGED_EVENT, { detail: normalizedName }));
};

export const markLoginNotice = () => {
  // 로그인 성공 안내를 한 번만 띄우기 위해 표시 예약값을 저장합니다.
  localStorage.setItem(LOGIN_NOTICE_KEY, "true");
};

export const consumeLoginNotice = () => {
  // 예약된 로그인 안내를 읽고 즉시 제거합니다.
  const shouldShow = localStorage.getItem(LOGIN_NOTICE_KEY) === "true";
  localStorage.removeItem(LOGIN_NOTICE_KEY);
  return shouldShow;
};

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(LOGIN_NOTICE_KEY);
  localStorage.removeItem(USER_DISPLAY_NAME_KEY);
};

const decodeJwtPayload = (token) => {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

export const isAccessTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;

  return Date.now() >= payload.exp * 1000;
};

export const getValidAccessToken = () => {
  const token = getAccessToken();
  if (!token) return "";

  if (isAccessTokenExpired(token)) {
    clearAccessToken();
    return "";
  }

  return token;
};

export const buildAuthHeaders = (headers = {}) => {
  const token = normalizeAccessToken(getValidAccessToken());

  if (!token) return headers;

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
};

export const authFetch = async (input, init = {}) => {
  const response = await fetch(input, {
    ...init,
    headers: buildAuthHeaders(init.headers),
  });

  if (response.status === 401) {
    clearAccessToken();
  }

  return response;
};

export const getFriendlyApiErrorMessage = (error, fallbackMessage) => {
  const message = error?.message || "";

  if (
    message.includes("로그인") ||
    message.includes("인증") ||
    message.includes("401") ||
    message.includes("403")
  ) {
    return "로그인이 필요하거나 인증이 만료됐어요. 다시 로그인한 뒤 시도해 주세요.";
  }

  if (message.includes("413") || message.includes("너무 큽니다") || message.includes("용량")) {
    return "이미지 용량이 너무 커서 업로드할 수 없어요. 5MB 이하 파일로 다시 시도해 주세요.";
  }

  if (message.includes("Failed to fetch") || message.includes("CORS") || message.includes("네트워크")) {
    return "서버와 연결하지 못했어요. 잠시 후 다시 시도해 주세요.";
  }

  return fallbackMessage;
};
