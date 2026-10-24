import { formatCompactKoreanMoneyFromManwon } from "@/utils/priceFormat";

// 개별 토지 마커와 내부 요소만 기존 크기보다 20% 확대합니다.
const LAND_MARKER_SIZE_SCALE = 1.2;

// 개별 토지 마커 디자인의 기준 너비입니다.
const LAND_MARKER_BASE_WIDTH = 90;

// 개별 토지 마커 디자인의 기준 높이입니다.
const LAND_MARKER_BASE_HEIGHT = 56;

// canvas와 Kakao MarkerImage가 함께 사용할 확대된 마커 너비입니다.
const MARKER_WIDTH = LAND_MARKER_BASE_WIDTH * LAND_MARKER_SIZE_SCALE;

// canvas와 Kakao MarkerImage가 함께 사용할 확대된 마커 높이입니다.
const MARKER_HEIGHT = LAND_MARKER_BASE_HEIGHT * LAND_MARKER_SIZE_SCALE;

// 개별 토지 마커를 표시할 수 있는 최대 지도 레벨입니다.
const INDIVIDUAL_MARKER_MAX_LEVEL = 8;

// 시·군·구 집계 마커 디자인의 기준 너비입니다.
const DISTRICT_MARKER_BASE_WIDTH = 142;

// 시·군·구 집계 마커 디자인의 기준 높이입니다.
const DISTRICT_MARKER_BASE_HEIGHT = 116;

// 시·군·구 집계 마커는 기존 Canvas 너비를 유지합니다.
const DISTRICT_MARKER_WIDTH = DISTRICT_MARKER_BASE_WIDTH;

// 시·군·구 집계 마커는 기존 Canvas 높이를 유지합니다.
const DISTRICT_MARKER_HEIGHT = DISTRICT_MARKER_BASE_HEIGHT;

// 시·군·구 집계 마커만 기존 크기의 80%로 표시하기 위한 배율입니다.
const DISTRICT_MARKER_DISPLAY_SCALE = 0.8;

// 시·군·구 집계 마커에 사용할 요청 색상입니다.
const DISTRICT_MARKER_TEXT_COLOR = "#D0A926";

// 같은 필지에 여러 등록이 있을 때 주소와 유형별 건수를 보여주는 카드 크기입니다.
const DUPLICATE_MARKER_WIDTH = 220;
const DUPLICATE_MARKER_HEIGHT = 120;

// 같은 배경 이미지를 요청할 때 재사용할 로딩 Promise입니다.
let markerBackgroundPromise = null;

// 현재 Promise가 불러오는 배경 이미지 URL입니다.
let markerBackgroundSource = null;

// 반복 렌더링에서 Canvas와 지오코딩 작업을 재사용하되 메모리 증가를 제한합니다.
const MARKER_CACHE_LIMIT = 500;

// 가격·면적 조합이 같은 개별 마커 이미지를 재사용합니다.
const landMarkerImageCache = new Map();

// 지역명·거래 건수가 같은 시군구 마커 이미지를 재사용합니다.
const districtMarkerImageCache = new Map();

// 주소와 등록 유형 건수가 같은 중복 등록 카드를 재사용합니다.
const duplicateMarkerImageCache = new Map();

// 좌표가 없는 동일 주소를 지도 이동마다 다시 지오코딩하지 않도록 요청 결과를 재사용합니다.
const geocodePromiseCache = new Map();

// 생성된 Kakao 개별 마커의 비교 정보와 최신 클릭 데이터를 DOM 밖에서 보관합니다.
const landMarkerMetadata = new WeakMap();

// 캐시에 값을 저장하고 오래된 첫 항목을 제거해 최대 크기를 유지합니다.
const setBoundedCacheValue = (cache, key, value) => {
  if (cache.size >= MARKER_CACHE_LIMIT && !cache.has(key)) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
  cache.set(key, value);
};

// 마커 배경 이미지를 한 번만 불러와 이후 렌더링에서 재사용합니다.
const loadMarkerBackground = (source) => {
  // 이미지 URL이 없으면 마커를 생성할 수 없으므로 실패 처리합니다.
  if (!source) {
    return Promise.reject(new Error("마커 배경 이미지가 없습니다."));
  }

  // 동일한 URL을 이미 불러오는 중이거나 불러왔다면 기존 Promise를 반환합니다.
  if (markerBackgroundPromise && markerBackgroundSource === source) {
    return markerBackgroundPromise;
  }

  // 새 URL에 맞춰 캐시 기준을 갱신합니다.
  markerBackgroundSource = source;

  // 이미지 로딩이 끝난 뒤에만 canvas 렌더링을 시작하도록 Promise를 만듭니다.
  markerBackgroundPromise = new Promise((resolve, reject) => {
    // 브라우저 이미지 객체를 한 번만 생성합니다.
    const image = new Image();

    // 이미지 로딩이 완료되면 재사용할 객체를 반환합니다.
    image.onload = () => resolve(image);

    // 로딩 실패 시 다음 호출에서 다시 시도할 수 있도록 캐시를 초기화합니다.
    image.onerror = () => {
      markerBackgroundPromise = null;
      markerBackgroundSource = null;
      reject(new Error("마커 배경 이미지를 불러오지 못했습니다."));
    };

    // Vite가 변환한 이미지 URL을 로드합니다.
    image.src = source;
  });

  // 생성한 Promise를 호출부에 반환합니다.
  return markerBackgroundPromise;
};

