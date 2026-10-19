// 사업자·사용자 프로필 이미지 경로를 서버에서 읽을 수 있는 URL로 변환합니다.
export function resolveProfileImageUrl(path) {
  if (!path) return "";
  const apiBase = import.meta.env.VITE_API_BASE_URL || "https://api.helioss.site";
  const base = /^https?:\/\//i.test(apiBase) ? apiBase.replace(/\/$/, "") : `https://${apiBase.replace(/\/$/, "")}`;
  const value = String(path);
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.replace(/^\/+/, "");
  return `${base}/${normalized.startsWith("uploads/") ? normalized : `uploads/profiles/${normalized}`}`;
}
