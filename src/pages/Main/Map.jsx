import { useEffect, useRef, useState } from "react";
import SideBar from "@/components/layout/box/SideBar";
import NavBar from "@/components/layout/box/NavBar";
import Search from "@/components/ui/Search/Search";
import { MapPage, MapContainer, SideBarArea, SearchArea, NavBarArea } from "./Map.styled";

function Map() {
  // VWorld 지도가 렌더링될 DOM 요소를 참조하기 위한 ref
  const mapElementRef = useRef(null);

  // 생성된 VWorld 지도 객체를 저장하기 위한 ref
  // useRef를 쓰면 컴포넌트가 리렌더링되어도 값이 유지됨
  const mapInstanceRef = useRef(null);

  // 검색창에 입력한 주소 값을 저장하는 state
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    // VWorld API와 OpenLayers API가 정상적으로 로드되었는지 확인
    if (!window.vw || !window.vw.ol3 || !window.ol) {
      console.error("VWorld 또는 OpenLayers API가 로드되지 않았습니다.");
      return;
    }

    // 이미 지도가 생성되어 있으면 다시 만들지 않음
    if (mapInstanceRef.current) return;

    // 서울 한강 근방 좌표
    // EPSG:4326은 일반 위도/경도 좌표계
    // EPSG:900913은 VWorld/OpenLayers 지도에서 사용하는 좌표계
    const seoulCenter = window.ol.proj.transform(
      [126.995, 37.52],
      "EPSG:4326",
      "EPSG:900913"
    );

    // VWorld 지도의 초기 중심 좌표 설정
    window.vw.ol3.CameraPosition.center = seoulCenter;

    // VWorld 지도의 초기 줌 레벨 설정
    window.vw.ol3.CameraPosition.zoom = 12;

    // VWorld 지도 생성 옵션
    const options = {
      // 일반 그래픽 지도 사용
      basemapType: window.vw.ol3.BasemapType.GRAPHIC,

      // 기본 컨트롤 UI 밀도 설정
      controlDensity: window.vw.ol3.DensityType.EMPTY,

      // 지도 드래그/줌 같은 기본 상호작용 설정
      interactionDensity: window.vw.ol3.DensityType.BASIC,

      // 지도 컨트롤 자동 정렬
      controlsAutoArrange: true,

      // 홈 버튼을 눌렀을 때 이동할 위치
      homePosition: window.vw.ol3.CameraPosition,

      // 지도 처음 로딩 시 위치
      initPosition: window.vw.ol3.CameraPosition,
    };

    // id가 vworld-map인 DOM 요소에 VWorld 지도 생성
    const map = new window.vw.ol3.Map("vworld-map", options);

    // 생성한 지도 객체를 ref에 저장
    mapInstanceRef.current = map;

    // 지도 컨테이너 크기를 다시 계산
    // 레이아웃 위에 사이드바/검색창이 올라갈 때 지도 타일 깨짐을 줄이기 위함
    setTimeout(() => {
      map.updateSize();
    }, 100);

    // VWorld 지도 내부의 OpenLayers View 객체 가져오기
    // View는 지도 중심, 줌 레벨 같은 화면 상태를 관리함
    const view = map.getView();

    // 남한 주변으로 지도 이동 가능 범위 제한
    // [최소 경도, 최소 위도, 최대 경도, 최대 위도]
    const koreaExtent = window.ol.proj.transformExtent(
      [125.0, 33.0, 130.0, 38.3],
      "EPSG:4326",
      "EPSG:900913"
    );

    // 지도 중심을 서울 한강 근방으로 설정
    view.setCenter(seoulCenter);

    // 시작 줌 레벨 설정
    view.setZoom(12);

    // 줌 변경 이벤트 등록
    // OpenLayers에서는 줌 변경이 resolution 변경으로 감지됨
    view.on("change:resolution", () => {
      // 현재 줌 레벨 가져오기
      const zoom = view.getZoom();

      // 너무 멀리 축소하지 못하게 제한
      if (zoom < 9) {
        view.setZoom(9);
      }

      // 너무 많이 확대하지 못하게 제한
      if (zoom > 20) {
        view.setZoom(20);
      }
    });

    // 지도 중심 이동 이벤트 등록
    view.on("change:center", () => {
      // 현재 지도 중심 좌표 가져오기
      const center = view.getCenter();

      // 중심 좌표가 없으면 종료
      if (!center) return;

      // 현재 중심 좌표가 남한 범위를 벗어나지 않도록 보정
      const clampedCenter = [
        Math.min(Math.max(center[0], koreaExtent[0]), koreaExtent[2]),
        Math.min(Math.max(center[1], koreaExtent[1]), koreaExtent[3]),
      ];

      // 중심 좌표가 범위 밖이면 범위 안 좌표로 다시 이동
      if (center[0] !== clampedCenter[0] || center[1] !== clampedCenter[1]) {
        view.setCenter(clampedCenter);
      }
    });
  }, []);

  // 주소 검색 함수
  const searchAddress = async () => {
    // 검색어 확인용 로그
    console.log("검색 실행:", keyword);

    // 검색어가 비어 있으면 실행하지 않음
    if (!keyword.trim()) return;

    // .env 파일에 저장한 VWorld API 키 가져오기
    const apiKey = import.meta.env.VITE_VWORLD_API_KEY;

    // API 키가 없으면 안내 후 종료
    if (!apiKey) {
      alert("VWorld API 키가 설정되지 않았습니다.");
      return;
    }

    // VWorld Search API 요청 URL 생성
    const url =
      `/vworld-api/req/search?service=search` +
      `&request=search` +
      `&version=2.0` +
      `&crs=EPSG:4326` +
      `&size=10` +
      `&page=1` +
      `&query=${encodeURIComponent(keyword)}` +
      `&type=address` +
      `&category=road` +
      `&format=json` +
      `&key=${apiKey}`;

    // VWorld 서버에 주소 검색 요청
    const response = await fetch(url);

    // 응답 데이터를 JSON으로 변환
    const data = await response.json();

    // 응답 확인용 로그
    console.log("VWorld 응답:", data);

    // 검색 결과 중 첫 번째 주소 가져오기
    const item = data.response?.result?.items?.[0];

    // 검색 결과가 없으면 안내 후 종료
    if (!item) {
      alert("검색 결과가 없습니다.");
      return;
    }

    // VWorld 검색 결과의 경도, 위도 값
    const lon = Number(item.point.x);
    const lat = Number(item.point.y);

    // 위도/경도 좌표를 VWorld/OpenLayers 지도 좌표계로 변환
    const coordinate = window.ol.proj.transform(
      [lon, lat],
      "EPSG:4326",
      "EPSG:900913"
    );

    // 저장해둔 지도 객체 가져오기
    const map = mapInstanceRef.current;

    // 지도가 아직 준비되지 않았으면 종료
    if (!map) {
      alert("지도가 아직 준비되지 않았습니다.");
      return;
    }

    // 지도 View 객체 가져오기
    const view = map.getView();

    // 검색된 위치로 지도 중심 이동
    view.setCenter(coordinate);

    // 검색된 위치가 잘 보이도록 확대
    view.setZoom(19);
  };

  return (
    <MapPage>
      {/* VWorld 지도가 렌더링될 영역 */}
      <MapContainer id="vworld-map" ref={mapElementRef} />

      {/* 지도 위 왼쪽에 표시할 네비게이트바 */}
      <NavBarArea>
        <NavBar
          keyword={keyword}
          onChangeKeyword={setKeyword}
          onSearch={searchAddress}
        />
      </NavBarArea>

      {/* 지도 위 왼쪽에 표시할 사이드바 */}
      <SideBarArea>
        <SideBar />
      </SideBarArea>

    </MapPage>
  );
}

export default Map;
