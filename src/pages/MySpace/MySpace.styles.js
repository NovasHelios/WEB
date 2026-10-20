import styled from "styled-components";
import { listPageShell, listPageTitle, listPageDescription } from "@/styles/listPage";

export const SpaceWrapper = styled.div`
  /* 전역 80% 배율에서도 화면 가로를 가득 채우도록 보정합니다. */
  width: 100%;
  /* 전역 80% 배율에서도 페이지 배경이 실제 화면 하단까지 이어지게 합니다. */
  min-height: var(--app-viewport-height);
  background: var(--color-list-page-bg);
  overflow: hidden;
`;

export const SpaceMain = styled.main`
  /* 다른 목록 화면과 같은 문서 스크롤을 사용해 별도 우측 여백을 없앱니다. */
  min-height: calc(var(--app-viewport-height) - var(--navbar-height));
`;

export const SpacePage = styled.div`
  min-height: 100%;
  background: var(--color-list-page-bg);
`;

export const SpaceInner = styled.div`
  ${listPageShell}
`;

export const SpaceHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
`;

export const SpaceTitle = styled.h1`
  ${listPageTitle}
`;

export const SpaceTopNote = styled.p`
  ${listPageDescription}
`;

export const SpaceTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const SpaceStatText = styled.p`
  margin: 0;
  font-size: var(--font-md);
  line-height: 1.5;
  color: #2f2a23;

  strong {
    color: #8a6a00;
    font-weight: var(--font-bold);
  }
`;

export const SpaceTopAction = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  padding: 0 16px;
  border: 0;
  border-radius: 4px;
  background: #d9aa1f;
  color: #1f1c17;
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
  cursor: pointer;
`;

export const SpaceToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  /* 분리선과 정렬 도구 사이에 여백을 확보합니다. */
  margin: 1.5rem 0 1rem;
  flex-wrap: wrap;
`;

export const SpaceFilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const SpaceSortBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

export const SpaceFilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 34px;
  padding: 0 14px;
  border-radius: 9px;
  border: 1px solid ${(props) => (props.$active ? "#8e6b00" : "#d8c5a2")};
  background: ${(props) => (props.$active ? "#8e6b00" : "var(--color-surface)")};
  color: ${(props) => (props.$active ? "#fff" : "#5d5445")};
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
  cursor: pointer;
`;

export const SpaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 내 토지 목록 아래에 페이지 이동 컨트롤을 가운데 배치합니다.
export const SpacePagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 28px 0 8px;
`;

// 현재 페이지와 이전·다음 이동을 같은 버튼 규격으로 표시합니다.
export const SpacePageButton = styled.button`
  display: inline-flex;
  min-width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  border: 1px solid ${({ $active }) => ($active ? "#9a7400" : "#d8c5a2")};
  border-radius: 6px;
  background: ${({ $active }) => ($active ? "#9a7400" : "var(--color-surface)")};
  color: ${({ $active }) => ($active ? "#fff" : "#5d5445")};
  font: inherit;
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;

  &:disabled { color: #aaa49a; cursor: not-allowed; }
  &:focus-visible { outline: 2px solid #8a6800; outline-offset: 2px; }
`;

export const SpaceCard = styled.article`
  border: 1px solid #eadfc8;
  border-radius: 12px;
  background: var(--color-surface);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
  overflow: hidden;
`;

export const SpaceCardRow = styled.div`
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 170px;
  gap: 16px;
  padding: 16px;
  align-items: stretch;

  @media (max-width: 1100px) {
    grid-template-columns: 220px minmax(0, 1fr);
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const SpaceCardImage = styled.div`
  min-height: 206px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, ${(props) => props.$accent?.[0] || "#d8e6c8"}, ${(props) => props.$accent?.[1] || "#84b57f"});
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3);

  span {
    position: absolute;
    left: 14px;
    bottom: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 42px;
    height: 26px;
    padding: 0 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.82);
    color: #6c5d31;
    font-size: var(--font-xs);
    font-weight: var(--font-bold);
  }
`;

export const SpaceCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;

  h3 {
    margin: 0;
    font-size: var(--font-lg);
    line-height: 1.4;
    font-weight: var(--font-bold);
    color: #2a261f;
  }
`;

export const SpaceBadgeRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

export const SpaceBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 10px;
  border: 1px solid #d7cab0;
  border-radius: 4px;
  background: #f8f3ea;
  color: #7d725f;
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
`;

export const SpaceCardMeta = styled.div`
  display: grid;
  /* 값 길이에 맞춰 칸 전체가 줄바꿈되도록 왼쪽에 묶습니다. */
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 12px 24px;
  padding-top: 12px;
  border-top: 1px solid #efe4cf;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const SpaceCardMetaItem = styled.div`
  min-width: min(100%, 13rem);
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SpaceCardMetaLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: var(--font-xs);
  font-weight: var(--font-bold);
  color: #7b7365;
`;

export const SpaceCardMetaValue = styled.div`
  font-size: ${(props) => (props.$highlight ? "var(--font-lg)" : "var(--font-md)")};
  font-weight: var(--font-bold);
  color: ${(props) => (props.$highlight ? "#9a7400" : "#2a251c")};
  overflow-wrap: anywhere;
`;

export const SpaceInfoRow = styled.div`
  /* 거래 정보는 같은 폭의 왼쪽 정렬 칸으로 배치합니다. */
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  padding-top: 8px;

  > div {
    min-width: min(100%, 13rem);
    max-width: 100%;
    text-align: left;
  }

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(110px, 1fr));
  }
`;

export const SpaceCardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  color: #6a6458;
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
`;

export const SpaceActionColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 8px;

  @media (max-width: 1100px) {
    grid-column: 1 / -1;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
  }
`;

export const SpaceActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 130px;
  height: 36px;
  border: 1px solid ${(props) => (props.$danger ? "#d5bfa0" : props.$secondary ? "#d5bfa0" : "#a87a00")};
  border-radius: 2px;
  background: ${(props) => (props.$danger ? "#f7f2e9" : props.$secondary ? "#fffaf1" : "#fffdf5")};
  color: ${(props) => (props.$danger ? "#8f7a58" : "#8a6800")};
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
  cursor: pointer;
`;

export const SpaceModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.38);
  box-sizing: border-box;
