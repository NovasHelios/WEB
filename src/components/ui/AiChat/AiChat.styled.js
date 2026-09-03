import styled from "styled-components";

// AI 채팅 패널입니다.
export const ChatPanel = styled.section`
  position: fixed;
  right: 28px;
  bottom: 92px;
  // AI 채팅 패널은 미리보기보다 뒤, 지도보다 앞에 표시합니다.
  z-index: 24;
  width: 300px;
  height: 500px;
  background: #ffffff;
  border: 1px solid #d6b326;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 14px 38px rgba(17, 24, 39, 0.14);
`;

// AI 채팅 패널 상단 영역입니다.
export const ChatHeader = styled.header`
  height: 44px;
  padding: 0 12px;
  border-bottom: 1px solid #d6b326;
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    width: 28px;
    height: 28px;
    border: 0;
    background: transparent;
    color: #111827;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

// AI 채팅 제목입니다.
export const ChatTitle = styled.strong`
  color: #d6ae16;
  font-size: 14px;
  font-weight: 700;
`;

// 채팅 메시지가 표시되는 영역입니다.
export const ChatBody = styled.div`
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
`;

// 메시지가 없을 때 아이콘을 중앙에 보여주는 영역입니다.
export const EmptyState = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 빈 채팅 상태에서 보여줄 아이콘입니다.
export const EmptyIcon = styled.img`
  width: 52px;
  height: 52px;
  object-fit: contain;
`;

// 채팅 메시지 목록입니다.
export const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// 사용자와 AI 답변 메시지 말풍선입니다.
export const MessageBubble = styled.p`
  max-width: 82%;
  margin: 0;
  padding: 9px 11px;
  border-radius: 12px;
  align-self: ${({ $role }) => ($role === "user" ? "flex-end" : "flex-start")};
  background: ${({ $role }) => ($role === "user" ? "#d6b326" : "#f3f4f6")};
  color: ${({ $role }) => ($role === "user" ? "#111827" : "#374151")};
  font-size: 13px;
  font-weight: 600;
  line-height: 1.45;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

// 메시지 입력 영역입니다.
export const ChatFooter = styled.form`
  height: 44px;
  padding: 6px 8px;
  border-top: 1px solid #d6b326;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 메시지 입력창입니다.
export const ChatInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 30px;
  border: 0;
  outline: none;
  color: #111827;
  font-size: 11px;

  &::placeholder {
    color: #9ca3af;
  }
`;

// 메시지 전송 버튼입니다.
export const SendButton = styled.button`
  height: 30px;
  padding: 0 9px;
  border: 1px solid #d6b326;
  border-radius: 4px;
  background: #ffffff;
  color: #d6ae16;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
`;

// 오른쪽 아래 고정 AI 채팅 버튼입니다.
export const ChatButton = styled.button`
  position: fixed;
  right: 28px;
  bottom: 24px;
  // AI 채팅 버튼은 미리보기보다 뒤, 지도보다 앞에 표시합니다.
  z-index: 24;
  width: 58px;
  height: 58px;
  padding: 0;
  border: 0;
  border-radius: 16px;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

// 고정 버튼 안의 이미지 아이콘입니다.
export const ChatButtonIcon = styled.img`
  width: 58px;
  height: 58px;
  object-fit: contain;
`;
