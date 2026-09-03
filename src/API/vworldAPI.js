import { Api } from "@/contents/apiEndpoints";
import { authFetch } from "@/lib/auth";

const getResponseData = (payload) => {
  // 서버 공통 응답 래퍼에서 실제 자동 조회 데이터만 꺼냅니다.
  return payload?.data ?? {};
};

const getLandInfo = (data) => {
  // 스웨거 기준 landInfo.ladfrlVOList.ladfrlVOList 배열의 첫 번째 항목을 사용합니다.
  const list = data?.landInfo?.ladfrlVOList?.ladfrlVOList;
  return Array.isArray(list) ? list[0] || {} : {};
};

const formatArea = (value) => {
  // 서버 면적 값은 ㎡ 기준으로 표시하고 평 단위를 함께 계산합니다.
  const area = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  if (!area || Number.isNaN(area)) return "";

  const pyeong = Math.round(area / 3.3058).toLocaleString("ko-KR");
  return `${area.toLocaleString("ko-KR")}㎡ (${pyeong}평)`;
};

const formatShareCount = (count, ownerType) => {
  // 공유인 수와 소유구분을 같이 보여줍니다.
  const normalizedCount = String(count ?? "").trim();
  const normalizedOwnerType = String(ownerType ?? "").trim();

  if (normalizedCount) {
    return normalizedOwnerType ? `${normalizedCount}명 (${normalizedOwnerType})` : `${normalizedCount}명`;
  }

  return normalizedOwnerType ? `0명 (${normalizedOwnerType})` : "0명 (단독소유)";
};

export const fetchVworldLandInfo = async (address) => {
  // 스웨거의 /api/vworld/land 엔드포인트로 주소 기반 자동 조회 정보를 가져옵니다.
  const trimmedAddress = String(address || "").trim();
  if (!trimmedAddress) return null;

  const params = new URLSearchParams({ address: trimmedAddress });
  const response = await authFetch(`${Api.VworldLand}?${params.toString()}`, {
    method: "GET",
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : {};

  if (!response.ok) {
    throw new Error(payload?.message || payload?.data?.message || "자동 조회 정보를 불러오지 못했습니다.");
  }

  const data = getResponseData(payload);
  const landInfo = getLandInfo(data);
  const latitude = data.y ?? "";
  const longitude = data.x ?? "";

  return {
    pnu: data.pnu || landInfo.pnu || "",
    latitude,
    longitude,
    confirmedLocation: latitude && longitude ? `${latitude}, ${longitude}` : "",
    confirmedAddress: data.addressName || trimmedAddress,
    confirmedRoadAddress: "",
    zoneNo: data.zoneNo || "",
    buildingName: data.buildingName || "",
    area: formatArea(landInfo.lndpclAr),
    landCategory: landInfo.lndcgrCodeNm || "",
    altitude: "",
    roadAccess: "",
    shareCount: formatShareCount(landInfo.cnrsPsnCo, landInfo.posesnSeCodeNm),
    registerType: landInfo.regstrSeCodeNm || "",
    legalDong: landInfo.ldCodeNm || "",
    lastUpdatedAt: landInfo.lastUpdtDt || "",
  };
};