`;

// 토지 삭제 확인을 브라우저 기본 confirm 대신 서비스 모달로 표시합니다.
export const SpaceDeleteOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 120;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(31, 28, 23, 0.48);
  box-sizing: border-box;
`;

export const SpaceDeleteDialog = styled.section`
  width: min(100%, 26rem);
  padding: clamp(1.5rem, 5vw, 2rem);
  border: 1px solid #e6dcc8;
  border-radius: 1.125rem;
  background: #fffdf8;
  color: #2c2925;
  box-shadow: 0 24px 70px rgba(37, 29, 14, 0.24);
  text-align: center;

  h2 { margin: 0; font-size: var(--font-xl); font-weight: var(--font-bold); }
  p { margin: 0.75rem 0 0; color: #756d61; font-size: var(--font-sm); line-height: 1.65; }
`;

export const SpaceDeleteIcon = styled.div`
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: #f7efdc;
  color: #9a7200;
`;

export const SpaceDeleteActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  > button { min-width: 7rem; }
`;

export const SpaceModal = styled.form`
  width: min(100%, 520px);
  border: 1px solid #d9aa1f;
  border-radius: 8px;
  background: #fffdf8;
  padding: 16px;
  box-sizing: border-box;
  box-shadow: 0 18px 44px rgba(56, 43, 20, 0.18);
`;

export const SpaceModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: var(--font-xl);
    font-weight: var(--font-bold);
    color: #1f1c17;
  }
`;

export const SpaceModalImage = styled.div`
  width: 100%;
  height: 150px;
  border: 1px solid #d8c5a2;
  border-radius: 6px;
  background: #f7f2e9;
  background-image: ${({ $image }) => ($image ? `url(${$image})` : "none")};
  background-size: cover;
  background-position: center;
`;

export const SpaceModalFileButton = styled.button`
  width: fit-content;
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid #d8c5a2;
  border-radius: 4px;
  background: #fffaf1;
  color: #8a6800;
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
  cursor: pointer;
`;

export const SpaceModalFileInput = styled.input`
  display: none;
`;

export const SpaceModalClose = styled.button`
  width: 34px;
  height: 34px;
  border: 1px solid #d8c5a2;
  border-radius: 4px;
  background: #fffaf1;
  color: #5d5445;
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  cursor: pointer;
`;

export const SpaceModalField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  color: #5d5445;
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
`;

export const SpaceModalInput = styled.input`
  width: 100%;
  height: 42px;
  border: 0;
  border-bottom: 2px solid #2f2a23;
  background: transparent;
  color: #1f1c17;
  font-size: var(--font-md);
  outline: none;

  /* 읽기 전용 주소 입력을 수정 가능한 입력과 시각적으로 구분합니다. */
  &:read-only {
    padding: 0 8px;
    border-bottom-color: #c8c1b6;
    border-radius: 4px;
    background: #f3f1ed;
    color: #777168;
    cursor: not-allowed;
  }
`;

// 읽기 전용 주소의 수정 제한 안내 문구를 표시합니다.
export const SpaceModalReadonlyNote = styled.p`
  margin: 0;
  color: #8a8175;
  font-size: var(--font-xs);
  font-weight: var(--font-regular);
