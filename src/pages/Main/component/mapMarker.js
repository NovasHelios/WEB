import { formatCompactKoreanMoneyFromManwon } from "@/utils/priceFormat";

// canvas와 Kakao MarkerImage가 함께 사용할 마커 너비입니다.
const MARKER_WIDTH = 90;

// canvas와 Kakao MarkerImage가 함께 사용할 마커 높이입니다.
const MARKER_HEIGHT = 56;

// 같은 배경 이미지를 요청할 때 재사용할 로딩 Promise입니다.
let markerBackgroundPromise = null;

// 현재 Promise가 불러오는 배경 이미지 URL입니다.
let markerBackgroundSource = null;

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

// 현재 지도 레벨에 따라 Kakao 마커 표시 상태를 갱신합니다.
export const updateLandLayerByZoom = ({
  // Kakao 지도 객체를 담은 ref입니다.
  mapRef,

  // Kakao 마커 배열을 담은 ref입니다.
  markerLayerRef,
}) => {
  // Kakao 지도 객체가 없으면 중단합니다.
  if (!mapRef.current) return;

  // Kakao 마커 배열이 아직 없으면 중단합니다.
  if (!Array.isArray(markerLayerRef.current)) return;

  // 현재 Kakao 지도 레벨을 가져옵니다.
  const level = mapRef.current.getLevel();

  // 너무 멀리 축소된 경우에는 마커를 숨깁니다.
  const shouldShowMarkers = level <= 8;

  // Kakao 마커마다 지도 표시 여부를 갱신합니다.
  markerLayerRef.current.forEach((marker) => {
    // 보여줄 때는 현재 지도에 붙이고, 숨길 때는 지도에서 제거합니다.
    marker.setMap(shouldShowMarkers ? mapRef.current : null);
  });
};

export const formatPrice = (price) => {
  // 지도 마커 가격도 서버 기준인 원 단위로 표시합니다.
  return formatCompactKoreanMoneyFromManwon(price, "가격 없음");
};

// 가격/면적 텍스트를 markup.png 마커 디자인 위에 얹어서 canvas 이미지로 생성합니다.
export const createLandMarkerImage = ({
  priceText,
  areaText,
  markerBackground,
}) => {
  // 로드가 끝난 배경 이미지가 없으면 마커 이미지를 만들지 않습니다.
  if (!markerBackground) return "";

  // 마커 이미지를 그릴 canvas를 생성합니다.
  const canvas = document.createElement("canvas");

  // 화면의 실제 배율을 사용해 고해상도 화면에서도 선명하게 표시합니다.
  const pixelRatio = Math.max(1, window.devicePixelRatio || 1);

  // canvas 실제 픽셀 크기를 설정합니다.
  canvas.width = MARKER_WIDTH * pixelRatio;
  canvas.height = MARKER_HEIGHT * pixelRatio;

  // canvas에 그릴 2D context를 가져옵니다.
  const ctx = canvas.getContext("2d");

  // 이후 그리는 요소들이 CSS 기준 크기처럼 동작하도록 배율을 적용합니다.
  ctx.scale(pixelRatio, pixelRatio);

  // 로딩이 완료된 markup.png 배경을 canvas 전체에 그립니다.
  ctx.drawImage(markerBackground, 0, 0, MARKER_WIDTH, MARKER_HEIGHT);

  // 가격 텍스트 색상을 흰색으로 설정합니다.
  ctx.fillStyle = "#ffffff";

  // 가격 텍스트를 2번 디자인 크기에 맞게 작게 표시합니다.
  ctx.font = "900 13px sans-serif";

  // 텍스트를 마커 중앙 기준으로 정렬합니다.
  ctx.textAlign = "center";

  // 텍스트의 세로 기준을 중앙으로 맞춥니다.
  ctx.textBaseline = "middle";

  // 가격 텍스트를 상단 영역에 표시합니다.
  ctx.fillText(priceText, MARKER_WIDTH / 2, 16, MARKER_WIDTH - 12);

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
  ctx.fillText(areaText, MARKER_WIDTH / 2, 34, MARKER_WIDTH - 12);

  // Kakao MarkerImage에서 사용할 data URL을 반환합니다.
  return canvas.toDataURL();
};

