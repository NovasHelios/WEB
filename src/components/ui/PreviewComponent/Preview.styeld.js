// styled-components를 사용해 새 미리보기 패널의 기본 틀을 정의합니다.
import styled from "styled-components";

// 지도 오른쪽에 표시되는 새 미리보기 패널입니다.
export const Panel = styled.aside`
  position: fixed;
  top: var(--navbar-height);
  right: 0;
  z-index: 35;
  display: flex;
  flex-direction: column;
  width: 500px;
  /* 전역 80% 배율에서도 패널이 실제 화면 하단까지 채워지도록 보정합니다. */
  height: calc(var(--app-viewport-height) - var(--navbar-height));
  overflow: hidden;
  border-left: 1px solid #e8e3dc;
  background: #ffffff;
  color: #111111;
`;

// 이미지와 탭 콘텐츠가 들어갈 스크롤 영역입니다.
export const PanelBody = styled.div`
  flex: 1;
  min-height: 0;

  /* 탭별 콘텐츠 높이가 달라도 스크롤 영역의 너비를 일정하게 유지합니다. */
  overflow-y: scroll;
  scrollbar-gutter: stable;

  padding: 24px;
`;

// 대표 이미지가 차지하는 고정 크기 영역입니다.
export const ImageArea = styled.div`
  position: relative;
  width: 100%;
  height: 281px;
`;

// 대표 이미지와 이미지 위 버튼을 같은 기준으로 배치하는 영역입니다.
export const ImageBox = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
`;

// 서버에서 받은 대표 이미지입니다.
export const LandImage = styled.img`
  position: relative;
  z-index: 2;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 이미지가 없거나 로드에 실패했을 때 뒤에서 보이는 배경입니다.
export const PlaceholderBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  background: ${({ $color }) => $color || "#f2f2f2"};
`;

// 대표 이미지 우측 상단의 관심 등록 버튼입니다.
export const SaveIconButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.82);
  color: ${({ $active }) => ($active ? "#d8a900" : "#8f8a78")};
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;

// 대표 이미지 우측 하단의 이미지 개수 표시입니다.
export const ImageCounter = styled.span`
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 3;
  padding: 4px 7px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.92);
  color: #111111;
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
  line-height: 1;
`;

// 대표 이미지 아래에 표시되는 썸네일 목록입니다.
export const ThumbnailGrid = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  padding-bottom: 2px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
`;

// 대표 이미지를 변경하는 정사각형 썸네일 버튼입니다.
export const ThumbButton = styled.button`
  position: relative;
  width: 64px;
  height: 64px;
  flex: 0 0 64px;
  padding: 0;
  overflow: hidden;
  border: 2px solid ${({ $active }) => ($active ? "#a27000" : "transparent")};
  border-radius: 7px;
  background: #f2f2f2;
  cursor: pointer;
`;

// 썸네일 버튼 안에 표시되는 실제 이미지입니다.
export const ThumbnailImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 기본 정보 탭의 전체 콘텐츠 영역입니다.
export const BasicInfoContent = styled.section`
  margin: 0;
  padding: 20px;
  color: #1f2937;
`;

// 기본 정보 제목과 기준일을 배치합니다.
export const BasicInfoHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #eeeeee;
`;

// 기본 정보 제목입니다.
export const BasicInfoTitle = styled.h3`
  margin: 0;
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
`;

// 토지 정보의 기준일입니다.
export const ReferenceDate = styled.span`
  color: #a3a3a3;
  font-size: var(--font-xs);
  text-align: right;
`;

// 토지 주소를 강조하는 영역입니다.
export const AddressBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  padding: 14px;
  border: 1px solid #eeeeee;
  border-radius: 10px;
  background: #fafafa;
  color: #a3a3a3;
`;

// 주소 영역의 작은 라벨입니다.
export const AddressLabel = styled.span`
  display: block;
  margin-bottom: 4px;
  color: #b0b0b0;
  font-size: var(--font-xs);
`;

// 실제 주소 값입니다.
export const AddressText = styled.strong`
  display: block;
  color: #333333;
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
`;

// 기본 정보 행들을 감싸는 목록입니다.
export const BasicInfoList = styled.div`
  margin-top: 16px;
`;

// 기본 정보의 한 행입니다.
export const BasicInfoRow = styled.div`
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  align-items: center;
  min-height: 42px;
  border-bottom: 1px solid #eeeeee;
`;

// 기본 정보 항목명입니다.
export const InfoLabel = styled.span`
  color: #777777;
  font-size: var(--font-sm);
`;

// 기본 정보 항목값입니다.
export const InfoValue = styled.strong`
  color: ${({ $price }) => ($price ? "#222222" : "#333333")};
  font-size: ${({ $price }) => ($price ? "16px" : "var(--font-sm)")};
  font-weight: var(--font-normal);
  text-align: right;
`;

