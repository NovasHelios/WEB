import { formatExactKoreanMoneyFromManwon } from "@/utils/priceFormat";

// API 서버 기본 주소를 안전하게 정리합니다.
const normalizeBaseUrl = (value) => {
  // 환경변수가 없으면 운영 서버 주소를 기본값으로 사용합니다.
  const rawValue = value || "https://www.helioss.site";

  // 완전한 URL이면 마지막 슬래시만 제거합니다.
  if (rawValue.startsWith("http://") || rawValue.startsWith("https://")) {
    return rawValue.replace(/\/$/, "");
  }

  // 프로토콜이 없는 주소에는 https를 붙입니다.
  return `https://${rawValue.replace(/\/$/, "")}`;
};

// 이미지와 파일 상대 경로를 절대 경로로 만들 때 사용할 서버 주소입니다.
const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

// 서버에서 받은 파일 경로를 브라우저에서 접근 가능한 URL로 변환합니다.
export const resolveAssetUrl = (path) => {
  // 경로가 없으면 빈 값을 반환합니다.
  if (!path) return "";

  // 서버가 이미지 객체를 내려줄 때 실제 경로 후보를 꺼냅니다.
  if (typeof path === "object") {
    return resolveAssetUrl(path.url || path.path || path.filePath || path.imageUrl || path.landImagePath || "");
  }

  // 문자열이 아닌 값은 이미지 경로로 쓰지 않습니다.
  if (typeof path !== "string") return "";

  // 이미 완전한 URL이면 그대로 사용합니다.
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // 루트 상대 경로면 API 서버 주소를 앞에 붙입니다.
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;

  // 일반 상대 경로면 API 서버 주소와 함께 붙입니다.
  return `${API_BASE_URL}/${path}`;
};

export const formatPrice = (value) => {
  // 상세보기 가격은 서버 기준인 원 단위를 정확하게 모두 표시합니다.
  return formatExactKoreanMoneyFromManwon(value);
};

// 제곱미터 면적을 평수와 함께 표시합니다.
export const formatArea = (value) => {
  // 면적이 없으면 빈 값을 대신 표시합니다.
  if (value === null || value === undefined || value === "") return "-";

  // 숫자 계산을 위해 면적을 Number로 변환합니다.
  const numberValue = Number(value);

  // 숫자로 변환할 수 없으면 원본 값을 그대로 표시합니다.
  if (Number.isNaN(numberValue)) return String(value);

  // 평 단위 면적을 계산합니다.
  const pyeong = Math.round(numberValue / 3.3058);

  // 제곱미터와 평수를 함께 반환합니다.
  return `${numberValue.toLocaleString()} ㎡ (${pyeong.toLocaleString()}평)`;
};

// 거래 유형 코드를 한국어 화면 문구로 변환합니다.
export const formatTransactionType = (value) => {
  // 서버 거래 유형 코드를 화면 문구로 매핑합니다.
  const transactionMap = {
    SALE: "매매",
    LEASE: "임대",
    BUSINESS_HOPE: "사업희망",
  };

  // 매핑된 값이 없으면 원본 값을 사용합니다.
  return transactionMap[value] || value || "-";
};

// 상세보기에서 사용할 이미지 목록을 구성합니다.
export const buildImageList = (land) => {
  // 서버에서 여러 이미지 배열을 줄 가능성을 대비합니다.
  const extraImages =
    land.landImagePaths ||
    land.imagePaths ||
    land.images ||
    land.imageUrls ||
    land.landImages ||
    land.files ||
    [];

  // 대표 이미지와 추가 이미지를 하나의 배열로 합칩니다.
  return [
    land.landImagePath,
    land.imagePath,
    land.thumbnailPath,
    land.thumbnailUrl,
    ...(Array.isArray(extraImages) ? extraImages : []),
  ]
    .filter(Boolean)
    .map(resolveAssetUrl)
    .filter(Boolean);
};

// 상세보기에서 사용할 문서 목록을 구성합니다.
export const buildDocumentList = (land) => {
  // 서버에서 단일 문서 경로만 주는 현재 구조를 배열로 맞춥니다.
  const documents = [land.documentPath].filter(Boolean);

  // 문서 카드에서 사용할 이름과 URL을 만듭니다.
  return documents.map((path, index) => ({
    name: path.split("/").pop() || `토지 서류 ${index + 1}`,
    url: resolveAssetUrl(path),
  }));
};
