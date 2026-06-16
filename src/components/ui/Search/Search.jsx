import { useEffect, useRef, useState } from "react";
import SideBar from "@/components/layout/box/SideBar";
import {
  MapPage,
  MapContainer,
  SideBarArea,
  SearchBox,
  SearchInput,
  SearchButton,
} from "./Map.styles";

function Map() {
  // 지도 DOM 요소 참조 ref
  const mapElementRef = useRef(null);

  // 생성된 VWorld 지도 객체를 저장하기 위한 ref
  // useRef를 쓰면 리렌더링되어도 값이 유지됨
  const mapInstanceRef = useRef(null);

  // 검색창에 입력한 주소 값을 저장하는 state
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    // VWorld API와 OpenLayers API가 정상적으로 로드되었는지 확인
    if (!window.vw || !window.vw.ol3 || !window.ol) {
      console.error("VWorld 또는 OpenLayers API가 로드되지 않았습니다.");
      return;
    }

    // 지도가 이미 생성되어 있으면 다시 만들지 않음
    if (mapInstanceRef.current) return;

    // 서울 한강 근방 좌표
    // VWorld/OpenLayers 지도에서 사용할 수 있도록 좌표계를 변환
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

      // 컨트롤 자동 정렬
      controlsAutoArrange: true,

      // 홈 버튼을 눌렀을 때 이동할 위치
      homePosition: window.vw.ol3.CameraPosition,

      // 지도 처음 로딩 시 위치
      initPosition: window.vw.ol3.CameraPosition,
    };

    // id가 vworld-map인 div에 VWorld 지도 생성
    const map = new window.vw.ol3.Map("vworld-map", options);

    // 생성한 지도 객체를 ref에 저장
    mapInstanceRef.current = map;

    // 지도 컨테이너 크기 계산을 다시 하도록 처리
    // 사이드바/레이아웃 때문에 타일이 깨져 보이는 문제를 줄임
    setTimeout(() => {
      map.updateSize();
    }, 100);

    // VWorld 지도 내부의 OpenLayers View 객체 가져오기
    const view = map.getView();

    // 남한 주변으로 지도 이동 가능 범위 제한
    const koreaExtent = window.ol.proj.transformExtent(
      [125.0, 33.0, 130.0, 38.3],
      "EPSG:4326",
      "EPSG:900913"
    );

    // 지도 중심을 서울 한강 근방으로 설정
    // setCenter: 현재 지도 중심 좌표 변경
    view.setCenter(seoulCenter);

    // 시작 줌 레벨 설정
    // setZoom: 줌 레벨 변경
    view.setZoom(12);

    // 줌 변경 이벤트
    // "change:resolution": OpenLayers에서 정해둔 이벤트 이름.
    // 줌/해상도 변화가 생길 때 발생
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

    // 지도 중심 이동 이벤트
    view.on("change:center", () => {
      const center = view.getCenter();
      if (!center) return;

      // 현재 중심 좌표가 남한 범위를 벗어나지 않도록 보정
      const clampedCenter = [
        Math.min(Math.max(center[0], koreaExtent[0]), koreaExtent[2]),
        Math.min(Math.max(center[1], koreaExtent[1]), koreaExtent[3]),
      ];

      // 중심 좌표가 범위를 벗어났으면 다시 범위 안으로 이동
      if (center[0] !== clampedCenter[0] || center[1] !== clampedCenter[1]) {
        view.setCenter(clampedCenter);
      }
    });
  }, []);

  // 주소 검색 함수
  const searchAddress = async () => {
    // 검색어가 비어 있으면 실행하지 않음
    if (!keyword.trim()) return;

    // .env 파일에 저장한 VWorld API 키 가져오기
    const apiKey = import.meta.env.VITE_VWORLD_API_KEY;

    // VWorld Search API 요청 URL 생성
    const url =
      `https://api.vworld.kr/req/search?service=search` +
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

    // 위도/경도 좌표를 지도 좌표계로 변환
    const coordinate = window.ol.proj.transform(
      [lon, lat],
      "EPSG:4326",
      "EPSG:900913"
    );

    // 저장해둔 지도 객체 가져오기
    const map = mapInstanceRef.current;

    // 지도 View 객체 가져오기
    const view = map.getView();

    // 검색된 위치로 지도 중심 이동
    view.setCenter(coordinate);

    // 검색된 위치가 잘 보이도록 확대
    view.setZoom(17);
  };

  return (
    <MapPage>
      {/* VWorld 지도가 렌더링될 영역 */}
      <MapContainer id="vworld-map" ref={mapElementRef} />

      {/* 지도 위 왼쪽에 표시할 사이드바 */}
      <SideBarArea>
        <SideBar />
      </SideBarArea>

      {/* 지도 위에 올리는 주소 검색창 */}
      <SearchBox>
        {/* 주소 입력창 */}
        <SearchInput
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              searchAddress();
            }
          }}
          placeholder="주소를 입력하세요"
        />

        {/* 검색 버튼 */}
        <SearchButton onClick={searchAddress}>검색</SearchButton>
      </SearchBox>
    </MapPage>
  );
}

export default Map;