// 서버에서 아직 제공하지 않는 값을 붉은색으로 표시합니다.
export const UnsupportedValue = styled.span`
  color: #dc2626;
  font-size: var(--font-xs);
  text-align: right;
`;

// 매매 또는 임대 유형을 표시하는 배지입니다.
export const TransactionBadge = styled.span`
  justify-self: end;
  padding: 3px 10px;
  border: 1px solid #a7f3d0;
  border-radius: 999px;
  background: #ecfdf5;
  color: #059669;
  font-size: var(--font-xs);
`;

// 첨부 서류 영역입니다.
export const AttachmentSection = styled.section`
  margin-top: 14px;
`;

// 첨부 서류 제목입니다.
export const AttachmentTitle = styled.h4`
  margin: 0 0 12px;
  color: #333333;
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
`;

// 첨부 서류 목록입니다.
export const AttachmentList = styled.div`
  display: grid;
  gap: 8px;
`;

// 첨부 서류 한 항목입니다.
export const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding: 8px 12px;
  border: 1px solid #e8e3dc;
  border-radius: 10px;
  background: #ffffff;
`;

// 파일 종류와 파일명을 배치하는 영역입니다.
export const AttachmentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  > span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 1px solid #fecdd3;
    border-radius: 8px;
    color: #fb7185;
    font-size: 10px;
  }

  small {
    display: block;
    margin-top: 2px;
    color: #a3a3a3;
    font-size: 10px;
  }
`;

// 첨부 파일명입니다.
export const AttachmentName = styled.strong`
  display: block;
  color: #444444;
  font-size: var(--font-xs);
  font-weight: var(--font-normal);
`;

// 첨부 파일 다운로드 링크입니다.
export const AttachmentDownload = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: #a3a3a3;
`;

// 세 정보 화면을 감싸는 탭 영역입니다.
export const TabSection = styled.section`
  margin-top: 8px;
  overflow: hidden;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background: #ffffff;
`;

// 세 개의 탭 버튼을 같은 너비로 배치합니다.
export const TabList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-bottom: 1px solid #e5e5e5;
`;

// 각 정보 화면으로 이동하는 탭 버튼입니다.
export const TabButton = styled.button`
  position: relative;
  height: 48px;
  padding: 0 8px;
  border: 0;
  background: #ffffff;
  color: ${({ $active }) => ($active ? "#222222" : "#a3a3a3")};
  font-size: var(--font-sm);
  font-weight: var(--font-normal);
  cursor: pointer;

  /* 현재 선택된 탭 아래에 검은색 선을 표시합니다. */
  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    background: ${({ $active }) =>
      $active ? "#222222" : "transparent"};
    content: "";
  }
`;

// 선택된 탭의 컴포넌트가 표시되는 영역입니다.
export const TabContent = styled.div`
  min-height: 240px;
`;

// 아직 구현하지 않은 탭에 표시하는 안내 문구입니다.
export const TabPreparingMessage = styled.p`
  margin: 0;
  padding: 32px 20px;
  color: #dc2626;
  font-size: var(--font-sm);
  text-align: center;
`;

// 태양광 적합도 탭의 점수 카드와 보고서를 세로로 배치합니다.
export const AnalysisContent = styled.section`
  display: grid;
  gap: 28px;
  padding: 20px;
  color: #1f2937;
`;

// 인허가 적합도 점수를 표시하는 카드입니다.
export const AnalysisCard = styled.section`
  padding: 24px;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
`;

// 인허가 적합도 분석 카드의 제목입니다.
export const AnalysisCardTitle = styled.h3`
  margin: 0 0 20px;
  color: #1f2937;
  font-size: 18px;
  font-weight: var(--font-bold);
`;

// 종합 적합도 이름과 반원형 점수 게이지를 양쪽에 배치합니다.
export const TotalScoreRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

// 종합 적합도 항목명입니다.
export const TotalScoreLabel = styled.span`
  color: #273043;
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
`;

// 종합 적합도를 100점 기준의 반원형 게이지로 표시합니다.
export const ScoreGauge = styled.div`
  position: relative;
  width: 120px;
  height: 64px;

  svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  /* 회색 기본 바와 실제 점수 바의 공통 모양입니다. */
  .gauge-track,
  .gauge-progress {
    fill: none;
    stroke-width: 10;
    stroke-linecap: round;
  }

  /* 데이터 로딩 전부터 보이는 종합 적합도 게이지의 회색 기본 바입니다. */
  .gauge-track {
    stroke: #dedede;
  }

  /* 점수 구간별 색상으로 실제 점수만큼 채워지는 게이지 바입니다. */
  .gauge-progress {
    stroke: ${({ $score }) => {
      if ($score <= 33) return "#ff5757";
      if ($score <= 66) return "#ffd33d";
      return "#5dde88";
    }};
    stroke-dasharray: ${({ $score, $loaded }) =>
      `${$loaded ? $score : 0} 100`};
    transition:
      stroke-dasharray 800ms cubic-bezier(0.22, 1, 0.36, 1),
      stroke 200ms ease;
  }

  @media (prefers-reduced-motion: reduce) {
    .gauge-progress {
      transition: none;
    }
  }
`;

