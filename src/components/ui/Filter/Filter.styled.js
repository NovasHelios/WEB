// styled-components를 가져옵니다.
import styled from "styled-components";

// 필터 버튼과 드롭다운 패널을 감싸는 영역입니다.
export const FilterWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 지도 위에 표시되는 필터 버튼입니다.
export const FilterButton = styled.button`
  height: 42px;
  padding: 0 12px 0 16px;
  border: 2px solid #111111;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#111111" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#111111")};
  font-size: 18px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
`;

// 필터 버튼 하나와 해당 드롭다운 패널을 함께 감싸는 기준 영역입니다.
export const FilterItem = styled.div`
  position: relative;
  display: inline-flex;
`;

// 필터 버튼 아래에 열리는 드롭다운 패널입니다.
export const DropdownPanel = styled.div`
  position: absolute;
  top: 52px;
  left: 0;
  width: ${({ $width }) => $width || "452px"};
  padding: 10px;
  border: 2px solid #111111;
  border-radius: 8px;
  background: #ffffff;
  z-index: 40;
`;

// 드롭다운 제목과 닫기 버튼을 배치하는 영역입니다.
export const DropdownHeader = styled.div`
  position: relative;
  height: 34px;
  color: #111111;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
`;

// 드롭다운을 닫는 버튼입니다.
export const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 3px;
  background: #111111;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

// 거래 유형 버튼 그룹입니다.
export const SegmentedControl = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 50px;
  margin-bottom: 16px;
  border: 1.5px solid #111111;
  border-radius: 8px;
  overflow: hidden;
`;

// 거래 유형 선택 버튼입니다.
export const SegmentButton = styled.button`
  border: 0;
  border-right: 1.5px solid #111111;
  background: ${({ $active }) => ($active ? "#f7edd0" : "#ffffff")};
  color: #111111;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;

  &:last-child {
    border-right: 0;
  }
`;

// 적용 또는 저장 버튼입니다.
export const ApplyButton = styled.button`
  width: 100%;
  height: 44px;
  border: 0;
  border-radius: 5px;
  background: #d2ad23;
  color: #111111;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
`;

// 범위 필터 한 묶음입니다.
export const RangeBlock = styled.div`
  margin-bottom: 26px;
`;

// 범위 필터 제목 줄입니다.
export const RangeTitleRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  color: #111111;
  font-size: 16px;
  font-weight: 600;

  button {
    border: 0;
    background: transparent;
    color: #111111;
    cursor: pointer;
  }
`;

// 현재 선택된 범위 표시 텍스트입니다.
export const RangeValueText = styled.span`
  color: #d2ad23;
  font-size: 15px;
  font-weight: 600;
`;

// range input 두 개를 겹쳐 배치하는 영역입니다.
export const RangeTrack = styled.div`
  position: relative;
  height: 24px;

  // 전체 슬라이더 회색 바입니다.
  &::before {
    content: "";
    position: absolute;
    left: 46px;
    right: 26px;
    top: 9px;
    height: 5px;
    background: #cfcfcf;
  }

  // 선택된 범위를 표현하는 금색 바입니다.
  &::after {
    content: "";
    position: absolute;
    left: 46px;
    right: 26px;
    top: 9px;
    height: 5px;
    background: #d2ad23;
  }
`;

// 범위 선택 input입니다.
export const RangeInput = styled.input`
  position: absolute;
  left: 46px;
  right: 26px;
  width: calc(100% - 72px);
  height: 24px;
  margin: 0;
  background: transparent;
  appearance: none;

  // input 전체가 클릭을 먹지 않게 해서 반대편 핸들이 움직이는 문제를 막습니다.
  pointer-events: none;

  // 최소 핸들과 최대 핸들의 클릭 우선순위를 분리합니다.
  z-index: ${({ $isMin }) => ($isMin ? 3 : 2)};

  &::-webkit-slider-runnable-track {
    height: 5px;
    background: transparent;
  }

  &::-webkit-slider-thumb {
    width: 18px;
    height: 18px;
    margin-top: -7px;
    border: 2px solid #555555;
    border-radius: 50%;
    background: #ffffff;
    appearance: none;
    cursor: pointer;

    // 실제 원형 핸들만 드래그 가능하게 만듭니다.
    pointer-events: auto;
  }
`;