// null과 빈 문자열을 제외하고 유효한 숫자만 좌표와 면적에 사용합니다.
const toFiniteNumber = (value) => {
  // 값이 없으면 Number 변환으로 0이 되는 것을 막기 위해 NaN을 반환합니다.
  if (value === null || value === undefined || value === "") return NaN;

  // 값이 있으면 숫자로 변환해 호출부에서 유효성을 검사할 수 있게 합니다.
  return Number(value);
};

// 지역 값이 객체 또는 문자열로 전달되어도 화면에 사용할 이름으로 변환합니다.
const getRegionName = (value) => {
  // 지역 객체는 name 필드를 우선 사용합니다.
  if (value && typeof value === "object") return String(value.name || "").trim();

  // 문자열 값은 앞뒤 공백을 제거해 반환합니다.
  return String(value || "").trim();
};

// 구조화된 지역 필드가 없을 때 주소에서 시·군·구 이름을 추출합니다.
const getDistrictFromAddress = (address) => {
  // 주소가 없으면 지역명을 만들 수 없습니다.
  if (!address) return "";

  // 첫 번째 시도명을 제외하고 하위 행정구역을 순서대로 확인합니다.
  const tokens = String(address).trim().split(/\s+/).slice(1);
  const districtIndex = tokens.findIndex((token) => /(시|군|구)$/.test(token));

  // 시·군·구 형태의 단어가 없으면 빈 값을 반환합니다.
  if (districtIndex < 0) return "";

  // 일반구가 있는 도시는 시와 구를 함께 표시해 같은 시의 구를 구분합니다.
  if (
    /시$/.test(tokens[districtIndex]) &&
    /구$/.test(tokens[districtIndex + 1] || "")
  ) {
    return `${tokens[districtIndex]} ${tokens[districtIndex + 1]}`;
  }

  // 군 또는 자치구처럼 한 단어로 구분되는 지역명은 그대로 반환합니다.
  return tokens[districtIndex];
};

// 토지 데이터에서 시·군·구 집계에 사용할 지역명을 결정합니다.
const getDistrictName = (land) => {
  // 서버의 구조화된 시군구 필드를 가장 먼저 사용합니다.
  const structuredDistrict = getRegionName(
    land.regionSigungu ?? land.sigungu
  );

  // 구조화된 값이 있으면 주소 파싱 없이 반환합니다.
  if (structuredDistrict) return structuredDistrict;

  // 주소에서 추출한 시·군·구를 보조 값으로 사용합니다.
  const addressDistrict = getDistrictFromAddress(land.address);

  // 세종특별자치시처럼 별도 시군구가 없는 지역은 시도명을 사용합니다.
  return (
    addressDistrict ||
    getRegionName(land.regionSido ?? land.sido)
  );
};

// 서버의 거래 유형을 집계 마커의 세 가지 항목으로 정규화합니다.
const getTransactionCountKey = (transactionType) => {
  // 대소문자와 구분 문자를 제거해 기존 서버 표기를 함께 처리합니다.
  const normalized = String(transactionType || "")
    .replace(/[\s_-]/g, "")
    .toUpperCase();

  // 사업 희망 유형은 BUSINESS_HOPE와 BusinessHope를 모두 지원합니다.
  if (normalized.includes("HOPE")) return "businessHope";

  // 임대와 월세 유형은 임대 항목으로 합산합니다.
  if (normalized.includes("LEASE") || normalized.includes("RENT")) {
    return "lease";
  }

  // 매매 유형은 매매 항목으로 합산합니다.
  if (normalized.includes("SALE")) return "sale";

  // 알 수 없는 거래 유형은 세부 집계에서 제외합니다.
  return null;
};

// 둥근 사각형 집계 마커 배경을 Canvas 경로로 그립니다.
const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  // 각 모서리를 직선과 곡선으로 이어 둥근 사각형 경로를 만듭니다.
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

// 시·군·구 이름과 거래 유형별 건수를 표시하는 마커 이미지를 생성합니다.
const createDistrictMarkerImage = ({ districtName, counts, isSelected = false }) => {
  // 화면 배율과 표시 내용을 조합해 동일한 집계 마커 Canvas 결과를 찾습니다.
  const cacheKey = [
    window.devicePixelRatio || 1,
    districtName,
    counts.lease,
    counts.sale,
    counts.businessHope,
    isSelected,
  ].join("|");
  const cachedImage = districtMarkerImageCache.get(cacheKey);
  if (cachedImage) return cachedImage;

  // 고해상도 화면에서도 선명하게 표시할 Canvas를 생성합니다.
  const canvas = document.createElement("canvas");
  const pixelRatio = Math.max(1, window.devicePixelRatio || 1);

  // Canvas 실제 픽셀 크기에 화면 배율을 반영합니다.
  canvas.width = DISTRICT_MARKER_WIDTH * pixelRatio;
  canvas.height = DISTRICT_MARKER_HEIGHT * pixelRatio;

  // 집계 마커를 그릴 2D context를 준비합니다.
  const ctx = canvas.getContext("2d");
  // 시·군·구 마커는 고해상도 배율만 적용해 기존 표시 크기를 유지합니다.
  ctx.scale(pixelRatio, pixelRatio);

  // 이미지와 같은 흰색 배경과 짙은 테두리의 둥근 상자를 그립니다.
  drawRoundedRect(
    ctx,
    1,
    1,
    DISTRICT_MARKER_BASE_WIDTH - 2,
    DISTRICT_MARKER_BASE_HEIGHT - 2,
    16
  );
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  // 선택한 시군구 마커의 테두리는 요청한 강조색으로 표시합니다.
  // 선택이 해제된 마커는 요청한 검은색 테두리로 표시합니다.
  ctx.strokeStyle = isSelected ? "#D0A926" : "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 지역명과 항목 문구는 검은색으로 표시합니다.
  ctx.fillStyle = "#111111";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  // 상단에 시·군·구 이름을 굵게 표시합니다.
  ctx.font = "800 20px sans-serif";
  ctx.fillText(districtName, 14, 22, DISTRICT_MARKER_BASE_WIDTH - 28);

  // 항목 문구 뒤에 숫자만 강조색으로 표시하는 함수를 정의합니다.
  const drawCountRow = (label, count, y) => {
    // 항목 문구를 검은색으로 먼저 그립니다.
    ctx.fillStyle = "#111111";
    ctx.fillText(label, 14, y, DISTRICT_MARKER_BASE_WIDTH - 28);

    // 항목 문구의 실제 너비 다음 위치부터 강조색 숫자를 그립니다.
    const numberX = 14 + ctx.measureText(`${label} `).width;
    ctx.fillStyle = DISTRICT_MARKER_TEXT_COLOR;
    ctx.fillText(
      String(count),
      numberX,
      y,
      DISTRICT_MARKER_BASE_WIDTH - numberX - 8
    );
  };

  // 요청한 순서대로 임대, 매매, 사업희망 건수를 표시합니다.
  ctx.font = "700 17px sans-serif";
  drawCountRow("임대", counts.lease, 48);
  drawCountRow("매매", counts.sale, 72);
  drawCountRow("사업희망", counts.businessHope, 96);

  // Kakao MarkerImage에서 사용할 data URL을 저장해 다음 렌더링에서 재사용합니다.
  const markerImageUrl = canvas.toDataURL();
  setBoundedCacheValue(districtMarkerImageCache, cacheKey, markerImageUrl);
  return markerImageUrl;
};

