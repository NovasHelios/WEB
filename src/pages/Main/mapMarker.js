// 주소에서 축소 시 묶어서 보여줄 구/군/시 단위 이름을 추출
export const getGroupNameFromAddress = (address) => {
  const words = address.trim().split(/\s+/);

  // 예: 중구, 팔달구, 달성군
  const district = words.find((word) => /(구|군)$/.test(word));
  if (district) return district;

  // 예: 수원시, 성남시
  const city = words.find((word) => /시$/.test(word));
  if (city) return city;

  return "기타";
};

export const createGroupMarkerImage = (groupName, count) => {
  const canvas = document.createElement("canvas");
  const width = 96;
  const height = 64;
  const radius = 10;

  canvas.width = width * 2;
  canvas.height = height * 2;

  const ctx = canvas.getContext("2d");
  ctx.scale(2, 2);

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#777777";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(width - radius, 0);
  ctx.quadraticCurveTo(width, 0, width, radius);
  ctx.lineTo(width, height - radius);
  ctx.quadraticCurveTo(width, height, width - radius, height);
  ctx.lineTo(radius, height);
  ctx.quadraticCurveTo(0, height, 0, height - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#111111";
  ctx.font = "700 16px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(groupName, 12, 9);

  ctx.font = "700 14px sans-serif";
  ctx.fillText("매물", 12, 34);

  ctx.fillStyle = "#10a64a";
  ctx.fillText(count.toLocaleString(), 48, 34);

  return canvas.toDataURL();
};

// 축소 상태에서 구/군/시 단위로 등록 토지 수를 묶어 표시
export const renderLandGroups = ({ lands, groupLayerRef }) => {
  if (!groupLayerRef.current) return;

  const source = groupLayerRef.current.getSource();

  // 기존 집계 마커 제거
  source.clear();

  const groupMap = new Map();

  lands.forEach((land) => {
    // 주소에서 구/군/시 이름 추출
    const groupName = getGroupNameFromAddress(land.address);

    if (!groupMap.has(groupName)) {
      groupMap.set(groupName, {
        groupName,
        count: 0,
        x: 0,
        y: 0,
      });
    }

    const group = groupMap.get(groupName);

    group.count += 1;

    // 같은 구/군/시 안 여러 토지가 있으면 좌표 평균을 대표 위치로 사용
    group.x += land.coordinate[0];
    group.y += land.coordinate[1];
  });

  groupMap.forEach((group) => {
    const center = [group.x / group.count, group.y / group.count];

    const feature = new window.ol.Feature({
      geometry: new window.ol.geom.Point(center),
      groupName: group.groupName,
      count: group.count,
    });

    feature.setStyle(
      new window.ol.style.Style({
        image: new window.ol.style.Icon({
          src: createGroupMarkerImage(group.groupName, group.count),
          anchor: [0.5, 0.5],
          scale: 0.36,
        }),
      })
    );

    source.addFeature(feature);
  });
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

// 가격을 억 단위로 축약해서 표시
// 예: 350,000,000 -> 3.5억
// 예: 354,000,000 -> 3.5억
// 예: 1,000,000,000 -> 10억
export const formatPrice = (price) => {
  if (!price) return "가격 없음";

  // 원 단위를 억 단위 숫자로 변환
  const eokValue = Number(price) / 100000000;

  // 1억 이상이면 억 단위로 표시
  if (eokValue >= 1) {
    // 소수점 둘째 자리까지 버림
    // 3.54 -> 3.5, 3.59 -> 3.5
    const floored = Math.floor(eokValue * 10) / 10;

    // 3.0억처럼 보이지 않도록 정수면 소수점 제거
    return `${Number.isInteger(floored) ? floored : floored.toFixed(1)}억`;
  }

  // 1억 미만은 만원 단위로 표시
  const manValue = Math.floor(Number(price) / 10000);
  return `${manValue.toLocaleString()}만원`;
};

// 여러 토지가 가까이 겹칠 때 표시할 원형 개수 마커 이미지를 생성
export const createCountCircleImage = (count) => {
  // 캔버스 생성
  const canvas = document.createElement("canvas");

  // 고해상도 화면에서도 선명하게 보이도록 배율 설정
  const pixelRatio = 2;

  // 원형 마커 기본 크기
  const size = 74;

  // 실제 캔버스 크기 설정
  canvas.width = size * pixelRatio;
  canvas.height = size * pixelRatio;

  // 캔버스 그리기 도구 가져오기
  const ctx = canvas.getContext("2d");

  // 전체 도형을 고해상도 배율로 확대
  ctx.scale(pixelRatio, pixelRatio);

  // 원 배경 색상 설정
  ctx.fillStyle = "rgba(255, 171, 3, 0.35)";

  // 원 테두리 색상 설정
  ctx.strokeStyle = "rgba(255, 171, 3, 0.75)";

  // 원 테두리 두께 설정
  ctx.lineWidth = 2;

  // 원 그리기 시작
  ctx.beginPath();

  // 원형 개수 마커 그림
  ctx.arc(size / 2, size / 2, 34, 0, Math.PI * 2);

  // 원 내부 채우기
  ctx.fill();

  // 원 테두리 그리기
  ctx.stroke();

  // 숫자 색상 설정
  ctx.fillStyle = "#111111";

  // 숫자 폰트 설정
  ctx.font = "900 24px sans-serif";

  // 숫자 가로 정렬
  ctx.textAlign = "center";

  // 숫자 세로 정렬
  ctx.textBaseline = "middle";

  // 가운데에 개수 표시
  ctx.fillText(String(count), size / 2, size / 2);

  // OpenLayers Icon에서 사용할 이미지 URL 반환
  return canvas.toDataURL();
};

// 묶인 토지들 중 가장 최신에 등록된 토지 하나를 찾음
export const getLatestLand = (lands) => {
  // 서버에서 최신 등록일 필드가 아직 명확하지 않으면 id가 큰 것을 최신으로 간주
  return [...lands].sort((a, b) => Number(b.id) - Number(a.id))[0];
};

// 가격/면적 텍스트까지 포함한 하나의 마커 이미지를 canvas로 생성
export const createLandMarkerImage = ({ priceText, areaText }) => {
  const canvas = document.createElement("canvas");

  // 원본 디자인 기준 크기
  const baseWidth = 160;
  const baseHeight = 120;

  // 실제 화면에 보일 축소 비율
  const markerScale = 0.65;

  // 선명도 보정
  const pixelRatio = 2;

  canvas.width = baseWidth * markerScale * pixelRatio;
  canvas.height = baseHeight * markerScale * pixelRatio;

  const ctx = canvas.getContext("2d");

  // 핵심: 캔버스를 줄이는 게 아니라, 그리는 내용 전체를 축소
  ctx.scale(markerScale * pixelRatio, markerScale * pixelRatio);

  // 주황색 배경
  ctx.fillStyle = "#ffab03";
  ctx.beginPath();
  ctx.roundRect(20, 8, 120, 74, 8);
  ctx.fill();

  // 아래 삼각형
  ctx.beginPath();
  ctx.moveTo(68, 82);
  ctx.lineTo(92, 82);
  ctx.lineTo(80, 106);
  ctx.closePath();
  ctx.fill();

  // 가격 텍스트
  ctx.fillStyle = "#000000";
  ctx.font = "900 22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(priceText, 80, 34);

  // 검은 면적 박스
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(34, 50, 92, 26, 5);
  ctx.fill();
  ctx.stroke();

  // 면적 텍스트
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 16px sans-serif";
  ctx.fillText(areaText, 80, 64);

  return canvas.toDataURL();
};

// 개별 토지 하나를 지도 위에 표시할 OpenLayers Feature로 변환
export const createLandFeature = (land) => {
  // 토지 좌표를 기준으로 점 Feature 생성
  const feature = new window.ol.Feature({
    // 마커가 찍힐 지도 좌표
    geometry: new window.ol.geom.Point(land.coordinate),

    // 클릭했을 때 상세 패널에 보여줄 원본 토지 데이터
    land,

    // 필요한 토지 정보들을 Feature에도 직접 저장
    landId: land.id,
    ownerEmail: land.ownerEmail,
    address: land.address,
    area: land.area,
    lcCode: land.lcCode,
    lcCodeNm: land.lcCodeNm,
    regstrSeCodeNm: land.regstrSeCodeNm,
    cnrsPsnCo: land.cnrsPsnCo,
    pnu: land.pnu,
    desiredPrice: land.desiredPrice,
    description: land.description,
    status: land.status,
    landImagePath: land.landImagePath,
  });

  // 서버에서 받은 m² 값을 평으로 변환
  const areaPyeong = Math.round(Number(land.area) / 3.3058);

  // 가격과 평수를 포함한 마커 이미지를 캔버스로 생성
  const markerImage = createLandMarkerImage({
    priceText: formatPrice(land.desiredPrice),
    areaText: `${areaPyeong}평`,
  });

  // 생성한 이미지 마커를 Feature 스타일로 적용
  feature.setStyle(
    new window.ol.style.Style({
      image: new window.ol.style.Icon({
        src: markerImage,
        anchor: [0.5, 1],
        scale: 0.75,
      }),
    })
  );

  // 완성된 토지 Feature 반환
  return feature;
};

// 중간 줌 상태에서 가까이 겹치는 토지들을 원형 개수 마커로 묶어서 표시
export const renderNearbyLandGroups = ({ lands, groupLayerRef }) => {
  // 그룹 레이어가 아직 준비되지 않았으면 중단
  if (!groupLayerRef.current) return;

  // 그룹 마커를 담는 source 가져오기
  const source = groupLayerRef.current.getSource();

  // 이전에 표시된 그룹 마커 제거
  source.clear();

  // 가까운 토지들을 묶어둘 배열
  const nearbyGroups = [];

  // 좌표가 있는 토지들을 하나씩 확인
  lands.forEach((land) => {
    // 좌표가 없으면 지도에 표시할 수 없으므로 건너뜀
    if (!land.coordinate) return;

    // 이미 만들어진 그룹 중 현재 토지와 가까운 그룹을 찾음
    const existingGroup = nearbyGroups.find((group) => {
      // x 좌표 차이
      const dx = group.center[0] - land.coordinate[0];

      // y 좌표 차이
      const dy = group.center[1] - land.coordinate[1];

      // 두 좌표 사이 거리 계산
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 이 값이 클수록 더 넓은 범위의 마커들이 하나로 묶임
      return distance < 260;
    });

    // 가까운 그룹이 있으면 해당 그룹에 토지를 추가
    if (existingGroup) {
      existingGroup.lands.push(land);

      // 그룹 중심 좌표를 그룹 안 토지들의 평균 좌표로 다시 계산
      existingGroup.center = [
        existingGroup.lands.reduce((sum, item) => sum + item.coordinate[0], 0) /
          existingGroup.lands.length,
        existingGroup.lands.reduce((sum, item) => sum + item.coordinate[1], 0) /
          existingGroup.lands.length,
      ];

      return;
    }

    // 가까운 그룹이 없으면 새 그룹 생성
    nearbyGroups.push({
      center: land.coordinate,
      lands: [land],
    });
  });

  // 만들어진 그룹들을 실제 지도 Feature로 변환
  nearbyGroups.forEach((group) => {
    // 그룹에 토지가 하나뿐이면 기존 토지 마커 그대로 표시
    if (group.lands.length === 1) {
      source.addFeature(createLandFeature(group.lands[0]));
      return;
    }

    // 여러 토지가 겹친 경우 가장 최신 토지 하나를 대표로 사용
    const latestLand = getLatestLand(group.lands);

    // 겹친 토지 개수를 보여줄 원형 마커 Feature 생성
    const countFeature = new window.ol.Feature({
      // 원형 개수 마커는 그룹 중심에 표시
      geometry: new window.ol.geom.Point(group.center),

      // 원형 마커를 클릭했을 때 최신 토지 상세를 열기 위한 데이터
      latestLand,

      // 그룹에 포함된 토지 개수
      count: group.lands.length,

      // 그룹에 포함된 전체 토지 목록
      lands: group.lands,
    });

    // 원형 개수 마커 스타일 적용
    countFeature.setStyle(
      new window.ol.style.Style({
        image: new window.ol.style.Icon({
          src: createCountCircleImage(group.lands.length),
          anchor: [0.5, 0.5],
          scale: 1,
        }),
      })
    );

    // 원형 개수 마커 추가
    source.addFeature(countFeature);

    // 가장 최신 토지 마커 하나만 같이 표시
    source.addFeature(createLandFeature(latestLand));
  });
};

// 등록된 토지 목록을 Kakao 마커로 지도에 표시합니다.
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

  // 마커 클릭 시 실행할 함수입니다.
  onMarkerClick,

  // 렌더링 이후 줌 레벨에 맞춰 표시 상태를 갱신하는 함수입니다.
  onAfterRender,
}) => {
  // Kakao 지도 객체가 없으면 마커를 표시하지 않습니다.
  if (!mapRef.current) return;

  // 이전에 생성한 Kakao 마커들이 있으면 지도에서 제거합니다.
  if (Array.isArray(markerLayerRef.current)) {
    markerLayerRef.current.forEach((marker) => {
      // 기존 마커를 지도에서 제거합니다.
      marker.setMap(null);
    });
  }

  // 새 마커 목록을 저장할 배열을 만듭니다.
  const markers = [];

  // 주소를 좌표로 변환한 토지 목록을 만듭니다.
  const geocodedLands = await Promise.all(
    lands.map(async (land) => {
      // 주소가 없으면 지도에 표시할 수 없으므로 제외합니다.
      if (!land.address) return null;

      // 주소를 Kakao 주소 검색으로 좌표 변환합니다.
      const point = await geocodeAddress(land.address);

      // 좌표 변환에 실패하면 제외합니다.
      if (!point) return null;

      // Kakao 지도에서 사용할 위도/경도 좌표 객체를 만듭니다.
      const position = new window.kakao.maps.LatLng(point.lat, point.lon);

      // 지도 표시용 좌표 정보를 토지 데이터에 함께 저장합니다.
      return {
        ...land,

        // Kakao 검색 결과에는 PNU가 없을 수 있으므로 기존 값 또는 null을 유지합니다.
        pnu: land.pnu || point.pnu,

        // Kakao 지도 표시용 좌표 객체입니다.
        position,

        // 그룹 계산이나 추후 처리를 위해 숫자 좌표도 저장합니다.
        lat: point.lat,
        lon: point.lon,
      };
    })
  );

  // 좌표 변환에 성공한 토지만 남깁니다.
  const displayLands = geocodedLands.filter(Boolean);

  // 좌표 변환이 끝난 토지를 Kakao 마커로 표시합니다.
  displayLands.forEach((land) => {
    // 가격과 면적이 들어간 기존 canvas 마커 이미지를 생성합니다.
    const markerImageUrl = createLandMarkerImage({
      priceText: formatPrice(land.desiredPrice),
      areaText: `${Math.round(Number(land.area) / 3.3058)}평`,
    });

    // Kakao 마커 이미지 크기를 설정합니다.
    const imageSize = new window.kakao.maps.Size(78, 58);

    // Kakao 마커 이미지 옵션을 설정합니다.
    const imageOption = {
      // 마커의 하단 중앙이 좌표에 닿도록 기준점을 설정합니다.
      offset: new window.kakao.maps.Point(39, 58),
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

    // 마커 클릭 시 상세 패널을 열 수 있도록 이벤트를 등록합니다.
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
