// styled-components를 사용해 지도 페이지 레이아웃을 정의합니다.
import styled from "styled-components";

// 홈 화면 전체 영역입니다.
export const MapPage = styled.div`
  position: relative;
  width: 100%;
  /* 전역 80% 배율을 적용한 뒤에도 실제 화면 높이를 가득 채우도록 보정합니다. */
  height: 125vh;
  overflow: hidden;
  background: #ffffff;
`;

// Kakao 지도가 실제로 렌더링되는 영역입니다.
export const MapContainer = styled.div`
  width: 100%;
  /* 125vh에서 상단 네비게이션 높이를 제외해 지도 하단이 잘리지 않게 합니다. */
  height: calc(125vh - 72px);
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
  /* 검색 결과 패널이 열리면 패널 너비만큼 필터를 오른쪽으로 이동합니다. */
  left: ${({ $isSearchOpen }) => ($isSearchOpen ? "340px" : "20px")};
  z-index: 20;
  /* 검색 결과 패널 표시 상태가 바뀔 때 위치를 자연스럽게 전환합니다. */
  transition: left 0.2s ease;
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

// 지도 화면의 기본 alert 대신 서비스 스타일 안내창을 표시합니다.
export const MapAlertOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(31, 28, 23, 0.38);
`;

export const MapAlertDialog = styled.div`
  width: min(100%, 420px);
  padding: 28px;
  border: 1px solid #e4c46c;
  border-radius: 18px;
  background: #fffdf8;
  box-shadow: 0 18px 48px rgba(56, 43, 20, 0.2);
  box-sizing: border-box;
`;

export const MapAlertTitle = styled.h2`
  margin: 0;
  color: #2a251c;
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
`;

export const MapAlertMessage = styled.p`
  margin: 14px 0 24px;
  color: #6f6658;
  font-size: var(--font-md);
  line-height: 1.6;
`;

export const MapAlertButton = styled.button`
  display: block;
  width: 100%;
  min-height: 44px;
  border: 1px solid #d9aa1f;
  border-radius: 8px;
  background: #d9aa1f;
  color: #2a251c;
  font-size: var(--font-md);
  font-weight: var(--font-bold);
  cursor: pointer;
`;
