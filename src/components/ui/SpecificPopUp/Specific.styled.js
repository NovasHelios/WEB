// styled-components로 상세보기 팝업 스타일을 정의합니다.
import styled from "styled-components";

// 팝업 뒤 전체 화면을 덮고 배경을 블러 처리하는 영역입니다.
export const SpecificBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  background: rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(8px);
`;

// 실제 상세보기 팝업 박스입니다.
export const SpecificPanel = styled.section`
  width: min(1200px, calc(100vw - 72px));
  max-height: calc(100vh - 56px);
  overflow: hidden;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.28);
`;

// 팝업 상단 헤더 영역입니다.
export const SpecificHeader = styled.header`
  position: relative;
  padding: 34px 40px 24px;
  border-bottom: 1px solid #eeeeee;
`;

// 상세보기 제목입니다.
export const SpecificTitle = styled.h2`
  margin: 12px 0 12px;
  color: #111827;
  font-size: 32px;
  font-weight: 500;
  line-height: 1.25;
`;

// 토지 태그 목록 영역입니다.
export const SpecificTagRow = styled.div`
  display: flex;
  gap: 8px;
`;

// 토지 태그입니다.
export const SpecificTag = styled.span`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 4px;
  background: #f1eeee;
  color: #4b5563;
  font-size: 13px;
  font-weight: 500;
`;

// 팝업 닫기 버튼입니다.
export const SpecificCloseButton = styled.button`
  position: absolute;
  top: 32px;
  right: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
`;

// 팝업 본문 스크롤 영역입니다.
export const SpecificBody = styled.div`
  max-height: calc(100vh - 210px);
  overflow-y: auto;
  padding: 24px 40px 40px;
`;

// 본문 섹션 공통 영역입니다.
export const SpecificSection = styled.section`
  margin-top: 24px;

  &:first-child {
    margin-top: 0;
  }
`;

// 섹션 제목입니다.
export const SpecificSectionTitle = styled.h3`
  margin: 0 0 14px;
  color: #111827;
  font-size: 18px;
  font-weight: 600;
`;

// 아직 구현하지 않은 영역을 표시하는 임시 박스입니다.
export const SpecificPlaceholderBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  background: #fafafa;
  color: #9ca3af;
  font-size: 14px;
`;
