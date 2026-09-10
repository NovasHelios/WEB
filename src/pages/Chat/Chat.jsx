import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { ChevronUp, LogOut, Paperclip, Search, Send, Map } from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
import Specific from "@/components/ui/SpecificPopUp/Specific";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, getValidAccessToken } from "@/lib/auth";
import { formatKoreanMoneyFromManwon } from "@/utils/priceFormat";
import {
  ChatActionButton,
  ChatAvatar,
  ChatBubble,
  ChatComposer,
  ChatEmpty,
  ChatInputBox,
  ChatLandHeader,
  ChatLandImage,
  ChatLandInfo,
  ChatLandPanel,
  ChatLandRow,
  ChatListHeader,
  ChatMain,
  ChatMessageArea,
  ChatMessageRow,
  ChatPage,
  ChatRoomHeader,
  ChatRoomItem,
  ChatRoomList,
  ChatSearch,
  ChatShell,
  ChatSidebar,
  ChatStatusText,
  ChatTime,
  ChatLeaveButton,
} from "./Chat.styles";

const normalizeBaseUrl = (value) => {
  // 서버 파일 경로를 절대 URL로 바꿉니다.
  const rawValue = value || "https://www.helioss.site";
  if (rawValue.startsWith("http://") || rawValue.startsWith("https://")) {
    return rawValue.replace(/\/$/, "");
  }
  return `https://${rawValue.replace(/\/$/, "")}`;
};

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

