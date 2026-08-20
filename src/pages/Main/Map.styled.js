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

// 지도 왼쪽 위에 필터 버튼을 올리는 영역입니다.
export const FilterArea = styled.div`
  position: absolute;
  top: 92px;
  left: 8px;
  z-index: 20;
  display: flex;
  gap: 20px;
`;

// 필터 버튼의 공통 디자인입니다.
export const FilterButton = styled.button`
  min-width: 100px;
  height: 36px;
  padding: 0 26px;
  border: 2px solid ${({ $active }) => ($active ? "#d49f00" : "#111111")};
  border-radius: 999px;
  background: #ffffff;
  color: #111111;
  font-size: 17px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
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
