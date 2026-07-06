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

// 현재 줌 레벨에 따라 개별 마커, 가까운 묶음 마커, 시군구 묶음 마커를 전환
export const updateLandLayerByZoom = ({
  mapRef,
  markerLayerRef,
  boundaryLayerRef,
  groupLayerRef,
  displayDataRef,
}) => {
  // 지도가 아직 준비되지 않았으면 중단
  if (!mapRef.current) return;

  // 현재 지도 줌 레벨 가져오기
  const zoom = mapRef.current.getView().getZoom();

  // 지도에 표시할 토지 데이터가 있는지 확인
  const hasDisplayLands = displayDataRef.current.length > 0;

  // 3단계: 많이 축소된 상태에서는 시/군/구 단위로 묶기
  const shouldDistrictGroup = zoom <= 11 && hasDisplayLands;

  // 2단계: 중간 축소 상태에서는 가까이 겹치는 마커를 원형 개수 마커로 묶기
  const shouldNearbyGroup = zoom > 11 && zoom <= 14 && hasDisplayLands;

  // 1단계: 충분히 확대된 상태에서는 개별 토지 마커 그대로 표시
  const shouldShowIndividual = zoom > 14 && hasDisplayLands;

  // 개별 토지 마커 레이어 표시 여부
  markerLayerRef.current?.setVisible(shouldShowIndividual);

  // 필지 경계 레이어는 개별 마커 상태에서만 표시
  boundaryLayerRef.current?.setVisible(shouldShowIndividual);

  // 그룹 레이어는 가까운 묶음 또는 시군구 묶음 상태에서만 표시
  groupLayerRef.current?.setVisible(shouldDistrictGroup || shouldNearbyGroup);

  // 많이 축소된 상태면 기존 시군구 묶음 표시
  if (shouldDistrictGroup) {
    renderLandGroups({
      lands: displayDataRef.current,
      groupLayerRef,
    });

    return;
  }

  // 중간 축소 상태면 가까운 마커끼리 원형 개수 마커로 묶음
  if (shouldNearbyGroup) {
    renderNearbyLandGroups({
      lands: displayDataRef.current,
      groupLayerRef,
    });

    return;
  }

  // 개별 마커 상태에서는 그룹 레이어 비우기
  groupLayerRef.current?.getSource().clear();
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

// 등록된 토지 목록을 OpenLayers 마커로 지도에 표시
export const renderLandMarkers = async ({
  lands,
  markerLayerRef,
  displayDataRef,
  geocodeAddress,
  onAfterRender,
}) => {
  if (!markerLayerRef.current) return;

  const source = markerLayerRef.current.getSource();

  // 기존 마커 제거
  source.clear();

  const geocodedLands = await Promise.all(
    lands.map(async (land) => {
      if (!land.address) return null;

      const point = await geocodeAddress(land.address);
      if (!point) return null;

      const coordinate = window.ol.proj.transform(
        [point.lon, point.lat],
        "EPSG:4326",
        "EPSG:900913"
      );

      return {
        ...land,

        // 서버에서 pnu가 오면 그 값을 쓰고,
        // 없으면 VWorld 주소 검색 결과의 item.id를 pnu로 사용
        pnu: land.pnu || point.pnu,

        coordinate,
      };
    })
  );

  const displayLands = geocodedLands.filter(Boolean);

  // 좌표 변환이 끝난 토지들을 각각 개별 마커로 표시
  displayLands.forEach((land) => {
    source.addFeature(createLandFeature(land));
  });

  // 줌 레벨 전환에 사용할 토지 목록 저장
  displayDataRef.current = displayLands;

  // 현재 줌 레벨 기준으로 개별 마커/집계 마커 표시 상태 갱신
  onAfterRender();
};