// 같은 필지에 등록된 주소와 매매·임대·사업희망 건수를 카드형 마커로 그립니다.
const createDuplicateMarkerImage = ({ address, counts }) => {
  // 중복 핀에는 시도와 시군구를 제외한 상세 주소만 표시합니다.
  const addressParts = String(address || "").trim().split(/\s+/).filter(Boolean);
  if (addressParts.length > 1) addressParts.shift();
  while (addressParts.length && /(시|군|구)$/.test(addressParts[0])) addressParts.shift();
  const displayAddress = addressParts.join(" ") || address || "주소 정보 없음";
  const cacheKey = [window.devicePixelRatio || 1, displayAddress, counts.lease, counts.sale, counts.businessHope].join("|");
  const cachedImage = duplicateMarkerImageCache.get(cacheKey);
  if (cachedImage) return cachedImage;

  const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
  const canvas = document.createElement("canvas");
  canvas.width = DUPLICATE_MARKER_WIDTH * pixelRatio;
  canvas.height = DUPLICATE_MARKER_HEIGHT * pixelRatio;
  const ctx = canvas.getContext("2d");
  ctx.scale(pixelRatio, pixelRatio);

  drawRoundedRect(ctx, 1, 1, DUPLICATE_MARKER_WIDTH - 2, DUPLICATE_MARKER_HEIGHT - 18, 16);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#1c3447";
  ctx.lineWidth = 2;
  ctx.stroke();

  // 상단 주소 영역은 짙은 남색으로 분리해 시안처럼 강조합니다.
  ctx.beginPath();
  ctx.moveTo(21, 1);
  ctx.lineTo(DUPLICATE_MARKER_WIDTH - 21, 1);
  ctx.quadraticCurveTo(DUPLICATE_MARKER_WIDTH - 1, 1, DUPLICATE_MARKER_WIDTH - 1, 21);
  ctx.lineTo(DUPLICATE_MARKER_WIDTH - 1, 37);
  ctx.lineTo(1, 37);
  ctx.lineTo(1, 21);
  ctx.quadraticCurveTo(1, 1, 21, 1);
  ctx.closePath();
  ctx.fillStyle = "#1c3447";
  ctx.fill();

  // 지도 위치를 가리키는 작은 꼬리를 카드 하단에 추가합니다.
  ctx.beginPath();
  const pointerX = DUPLICATE_MARKER_WIDTH / 2;
  ctx.moveTo(pointerX - 13, DUPLICATE_MARKER_HEIGHT - 18);
  ctx.lineTo(pointerX, DUPLICATE_MARKER_HEIGHT - 1);
  ctx.lineTo(pointerX + 13, DUPLICATE_MARKER_HEIGHT - 18);
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#1c3447";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pointerX - 11, DUPLICATE_MARKER_HEIGHT - 18);
  ctx.lineTo(pointerX + 11, DUPLICATE_MARKER_HEIGHT - 18);
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "800 15px sans-serif";
  const normalizedAddress = String(displayAddress).trim();
  ctx.fillText(normalizedAddress, 13, 20, DUPLICATE_MARKER_WIDTH - 26);

  // 하단 칩에는 서버에서 받은 거래 유형별 등록 수만 표시합니다.
  const rows = [["매매", counts.sale], ["임대", counts.lease], ["사업희망", counts.businessHope]];
  const chipY = 55;
  const chipGap = 4;
  const chipWidth = (DUPLICATE_MARKER_WIDTH - 26 - chipGap * 2) / 3;
  rows.forEach(([label, count], index) => {
    const x = 13 + index * (chipWidth + chipGap);
    drawRoundedRect(ctx, x, chipY, chipWidth, 28, 7);
    ctx.fillStyle = "#f1f3f5";
    ctx.fill();
    ctx.textAlign = "center";
    ctx.font = "700 13px sans-serif";
    ctx.fillStyle = "#29313a";
    const labelWidth = ctx.measureText(`${label} `).width;
    ctx.font = "800 14px sans-serif";
    const countWidth = ctx.measureText(String(count)).width;
    const textStartX = x + (chipWidth - labelWidth - countWidth) / 2;
    ctx.textAlign = "left";
    ctx.font = "700 13px sans-serif";
    ctx.fillText(label, textStartX, chipY + 14, chipWidth - 8);
    ctx.fillStyle = "#00a34a";
    ctx.font = "800 14px sans-serif";
    ctx.fillText(String(count), textStartX + labelWidth, chipY + 14, chipWidth - 8);
  });

  const imageUrl = canvas.toDataURL();
  setBoundedCacheValue(duplicateMarkerImageCache, cacheKey, imageUrl);
  return imageUrl;
};