export const renderLandMarkers = async ({
  // Kakao 지도 객체를 담은 ref입니다.
  mapRef,

  // 서버에서 받아온 토지 목록입니다.
  lands,

  // 생성된 Kakao 마커 목록을 저장할 ref입니다.
  markerLayerRef,

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
            ? await geocodeAddress(land.address)
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
      };
    })
  );

  // 좌표 변환에 성공한 토지만 남깁니다.
  const displayLands = geocodedLands.filter(Boolean);

  // 지오코딩 중 더 최신 요청이 시작됐다면 현재 결과를 지도에 반영하지 않습니다.
  if (isStale?.()) return;

  // 지오코딩이 모두 끝난 뒤 기존 마커를 한 번에 제거합니다.
  if (Array.isArray(markerLayerRef.current)) {
    markerLayerRef.current.forEach((marker) => {
      // 기존 마커를 지도에서 제거합니다.
      marker.setMap(null);
    });
  }

  // 새 마커 목록을 저장할 배열을 만듭니다.
  const markers = [];

  // 좌표 변환이 끝난 토지를 Kakao 마커로 표시합니다.
  displayLands.forEach((land) => {
    // markup.png 배경 위에 가격과 면적을 얹은 마커 이미지를 생성합니다.
    // 서버 면적을 유효한 숫자로 변환합니다.
    const numericArea = toFiniteNumber(land.area);

    // 유효한 면적만 숫자로 표시하고, 없는 값은 안내 문구로 대체합니다.
    const areaText = Number.isFinite(numericArea)
      ? `${Math.round(numericArea).toLocaleString()}㎡`
      : "면적 없음";

    // 로드가 완료된 배경 위에 가격과 면적을 얹은 마커 이미지를 생성합니다.
    const markerImageUrl = createLandMarkerImage({
      priceText: formatPrice(land.desiredPrice),
      areaText,
      markerBackground,
    });

    // Kakao 지도에서 실제로 보일 마커 크기를 설정합니다.
    const imageSize = new window.kakao.maps.Size(
      MARKER_WIDTH,
      MARKER_HEIGHT
    );

    // 마커 이미지의 하단 중앙이 실제 좌표에 닿도록 기준점을 설정합니다.
    const imageOption = {
      offset: new window.kakao.maps.Point(
        MARKER_WIDTH / 2,
        MARKER_HEIGHT
      ),
    };

    // Kakao 마커 이미지를 생성합니다.
    const markerImage = new window.kakao.maps.MarkerImage(
      markerImageUrl,
      imageSize,
      imageOption
    );

    // Kakao 마커를 생성합니다.
    const marker = new window.kakao.maps.Marker({
      // 마커가 표시될 지도입니다.
      map: mapRef.current,

      // 마커 위치입니다.
      position: land.position,

      // 마커 이미지입니다.
      image: markerImage,
    });

    // 마커 클릭 시 미리보기 패널을 열 수 있도록 이벤트를 등록합니다.
    window.kakao.maps.event.addListener(marker, "click", () => {
      // 클릭된 토지 정보를 상위 컴포넌트로 전달합니다.
      onMarkerClick?.(land);

      // 클릭된 위치로 지도 중심을 이동합니다.
      mapRef.current.setCenter(land.position);

      // 클릭된 토지가 잘 보이도록 확대합니다.
      mapRef.current.setLevel(3);
    });

    // 나중에 제거하거나 표시 상태를 바꾸기 위해 마커를 배열에 저장합니다.
    markers.push(marker);
  });

  // 생성된 Kakao 마커 목록을 ref에 저장합니다.
  markerLayerRef.current = markers;

  // 줌 레벨 전환에 사용할 토지 목록을 저장합니다.
  displayDataRef.current = displayLands;

  // 렌더링 후 필요한 후처리를 실행합니다.
  onAfterRender?.();
};
