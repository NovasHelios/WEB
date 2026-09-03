const VWORLD_API_KEY = import.meta.env.VITE_VWORLD_API_KEY;

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