// 표시 가능한 토지를 시·군·구별로 묶고 각 그룹의 중심 좌표와 건수를 계산합니다.
const createDistrictGroups = (lands) => {
  // 같은 시군구를 빠르게 찾기 위해 Map을 사용합니다.
  const groups = new Map();

  // 현재 필터 결과에 포함된 모든 토지를 집계합니다.
  lands.forEach((land) => {
    // 토지가 속한 시·군·구 이름을 결정합니다.
    const districtName = getDistrictName(land);

    // 지역명을 확인할 수 없는 토지는 잘못된 집계 마커 생성을 막기 위해 제외합니다.
    if (!districtName) return;

    // 같은 이름의 시군구가 다른 시도에 있을 수 있어 시도명을 그룹 키에 포함합니다.
    const sidoName = getRegionName(land.regionSido ?? land.sido);
    const groupKey = `${sidoName}|${districtName}`;

    // 처음 발견한 시군구는 빈 집계 정보로 초기화합니다.
    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        districtName,
        // 같은 이름의 시군구를 구분할 시도명을 사이드바에 전달합니다.
        sidoName,
        // 집계 건수와 동일한 토지 목록을 클릭 시 사이드바에 전달합니다.
        lands: [],
        latitudeSum: 0,
        longitudeSum: 0,
        landCount: 0,
        counts: {
          lease: 0,
          sale: 0,
          businessHope: 0,
        },
      });
    }

    // 현재 토지 좌표를 그룹 중심 계산에 누적합니다.
    const group = groups.get(groupKey);
    group.latitudeSum += land.lat;
    group.longitudeSum += land.lon;
    group.landCount += 1;

    // 현재 토지를 해당 시군구 마커의 소속 목록에 보관합니다.
    group.lands.push(land);

    // 인식 가능한 거래 유형이면 해당 항목의 건수를 증가시킵니다.
    const countKey = getTransactionCountKey(land.transactionType);
    if (countKey) group.counts[countKey] += 1;
  });

  // Map 값을 렌더링 가능한 배열로 변환합니다.
  return Array.from(groups.values());
};

// 현재 Kakao 지도 확대 수준에서 표시해야 할 마커 종류를 반환합니다.
export const getLandMarkerDisplayMode = (mapRef) => {
  if (!mapRef.current) return null;
  return mapRef.current.getLevel() <= INDIVIDUAL_MARKER_MAX_LEVEL
    ? "individual"
    : "district";
};

// 현재 지도 레벨에 따라 Kakao 마커 표시 상태를 갱신합니다.
export const updateLandLayerByZoom = ({
  // Kakao 지도 객체를 담은 ref입니다.
  mapRef,

  // Kakao 마커 배열을 담은 ref입니다.
  markerLayerRef,

  // 시·군·구 집계 마커 배열을 담은 ref입니다.
  districtMarkerLayerRef,

  // 마지막 표시 모드를 저장해 같은 확대 구간에서 전체 마커를 다시 순회하지 않습니다.
  visibilityModeRef,
}) => {
  // Kakao 지도 객체가 없으면 중단합니다.
  if (!mapRef.current) return;

  // 현재 Kakao 지도 레벨을 가져옵니다.
  const nextMode = getLandMarkerDisplayMode(mapRef);

  // 가까운 지도에서는 개별 마커를, 먼 지도에서는 시군구 집계 마커를 표시합니다.
  const shouldShowIndividualMarkers = nextMode === "individual";

  // 확대 단계가 개별 또는 시군구 표시 구간 안에서 유지되면 변경 작업을 생략합니다.
  if (visibilityModeRef?.current === nextMode) return;
  if (visibilityModeRef) visibilityModeRef.current = nextMode;

  // 개별 토지 마커의 지도 표시 여부를 갱신합니다.
  if (Array.isArray(markerLayerRef.current)) {
    markerLayerRef.current.forEach((marker) => {
      // 집계 마커가 보이는 동안 기존 토지 마커는 지도에서 제거합니다.
      marker.setMap(shouldShowIndividualMarkers ? mapRef.current : null);
    });
  }

  // 시·군·구 집계 마커의 지도 표시 여부를 갱신합니다.
  if (Array.isArray(districtMarkerLayerRef?.current)) {
    districtMarkerLayerRef.current.forEach((marker) => {
      // 축소 단계에서만 집계 마커를 지도에 표시합니다.
      marker.setMap(shouldShowIndividualMarkers ? null : mapRef.current);
    });
  }
};

export const formatPrice = (price, transactionType) => {
  // 사업 희망 토지는 가격 대신 거래 목적을 명확하게 표시합니다.
  if (getTransactionCountKey(transactionType) === "businessHope") return "사업희망";
  // 지도 마커 가격도 서버 기준인 원 단위로 표시합니다.
  return formatCompactKoreanMoneyFromManwon(price, "가격 없음");
};

