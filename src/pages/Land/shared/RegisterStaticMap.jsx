import { useEffect, useMemo, useRef } from "react";
import { StaticMapCanvas, StaticMapEmpty, StaticMapRoot } from "./RegisterStaticMap.styled";

function RegisterStaticMap({ latitude, longitude, emptyText = "지도를 표시할 좌표가 없습니다." }) {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const positionData = useMemo(() => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return { lat, lng };
  }, [latitude, longitude]);

  useEffect(() => {
    if (!positionData || !mapElementRef.current || !window.kakao?.maps) {
      return;
    }

    const position = new window.kakao.maps.LatLng(positionData.lat, positionData.lng);

    // 등록 과정의 지도는 위치 확인용이라 움직임과 확대를 막는다.
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.kakao.maps.Map(mapElementRef.current, {
        center: position,
        level: 3,
        draggable: false,
        scrollwheel: false,
        disableDoubleClick: true,
        disableDoubleClickZoom: true,
      });
    }

    mapInstanceRef.current.relayout();
    mapInstanceRef.current.setCenter(position);
    mapInstanceRef.current.setLevel(3);
    mapInstanceRef.current.setDraggable(false);
    mapInstanceRef.current.setZoomable(false);

    if (!markerRef.current) {
      markerRef.current = new window.kakao.maps.Marker({
        map: mapInstanceRef.current,
        position,
      });
      return;
    }

    markerRef.current.setMap(mapInstanceRef.current);
    markerRef.current.setPosition(position);
  }, [positionData]);

  return (
    <StaticMapRoot>
      {positionData ? <StaticMapCanvas ref={mapElementRef} /> : <StaticMapEmpty>{emptyText}</StaticMapEmpty>}
    </StaticMapRoot>
  );
}

export default RegisterStaticMap;