// 반원형 게이지 중앙에 종합 점수를 표시합니다.
export const ScoreGaugeValue = styled.strong`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  color: #111111;
  font-size: 24px;
  font-weight: var(--font-bold);
  line-height: 1;
  text-align: center;

  small {
    margin-left: 2px;
    font-size: 10px;
    font-weight: var(--font-normal);
  }
`;

// 분석 등급 또는 인허가 결격 상태를 표시합니다.
export const AnalysisStatus = styled.p`
  margin: 8px 0 0;
  color: ${({ $disqualified }) => ($disqualified ? "#dc2626" : "#777777")};
  font-size: var(--font-xs);
  text-align: right;
`;

// 종합 점수와 항목별 점수 사이를 구분합니다.
export const ScoreDivider = styled.hr`
  margin: 18px 0;
  border: 0;
  border-top: 1px solid #eeeeee;
`;

// 여섯 개 적합도 평가 항목을 일정한 간격으로 배치합니다.
export const ScoreList = styled.div`
  display: grid;
  gap: 12px;
`;

// 평가 항목명, 점수, 진행 막대를 묶습니다.
export const ScoreItem = styled.div`
  display: grid;
  gap: 7px;
`;

// 평가 항목명과 획득 점수를 양쪽에 배치합니다.
export const ScoreItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #747b8a;
  font-size: var(--font-xs);

  strong {
    color: #273043;
    font-weight: var(--font-medium);
  }
`;

// 항목별 최대 점수를 나타내는 진행 막대 배경입니다.
export const ScoreTrack = styled.div`
  width: 100%;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #eeeeee;
`;

// 항목별 획득 점수의 비율을 진행 막대에 표시합니다.
export const ScoreFill = styled.span`
  display: block;
  width: ${({ $percent, $loaded }) => ($loaded ? `${$percent}%` : "0")};
  height: 100%;
  border-radius: inherit;
  background: #d7b34a;
  transition: width 800ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// AI 분석 보고서 제목과 본문을 묶는 영역입니다.
export const AnalysisReportSection = styled.section`
  display: grid;
  gap: 12px;
`;

// AI 분석 보고서의 제목입니다.
export const AnalysisReportTitle = styled.h3`
  margin: 0;
  color: #222222;
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
`;

// 서버 분석 근거를 표시하는 보고서 상자입니다.
export const AnalysisReportBox = styled.div`
  min-height: 180px;
  padding: 16px;
  border: 1px solid #dcc7aa;
  border-radius: 6px;
  background: #fffdfb;
`;

// 서버에서 받은 분석 근거의 줄바꿈을 유지해 표시합니다.
export const AnalysisReportText = styled.p`
  margin: 0;
  color: #333333;
  font-size: var(--font-xs);
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

// 분석 로딩 또는 결과 없음 상태를 표시합니다.
export const AnalysisStatusMessage = styled.p`
  margin: 0;
  padding: ${({ $compact }) => ($compact ? "28px 8px" : "40px 16px")};
  color: #777777;
  font-size: var(--font-sm);
  text-align: center;
`;

// 분석 조회 오류와 재시도 동작을 함께 표시합니다.
export const AnalysisError = styled.div`
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 40px 16px;
  color: #dc2626;
  font-size: var(--font-sm);
  text-align: center;

  p {
    margin: 0;
  }
`;

// 실패한 분석 API를 다시 요청하는 버튼입니다.
export const AnalysisRetryButton = styled.button`
  min-width: 96px;
  height: 36px;
  padding: 0 16px;
  border: 1px solid #dcc7aa;
  border-radius: 6px;
  background: #ffffff;
  color: #333333;
  font-size: var(--font-xs);
  cursor: pointer;
`;

// 스크롤과 분리되어 패널 하단에 유지되는 버튼 영역입니다.
export const ActionBar = styled.footer`
  flex-shrink: 0;
  display: grid;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e1d2bc;
  background: #ffffff;
`;

// 관심 등록과 채팅에 공통으로 사용하는 버튼입니다.
export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 44px;
  border: 1px solid #dcc7aa;
  border-radius: 7px;
  background: #ffffff;
  color: #222222;
  font-size: var(--font-sm);
  font-weight: var(--font-normal);
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;

// 관심 등록 상태를 함께 표시하는 하단 버튼입니다.
export const WishButton = styled(ActionButton)`
  color: ${({ $active }) => ($active ? "#a27000" : "#222222")};
`;

// 관심 등록 또는 채팅 요청 결과 문구입니다.
export const ActionMessage = styled.p`
  margin: 0;
  color: ${({ $error }) => ($error ? "#dc2626" : "#166534")};
  font-size: var(--font-xs);
  text-align: center;
`;