// 가격/면적 텍스트를 markup.png 마커 디자인 위에 얹어서 canvas 이미지로 생성합니다.
export const createLandMarkerImage = ({
  priceText,
  areaText,
  markerBackground,
  listingCount = 1,
}) => {
  // 로드가 끝난 배경 이미지가 없으면 마커 이미지를 만들지 않습니다.
  if (!markerBackground) return "";

  // 배경·화면 배율·표시 문구가 같으면 이전 Canvas 결과를 그대로 사용합니다.
  const cacheKey = [
    markerBackgroundSource,
    window.devicePixelRatio || 1,
    priceText,
    areaText,
    listingCount,
  ].join("|");
  const cachedImage = landMarkerImageCache.get(cacheKey);
  if (cachedImage) return cachedImage;

  // 마커 이미지를 그릴 canvas를 생성합니다.
  const canvas = document.createElement("canvas");

  // 화면의 실제 배율을 사용해 고해상도 화면에서도 선명하게 표시합니다.
  const pixelRatio = Math.max(1, window.devicePixelRatio || 1);

  // canvas 실제 픽셀 크기를 설정합니다.
  canvas.width = MARKER_WIDTH * pixelRatio;
  canvas.height = MARKER_HEIGHT * pixelRatio;

  // canvas에 그릴 2D context를 가져옵니다.
  const ctx = canvas.getContext("2d");

  // 고해상도 배율과 요청한 20% 확대 비율을 내부 글자와 여백에 함께 적용합니다.
  ctx.scale(
    pixelRatio * LAND_MARKER_SIZE_SCALE,
    pixelRatio * LAND_MARKER_SIZE_SCALE
  );

  // 기준 디자인 크기로 그린 배경을 context 배율을 통해 20% 확대합니다.
  ctx.drawImage(
    markerBackground,
    0,
    0,
    LAND_MARKER_BASE_WIDTH,
    LAND_MARKER_BASE_HEIGHT
  );

  // 가격 텍스트 색상을 흰색으로 설정합니다.
  ctx.fillStyle = "#ffffff";

  // 가격 텍스트를 2번 디자인 크기에 맞게 작게 표시합니다.
  ctx.font = "900 13px sans-serif";

  // 텍스트를 마커 중앙 기준으로 정렬합니다.
  ctx.textAlign = "center";

  // 텍스트의 세로 기준을 중앙으로 맞춥니다.
  ctx.textBaseline = "middle";

  // 가격 텍스트를 상단 영역에 표시합니다.
  ctx.fillText(
    priceText,
    LAND_MARKER_BASE_WIDTH / 2,
    16,
    LAND_MARKER_BASE_WIDTH - 12
  );

  // 가격과 면적 사이의 구분선을 그립니다.
  ctx.strokeStyle = "#ffffff";
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(22, 25);
  ctx.lineTo(68, 25);
  ctx.stroke();

  // 이후 텍스트는 다시 불투명하게 표시합니다.
  ctx.globalAlpha = 1;

  // 면적 텍스트를 2번 디자인 크기에 맞게 작게 표시합니다.
  ctx.font = "900 12px sans-serif";

  // 면적 텍스트를 하단 영역에 표시합니다.
  ctx.fillText(
    areaText,
    LAND_MARKER_BASE_WIDTH / 2,
    34,
    LAND_MARKER_BASE_WIDTH - 12
  );

  // 같은 필지에 여러 등록이 있으면 마커에 등록 건수를 표시합니다.
  if (listingCount > 1) {
    ctx.font = "700 10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#D0A926";
    ctx.beginPath();
    ctx.arc(LAND_MARKER_BASE_WIDTH - 8, 8, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(String(listingCount), LAND_MARKER_BASE_WIDTH - 8, 8, 14);
  }

  // Kakao MarkerImage에서 사용할 data URL을 저장해 반복 Canvas 변환을 줄입니다.
  const markerImageUrl = canvas.toDataURL();
  setBoundedCacheValue(landMarkerImageCache, cacheKey, markerImageUrl);
  return markerImageUrl;
};

// 동일 주소의 좌표 변환 요청과 결과를 재사용합니다.
const geocodeAddressWithCache = (address, geocodeAddress) => {
  // 연속 공백 차이로 같은 주소가 별도 요청되지 않도록 키를 정리합니다.
  const cacheKey = String(address || "").replace(/\s+/g, " ").trim();
  if (!cacheKey) return Promise.resolve(null);

  const cachedPromise = geocodePromiseCache.get(cacheKey);
  if (cachedPromise) return cachedPromise;

  // 진행 중인 요청도 Promise 상태로 저장해 동시에 발생한 중복 호출을 합칩니다.
  const request = Promise.resolve(geocodeAddress(cacheKey))
    .then((point) => {
      // 실패 결과는 다음 렌더링에서 다시 시도할 수 있도록 캐시하지 않습니다.
      if (!point) geocodePromiseCache.delete(cacheKey);
      return point;
    })
    .catch((error) => {
      // 일시적인 요청 오류도 다음 시도에서 복구할 수 있도록 제거합니다.
      geocodePromiseCache.delete(cacheKey);
      throw error;
    });

  setBoundedCacheValue(geocodePromiseCache, cacheKey, request);
  return request;
};

export const renderLandMarkers = async ({
  // Kakao 지도 객체를 담은 ref입니다.
  mapRef,

  // 서버에서 받아온 토지 목록입니다.
  lands,

  // 생성된 Kakao 마커 목록을 저장할 ref입니다.
  markerLayerRef,

  // 생성된 시·군·구 집계 마커 목록을 저장할 ref입니다.
  districtMarkerLayerRef,

  // 마지막으로 선택한 시군구를 마커 재생성 시에도 유지하는 ref입니다.
  selectedDistrictKeyRef,

  // 사이드바를 닫을 때 현재 마커의 테두리를 복원할 함수를 저장하는 ref입니다.
  resetDistrictMarkersRef,

  // 지오코딩까지 끝난 토지 데이터를 저장할 ref입니다.
  displayDataRef,

  // 주소를 위도/경도로 바꾸는 함수입니다.
  geocodeAddress,

  // 마커 배경으로 사용할 markup.png 이미지입니다.
  markupImage,

  // 더 최신 필터 요청이 시작되었는지 확인하는 함수입니다.
  isStale,

  // 마커 클릭 시 실행할 함수입니다.
  onMarkerClick,

  // 시군구 마커 클릭 시 소속 토지 목록을 전달하는 함수입니다.
  onDistrictMarkerClick,

  // 렌더링 이후 줌 레벨에 맞춰 표시 상태를 갱신하는 함수입니다.
  onAfterRender,
}) => {
  // Kakao 지도 객체가 없으면 마커를 표시하지 않습니다.
  if (!mapRef.current) return;

  // canvas를 그리기 전에 배경 이미지 로딩을 완료합니다.
  const markerBackground = await loadMarkerBackground(markupImage);

  // 서버 좌표 또는 주소 변환 좌표를 사용한 토지 목록을 만듭니다.
  const geocodedLands = await Promise.all(
    lands.map(async (land) => {
      // 서버에서 내려준 좌표를 숫자로 변환합니다.
      const serverLon = toFiniteNumber(land.x);
      const serverLat = toFiniteNumber(land.y);

      // 서버 좌표가 있으면 우선 사용하고, 없으면 주소 기반 좌표 변환으로 보완합니다.
      const point =
        Number.isFinite(serverLon) && Number.isFinite(serverLat)
          ? { lat: serverLat, lon: serverLon }
          : land.address
            ? await geocodeAddressWithCache(land.address, geocodeAddress)
            : null;

      // 좌표 변환에 실패하면 제외합니다.
      if (!point) return null;

      // Kakao 지도에서 사용할 위도/경도 좌표 객체를 만듭니다.
      const position = new window.kakao.maps.LatLng(point.lat, point.lon);

      // 지도 표시용 좌표 정보를 토지 데이터에 함께 저장합니다.
      return {
        // 서버에서 받은 토지 정보를 그대로 유지합니다.
        ...land,

        // pnu는 서버에서 내려준 값만 사용합니다.
        pnu: land.pnu || null,

        // Kakao 지도 표시용 좌표 객체입니다.
        position,

        // 지도 이동과 추후 표시용 숫자 좌표입니다.
        lat: point.lat,
        lon: point.lon,

        // 서버 지역 정보가 없으면 Kakao 주소 검색 결과로 시도를 보완합니다.
        regionSido: land.regionSido || point.sido || null,

        // 서버 지역 정보가 없으면 Kakao 주소 검색 결과로 시군구를 보완합니다.
        regionSigungu: land.regionSigungu || point.sigungu || null,
      };
    })
  );

  // 좌표 변환에 성공한 토지만 남깁니다.
  const displayLands = geocodedLands.filter(Boolean);

  // 지오코딩 중 더 최신 요청이 시작됐다면 현재 결과를 지도에 반영하지 않습니다.
  if (isStale?.()) return;

  // 기존 개별 마커를 토지 식별자로 찾아 재사용할 수 있게 정리합니다.
  const existingLandMarkers = new Map();
  if (Array.isArray(markerLayerRef.current)) {
    markerLayerRef.current.forEach((marker) => {
      // 이전 렌더링에서 저장한 식별 정보가 있는 마커만 재사용 후보로 보관합니다.
      const metadata = landMarkerMetadata.get(marker);
      if (metadata?.key) {
        existingLandMarkers.set(metadata.key, marker);
      } else {
        marker.setMap(null);
      }
    });
  }

  // 기존 시·군·구 집계 마커도 새 필터 결과로 교체하기 전에 제거합니다.
  if (Array.isArray(districtMarkerLayerRef?.current)) {
    districtMarkerLayerRef.current.forEach((marker) => {
      // 기존 집계 마커를 지도에서 제거합니다.
      marker.setMap(null);
    });
  }

  // 새 마커 목록을 저장할 배열을 만듭니다.
  const markers = [];

  // 새 시·군·구 집계 마커 목록을 저장할 배열을 만듭니다.
  const districtMarkers = [];

  // 현재 지도 단계에 맞춰 마커가 생성 직후 표시될지 결정합니다.
  const shouldShowIndividualMarkers =
    mapRef.current.getLevel() <= INDIVIDUAL_MARKER_MAX_LEVEL;

  // PNU가 같은 등록만 한 마커로 묶고, 그 외 토지는 개별 마커로 유지합니다.
  const groupedLands = new Map();
  if (shouldShowIndividualMarkers) {
    displayLands.forEach((land, index) => {
      const parcelId = String(land.pnu ?? land.PNU ?? "").trim();
      const fallbackId = String(
        land.id ?? land.landId ?? `${land.address || "land"}-${index}`
      );
      const key = parcelId ? `pnu:${parcelId}` : `land:${fallbackId}`;
      const group = groupedLands.get(key);
      if (group) group.lands.push(land);
      else groupedLands.set(key, { key, lands: [land] });
    });
  }

  // 좌표 변환이 끝난 토지를 Kakao 마커로 표시합니다.
  // 확대 상태에서 실제로 보이는 경우에만 개별 토지 마커를 생성합니다.
  if (shouldShowIndividualMarkers) groupedLands.forEach((group) => {
    const land = group.lands[0];
    const listingCount = group.lands.length;
    const markerKey = group.key;
    const duplicateCounts = group.lands.reduce((counts, listing) => {
      const countKey = getTransactionCountKey(listing.transactionType);
      if (countKey) counts[countKey] += 1;
      return counts;
    }, { lease: 0, sale: 0, businessHope: 0 });

    // 좌표와 마커 문구가 동일한지 빠르게 비교할 문자열을 만듭니다.
    const markerSignature = [
      land.lat,
      land.lon,
      land.desiredPrice,
      land.desiredArea,
      land.transactionType,
      listingCount,
      land.address,
      duplicateCounts.lease,
      duplicateCounts.sale,
      duplicateCounts.businessHope,
    ].join("|");

    // 같은 토지의 기존 Kakao 마커가 있으면 객체와 클릭 이벤트를 그대로 재사용합니다.
    let marker = existingLandMarkers.get(markerKey);
    const previousMetadata = marker ? landMarkerMetadata.get(marker) : null;

    // markup.png 배경 위에 가격과 면적을 얹은 마커 이미지를 생성합니다.
    // 마커에는 실제 토지 면적이 아닌 사용자가 등록한 희망 면적을 표시합니다.
    const numericArea = toFiniteNumber(land.desiredArea);

    // 유효한 면적만 숫자로 표시하고, 없는 값은 안내 문구로 대체합니다.
    const areaText = Number.isFinite(numericArea)
      ? `${Math.round(numericArea).toLocaleString()}㎡`
      : "면적 없음";

    // 새 마커이거나 좌표·문구가 변경된 마커만 이미지와 위치를 갱신합니다.
    if (!marker || previousMetadata?.signature !== markerSignature) {
      // 로드가 완료된 배경 위에 가격과 면적을 얹은 마커 이미지를 생성합니다.
      const markerImageUrl = listingCount > 1
        ? createDuplicateMarkerImage({ address: land.address, counts: duplicateCounts })
        : createLandMarkerImage({
          priceText: formatPrice(land.desiredPrice, land.transactionType),
          areaText,
          markerBackground,
          listingCount,
        });

      // Kakao 지도에서 사용할 마커 이미지와 기준점을 생성합니다.
      const markerImage = new window.kakao.maps.MarkerImage(
        markerImageUrl,
        new window.kakao.maps.Size(
          listingCount > 1 ? DUPLICATE_MARKER_WIDTH : MARKER_WIDTH,
          listingCount > 1 ? DUPLICATE_MARKER_HEIGHT : MARKER_HEIGHT
        ),
        {
          offset: new window.kakao.maps.Point(
            listingCount > 1 ? DUPLICATE_MARKER_WIDTH / 2 : MARKER_WIDTH / 2,
            listingCount > 1 ? DUPLICATE_MARKER_HEIGHT : MARKER_HEIGHT
          ),
        }
      );

      if (marker) {
        // 기존 마커는 필요한 위치와 이미지만 변경합니다.
        marker.setPosition(land.position);
        marker.setImage(markerImage);
      } else {
        // 새 토지만 새로운 Kakao 마커 객체를 만듭니다.
        marker = new window.kakao.maps.Marker({
          map: shouldShowIndividualMarkers ? mapRef.current : null,
          position: land.position,
          image: markerImage,
        });

        // 클릭 이벤트는 한 번만 등록하고 최신 토지 정보는 WeakMap에서 읽습니다.
        const clickHandler = () => {
          const currentMetadata = landMarkerMetadata.get(marker);
          if (!currentMetadata) return;
          currentMetadata.onMarkerClick?.(
            currentMetadata.land,
            false,
            currentMetadata.lands
          );
          mapRef.current.setCenter(currentMetadata.land.position);
          // 중복 등록 핀은 상세 위치를 더 잘 확인할 수 있도록 한 단계 더 확대합니다.
          mapRef.current.setLevel(currentMetadata.listingCount > 1 ? 1 : 3);
        };
        window.kakao.maps.event.addListener(marker, "click", clickHandler);
        landMarkerMetadata.set(marker, { clickHandler });
      }
    }

    // 재사용 마커도 현재 확대 단계에 맞는 지도 표시 상태로 맞춥니다.
    marker.setMap(shouldShowIndividualMarkers ? mapRef.current : null);

    // 다음 클릭과 비교에서 사용할 최신 토지 정보와 표시값을 저장합니다.
    landMarkerMetadata.set(marker, {
      ...landMarkerMetadata.get(marker),
      key: markerKey,
      signature: markerSignature,
      land,
      lands: group.lands,
      listingCount,
      onMarkerClick,
    });

    // 이번 결과에 포함된 마커는 제거 대상 목록에서 제외합니다.
    existingLandMarkers.delete(markerKey);

    // 나중에 제거하거나 표시 상태를 바꾸기 위해 마커를 배열에 저장합니다.
    markers.push(marker);
  });

  // 새 필터 결과에서 사라진 개별 마커만 이벤트와 지도에서 제거합니다.
  existingLandMarkers.forEach((marker) => {
    const metadata = landMarkerMetadata.get(marker);
    if (metadata?.clickHandler) {
      window.kakao.maps.event.removeListener(marker, "click", metadata.clickHandler);
    }
    marker.setMap(null);
    landMarkerMetadata.delete(marker);
  });

  // 현재 필터 결과를 시·군·구별 집계 정보로 변환합니다.
  const districtGroups = shouldShowIndividualMarkers
    ? []
    : createDistrictGroups(displayLands);

  // 클릭 시 기존 선택 마커와 새 선택 마커의 이미지를 함께 갱신합니다.
  const districtMarkerSelections = [];

  // 시군구 선택 시 전체 배열 대신 이전 선택과 새 선택만 갱신합니다.
  let selectedDistrictEntry = null;

  // 각 시·군·구 그룹을 하나의 집계 마커로 생성합니다.
  districtGroups.forEach((group) => {
    // 그룹에 포함된 토지 좌표의 평균값으로 집계 마커 중심을 계산합니다.
    const position = new window.kakao.maps.LatLng(
      group.latitudeSum / group.landCount,
      group.longitudeSum / group.landCount
    );

    // 시도와 시군구를 함께 사용해 이름이 같은 지역의 선택 상태를 구분합니다.
    const groupKey = `${group.sidoName}|${group.districtName}`;

    // 시·군·구 집계 마커는 기존 80% 표시 크기를 유지합니다.
    const displayWidth = DISTRICT_MARKER_WIDTH * DISTRICT_MARKER_DISPLAY_SCALE;
    const displayHeight =
      DISTRICT_MARKER_HEIGHT * DISTRICT_MARKER_DISPLAY_SCALE;

    // 선택 상태별 마커 이미지를 캐시해 반복 클릭 시 Canvas를 다시 그리지 않습니다.
    const markerImages = new Map();

    // 같은 크기와 중심점을 유지하면서 선택 상태에 맞는 테두리 이미지를 반환합니다.
    const getMarkerImage = (isSelected) => {
      // 이미 생성한 상태의 이미지는 그대로 재사용합니다.
      if (markerImages.has(isSelected)) return markerImages.get(isSelected);

      // 지역명과 건수는 유지하고 선택 여부에 따라 테두리 색상만 변경합니다.
      const markerImageUrl = createDistrictMarkerImage({
        districtName: group.districtName,
        counts: group.counts,
        isSelected,
      });

      // 기존 집계 마커의 표시 크기와 중앙 기준점을 그대로 사용합니다.
      const markerImage = new window.kakao.maps.MarkerImage(
        markerImageUrl,
        new window.kakao.maps.Size(displayWidth, displayHeight),
        {
          offset: new window.kakao.maps.Point(displayWidth / 2, displayHeight / 2),
        }
      );

      // 생성한 상태별 이미지를 저장하고 클릭 처리에서 재사용합니다.
      markerImages.set(isSelected, markerImage);
      return markerImage;
    };

    // 축소 단계에서만 표시할 Kakao 집계 마커를 생성합니다.
    const marker = new window.kakao.maps.Marker({
      map: shouldShowIndividualMarkers ? null : mapRef.current,
      position,
      // 지도 재조회로 마커를 다시 생성해도 이전 선택 테두리를 복원합니다.
      image: getMarkerImage(selectedDistrictKeyRef?.current === groupKey),
    });

    // 개별 마커보다 위에 표시되도록 집계 마커의 표시 순서를 높입니다.
    marker.setZIndex(2);

    // 현재 집계 마커의 선택 상태와 이미지 생성 함수를 함께 보관합니다.
    const markerEntry = { marker, groupKey, getMarkerImage };
    if (selectedDistrictKeyRef?.current === groupKey) {
      selectedDistrictEntry = markerEntry;
    }

    // 클릭한 집계 마커의 소속 토지를 기존 검색 사이드바에 표시합니다.
    window.kakao.maps.event.addListener(marker, "click", () => {
      // 다음 마커 재생성에서도 선택한 시군구를 식별할 수 있도록 저장합니다.
      if (selectedDistrictKeyRef) selectedDistrictKeyRef.current = groupKey;

      // 이전 선택만 기본 테두리로 복원하고 현재 선택 마커를 강조합니다.
      if (selectedDistrictEntry && selectedDistrictEntry !== markerEntry) {
        selectedDistrictEntry.marker.setImage(
          selectedDistrictEntry.getMarkerImage(false)
        );
      }
      markerEntry.marker.setImage(markerEntry.getMarkerImage(true));
      selectedDistrictEntry = markerEntry;

      // 마커 중심이나 확대 수준을 바꾸지 않고 현재 그룹을 전달합니다.
      onDistrictMarkerClick?.(group);
    });

    // 이후 확대 수준 변경과 제거를 위해 배열에 저장합니다.
    districtMarkers.push(marker);

    // 다른 시군구를 클릭할 때 현재 마커의 선택 테두리를 해제할 수 있도록 저장합니다.
    districtMarkerSelections.push(markerEntry);
  });

  // 생성된 Kakao 마커 목록을 ref에 저장합니다.
  markerLayerRef.current = markers;

  // 생성된 시·군·구 집계 마커 목록을 ref에 저장합니다.
  districtMarkerLayerRef.current = districtMarkers;

  // 마커 재생성마다 닫기 처리가 최신 마커 목록을 사용하도록 갱신합니다.
  if (resetDistrictMarkersRef) {
    // 저장된 선택 지역과 모든 집계 마커의 테두리를 함께 초기화합니다.
    resetDistrictMarkersRef.current = () => {
      // 이후 지도 재조회에서도 이전 선택 테두리가 다시 나타나지 않도록 지웁니다.
      if (selectedDistrictKeyRef) selectedDistrictKeyRef.current = null;

      // 선택된 마커 하나만 기본 테두리로 복원합니다.
      selectedDistrictEntry?.marker.setImage(
        selectedDistrictEntry.getMarkerImage(false)
      );
      selectedDistrictEntry = null;
    };
  }

  // 줌 레벨 전환에 사용할 토지 목록을 저장합니다.
  displayDataRef.current = displayLands;

  // 렌더링 후 필요한 후처리를 실행합니다.
  onAfterRender?.();
};
