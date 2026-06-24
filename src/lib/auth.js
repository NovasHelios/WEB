const ACCESS_TOKEN_KEY = "accessToken";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
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
  const token = getValidAccessToken();

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
