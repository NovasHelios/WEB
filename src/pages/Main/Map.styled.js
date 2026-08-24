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

// 필터 아이콘만 표시하는 둥근 버튼입니다.
export const FilterToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 98px;
  height: 44px;
  border: 2px solid #111111;
  border-radius: 999px;
  background: #ffffff;
  padding: 0;
  cursor: pointer;

  img {
    width: 29px;
    height: 30px;
    object-fit: contain;
    display: block;
  }
`;

// 필터 옵션 전체를 감싸는 패널입니다.
export const FilterPanel = styled.div`
  width: 500px;
  margin-top: 10px;
  padding: 28px 16px 22px;
  border: 2px solid #111111;
  border-radius: 8px;
  background: #ffffff;
`;

// 매매/임대/사업희망 탭 영역입니다.
export const FilterTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 48px;
  border: 1.5px solid #111111;
  border-radius: 8px;
  overflow: hidden;
`;

// 필터 탭 버튼입니다.
export const FilterTab = styled.button`
  border: 0;
  border-right: 4px solid #777777;
  background: #ffffff;
  color: #111111;
  font-size: 20px;
  font-weight: 800;
  cursor: pointer;

  &:last-child {
    border-right: 0;
  }
`;

// 슬라이더 한 줄을 감싸는 영역입니다.
export const FilterRangeGroup = styled.div`
  margin-top: 26px;
`;

// 금색 슬라이더 라인입니다.
export const FilterRangeLine = styled.div`
  position: relative;
  height: 7px;
  margin: 0 28px;
  background: #d1aa22;
`;

// 슬라이더 양쪽 원형 핸들입니다.
export const FilterRangeHandle = styled.span`
  position: absolute;
  top: 50%;
  ${({ $side }) => ($side === "left" ? "left: 0;" : "right: 0;")}
  width: 24px;
  height: 24px;
  border: 3px solid #555555;
  border-radius: 50%;
  background: #ffffff;
  transform: translateY(-50%);
`;

// 슬라이더 아래 눈금 라벨 영역입니다.
export const FilterRangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  color: #111111;
  font-size: 17px;
  font-weight: 800;
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
