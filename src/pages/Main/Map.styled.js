import styled from "styled-components";

// 지도 페이지 전체 영역
export const MapPage = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

// VWorld 지도가 실제로 렌더링되는 영역
export const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

// 지도 위 왼쪽에 올라가는 네비게이트바 영역
export const NavBarArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 82px;
`;

// 지도 위 왼쪽에 올라가는 사이드바 영역
export const SideBarArea = styled.div`
  position: absolute;
  top: 56px;
  left: 0;
  z-index: 10;
  width: 184px;
  height: calc(100vh - 56px);
`;

// 지도 위에 올라가는 검색창 위치 영역
export const SearchArea = styled.div`
  position: absolute;
  top: 34px;
  left: 278px;
  z-index: 20;
`;