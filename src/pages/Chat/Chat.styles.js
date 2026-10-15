import styled from "styled-components";

// 채팅 페이지 전체 레이아웃입니다.
export const ChatPage = styled.div`
  /* 전역 화면 배율에서도 채팅 영역이 세로로 잘리지 않도록 보정합니다. */
  min-height: var(--app-viewport-height);
  background: var(--color-page-bg);
  color: #1f1f1f;
`;

// 채팅 본문 3단 영역입니다.
export const ChatShell = styled.main`
  display: flex;
  /* 네비게이션 아래 채팅 3단 영역이 화면 끝까지 이어지게 합니다. */
  height: calc(var(--app-viewport-height) - var(--navbar-height));
  min-height: 0;
  overflow: hidden;
  /* 좁은 화면에서는 패널을 숨기지 않고 세로로 배치합니다. */
  @media (max-width: 60rem) {
    flex-direction: column;
    height: auto;
    overflow: visible;
  }
`;

// 채팅방 목록 패널입니다.
export const ChatSidebar = styled.aside`
  width: clamp(14rem, 22vw, 25rem);
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex-shrink: 0;
  border-right: 1px solid #e4d9c7;
  background: var(--color-surface-soft);
  overflow: hidden;
  @media (max-width: 60rem) {
    width: 100%;
    max-height: 22rem;
    border-right: 0;
    border-bottom: 1px solid #e4d9c7;
  }
`;

// 채팅방 목록 상단입니다.
export const ChatListHeader = styled.div`
  padding: 16px;

  h1 {
    margin: 0 0 16px;
    /* 채팅 패널 제목은 전체 페이지 제목보다 작은 전용 규격을 사용합니다. */
    font-size: var(--font-xl);
    font-weight: var(--font-bold);
    line-height: 1.3;
    letter-spacing: normal;
  }
`;

// 채팅방 검색창입니다.
export const ChatSearch = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 42px;
  border: 1px solid #4a4034;
  background: #ffffff;
  padding: 0 12px;

  input {
    width: 100%;
    border: 0;
    outline: 0;
    color: #2b2b2b;
    font-size: var(--font-sm);
    background: transparent;
  }
`;

// 채팅방 목록입니다.
export const ChatRoomList = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

// 채팅방 목록 아이템입니다.
export const ChatRoomItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  min-height: 100px;
  border: 0;
  border-left: 4px solid ${({ $active }) => ($active ? "#d6a81b" : "transparent")};
  border-bottom: 1px solid #eee7da;
  background: ${({ $active }) => ($active ? "#f2ede3" : "transparent")};
  padding: 16px;
  text-align: left;
  cursor: pointer;

  strong {
    color: #1f1f1f;
    font-size: var(--font-md);
    font-weight: var(--font-bold);
  }

  span {
    color: #5f5a52;
    font-size: var(--font-sm);
  }

  small {
    color: #8a8174;
    font-size: var(--font-xs);
  }
`;

// 비어 있는 상태 문구입니다.
export const ChatEmpty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 240px;
  color: #111111;
  font-size: var(--font-xl);
  font-weight: var(--font-medium);
`;

// 중앙 채팅 영역입니다.
export const ChatMain = styled.section`
  display: flex;
  flex: 1;
  height: 100%;
  min-width: 0;
  flex-direction: column;
  background: var(--color-page-bg);
  @media (max-width: 60rem) {
    flex: none;
    height: calc(var(--app-viewport-height) - var(--navbar-height));
  }
`;

// 선택된 채팅방 상단 정보입니다.
export const ChatRoomHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  margin: 16px;
  padding: 16px;
  border: 1px solid #d6a81b;
  border-radius: 8px;
  background: var(--color-surface);

  > div {
    min-width: 0;
  }

  h2 {
    margin: 0;
    color: #1f1f1f;
    font-size: var(--font-lg);
    font-weight: var(--font-bold);
  }

  p {
    margin: 6px 0 0;
    color: #5f5a52;
    font-size: var(--font-sm);
  }
`;

// 채팅방 아바타입니다.
export const ChatAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $compact }) => ($compact ? "36px" : "48px")};
  height: ${({ $compact }) => ($compact ? "36px" : "48px")};
  flex-shrink: 0;
  border-radius: 50%;
  background: #f1e7c7;
  color: #9a7400;
  font-size: ${({ $compact }) => ($compact ? "14px" : "16px")};
  font-weight: var(--font-bold);
`;

// 메시지 목록 영역입니다.
export const ChatMessageArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
`;

// 메시지 한 줄입니다.
export const ChatMessageRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: ${({ $mine }) => ($mine ? "flex-end" : "flex-start")};
  gap: 12px;
  max-width: 760px;
  margin: 0 ${({ $mine }) => ($mine ? "0" : "auto")} 12px ${({ $mine }) => ($mine ? "auto" : "0")};
