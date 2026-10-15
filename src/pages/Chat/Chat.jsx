import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { AlertTriangle, LogOut, Paperclip, Search, Send, Map, Trash2, X } from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
// 채팅 데이터를 불러올 때 다른 페이지와 동일한 공통 로딩 화면을 사용합니다.
import PageLoading from "@/components/ui/PageLoading/PageLoading";
import Specific from "@/components/ui/SpecificPopUp/Specific";
import { Api } from "@/contents/apiEndpoints";
import {
  addClosedChatRoomId,
  CHAT_ROOMS_CHANGED_EVENT,
  filterOpenChatRooms,
  isClosedChatRoomId,
} from "@/lib/chatRooms";
import { authFetch, getValidAccessToken } from "@/lib/auth";
import useAuthToken from "@/hooks/useAuthToken";
import { mergeChatMessages } from "@/utils/chatMessages";
import { readApiResponse } from "@/utils/apiResponse";
import { getTransactionLabel } from "@/pages/Land/landUtils";
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
  ChatLandCloseButton,
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
  ChatConfirmOverlay,
  ChatConfirmDialog,
  ChatConfirmIcon,
  ChatConfirmActions,
} from "./Chat.styles";

const normalizeBaseUrl = (value) => {
  // 서버 파일 경로를 절대 URL로 바꿉니다.
  const rawValue = value || "https://api.helioss.site";
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

function ChatSession({ token }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const clientRef = useRef(null);
  const sendingRef = useRef(false);
  const [isSending, setIsSending] = useState(false);
  const messageEndRef = useRef(null);
  const selectedRoomIdRef = useRef(null);
  const roomEpochRef = useRef(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedLand, setSelectedLand] = useState(null);
  const [isLandPanelOpen, setIsLandPanelOpen] = useState(true);
  const [detailLand, setDetailLand] = useState(null);
  const [myEmail, setMyEmail] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  // 현재 선택한 방과 실제 연결된 방이 같을 때만 전송을 허용합니다.
  const [connectedRoomId, setConnectedRoomId] = useState(null);
  const isSocketConnected = selectedRoomId !== null && connectedRoomId === selectedRoomId;
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  const selectedRoom = useMemo(
    () => rooms.find((room) => String(room.roomId) === String(selectedRoomId)) || null,
    [rooms, selectedRoomId],
  );

  useEffect(() => {
    if (!isLeaveConfirmOpen) return undefined;
    // 채팅방 삭제 확인은 Escape로 닫을 수 있습니다.
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !isDeleting) setIsLeaveConfirmOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isLeaveConfirmOpen, isDeleting]);

  useEffect(() => {
    // 비동기 수신 콜백에서 현재 선택된 방을 정확히 확인합니다.
    selectedRoomIdRef.current = selectedRoomId;
  }, [selectedRoomId]);

  const refreshMessages = useCallback(async (roomId) => {
    // 서버에 저장된 메시지 목록을 다시 불러와 화면 상태를 맞춥니다.
    if (!roomId) return;
    if (isClosedChatRoomId(roomId)) return [];
    const epoch = roomEpochRef.current;

    const response = await authFetch(Api.ChatMessages(roomId), { method: "GET" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.data?.message || data?.message || "메시지를 불러오지 못했습니다.");
    }

    const serverMessages = extractArray(data);
    // 방 이동 또는 계정 변경 뒤 도착한 응답은 화면에 반영하지 않습니다.
    if (epoch !== roomEpochRef.current || String(roomId) !== String(selectedRoomIdRef.current) || token !== getValidAccessToken()) return [];
    setMessages((prev) => mergeChatMessages(serverMessages, prev));
    return serverMessages;
  }, [token]);

  const handleSocketMessage = useCallback((message) => {
    // STOMP로 수신한 메시지를 화면 메시지 목록에 반영합니다.
    try {
      const incomingMessage = normalizeMessage(JSON.parse(message.body));
      if (!incomingMessage) return;
      if (isClosedChatRoomId(incomingMessage.roomId)) return;
      if (incomingMessage.roomId && String(incomingMessage.roomId) !== String(selectedRoomIdRef.current)) return;

      setMessages((prev) => mergeChatMessages(prev, [incomingMessage]));
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

        const nextRooms = filterOpenChatRooms(extractArray(roomsData));
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
    const handleChatRoomsChanged = () => {
      // 다른 화면에서 채팅을 새로 시작하면 숨김 목록 변경을 즉시 반영합니다.
      setRooms((prev) => filterOpenChatRooms(prev));

      void (async () => {
        try {
          const response = await authFetch(Api.ChatRooms, { method: "GET" });
          const data = await response.json();
          if (!response.ok) return;

          const nextRooms = filterOpenChatRooms(extractArray(data));
          setRooms(nextRooms);
          setSelectedRoomId((prevRoomId) => prevRoomId || nextRooms[0]?.roomId || null);
        } catch {
          // 목록 이벤트 갱신 실패는 기존 화면 상태를 유지합니다.
        }
      })();
    };

    window.addEventListener(CHAT_ROOMS_CHANGED_EVENT, handleChatRoomsChanged);

    return () => {
      window.removeEventListener(CHAT_ROOMS_CHANGED_EVENT, handleChatRoomsChanged);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchRoomDetail = async () => {
      // 선택된 채팅방이 없으면 빈 상태를 표시합니다.
      if (!selectedRoom) {
        setMessages([]);
        setSelectedLand(null);
        setDetailLand(null);
        return;
      }

      if (isClosedChatRoomId(selectedRoom.roomId)) {
        setRooms((prev) => prev.filter((room) => String(room.roomId) !== String(selectedRoom.roomId)));
        setSelectedRoomId(null);
        return;
      }

      setIsMessageLoading(true);
      setMessages([]);
      setSelectedLand(null);
      setStatusMessage("");
      setError("");

      try {
        const landResponse = selectedRoom.landId
          ? await authFetch(Api.Land(selectedRoom.landId), { method: "GET" })
          : null;
        const landData = landResponse ? await landResponse.json() : null;
        if (cancelled) return;
        await refreshMessages(selectedRoom.roomId);
        if (cancelled) return;
        setSelectedLand(landResponse?.ok ? landData?.data : null);
      } catch (err) {
        if (cancelled) return;
        if (err.message?.includes("로그인") || err.message?.includes("인증")) {
          navigate("/login", { replace: true });
          return;
        }

        setError(err.message || "채팅방 정보를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setIsMessageLoading(false);
      }
    };

    // 선택한 채팅방의 메시지와 토지 정보를 조회합니다.
    void fetchRoomDetail();
    return () => {
      cancelled = true;
      roomEpochRef.current += 1;
    };
  }, [navigate, refreshMessages, selectedRoom]);
  useEffect(() => {
    // 선택된 채팅방 기준으로 STOMP WebSocket을 연결합니다.
    if (!selectedRoom) {
      return undefined;
    }

    const token = getValidAccessToken();
    if (!token) {
      navigate("/login", { replace: true });
      return undefined;
    }

    let isClosedByCleanup = false;

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
        if (isClosedByCleanup) return;
        setConnectedRoomId(selectedRoom.roomId);
        const receive = (message) => {
          if (!isClosedByCleanup && token === getValidAccessToken()) handleSocketMessage(message);
        };
        client.subscribe(Api.ChatSubscribeRoom(selectedRoom.roomId), receive);
        client.subscribe(Api.ChatSubscribeMessages(selectedRoom.roomId), receive);
      },
      onStompError: (frame) => {
        if (isClosedByCleanup) return;
        setConnectedRoomId(null);
        setError(frame.body || frame.headers?.message || "채팅 서버 연결 중 오류가 발생했습니다.");
      },
      onWebSocketClose: () => {
        if (isClosedByCleanup) return;
        setConnectedRoomId(null);
        setError("채팅 서버에 연결하지 못했습니다.");
      },
      onWebSocketError: () => {
        if (isClosedByCleanup) return;
        setConnectedRoomId(null);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    // 저장된 메시지 ID를 반환하는 HTTP API로 전송 결과를 확정합니다.
    const content = messageInput.trim();
    const sendingToken = getValidAccessToken();
    if (!content || !selectedRoom || sendingRef.current) return;
    if (!sendingToken) {
      navigate("/login", { replace: true });
      return;
    }
    if (content.length > 2000) {
      setError("메시지는 2,000자 이하로 입력해주세요.");
      return;
    }
    const sentEpoch = roomEpochRef.current;
    sendingRef.current = true;
    setIsSending(true);
    setError("");
    setStatusMessage("메시지를 전송하는 중입니다.");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await authFetch(Api.ChatMessages(selectedRoom.roomId), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }), signal: controller.signal,
      });
      const data = await readApiResponse(response, "메시지를 전송하지 못했습니다.");
      if (data?.data?.messageId == null) throw new Error("저장된 메시지 ID를 확인할 수 없습니다.");
      if (sentEpoch !== roomEpochRef.current || sendingToken !== getValidAccessToken()) return;
      setMessages((prev) => mergeChatMessages(prev, [data.data]));
      setMessageInput("");
    } catch (error) {
      if (sentEpoch === roomEpochRef.current && sendingToken === getValidAccessToken()) {
        setError(`${error.message || "전송 결과를 확인하지 못했습니다."} 중복 전송을 피하려면 대화 내역을 먼저 확인해주세요.`);
      }
    } finally {
      window.clearTimeout(timeout);
      sendingRef.current = false;
      setIsSending(false);
      if (sentEpoch === roomEpochRef.current) setStatusMessage("");
    }
  };

  const handleFileUpload = async (event) => {
    // 파일 첨부 메시지는 서버 API로 전송합니다.
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !selectedRoom) return;
    const uploadEpoch = roomEpochRef.current;

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
      if (uploadEpoch !== roomEpochRef.current || token !== getValidAccessToken()) return;

      if (!response.ok) {
        throw new Error(data?.message || data?.data?.message || "파일을 전송하지 못했습니다.");
      }

      setMessages((prev) => mergeChatMessages(prev, [data?.data]));
      setStatusMessage("파일이 전송되었습니다.");
    } catch (err) {
      if (uploadEpoch === roomEpochRef.current && token === getValidAccessToken()) setError(err.message || "파일을 전송하지 못했습니다.");
    } finally {
      if (uploadEpoch === roomEpochRef.current) setIsMessageLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    // 채팅방 삭제 API를 호출하고 목록에서 즉시 제거합니다.
    if (!selectedRoom || isDeleting) return;
    const leavingRoom = selectedRoom;
    setIsDeleting(true);
    setError("");

    try {
      const response = await authFetch(Api.ChatDelete(leavingRoom.roomId), {
        method: "DELETE",
      });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;
      if (token !== getValidAccessToken()) return;

      if (!response.ok) {
        throw new Error(data?.data?.message || data?.message || "채팅방을 나가지 못했습니다.");
      }
      // 서버 삭제 성공 후에만 해당 방 ID를 숨깁니다. 같은 토지의 새 방은 숨기지 않습니다.
      addClosedChatRoomId(leavingRoom.roomId);
      setRooms((prev) => prev.filter((room) => String(room.roomId) !== String(leavingRoom.roomId)));
      setSelectedRoomId((prev) => String(prev) === String(leavingRoom.roomId) ? null : prev);
      setIsLeaveConfirmOpen(false);
    } catch (err) {
      if (token === getValidAccessToken()) setError(err.message || "삭제하지 못했습니다. 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
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

      {/* 채팅 목록 또는 선택한 대화가 로딩 중이면 전체 채팅 영역을 흐리게 표시합니다. */}
      <PageLoading isLoading={isLoading || isMessageLoading}>
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
            {!isLoading && filteredRooms.length === 0 ? <ChatEmpty>찾을 수 없습니다</ChatEmpty> : null}
            {filteredRooms.map((room) => (
              <ChatRoomItem
                key={room.roomId}
                type="button"
                $active={String(room.roomId) === String(selectedRoomId)}
                onClick={() => {
                  setSelectedRoomId(room.roomId);
                  setIsLandPanelOpen(true);
                }}
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
                {!isLandPanelOpen && selectedLand ? (
                  <ChatActionButton type="button" $variant="outline" onClick={() => setIsLandPanelOpen(true)}>
                    <Map size={15} />
                    토지 정보
                  </ChatActionButton>
                ) : null}
              </ChatRoomHeader>

              {error ? <ChatStatusText $error>{error}</ChatStatusText> : null}
              {statusMessage ? <ChatStatusText>{statusMessage}</ChatStatusText> : null}

              <ChatMessageArea>
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
                    disabled={isSending}
                    maxLength={2000}
                    onChange={(event) => setMessageInput(event.target.value)}
                    placeholder="메시지를 입력하세요..."
                  />
                </ChatInputBox>
                <ChatActionButton type="submit" disabled={!messageInput.trim() || isSending || !isSocketConnected}>
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

        {isLandPanelOpen ? <ChatLandPanel>
          <ChatLandHeader>
            <h2>토지 정보</h2>
            <ChatLandCloseButton
              type="button"
              onClick={() => setIsLandPanelOpen(false)}
              aria-label="토지 정보 닫기"
            >
              <X size={18} strokeWidth={2} />
            </ChatLandCloseButton>
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
                  {/* 사업 희망과 미분류도 다른 토지 화면과 같은 기준으로 표시합니다. */}
                  <strong>{getTransactionLabel(selectedLand.transactionType)}</strong>
                </ChatLandRow>
                <ChatLandRow>
                  <span>희망 가격</span>
                  <strong>{formatPrice(selectedLand.desiredPrice)}</strong>
                </ChatLandRow>
              </ChatLandInfo>
              <ChatLeaveButton type="button" onClick={() => setIsLeaveConfirmOpen(true)} disabled={isDeleting}>
                <LogOut size={15} />
                채팅방 삭제
              </ChatLeaveButton>
            </>
          ) : (
            <ChatEmpty>찾을 수 없습니다</ChatEmpty>
          )}
        </ChatLandPanel> : null}
      </ChatShell>
      </PageLoading>
      <Specific land={detailLand} onClose={() => setDetailLand(null)} />
    </ChatPage>
  );
}

// 계정이 바뀌면 이전 계정의 대화 상태와 연결을 모두 폐기합니다.
export default function Chat() {
  const token = useAuthToken();
  return <ChatSession key={token || "anonymous"} token={token} />;
}