`;

export const SpaceModalSelect = styled.select`
  width: 100%;
  height: 42px;
  border: 1px solid #d8c5a2;
  border-radius: 4px;
  background: #fff;
  color: #1f1c17;
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
  padding: 0 12px;
  outline: none;
`;

export const SpaceModalTextarea = styled.textarea`
  width: 100%;
  min-height: 96px;
  resize: vertical;
  border: 1px solid #d8c5a2;
  border-radius: 4px;
  background: #fff;
  color: #1f1c17;
  font-size: var(--font-sm);
  line-height: 1.5;
  padding: 12px;
  outline: none;
  box-sizing: border-box;
`;

export const SpaceModalError = styled.p`
  margin: 4px 0 14px;
  color: #b42318;
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
`;

export const SpaceModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
`;

// 토지 수정 모달보다 위에서 이미지 관리 창을 중앙에 표시합니다.
export const SpaceImageManagerOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.42);
  box-sizing: border-box;
`;

// 등록 이미지 목록과 임시 재업로드 명령을 담는 팝업 본문입니다.
export const SpaceImageManagerDialog = styled.div`
  width: min(100%, 800px);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  padding: 28px;
  border: 1px solid #d8c5a2;
  border-radius: 14px;
  background: #fffdf9;
  box-sizing: border-box;
  box-shadow: 0 20px 48px rgba(38, 29, 16, 0.28);

  @media (max-width: 600px) {
    padding: 20px 16px;
  }
`;

// 이미지 관리 제목과 닫기 버튼을 한 줄에 배치합니다.
export const SpaceImageManagerHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  h2 {
    margin: 0;
    color: #231f1a;
    font-size: 1.375rem;
    line-height: 1.3;
  }
`;

// 이미지 관리 기능의 현재 동작 범위를 설명합니다.
export const SpaceImageManagerDescription = styled.p`
  margin: 6px 0 0;
  color: #8a8175;
  font-size: var(--font-xs);
  font-weight: var(--font-regular);
`;

// 이미지 관리 팝업을 닫는 기호 버튼입니다.
export const SpaceImageManagerClose = styled.button`
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: #37312a;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;

  &:focus-visible { outline: 2px solid #9d7412; outline-offset: 2px; }
`;

// 등록 이미지가 많아질 때 가로 스크롤되는 고정 높이 목록입니다.
export const SpaceImageManagerList = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  padding: 0 0 14px;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-color: #bd873e #e8e4dc;
  scrollbar-width: thin;

  &::-webkit-scrollbar { height: 7px; }
  &::-webkit-scrollbar-track { border-radius: 999px; background: #e8e4dc; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: #bd873e; }
`;

// 각 등록 이미지를 동일한 크기로 잘라 보여주는 썸네일입니다.
export const SpaceImageManagerThumbnail = styled.figure`
  width: 148px;
  height: 142px;
  flex: 0 0 148px;
  overflow: hidden;
  margin: 0;
  border-radius: 8px;
  background: #858585;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// 등록 이미지가 없는 경우 목록 대신 안내 문구를 표시합니다.
export const SpaceImageManagerEmpty = styled.p`
  display: grid;
  min-height: 142px;
  margin: 20px 0 14px;
  place-items: center;
  border-radius: 8px;
  background: #f2eee7;
  color: #82796e;
  font-size: var(--font-sm);
`;

// API 연결 전까지 시각적으로만 제공하는 이미지 재업로드 영역입니다.
export const SpaceImageManagerUpload = styled.button`
  display: flex;
  width: 100%;
  min-height: 96px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  margin-top: 2px;
  border: 1px dashed #d8c5a2;
  border-radius: 10px;
  background: #fcfaf6;
  color: #9a6b21;
  font: inherit;
  font-weight: var(--font-bold);
  cursor: default;
`;

// 이미지 관리 팝업의 취소와 임시 저장 버튼을 오른쪽에 배치합니다.
export const SpaceImageManagerActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
`;

// 이미지 관리 팝업의 하단 명령 버튼입니다.
export const SpaceImageManagerButton = styled.button`
  min-width: 96px;
  min-height: 40px;
  padding: 8px 16px;
  border: 1px solid ${({ $primary }) => ($primary ? "#bd873e" : "#ded5c8")};
  border-radius: 7px;
  background: ${({ $primary }) => ($primary ? "#bd873e" : "#fffdf9")};
  color: ${({ $primary }) => ($primary ? "#ffffff" : "#403a32")};
  font: inherit;
  font-weight: var(--font-medium);
  cursor: pointer;

  &:focus-visible { outline: 2px solid #8e641f; outline-offset: 2px; }
`;
