import { useEffect, useRef } from "react";

function Map() {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!window.vw || !window.vw.ol3 || !window.ol) {
      console.error("VWorld 또는 OpenLayers API가 로드되지 않았습니다.");
      return;
    }

    if (mapInstanceRef.current) return;

    const seoulCenter = window.ol.proj.transform(
      [126.995, 37.52],
      "EPSG:4326",
      "EPSG:900913"
    );

    window.vw.ol3.CameraPosition.center = seoulCenter;
    window.vw.ol3.CameraPosition.zoom = 12;

    const options = {
      basemapType: window.vw.ol3.BasemapType.GRAPHIC,
      controlDensity: window.vw.ol3.DensityType.EMPTY,
      interactionDensity: window.vw.ol3.DensityType.BASIC,
      controlsAutoArrange: true,
      homePosition: window.vw.ol3.CameraPosition,
      initPosition: window.vw.ol3.CameraPosition,
    };

    const map = new window.vw.ol3.Map("vworld-map", options);
    mapInstanceRef.current = map;

    setTimeout(() => {
      map.updateSize();
    }, 100);

    const view = map.getView();

    const koreaExtent = window.ol.proj.transformExtent(
      [125.0, 33.0, 130.0, 38.3],
      "EPSG:4326",
      "EPSG:900913"
    );

    view.setCenter(seoulCenter);
    view.setZoom(12);

    view.on("change:resolution", () => {
      const zoom = view.getZoom();

      if (zoom < 9) {
        view.setZoom(9);
      }

      if (zoom > 18) {
        view.setZoom(18);
      }
    });

    view.on("change:center", () => {
      const center = view.getCenter();
      if (!center) return;

      const clampedCenter = [
        Math.min(Math.max(center[0], koreaExtent[0]), koreaExtent[2]),
        Math.min(Math.max(center[1], koreaExtent[1]), koreaExtent[3]),
      ];

      if (center[0] !== clampedCenter[0] || center[1] !== clampedCenter[1]) {
        view.setCenter(clampedCenter);
      }
    });
  }, []);

  return (
    <div
      id="vworld-map"
      ref={mapElementRef}
      style={{
        width: "100%",
        height: "100vh",
      }}
    />
  );
}

export default Map;
