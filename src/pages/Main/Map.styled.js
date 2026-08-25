// styled-components를 사용해 지도 페이지 레이아웃을 정의합니다.
import styled from "styled-components";

// 홈 화면 전체 영역입니다.
export const MapPage = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
`;

// Kakao 지도가 실제로 렌더링되는 영역입니다.
export const MapContainer = styled.div`
  width: 100%;
  height: calc(100vh - 72px);
  margin-top: 72px;
`;

// 상단 네비게이션 바를 지도 위에 고정하는 영역입니다.
export const NavBarArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 30;
  width: 100%;
  height: 72px;
`;

// 필터 버튼과 필터 패널을 지도 위에 고정하는 영역입니다.
export const FilterArea = styled.div`
  position: absolute;
  top: 84px;
  left: 20px;
  z-index: 20;
`;

// 상세 토지 패널을 지도 위에 띄우기 위한 기준 영역입니다.
export const DetailPanelArea = styled.div`
  position: absolute;
  top: 72px;
  left: 16px;
  z-index: 25;
  width: 0;
  height: 0;
`;
