// styled-components를 사용해 상세 패널 스타일을 정의합니다.
import styled from "styled-components";

// 마커 클릭 시 오른쪽에 표시되는 상세 패널입니다.
export const Panel = styled.aside`
  position: fixed;
  top: 72px;
  right: 0;
  z-index: 35;
  display: flex;
  flex-direction: column;
  width: 322px;
  height: calc(100vh - 72px);
  background: #ffffff;
  border-left: 1px solid #e1d2bc;
  color: #111111;
  overflow: hidden;
`;

// 상세 패널 상단 헤더입니다.
export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0;
`;

// 작은 섹션 라벨입니다.
export const SectionLabel = styled.p`
  margin: 0;
  color: #a27000;
  font-size: 12px;
  font-weight: 700;
`;

// 패널 닫기 버튼입니다.
export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  color: #3b3328;
  cursor: pointer;
`;

// 상세 패널 제목입니다.
export const DetailTitle = styled.h2`
  margin: 6px 24px 18px;
  color: #111111;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.35;
`;

// 스크롤되는 본문 영역입니다.
export const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 24px 24px 28px;
`;

// 대표 토지 이미지입니다.
export const LandImage = styled.img`
  width: 100%;
  height: 192px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
`;

// 이미지가 없을 때 사용하는 임시 이미지 영역입니다.
export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 192px;
  border-radius: 8px;
  background: linear-gradient(135deg, #b8d2e6, #d8c09b 65%, #8fb57a);
`;

// 대표 이미지 영역을 감싸는 컨테이너(절대 위치 요소들이 내부에 들어감)
export const ImageArea = styled.div`
  position: relative;
  width: 100%;
  height: 192px;
`;

// placeholder를 이미지 뒤에 배치할 때 사용합니다.
export const PlaceholderBackground = styled(ImagePlaceholder)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

// 이미지 위 관심 버튼입니다.
export const SaveIconButton = styled.button`
  position: absolute;
  top: 116px;
  right: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.75);
  color: ${({ $active }) => ($active ? "#d8a900" : "#8f8a78")};
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;

// 이미지 개수 표시입니다.
export const ImageCounter = styled.span`
  position: absolute;
  top: 277px;
  right: 28px;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.92);
  color: #111111;
  font-size: 11px;
  font-weight: 700;
`;

// 썸네일 목록입니다.
export const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 9px;
  margin-top: 10px;
`;

// 썸네일 버튼입니다.
export const ThumbButton = styled.button`
  height: 64px;
  border: 1.5px solid ${({ $active }) => ($active ? "#a27000" : "transparent")};
  border-radius: 7px;
  background: #eadccb;
  color: #333333;
  overflow: hidden;
  cursor: pointer;
`;

// 임시 썸네일 이미지입니다.
export const ThumbnailImage = styled.div`
  width: 100%;
  height: 100%;
`;

// 기본 정보 카드입니다.
export const InfoCard = styled.section`
  margin-top: 24px;
  padding: 16px;
  border: 1px solid #d9b98f;
  border-radius: 8px;
  background: #fffaf6;
`;

// 카드 제목입니다.
export const InfoTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  color: #5f4100;
  font-size: 14px;
  font-weight: 500;
`;

// 기본 정보 한 줄입니다.
export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid #ead8c3;
  color: #6b5b49;
  font-size: 13px;

  &:first-of-type {
    border-top: 0;
  }

  strong {
    color: #111111;
    font-weight: 500;
    text-align: right;
  }
`;

// 매매가 강조 텍스트입니다.
export const PriceValue = styled.strong`
  color: #8a5a00 !important;
  font-size: 22px;
  font-weight: 800 !important;
`;

// AI 분석 카드입니다.
export const AiCard = styled.section`
  margin-top: 24px;
  padding: 16px;
  border: 1px solid #d9b56f;
  border-radius: 8px;
  background: #ffe7ad;
`;

// BETA 배지입니다.
export const BetaBadge = styled.span`
  margin-left: auto;
  padding: 3px 8px;
  border-radius: 999px;
  background: #8a5a00;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
`;

// AI 수치 카드 그리드입니다.
export const AiGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`;

// AI 수치 카드입니다.
export const AiMetric = styled.div`
  min-height: 74px;
  padding: 13px 10px;
  border: 1px solid #ead8c3;
  border-radius: 7px;
  background: #fffaf6;

  span {
    display: block;
    color: #6b5b49;
    font-size: 11px;
    font-weight: 500;
  }

  strong {
    display: block;
    margin-top: 8px;
    color: #8a5a00;
    font-size: 21px;
    font-weight: 800;
  }
`;

// 하단 고정 액션 버튼 영역입니다.
export const ActionBar = styled.div`
  flex-shrink: 0;
  display: grid;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #d9b98f;
  background: #ffffff;

  p {
    margin: 0;
    color: #c2410c;
    font-size: 12px;
    font-weight: 700;
  }
`;

// 관심 등록 버튼입니다.
export const BookmarkButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  border: 1px solid #d9b98f;
  border-radius: 7px;
  background: ${({ $active }) => ($active ? "#fff8dd" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#8a5a00" : "#111111")};
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;

// 상세 보기와 채팅 버튼입니다.
export const ContactButton = styled.button`
  height: 44px;
  border: 1px solid #d9b98f;
  border-radius: 7px;
  background: #ffffff;
  color: #111111;
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;