`;

// 메시지 말풍선입니다.
export const ChatBubble = styled.div`
  max-width: min(420px, 68%);
  padding: 12px 16px;
  border-radius: ${({ $mine }) => ($mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px")};
  background: ${({ $mine }) => ($mine ? "#d6a81b" : "#ffffff")};
  color: ${({ $mine }) => ($mine ? "#ffffff" : "#222222")};
  box-shadow: 0 6px 18px rgba(32, 24, 11, 0.08);
  font-size: var(--font-sm);
  line-height: 1.55;
  word-break: break-word;
`;

// 메시지 시간입니다.
export const ChatTime = styled.span`
  align-self: flex-end;
  color: #7d756a;
  font-size: var(--font-xs);
  white-space: nowrap;
`;

// 메시지 입력 영역입니다.
export const ChatComposer = styled.form`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  padding: 16px;
  border-top: 1px solid #e4d9c7;
  background: var(--color-surface);
`;

// 메시지 입력 박스입니다.
export const ChatInputBox = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  flex: 1;
  height: 66px;
  gap: 14px;
  border: 1px solid #d6a81b;
  border-radius: 8px;
  background: #ffffff;
  padding: 0 16px;

  input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    color: #1f1f1f;
    font-size: var(--font-sm);
    background: transparent;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #5f5a52;
  }
`;

// 채팅 액션 버튼입니다.
export const ChatActionButton = styled.button`
  // 아이콘과 문구가 테두리에 붙지 않도록 버튼 내부 여백을 확보합니다.
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-left: ${({ $alignRight }) => ($alignRight ? "auto" : "0")};
  height: 38px;
  min-width: 128px;
  padding: 0 16px;
  border: 1px solid ${({ $variant }) => ($variant === "outline" ? "#d6a81b" : "#d6a81b")};
  border-radius: 5px;
  background: ${({ $variant }) => ($variant === "outline" ? "#ffffff" : "#d6a81b")};
  color: ${({ $variant }) => ($variant === "outline" ? "#9a7400" : "#ffffff")};
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;

// 우측 토지 정보 패널입니다.
export const ChatLandPanel = styled.aside`
  width: clamp(14rem, 22vw, 25rem);
  flex-shrink: 0;
  border-left: 1px solid #e4d9c7;
  background: var(--color-surface-soft);
  padding: 16px;
  overflow-y: auto;
  @media (max-width: 60rem) {
    width: 100%;
    border-left: 0;
    border-top: 1px solid #e4d9c7;
  }
`;

// 토지 정보 패널 제목입니다.
export const ChatLandHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: var(--font-lg);
    font-weight: var(--font-bold);
  }
`;

// 채팅 우측 토지 정보 패널을 닫는 버튼입니다.
export const ChatLandCloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #5f5a52;
  cursor: pointer;

  &:hover {
    background: #eee7da;
  }

  &:focus-visible {
    outline: 2px solid #d6a81b;
    outline-offset: 2px;
  }
`;

// 토지 이미지 자리입니다.
export const ChatLandImage = styled.div`
  height: 164px;
  margin-bottom: 16px;
  border-radius: 6px;
  background: linear-gradient(135deg, #d9e8cd, #a7c98b);
  background-image: ${({ $image }) => ($image ? `url(${$image})` : undefined)};
  background-size: cover;
  background-position: center;
`;

// 토지 정보 값 목록입니다.
export const ChatLandInfo = styled.div`
  display: grid;
  gap: 12px;
  padding-bottom: 28px;
  border-bottom: 1px solid #e6dcca;

  h3 {
    margin: 0 0 8px;
    font-size: var(--font-lg);
    font-weight: var(--font-bold);
  }
`;

// 토지 정보 한 줄입니다.
export const ChatLandRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: #5f5a52;
  font-size: var(--font-sm);

  strong {
    color: #1f1f1f;
    font-weight: var(--font-medium);
    text-align: right;
  }
`;

// 채팅방 나가기 버튼 영역입니다.
export const ChatLeaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 42px;
  margin-top: 16px;
  border: 1px solid #c9b995;
  border-radius: 6px;
  background: #ffffff;
  color: #5f4b20;
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
  cursor: pointer;
`;

// 채팅방 삭제 확인창을 서비스 공통 색상으로 표시합니다.
export const ChatConfirmOverlay = styled.div`
  position: fixed; inset: 0; z-index: 120; display: grid; place-items: center;
  padding: 1rem; background: rgba(31, 28, 23, 0.48); box-sizing: border-box;
`;

export const ChatConfirmDialog = styled.section`
  width: min(100%, 26rem); padding: clamp(1.5rem, 5vw, 2rem);
  border: 1px solid #e6dcc8; border-radius: 1.125rem; background: #fffdf8;
  color: #2c2925; text-align: center; box-shadow: 0 24px 70px rgba(37, 29, 14, 0.24);
  h2 { margin: 0; font-size: var(--font-xl); }
  p { margin: 0.75rem 0 0; color: #756d61; font-size: var(--font-sm); line-height: 1.65; }
`;

export const ChatConfirmIcon = styled.div`
  display: grid; place-items: center; width: 3.25rem; height: 3.25rem;
  margin: 0 auto 1rem; border-radius: 50%; background: #f7efdc; color: #9a7200;
`;

export const ChatConfirmActions = styled.div`
  display: flex; justify-content: center; gap: 0.75rem; margin-top: 1.5rem;
  button { min-width: 7rem; height: 2.75rem; border: 1px solid #d8c5a2; border-radius: 0.5rem;
    background: #fff; color: #6f6045; font: inherit; cursor: pointer; }
  button:last-child { border-color: #936e00; background: #936e00; color: #fff; }
  button:disabled { opacity: 0.6; cursor: wait; }
  button:focus-visible { outline: 2px solid #936e00; outline-offset: 3px; }
`;

// 상태 메시지입니다.
export const ChatStatusText = styled.p`
  margin: 0;
  padding: 10px 16px 0;
  color: ${({ $error }) => ($error ? "#c2410c" : "#8a6800")};
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
`;
