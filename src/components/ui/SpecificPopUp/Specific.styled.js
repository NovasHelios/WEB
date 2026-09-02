// styled-components로 상세보기 팝업 스타일을 정의합니다.
import styled from "styled-components";

// 팝업 뒤 전체 화면을 덮고 배경을 블러 처리하는 영역입니다.
export const SpecificBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 40px 32px;
  box-sizing: border-box;
`;

// 실제 상세보기 팝업 박스입니다.
export const Panel = styled.div`
  width: min(1280px, 100%);
  height: min(760px, calc(100vh - 120px));
  background: white;
  border-radius: 16px;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  /* 팝업 박스 전체를 아래로 10px 이동 */
  transform: translateY(20px);
`;

// 팝업 상단 헤더 영역입니다.
export const Header = styled.div`
  padding: 28px 48px 20px;
`;

// 팝업 닫기 버튼입니다.
export const CloseButton = styled.button`
  position: absolute;
  top: 30px;
  right: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 0;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
`;

// 상세보기 제목입니다.
export const Title = styled.h2`
  font-size: 34px;
  line-height: 1.25;
`;

// 토지 태그 목록 영역입니다.
export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

// 토지 상태와 분류를 표시하는 태그입니다.
export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: ${({ $soft }) => ($soft ? "2px 12px" : "5px 10px")};
  border: ${({ $soft }) => ($soft ? "1px solid #ead7a4" : "0")};
  border-radius: ${({ $soft }) => ($soft ? "999px" : "4px")};
  background: ${({ $soft }) => ($soft ? "#fff8de" : "#f1eeee")};
  color: ${({ $soft }) => ($soft ? "#bd9500" : "#4b5563")};
  font-size: 12px;
  font-weight: 600;
`;

// 팝업 본문 스크롤 영역입니다.
export const MainContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 28px 48px 40px;
`;

// 상단 이미지, 정보, 위치 카드 그리드입니다.
export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 1.25fr) minmax(240px, 1fr) 190px;
  gap: 22px;
  align-items: start;
`;

// 사진 영역 컬럼입니다.
export const PhotoColumn = styled.div`
  min-width: 0;
`;

// 대표 이미지 박스입니다.
export const HeroImageBox = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 10px;
  background: #e5e7eb;
`;

// 대표 토지 이미지입니다.
export const HeroImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 이미지가 없을 때 사용하는 임시 이미지 영역입니다.
export const ImagePlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #d9e8f5, #ead9bd 58%, #a7c582);
  color: #ffffff;
`;

// 이미지 개수 표시입니다.
export const ImageCounter = styled.span`
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 4px 8px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.94);
  color: #111111;
  font-size: 12px;
  font-weight: 800;
`;

// 썸네일 목록입니다.
export const ThumbRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 10px;
`;

// 썸네일 버튼입니다.
export const ThumbButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  aspect-ratio: 1.35 / 1;
  border: 2px solid ${({ $active }) => ($active ? "#a27000" : "transparent")};
  border-radius: 7px;
  background: #eadfce;
  color: #8a8174;
  cursor: pointer;
`;

// 썸네일 이미지입니다.
export const ThumbImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 상단 상세 정보 표입니다.
export const MetaTable = styled.div`
  padding-top: 4px;
`;

// 정보 한 줄입니다.
export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: 20px;
  min-height: 52px;
  align-items: center;
  border-bottom: 1px solid #eeeeee;
  color: #6b7280;
  font-size: 14px;

  strong {
    min-width: 0;
    color: #111827;
    font-weight: 500;
    line-height: 1.45;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// 위치 요약 카드입니다.
export const LocationCard = styled.div`
  overflow: hidden;
  border: 1px solid #d8c5b1;
  border-radius: 10px;
  background: #ffffff;
`;

// 지도 미리보기 영역입니다.
export const LocationMap = styled.div`
  height: 140px;
  background: #e7f4ff;
`;

// 위치 카드 하단 제목입니다.
export const LocationTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  color: #111827;
  font-size: 14px;
`;

// 문서 영역입니다.
export const DocumentSection = styled.section`
  margin-top: 28px;
`;

// 섹션 제목입니다.
export const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px;
  color: #111827;
  font-size: 17px;
  font-weight: 600;
`;

// 문서 카드 그리드입니다.
export const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
`;

// 문서 카드입니다.
export const DocumentCard = styled.a`
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 74px;
  padding: 14px 16px;
  border: 1px solid #eeeeee;
  border-radius: 8px;
  background: #ffffff;
  color: inherit;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.04);

  strong {
    display: block;
    color: #111827;
    font-size: 14px;
    font-weight: 600;
  }

  span {
    display: block;
    margin-top: 4px;
    color: #6b7280;
    font-size: 12px;
  }
`;

// 문서 아이콘 박스입니다.
export const DocumentIconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 5px;
  background: #fff1f1;
  color: #ef4444;
`;

// 기본 정보와 분석 카드 그리드입니다.
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 12px;
`;

// 기본 정보와 예상 정보를 세로로 묶는 왼쪽 컬럼입니다.
export const InfoColumn = styled.div`
  display: grid;
  gap: 8px;
`;

// 기본 정보 카드입니다.
export const InfoCard = styled.section`
  padding: 18px;
  border: 1px solid #eeeeee;
  border-radius: 10px;
  background: #ffffff;
`;

// 기본 정보 목록입니다.
export const InfoList = styled.div`
  display: grid;
  gap: 4px;
`;

// 분석 카드입니다.
export const AnalysisCard = styled.section`
  padding: 18px;
  border: 1px solid #eeeeee;
  border-radius: 10px;
  background: #ffffff;
`;

// 종합 점수 배지입니다.
export const ScoreBadge = styled.span`
  margin-left: auto;
  padding: 6px 10px;
  border: 1px solid #86efac;
  border-radius: 6px;
  background: #f0fdf4;
  color: #16a34a;
  font-size: 12px;
  font-weight: 800;
`;

// 분석 항목 목록입니다.
export const AnalysisGrid = styled.div`
  display: grid;
  gap: 14px;
`;

// 분석 항목입니다.
export const AnalysisItem = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding-bottom: 13px;
  color: #6b7280;
  font-size: 13px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 5px;
    border-radius: 999px;
  }

  &::before {
    width: 100%;
    background: #eeeeee;
  }

  &::after {
    width: ${({ $score }) => `${$score || 0}%`};
    background: #d6b326;
  }

  strong {
    color: #111827;
    font-size: 13px;
  }
`;

// 아직 지원하지 않는 기능을 표시하는 붉은 문구입니다.
export const UnsupportedText = styled.strong`
  color: #ef4444;
  font-size: 13px;
  font-weight: 700;
`;

// AI 의견 카드입니다.
export const AiOpinion = styled.section`
  margin-top: 28px;
  padding: 24px;
  border: 1px solid #eeeeee;
  border-radius: 10px;
  background: #ffffff;

  ${SectionTitle} {
    color: #d2a915;
  }

  p {
    margin: 0;
    color: #111827;
    font-size: 15px;
    line-height: 1.75;
    white-space: pre-wrap;
  }
`;
