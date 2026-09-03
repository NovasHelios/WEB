import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, LogOut, Paperclip, Search, Send, Map } from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
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

const createStompFrame = (command, headers = {}, body = "") => {
  // 외부 패키지 없이 STOMP 프레임을 만들어 WebSocket으로 전송합니다.
  const headerLines = Object.entries(headers)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}:${value}`);

  return `${command}\n${headerLines.join("\n")}\n\n${body}\0`;
};

const parseStompFrames = (data) => {
  // 서버에서 들어온 STOMP 프레임을 command/header/body 구조로 분리합니다.
  return String(data)
    .split("\0")
    .filter(Boolean)
    .map((rawFrame) => {
      const [headerBlock = "", body = ""] = rawFrame.split("\n\n");
      const [command = "", ...headerLines] = headerBlock.split("\n");
      const headers = headerLines.reduce((acc, line) => {
        const separatorIndex = line.indexOf(":");
        if (separatorIndex === -1) return acc;
        acc[line.slice(0, separatorIndex)] = line.slice(separatorIndex + 1);
        return acc;
      }, {});

      return { command, headers, body };
    });
};

const normalizeMessage = (payload) => {
  // 서버 응답이 data로 감싸져도 실제 메시지만 꺼냅니다.
  if (!payload) return null;
  const message = payload.data || payload.result || payload;
  if (!message.content && !message.attachmentUrl && !message.attachmentOriginalName) return null;
  return message;
};

function Chat() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedLand, setSelectedLand] = useState(null);
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
        return;
      }

      setIsMessageLoading(true);
      setError("");

      try {
        const [messagesResponse, landResponse] = await Promise.all([
          authFetch(Api.ChatMessages(selectedRoom.roomId), { method: "GET" }),
          selectedRoom.landId
            ? authFetch(Api.Land(selectedRoom.landId), { method: "GET" })
            : Promise.resolve(null),
        ]);

        const messagesData = await messagesResponse.json();
        const landData = landResponse ? await landResponse.json() : null;

        if (!messagesResponse.ok) {
          throw new Error("메시지를 불러오지 못했습니다.");
        }

        setMessages(extractArray(messagesData));
        setSelectedLand(landResponse?.ok ? landData?.data : null);
      } catch (err) {
        setError(err.message || "채팅방 정보를 불러오지 못했습니다.");
      } finally {
        setIsMessageLoading(false);
      }
    };

    // 선택한 채팅방의 메시지와 토지 정보를 조회합니다.
    void fetchRoomDetail();
  }, [selectedRoom]);

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

    let socket = null;
    let socketCandidateIndex = 0;
    let isClosedByCleanup = false;
    let isConnected = false;
    const socketCandidates = Api.ChatSocketCandidates?.(token) || [Api.ChatSocket];

    setIsSocketConnected(false);

    const connectSocket = () => {
      // WebSocket 서버 설정 차이를 대비해 가능한 연결 경로를 순서대로 시도합니다.
      socket = new WebSocket(socketCandidates[socketCandidateIndex]);
      socketRef.current = socket;

      socket.onopen = () => {
        setError("");
        socket.send(
          createStompFrame("CONNECT", {
            "accept-version": "1.2",
            "heart-beat": "10000,10000",
            Authorization: `Bearer ${token}`,
          }),
        );
      };

      socket.onmessage = (event) => {
        parseStompFrames(event.data).forEach((frame) => {
          if (frame.command === "CONNECTED") {
            setError("");
            isConnected = true;
            setIsSocketConnected(true);
            socket.send(createStompFrame("SUBSCRIBE", { id: `room-${selectedRoom.roomId}`, destination: Api.ChatSubscribeRoom(selectedRoom.roomId) }));
            socket.send(
              createStompFrame("SUBSCRIBE", {
                id: `room-message-${selectedRoom.roomId}`,
                destination: Api.ChatSubscribeMessages(selectedRoom.roomId),
              }),
            );
            return;
          }

          if (frame.command === "MESSAGE") {
            try {
              const incomingMessage = normalizeMessage(JSON.parse(frame.body));
              if (!incomingMessage) return;

              setMessages((prev) => {
                const duplicated = prev.some((message) => String(message.messageId) === String(incomingMessage.messageId));
                return duplicated ? prev : [...prev, incomingMessage];
              });
            } catch {
              setError("메시지 응답을 해석하지 못했습니다.");
            }
            return;
          }

          if (frame.command === "ERROR") {
            setError(frame.body || "채팅 서버 연결 중 오류가 발생했습니다.");
          }
        });
      };

      socket.onerror = () => {
        // 실제 실패 메시지는 close에서 마지막 후보까지 실패한 뒤 표시합니다.
      };

      socket.onclose = () => {
        if (isClosedByCleanup) return;

        if (socketCandidateIndex < socketCandidates.length - 1 && !isConnected) {
          socketCandidateIndex += 1;
          connectSocket();
          return;
        }

        if (socketRef.current === socket) setIsSocketConnected(false);
        setError("채팅 서버에 연결하지 못했습니다.");
      };
    };

    connectSocket();

    return () => {
      // 채팅방 이동 시 이전 WebSocket 연결을 정리합니다.
      isClosedByCleanup = true;
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(createStompFrame("DISCONNECT", { receipt: `close-${selectedRoom.roomId}` }));
      }
      socket?.close();
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, [navigate, selectedRoom]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // 텍스트 메시지는 서버 STOMP destination으로 전송합니다.
    const content = messageInput.trim();
    const socket = socketRef.current;
    const token = getValidAccessToken();

    if (!content || !selectedRoom) return;
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    if (!isSocketConnected || socket?.readyState !== WebSocket.OPEN) {
      setError("채팅 서버 연결 후 다시 전송해주세요.");
      return;
    }

    socket.send(
      createStompFrame(
        "SEND",
        {
          destination: Api.ChatSendMessage(selectedRoom.roomId),
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        JSON.stringify({ roomId: selectedRoom.roomId, content }),
      ),
    );

    setMessages((prev) => [
      ...prev,
      {
        messageId: `local-${Date.now()}`,
        roomId: selectedRoom.roomId,
        senderEmail: myEmail,
        senderName: "나",
        content,
        sentAt: new Date().toISOString(),
      },
    ]);
    setMessageInput("");
    setStatusMessage("");
    setError("");
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

      if (!response.ok) {
        throw new Error("채팅방을 나가지 못했습니다.");
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
                <ChatActionButton type="button" $variant="outline" onClick={() => navigate("/")}>
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
                      {!mine ? <ChatAvatar>{(message.senderName || "H")[0]}</ChatAvatar> : null}
                      <ChatBubble $mine={mine}>
                        {message.content || message.attachmentOriginalName || "첨부파일"}
                        {attachmentUrl ? (
                          <div>
                            <a href={attachmentUrl} target="_blank" rel="noreferrer">
                              첨부파일 보기
                            </a>
                          </div>
                        ) : null}
                      </ChatBubble>
                      <ChatTime>{formatTime(message.sentAt)}</ChatTime>
                    </ChatMessageRow>
                  );
                })}
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
    </ChatPage>
  );
}

export default Chat;