const resolveFileUrl = (path) => {
  // 서버에서 상대경로로 내려온 파일을 표시 가능한 URL로 변환합니다.
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path}`;
};

const resolveLandImageUrl = (path) => {
  // 토지 이미지는 파일명만 오면 uploads/lands 경로를 붙여 요청합니다.
  if (!path) return "";

  const normalizedPath = String(path).replace(/^\/+/, "");

  if (normalizedPath.startsWith("http://") || normalizedPath.startsWith("https://")) return normalizedPath;
  if (normalizedPath.startsWith("uploads/")) return `${API_BASE_URL}/${normalizedPath}`;

  return `${API_BASE_URL}/uploads/lands/${normalizedPath}`;
};

const formatTime = (value) => {
  // 메시지 시간을 시안처럼 시:분으로 표시합니다.
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
};

const formatPrice = (value) => {
  // 가격은 서버 기준인 원 단위로 통일해서 표시합니다.
  return formatKoreanMoneyFromManwon(value);
};

const formatArea = (value) => {
  // 면적은 ㎡와 평을 함께 보여줍니다.
  const numeric = Number(value);
  if (!value || Number.isNaN(numeric)) return "-";
  const pyeong = Math.round(numeric / 3.3058).toLocaleString("ko-KR");
  return `${pyeong}평 (${numeric.toLocaleString("ko-KR")}㎡)`;
};

const extractArray = (payload) => {
  // API 응답 구조가 바뀌어도 배열만 안전하게 꺼냅니다.
  if (Array.isArray(payload)) return payload;
  const candidates = [payload?.data, payload?.content, payload?.data?.content, payload?.result];
  return candidates.find(Array.isArray) || [];
};

const normalizeMessage = (payload) => {
  // 서버 응답이 data로 감싸져도 실제 메시지만 꺼냅니다.
  if (!payload) return null;
  const message = payload.data || payload.result || payload;
  if (!message.content && !message.attachmentUrl && !message.attachmentOriginalName) return null;
  return message;
};

const mergeMessages = (serverMessages, pendingMessages = []) => {
  // 서버 저장 확인 전 임시 메시지는 목록 재조회 후에도 잠시 유지합니다.
  const serverKeys = new Set(
    serverMessages.map((message) => String(message.messageId || `${message.sentAt}-${message.content}`)),
  );
  const unresolvedPendingMessages = pendingMessages.filter((message) => {
    const hasSameContent = serverMessages.some(
      (serverMessage) =>
        serverMessage.content === message.content &&
        serverMessage.senderEmail === message.senderEmail,
    );
    return !serverKeys.has(String(message.messageId)) && !hasSameContent;
  });

  return [...serverMessages, ...unresolvedPendingMessages];
};

const markPendingMessageAsFailed = (pendingMessageId) => {
  // 서버 저장 확인이 끝난 임시 메시지에 실패 상태를 표시합니다.
  return (messages) =>
    messages.map((message) =>
      message.messageId === pendingMessageId
        ? { ...message, pendingFailed: true }
        : message,
    );
};

function Chat() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const clientRef = useRef(null);
  const confirmTimersRef = useRef([]);
  const messageEndRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedLand, setSelectedLand] = useState(null);
  const [detailLand, setDetailLand] = useState(null);
  const [myEmail, setMyEmail] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  const selectedRoom = useMemo(
    () => rooms.find((room) => String(room.roomId) === String(selectedRoomId)) || null,
    [rooms, selectedRoomId],
  );

  const refreshMessages = useCallback(async (roomId) => {
    // 서버에 저장된 메시지 목록을 다시 불러와 화면 상태를 맞춥니다.
    if (!roomId) return;

    const response = await authFetch(Api.ChatMessages(roomId), { method: "GET" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.data?.message || data?.message || "메시지를 불러오지 못했습니다.");
    }

    const serverMessages = extractArray(data);
    setMessages((prev) => mergeMessages(serverMessages, prev.filter((message) => message.pending)));
    return serverMessages;
  }, []);

  const handleSocketMessage = useCallback((message) => {
    // STOMP로 수신한 메시지를 화면 메시지 목록에 반영합니다.
    try {
      const incomingMessage = normalizeMessage(JSON.parse(message.body));
      if (!incomingMessage) return;

      setMessages((prev) => {
        const duplicated = prev.some(
          (prevMessage) =>
            String(prevMessage.messageId) === String(incomingMessage.messageId) ||
            (prevMessage.pending &&
              prevMessage.content === incomingMessage.content &&
              prevMessage.senderEmail === incomingMessage.senderEmail),
        );
        return duplicated
          ? prev.map((prevMessage) =>
              prevMessage.pending &&
              prevMessage.content === incomingMessage.content &&
              prevMessage.senderEmail === incomingMessage.senderEmail
                ? incomingMessage
                : prevMessage,
            )
          : [...prev, incomingMessage];
      });
    } catch {
      setError("메시지 응답을 해석하지 못했습니다.");
    }
  }, []);

  const filteredRooms = useMemo(() => {
    // 검색어에 맞는 채팅방만 표시합니다.
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return rooms;

    return rooms.filter((room) => {
      const target = `${room.counterpartName || ""} ${room.counterpartEmail || ""} ${room.landAddress || ""}`.toLowerCase();
      return target.includes(normalizedKeyword);
    });
  }, [keyword, rooms]);

  useEffect(() => {
    const fetchInitialData = async () => {
      // 채팅은 로그인한 사용자만 접근할 수 있습니다.
      if (!getValidAccessToken()) {
        navigate("/login", { replace: true });
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const [profileResponse, roomsResponse] = await Promise.all([
          authFetch(Api.MyProfile, { method: "GET" }),
          authFetch(Api.ChatRooms, { method: "GET" }),
        ]);

        const profileData = await profileResponse.json();
        const roomsData = await roomsResponse.json();

        if (!profileResponse.ok || !roomsResponse.ok) {
          if (profileResponse.status === 401 || roomsResponse.status === 401) {
            navigate("/login", { replace: true });
            return;
          }
          throw new Error("채팅 목록을 불러오지 못했습니다.");
        }

        const nextRooms = extractArray(roomsData);
        setMyEmail(profileData?.data?.email || "");
        setRooms(nextRooms);
        setSelectedRoomId(nextRooms[0]?.roomId || null);
      } catch (err) {
        setError(err.message || "채팅 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    // 채팅 페이지 진입 시 내 채팅방 목록을 조회합니다.
    void fetchInitialData();
  }, [navigate]);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      // 선택된 채팅방이 없으면 빈 상태를 표시합니다.
      if (!selectedRoom) {
        setMessages([]);
        setSelectedLand(null);
        setDetailLand(null);
        return;
      }

      setIsMessageLoading(true);
      setError("");

      try {
        const landResponse = selectedRoom.landId
          ? await authFetch(Api.Land(selectedRoom.landId), { method: "GET" })
          : null;
        const landData = landResponse ? await landResponse.json() : null;

        await refreshMessages(selectedRoom.roomId);
        setSelectedLand(landResponse?.ok ? landData?.data : null);
      } catch (err) {
        if (err.message?.includes("로그인") || err.message?.includes("인증")) {
          navigate("/login", { replace: true });
          return;
        }

        setError(err.message || "채팅방 정보를 불러오지 못했습니다.");
      } finally {
        setIsMessageLoading(false);
      }
    };

    // 선택한 채팅방의 메시지와 토지 정보를 조회합니다.
    void fetchRoomDetail();
  }, [navigate, refreshMessages, selectedRoom]);
  useEffect(() => {
    // 선택된 채팅방 기준으로 STOMP WebSocket을 연결합니다.
    if (!selectedRoom) {
      setIsSocketConnected(false);
      return undefined;
    }

    const token = getValidAccessToken();
    if (!token) {
      navigate("/login", { replace: true });
      return undefined;
    }

    let isClosedByCleanup = false;

    setIsSocketConnected(false);

    const client = new Client({
      brokerURL: Api.ChatSocket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 0,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        // 연결 후 현재 채팅방 topic을 구독합니다.
        setError("");
        setIsSocketConnected(true);
        client.subscribe(Api.ChatSubscribeRoom(selectedRoom.roomId), handleSocketMessage);
        client.subscribe(Api.ChatSubscribeMessages(selectedRoom.roomId), handleSocketMessage);
      },
      onStompError: (frame) => {
        setIsSocketConnected(false);
        setError(frame.body || frame.headers?.message || "채팅 서버 연결 중 오류가 발생했습니다.");
      },
      onWebSocketClose: () => {
        if (isClosedByCleanup) return;
        setIsSocketConnected(false);
        setError("채팅 서버에 연결하지 못했습니다.");
      },
      onWebSocketError: () => {
        if (isClosedByCleanup) return;
        setIsSocketConnected(false);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      // 채팅방 이동 시 이전 STOMP 연결을 정리합니다.
      isClosedByCleanup = true;
      void client.deactivate();
      if (clientRef.current === client) clientRef.current = null;
    };
  }, [handleSocketMessage, navigate, selectedRoom]);

  useEffect(() => {
    // 새 메시지가 추가되면 최신 메시지가 보이도록 이동합니다.
    messageEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  useEffect(() => {
    return () => {
      // 페이지 이탈 시 저장 확인 타이머를 정리합니다.
      confirmTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      confirmTimersRef.current = [];
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // 텍스트 메시지는 서버 STOMP destination으로 전송합니다.
    const content = messageInput.trim();
    const client = clientRef.current;
    const token = getValidAccessToken();

    if (!content || !selectedRoom) return;
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    if (!isSocketConnected || !client?.connected) {
      setError("채팅 서버 연결 후 다시 전송해주세요.");
      return;
    }

    const pendingMessageId = `pending-${Date.now()}`;
    try {
      client.publish({
        destination: Api.ChatSendMessage(selectedRoom.roomId),
        headers: {
          // Spring 메시지 컨버터가 JSON 본문으로 인식하도록 content-type만 명시합니다.
          "content-type": "application/json",
        },
        body: JSON.stringify({ roomId: selectedRoom.roomId, content }),
      });
    } catch {
      setError("메시지를 전송하지 못했습니다.");
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        messageId: pendingMessageId,
        roomId: selectedRoom.roomId,
        senderEmail: myEmail,
        senderName: "나",
        content,
        sentAt: new Date().toISOString(),
        pending: true,
      },
    ]);
    setMessageInput("");
    setStatusMessage("메시지 전송 후 서버 저장 상태를 확인하는 중입니다.");
    setError("");

    const confirmSavedMessage = async (retryCount = 0) => {
      // 서버 저장/브로드캐스트 지연을 감안해 메시지 목록을 여러 번 확인합니다.
      const serverMessages = await refreshMessages(selectedRoom.roomId);
      const savedMessage = serverMessages.some(
        (message) =>
          message.content === content &&
          (!message.senderEmail || !myEmail || message.senderEmail === myEmail),
      );

      if (savedMessage) {
        setStatusMessage("");
        return;
      }

      if (retryCount < 2) {
        const timerId = window.setTimeout(() => {
          void confirmSavedMessage(retryCount + 1);
        }, 1000);
        confirmTimersRef.current.push(timerId);
        return;
      }

      setMessages(markPendingMessageAsFailed(pendingMessageId));
      setStatusMessage("");
    };

    const timerId = window.setTimeout(() => {
      void confirmSavedMessage();
    }, 1000);
    confirmTimersRef.current.push(timerId);
  };

  const handleFileUpload = async (event) => {
    // 파일 첨부 메시지는 서버 API로 전송합니다.
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !selectedRoom) return;

    const formData = new FormData();
    formData.append("file", file);
    setStatusMessage("");
    setError("");
    setIsMessageLoading(true);

    try {
      const response = await authFetch(Api.ChatAttachment(selectedRoom.roomId), {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.data?.message || "파일을 전송하지 못했습니다.");
      }

      setMessages((prev) => [...prev, data?.data].filter(Boolean));
      setStatusMessage("파일이 전송되었습니다.");
    } catch (err) {
      setError(err.message || "파일을 전송하지 못했습니다.");
    } finally {
      setIsMessageLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    // 채팅방 종료 API를 호출하고 목록에서 제거합니다.
    if (!selectedRoom) return;

    try {
      const response = await authFetch(Api.ChatClose(selectedRoom.roomId), {
        method: "PATCH",
      });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        if (response.status === 409) {
          setStatusMessage(data?.data?.message || data?.message || "이미 종료되었거나 나갈 수 없는 채팅방입니다.");
          return;
        }

        throw new Error(data?.data?.message || data?.message || "채팅방을 나가지 못했습니다.");
      }

      setRooms((prev) => prev.filter((room) => room.roomId !== selectedRoom.roomId));
      setSelectedRoomId(null);
      setSelectedLand(null);
      setMessages([]);
    } catch (err) {
      setError(err.message || "채팅방을 나가지 못했습니다.");
    }
  };

  return (
    <ChatPage>
      {/* 공통 네비게이션 */}
      <NavBar
        keyword=""
        onChangeKeyword={() => {}}
        onSearch={() => {}}
        isSuggestionOpen={false}
        regionSuggestions={[]}
      />

      <ChatShell>
        <ChatSidebar>
          <ChatListHeader>
            <h1>채팅 목록</h1>
            <ChatSearch>
              <Search size={20} strokeWidth={2} />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="사업자명, 담당자명 검색"
              />
            </ChatSearch>
          </ChatListHeader>

          <ChatRoomList>
            {isLoading ? <ChatEmpty>불러오는 중입니다</ChatEmpty> : null}
            {!isLoading && filteredRooms.length === 0 ? <ChatEmpty>찾을 수 없습니다</ChatEmpty> : null}
            {filteredRooms.map((room) => (
              <ChatRoomItem
                key={room.roomId}
                type="button"
                $active={String(room.roomId) === String(selectedRoomId)}
                onClick={() => setSelectedRoomId(room.roomId)}
              >
                <strong>{room.counterpartName || room.counterpartEmail || "상대방"}</strong>
                <span>{room.counterpartEmail || "담당자 정보 없음"}</span>
                <small>{room.landAddress || "토지 주소 정보 없음"}</small>
              </ChatRoomItem>
            ))}
          </ChatRoomList>
        </ChatSidebar>

        <ChatMain>
          {!selectedRoom ? (
            <ChatEmpty>찾을 수 없습니다</ChatEmpty>
          ) : (
            <>
              <ChatRoomHeader>
                <ChatAvatar>{(selectedRoom.counterpartName || "H")[0]}</ChatAvatar>
                <div>
                  <h2>{selectedRoom.counterpartName || selectedRoom.counterpartEmail || "상대방"}</h2>
                  <p>{selectedRoom.landAddress || "토지 주소 정보 없음"}</p>
                </div>
                <ChatActionButton
                  type="button"
                  $variant="outline"
                  $alignRight
                  onClick={() => selectedLand && setDetailLand(selectedLand)}
                  disabled={!selectedLand}
                >
                  <Map size={15} />
                  토지 상세 보기
                </ChatActionButton>
              </ChatRoomHeader>

              {error ? <ChatStatusText $error>{error}</ChatStatusText> : null}
              {statusMessage ? <ChatStatusText>{statusMessage}</ChatStatusText> : null}

              <ChatMessageArea>
                {isMessageLoading ? <ChatEmpty>불러오는 중입니다</ChatEmpty> : null}
                {!isMessageLoading && messages.length === 0 ? <ChatEmpty>찾을 수 없습니다</ChatEmpty> : null}
                {messages.map((message) => {
                  const mine = message.senderEmail === myEmail;
                  const attachmentUrl = resolveFileUrl(message.attachmentUrl);

                  return (
                    <ChatMessageRow key={message.messageId || `${message.sentAt}-${message.content}`} $mine={mine}>
                      {!mine ? <ChatAvatar $compact>{(message.senderName || "H")[0]}</ChatAvatar> : null}
                      {mine ? <ChatTime>{formatTime(message.sentAt)}</ChatTime> : null}
                      <ChatBubble $mine={mine}>
                        {message.content || message.attachmentOriginalName || "첨부파일"}
                        {message.pendingFailed ? (
                          <div>서버 저장 확인 안 됨</div>
                        ) : null}
                        {attachmentUrl ? (
                          <div>
                            <a href={attachmentUrl} target="_blank" rel="noreferrer">
                              첨부파일 보기
                            </a>
                          </div>
                        ) : null}
                      </ChatBubble>
                      {!mine ? <ChatTime>{formatTime(message.sentAt)}</ChatTime> : null}
                    </ChatMessageRow>
                  );
                })}
                <div ref={messageEndRef} />
              </ChatMessageArea>

              <ChatComposer onSubmit={handleSubmit}>
                <ChatInputBox>
                  <button type="button" onClick={() => fileInputRef.current?.click()} aria-label="파일 첨부">
                    <Paperclip size={22} strokeWidth={2} />
                  </button>
                  <input
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    placeholder="메시지를 입력하세요..."
                  />
                </ChatInputBox>
                <ChatActionButton type="submit" disabled={!messageInput.trim() || !isSocketConnected}>
                  <Send size={15} />
                  전송
                </ChatActionButton>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </ChatComposer>
            </>
          )}
        </ChatMain>

        <ChatLandPanel>
          <ChatLandHeader>
            <h2>토지 정보</h2>
            <ChevronUp size={18} strokeWidth={2} />
          </ChatLandHeader>

          {selectedLand ? (
            <>
              <ChatLandImage $image={resolveLandImageUrl(selectedLand.landImagePaths?.[0])} />
              <ChatLandInfo>
                <h3>{selectedLand.address || selectedRoom?.landAddress || "-"}</h3>
                <ChatLandRow>
                  <span>면적</span>
                  <strong>{formatArea(selectedLand.area)}</strong>
                </ChatLandRow>
                <ChatLandRow>
                  <span>거래 방식</span>
                  <strong>{selectedLand.transactionType === "LEASE" ? "임대" : "매매"}</strong>
                </ChatLandRow>
                <ChatLandRow>
                  <span>희망 가격</span>
                  <strong>{formatPrice(selectedLand.desiredPrice)}</strong>
                </ChatLandRow>
              </ChatLandInfo>
              <ChatLeaveButton type="button" onClick={handleLeaveRoom}>
                <LogOut size={15} />
                채팅방 나가기
              </ChatLeaveButton>
            </>
          ) : (
            <ChatEmpty>찾을 수 없습니다</ChatEmpty>
          )}
        </ChatLandPanel>
      </ChatShell>
      <Specific land={detailLand} onClose={() => setDetailLand(null)} />
    </ChatPage>
  );
}

export default Chat;
