// styled-components를 사용해 새 미리보기 패널의 기본 틀을 정의합니다.
import styled from "styled-components";

// 지도 오른쪽에 표시되는 새 미리보기 패널입니다.
export const Panel = styled.aside`
  position: fixed;
  top: 72px;
  right: 0;
  z-index: 35;
  display: flex;
  flex-direction: column;
  width: 500px;
  height: calc(100vh - 72px);
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
