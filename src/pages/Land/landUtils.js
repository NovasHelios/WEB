// 공통 유틸리티 - 토지 목록 페이지에서 공유

export const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const numeric = typeof value === "number" ? value : Number(String(value).replace(/[^\d]/g, ""));
  if (Number.isNaN(numeric)) return String(value);

  // 서버 가격은 만원 단위이므로 화면에서는 조/억/만원 단위로 변환합니다.
  const jo = Math.floor(numeric / 100000000);
  const restAfterJo = numeric % 100000000;
  const eok = Math.floor(restAfterJo / 10000);
  const man = restAfterJo % 10000;

  if (jo > 0) {
    const eokText = eok > 0 ? ` ${eok.toLocaleString("ko-KR")}억원` : "";
    const manText = man > 0 ? ` ${man.toLocaleString("ko-KR")}만원` : "";
    return `${jo.toLocaleString("ko-KR")}조${eokText}${manText}`;
  }

  if (eok > 0 && man > 0) {
    return `${eok.toLocaleString("ko-KR")}억 ${man.toLocaleString("ko-KR")}만원`;
  }

  if (eok > 0) {
    return `${eok.toLocaleString("ko-KR")}억원`;
  }

  return `${numeric.toLocaleString("ko-KR")}만원`;
};

export const formatArea = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return Number.isInteger(value) ? value.toLocaleString("ko-KR") : String(value);
};

export const formatDate = (value = new Date()) => {
  // 등록일은 서버 날짜가 있으면 사용하고, 없으면 오늘 날짜로 표시합니다.
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toISOString().slice(0, 10).replaceAll("-", ".");
};

export const getCreatedDate = (land) =>
  land.createdAt ||
  land.createdDate ||
  land.registeredAt ||
  land.registerDate ||
  land.created_at ||
  new Date();

export const normalizeBaseUrl = (value) => {
  const rawValue = value || "https://www.helioss.site";
  if (rawValue.startsWith("http://") || rawValue.startsWith("https://")) {
    return rawValue.replace(/\/$/, "");
  }
  return `https://${rawValue.replace(/\/$/, "")}`;
};

export const resolveImageUrl = (path, baseUrl) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${baseUrl}${path}`;
  if (path.startsWith("uploads/")) return `${baseUrl}/${path}`;
  return `${baseUrl}/uploads/lands/${path}`;
};

export const extractLandArray = (payload) => {
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload?.data,
    payload?.content,
    payload?.data?.content,
    payload?.result,
    payload?.data?.result,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
};

// API 응답의 LandResponse 스펙에 맞게 정규화
export const normalizeLand = (land, index) => ({
  id: land.id ?? land.landId ?? `${land.address ?? "land"}-${index}`,
  address: land.address ?? "-",
  desiredPrice: land.desiredPrice ?? land.amount ?? land.price ?? null,
  area: land.area ?? null,
  status: land.status ?? "-",
  transactionType: land.transactionType ?? null,
  description: land.description ?? "-",
  createdDate: formatDate(getCreatedDate(land)),
  regionSido: land.regionSido ?? "",
  regionSigungu: land.regionSigungu ?? "",
  // landImagePaths는 배열 — 첫 번째 이미지를 썸네일로 사용
  landImagePath: Array.isArray(land.landImagePaths)
    ? (land.landImagePaths[0] ?? "")
    : (land.landImagePath ?? ""),
  landImagePaths: Array.isArray(land.landImagePaths) ? land.landImagePaths : [],
});

// Wish API 응답 정규화
export const normalizeWish = (wish, index) => ({
  id: wish.wishId ?? wish.landId ?? `${wish.address ?? "wish"}-${index}`,
  landId: wish.landId,
  wishId: wish.wishId,
  address: wish.address ?? "-",
  desiredPrice: wish.desiredPrice ?? null,
  area: wish.area ?? null,
  status: wish.status ?? "-",
  transactionType: wish.transactionType ?? null,
  description: wish.description ?? "-",
  regionSido: wish.regionSido ?? "",
  regionSigungu: wish.regionSigungu ?? "",
  wishedAt: wish.wishedAt,
  // 이미지
  landImagePath: Array.isArray(wish.landImagePaths)
    ? (wish.landImagePaths[0] ?? "")
    : (wish.landImagePath ?? ""),
  landImagePaths: Array.isArray(wish.landImagePaths) ? wish.landImagePaths : [],
});

export const getTransactionLabel = (value) => {
  if (!value) return "미분류";
  const upper = String(value).toUpperCase();
  if (upper === "SALE") return "매매";
  if (upper === "LEASE" || upper === "RENT") return "임대";
  return String(value);
};