// 범위 눈금 라벨 영역입니다.
export const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  color: #111111;
  font-size: 16px;
  font-weight: 600;
`;

// 하단 버튼을 배치하는 영역입니다.
export const ActionRow = styled.div`
  display: grid;

  // 버튼이 하나일 때는 중앙에 고정 폭으로 배치하고, 두 개일 때는 2열로 배치합니다.
  grid-template-columns: ${({ $center }) => ($center ? "260px" : "1fr 1fr")};

  // 중앙 배치 옵션이 켜진 경우 버튼 영역을 가운데로 보냅니다.
  justify-content: ${({ $center }) => ($center ? "center" : "stretch")};

  gap: 10px;
`;

// 직접 입력 input 두 개를 배치하는 영역입니다.
export const DirectInputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

// 직접 입력 input입니다.
export const DirectInputBox = styled.input`
  height: 48px;
  padding: 0 12px;
  border: 1px solid #dddddd;
  border-radius: 8px;
  color: #111111;
  font-size: 16px;
  font-weight: 600;

  // Chrome, Safari, Edge에서 number input 스피너를 제거합니다.
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    margin: 0;
    appearance: none;
  }

  // Firefox에서 number input 스피너를 제거합니다.
  &[type="number"] {
    appearance: textfield;
  }
`;

// 지역 선택 경로 텍스트입니다.
export const RegionPath = styled.div`
  margin-bottom: 12px;
  color: #111111;
  font-size: 16px;
  font-weight: 700;

  span {
    color: #6b7280;
    margin: 0 4px;
  }
`;

// 지역 버튼 목록입니다.
export const RegionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px 10px;
  margin-bottom: 18px;
`;

// 지역 선택 버튼입니다.
export const RegionButton = styled.button`
  height: 40px;
  border: ${({ $active }) => ($active ? "1px solid #d2ad23" : "0")};
  border-radius: 4px;
  background: ${({ $active }) => ($active ? "#fffaf0" : "#f3f4f6")};
  color: ${({ $active }) => ($active ? "#d2ad23" : "#111111")};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

// 직접 입력 팝업 뒤쪽을 어둡게 덮는 배경입니다.
export const DirectInputBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 직접 입력 팝업 박스입니다.
export const DirectInputModal = styled.div`
  width: 760px;
  padding: 10px 20px 20px;
  border-radius: 8px;
  background: #ffffff;
`;

// 직접 입력 팝업 상단 제목 영역입니다.
export const DirectInputHeader = styled.div`
  position: relative;
  height: 34px;
  color: #111111;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
`;

// 직접 입력 팝업 제목입니다.
export const DirectInputTitle = styled.span`
  line-height: 28px;
`;

// 직접 입력 input들을 가로로 배치하는 영역입니다.
export const DirectInputFields = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 18px;
  margin: 10px 0 28px;
`;

// 직접 입력 숫자 input과 단위 텍스트를 묶는 영역입니다.
export const DirectInputGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;

  input {
    padding-right: 54px;
  }
`;

// 직접 입력 단위 텍스트입니다.
export const DirectInputUnit = styled.span`
  position: absolute;
  top: 15px;
  right: 18px;
  color: #111111;
  font-size: 15px;
  font-weight: 700;
`;

// 직접 입력값 아래 읽기용 금액 문구입니다.
export const DirectInputHint = styled.span`
  min-height: 20px;
  color: #6b7280;
  font-size: 15px;
  font-weight: 500;
`;

// 직접 입력 에러 메시지입니다.
export const DirectInputError = styled.p`
  margin: -12px 0 18px;
  color: #ff3030;
  font-size: 15px;
  font-weight: 700;
`;
