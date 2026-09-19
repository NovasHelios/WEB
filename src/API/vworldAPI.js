import { Api } from "@/contents/apiEndpoints";

const VWORLD_API_KEY = import.meta.env.VITE_VWORLD_API_KEY;

const firstValue = (...values) => {
  // 여러 응답 필드 후보 중 실제 값이 있는 첫 번째 값을 사용합니다.
  return values.find((value) => value !== undefined && value !== null && String(value).trim() !== "") || "";
};

const findNestedList = (value) => {
  // VWorld 응답은 같은 이름의 객체/배열로 중첩될 수 있어 첫 번째 배열을 탐색합니다.
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value;

  for (const nestedValue of Object.values(value)) {
    const result = findNestedList(nestedValue);
    if (result.length) return result;
  }

  return [];
};

const formatArea = (value) => {
  // 면적 숫자는 ㎡ 단위와 천 단위 구분자를 붙여 표시합니다.
  const numeric = Number(String(value || "").replace(/,/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) return "";
  return `${numeric.toLocaleString("ko-KR")}㎡`;
};

const normalizeBackendLandInfo = (payload, fallbackAddress) => {
  // 백엔드 VWorld API 응답을 등록 화면에서 쓰는 필드명으로 변환합니다.
  const data = payload?.data || payload?.result || payload;
  if (!data || typeof data !== "object") return null;

  const landRows = findNestedList(data.landInfo || data.ladfrlVOList || data);
  const land = landRows[0] || {};
  const latitude = firstValue(data.y, data.latitude, data.lat);
  const longitude = firstValue(data.x, data.longitude, data.lng);

  return {
    pnu: firstValue(data.pnu, land.pnu),
    latitude,
    longitude,
    confirmedLocation: latitude && longitude ? `${latitude}, ${longitude}` : "",
    confirmedAddress: firstValue(data.addressName, data.address, data.refinedAddress, fallbackAddress),
    area: formatArea(firstValue(data.area, data.lndpclAr, land.lndpclAr)),
    landCategory: firstValue(data.landCategory, data.lndcgrCodeNm, land.lndcgrCodeNm, land.lndcgrCodeName),
    altitude: firstValue(data.altitude, data.tpgrphHgCodeNm, land.tpgrphHgCodeNm, land.tpgrphHgCodeName),
    roadAccess: firstValue(data.roadAccess, data.roadSideCodeNm, land.roadSideCodeNm, land.roadSideCodeName),
    shareCount: firstValue(data.shareCount, data.ownerCount, land.ownerCount, "0명 (단독소유)"),
  };
};

const fetchBackendLandInfo = async (address) => {
  // 서버가 제공하는 VWorld 자동 조회 API를 우선 사용합니다.
  if (!address) return null;

  const params = new URLSearchParams({ address });
  const response = await fetch(`${Api.VworldLand}?${params.toString()}`);
  const data = await response.json();

  if (!response.ok || data?.status === -1) return null;
  return normalizeBackendLandInfo(data, address);
};

const getCoordByType = async (address, type) => {
  // VWorld 주소 API로 주소를 좌표와 PNU 후보로 변환합니다.
  if (!VWORLD_API_KEY || !address) return null;

  const params = new URLSearchParams({
    service: "address",
    version: "2.0",
    request: "GetCoord",
    format: "json",
    crs: "epsg:4326",
    refine: "true",
    simple: "false",
    address,
    type,
    key: VWORLD_API_KEY,
  });

  const response = await fetch(`/vworld/req/address?${params.toString()}`);
  const data = await response.json();

  if (!response.ok || data?.response?.status !== "OK") return null;

  const point = data.response.result?.point;
  const structure = data.response.refined?.structure || {};

  return {
    longitude: point?.x || "",
    latitude: point?.y || "",
    pnu: structure.level4LC || "",
    refinedAddress: data.response.refined?.text || address,
  };
};

const fetchParcelFeature = async (pnu) => {
  // PNU로 VWorld 연속지적도 속성 정보를 조회합니다.
  if (!VWORLD_API_KEY || !pnu) return null;

  const params = new URLSearchParams({
    service: "data",
    version: "2.0",
    request: "GetFeature",
    format: "json",
    size: "1",
    page: "1",
    geometry: "false",
    attribute: "true",
    crs: "EPSG:4326",
    data: "LP_PA_CBND_BUBUN",
    attrfilter: `pnu:=:${pnu}`,
    key: VWORLD_API_KEY,
  });

  const response = await fetch(`/vworld/req/data?${params.toString()}`);
  const data = await response.json();
  const feature = data?.response?.result?.featureCollection?.features?.[0];

  if (!response.ok || !feature) return null;

  return feature.properties || {};
};

export const fetchVworldLandInfo = async (address) => {
  // 도로명/지번 순서로 조회해서 가능한 자동 조회 정보를 구성합니다.
  const backendInfo = await fetchBackendLandInfo(address).catch(() => null);
  if (backendInfo) return backendInfo;

  const coordInfo =
    (await getCoordByType(address, "PARCEL")) ||
    (await getCoordByType(address, "ROAD"));

  if (!coordInfo) return null;

  const parcel = await fetchParcelFeature(coordInfo.pnu);

  return {
    pnu: coordInfo.pnu,
    latitude: coordInfo.latitude,
    longitude: coordInfo.longitude,
    confirmedLocation: coordInfo.latitude && coordInfo.longitude
      ? `${coordInfo.latitude}, ${coordInfo.longitude}`
      : "",
    confirmedAddress: coordInfo.refinedAddress,
    area: parcel?.lndpclAr ? `${Number(parcel.lndpclAr).toLocaleString("ko-KR")}㎡` : "",
    landCategory: parcel?.lndcgrCodeNm || parcel?.jibun || "",
    altitude: "",
    roadAccess: "",
    shareCount: "0명 (단독소유)",
  };
};
