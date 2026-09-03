// 상세보기 팝업의 고정 미니 지도를 렌더링합니다.
import { useEffect, useRef } from "react";

import { LocationMap } from "./Specific.styled";

// 토지 좌표를 기준으로 조작 불가능한 Kakao 미니 지도를 표시합니다.
function SpecificMiniMap({ land }) {
  // Kakao Map을 생성할 DOM 영역입니다.
  const locationMapRef = useRef(null);

  useEffect(() => {
    // 지도 SDK와 좌표가 준비되지 않으면 지도 생성을 건너뜁니다.
    if (!locationMapRef.current || !window.kakao?.maps || !land?.x || !land?.y) {
      return;
    }

    // 서버 좌표는 x=경도, y=위도 형식으로 내려옵니다.
    const position = new window.kakao.maps.LatLng(Number(land.y), Number(land.x));

    // 상세보기에서는 위치 확인만 가능하도록 조작을 막은 미니 지도를 생성합니다.
    const map = new window.kakao.maps.Map(locationMapRef.current, {
      center: position,
      level: 3,
      draggable: false,
      scrollwheel: false,
      disableDoubleClickZoom: true,
    });

    // 선택한 토지 위치를 지도 중앙에 마커로 표시합니다.
    new window.kakao.maps.Marker({
      position,
      map,
    });

    // 팝업 렌더링 직후 지도 크기를 다시 계산해 타일 깨짐을 방지합니다.
    setTimeout(() => {
      map.relayout();
      map.setCenter(position);
    }, 0);
  }, [land]);

  // 지도 라이브러리가 사용할 빈 컨테이너를 반환합니다.
  return <LocationMap ref={locationMapRef} />;
}

export default SpecificMiniMap;
