import styled from "styled-components";

// 지도 위에 뜨는 특정 토지 상세 패널
// 검색창보다 조금 아래에 위치시키고, 검색 결과 리스트보다는 낮은 z-index로 둠
export const Panel = styled.aside`
  position: absolute;
  top: 96px;
  left: 180px;
  z-index: 15;
  width: 520px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  background: #ffffff;
  border: 2px solid #ffab03;
  border-radius: 4px;
  padding: 28px;
  color: #06264a;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.16);
`;

// 상세 패널 닫기 버튼
export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 18px;
  border: 0;
  background: transparent;
  font-size: 30px;
  line-height: 1;
  cursor: pointer;
`;

// 서버에서 받은 토지 이미지 표시 영역
export const LandImage = styled.img`
  width: 100%;
  height: 286px;
  object-fit: cover;
  border-radius: 3px;
  display: block;
`;

// 이미지가 없을 때 임시로 보여줄 빈 영역
export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 286px;
  border-radius: 3px;
  background: #e5e7eb;
`;

// 상세 정보 한 구역
export const Section = styled.div`
  padding: 26px 0;
  border-bottom: 1px solid #d7dde5;
`;

// ADDRESS, PRICE 같은 라벨 텍스트
export const Label = styled.p`
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 800;
  color: #555b66;
  letter-spacing: 0.04em;
`;

// 실제 상세 값 텍스트
export const Value = styled.p`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #06264a;
`;

// 가격/면적/지목 같은 정보를 2열로 배치
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
`;

// 설명 문단
export const Description = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.8;
  color: #1f2937;
`;

// 하단 액션 버튼 영역
export const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 124px;
  gap: 14px;
  padding-top: 22px;

  button {
    height: 54px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
  }
`;

// 담당자 문의 버튼
export const ContactButton = styled.button`
  border: 0;
  background: #06264a;
  color: #ffffff;
`;

// 관심등록 버튼
export const BookmarkButton = styled.button`
  border: 1px solid #06264a;
  background: #ffffff;
  color: #06264a;
`;
