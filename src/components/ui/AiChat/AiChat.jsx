// AI 채팅 UI의 열림 상태와 임시 답변 메시지를 관리합니다.
import { useState } from "react";
import { Send, X } from "lucide-react";

import aiChatIcon from "@/images/AI_chat.png";
import {
  ChatBody,
  ChatButton,
  ChatButtonIcon,
  ChatFooter,
  ChatHeader,
  ChatInput,
  ChatPanel,
  ChatTitle,
  EmptyIcon,
  EmptyState,
  MessageBubble,
  MessageList,
  SendButton,
} from "./AiChat.styled";

// 아직 AI 기능이 완성되기 전까지 보여줄 고정 답변입니다.
const UNSUPPORTED_MESSAGE = "아직은 지원하지 않는 기능입니다.";

// 지도 화면 오른쪽 아래에 표시되는 AI 채팅 위젯입니다.
function AiChat() {
  // 채팅 패널 열림 여부입니다.
  const [isOpen, setIsOpen] = useState(false);

  // 사용자가 입력 중인 메시지입니다.
  const [inputValue, setInputValue] = useState("");

  // 화면에 표시할 채팅 메시지 목록입니다.
  const [messages, setMessages] = useState([]);

  // 채팅 패널을 열고 닫습니다.
  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  // 채팅 메시지를 전송하고 임시 답변을 추가합니다.
  const handleSubmit = (event) => {
    // form 기본 새로고침을 막습니다.
    event.preventDefault();

    // 공백 메시지는 전송하지 않습니다.
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    // 사용자 메시지와 임시 AI 답변을 차례대로 추가합니다.
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-user`, role: "user", text: trimmedValue },
      { id: `${Date.now()}-ai`, role: "assistant", text: UNSUPPORTED_MESSAGE },
    ]);

    // 전송 후 입력창을 비웁니다.
    setInputValue("");
  };

  return (
    <>
      {/* AI 채팅 패널입니다. */}
      {isOpen && (
        <ChatPanel>
          <ChatHeader>
            <ChatTitle>AI 검색</ChatTitle>
            <button type="button" onClick={handleToggleOpen} aria-label="닫기">
              <X size={20} strokeWidth={2.2} />
            </button>
          </ChatHeader>

          <ChatBody>
            {messages.length ? (
              <MessageList>
                {messages.map((message) => (
                  <MessageBubble key={message.id} $role={message.role}>
                    {message.text}
                  </MessageBubble>
                ))}
              </MessageList>
            ) : (
              <EmptyState>
                <EmptyIcon src={aiChatIcon} alt="" />
              </EmptyState>
            )}
          </ChatBody>

          <ChatFooter onSubmit={handleSubmit}>
            <ChatInput
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="메시지를 입력하세요..."
            />
            <SendButton type="submit" aria-label="전송">
              <Send size={17} strokeWidth={2.2} />
              전송
            </SendButton>
          </ChatFooter>
        </ChatPanel>
      )}

      {/* 오른쪽 아래 고정 AI 채팅 버튼입니다. */}
      <ChatButton type="button" onClick={handleToggleOpen} aria-label="AI 채팅">
        <ChatButtonIcon src={aiChatIcon} alt="" />
      </ChatButton>
    </>
  );
}

export default AiChat;
