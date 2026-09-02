import styled from "styled-components";

// 지역 필터 전체 패널 내용 영역입니다.
export const RegionFilterWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

// 현재 선택 경로를 보여주는 영역입니다.
export const BreadcrumbWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #111111;
  font-size: 18px;
  font-weight: 800;

  button {
    border: 0;
    background: transparent;
    color: #111111;
    font: inherit;
    cursor: pointer;
  }

  span {
    color: #6b7280;
  }
`;

// 지역 버튼들을 여러 열로 배치하는 그리드입니다.
export const RegionGridWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  button {
    height: 40px;
    border: 1px solid transparent;
    border-radius: 4px;
    background: #f3f4f6;
    color: #111111;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
  }

  button.selected {
    border-color: #d2ad23;
    background: #fffaf0;
    color: #d2ad23;
  }
`;

// 로딩과 오류 메시지를 표시하는 문구입니다.
export const RegionMessage = styled.p`
  margin: 0;
  color: ${({ $error }) => ($error ? "#ef4444" : "#6b7280")};
  font-size: 14px;
  font-weight: 700;
`;

// 지역 선택 저장 버튼입니다.
export const RegionSaveButton = styled.button`
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
