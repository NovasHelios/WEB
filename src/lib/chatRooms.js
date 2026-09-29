const CLOSED_CHAT_ROOM_IDS_KEY = "heliosClosedChatRoomIds";
const CLOSED_CHAT_ROOM_MATCHES_KEY = "heliosClosedChatRoomMatches";
export const CHAT_ROOMS_CHANGED_EVENT = "helios:chat-rooms-changed";

const normalizeRoomId = (roomId) => String(roomId || "").trim();
const normalizeValue = (value) => String(value || "").trim().toLowerCase();

const readJsonArray = (key) => {
  // localStorage 값이 깨져도 채팅 목록이 멈추지 않게 빈 배열로 복구합니다.
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const buildRoomMatch = (room) => ({
  // 서버가 나간 방을 다른 roomId로 다시 내려줘도 같은 토지/상대면 숨길 수 있게 보관합니다.
  roomId: normalizeRoomId(room?.roomId || room?.id || room?.chatRoomId),
  landId: normalizeValue(room?.landId || room?.land?.id || room?.land?.landId || room?.targetLandId),
  landAddress: normalizeValue(room?.landAddress || room?.address || room?.land?.address),
  counterpartEmail: normalizeValue(
    room?.counterpartEmail ||
      room?.otherUserEmail ||
      room?.receiverEmail ||
      room?.senderEmail ||
      room?.counterpart?.email,
  ),
});

export const getClosedChatRoomIds = () => {
  // 나간 채팅방은 서버 응답 지연 중에도 목록에 다시 보이지 않게 로컬에 보관합니다.
  return readJsonArray(CLOSED_CHAT_ROOM_IDS_KEY).map(normalizeRoomId).filter(Boolean);
};

export const addClosedChatRoomId = (roomId, room = null) => {
  // 채팅방 나가기 직후 같은 roomId를 즉시 숨깁니다.
  const normalizedRoomId = normalizeRoomId(roomId);
  if (!normalizedRoomId && !room) return;

  const nextIds = Array.from(new Set([...getClosedChatRoomIds(), normalizedRoomId].filter(Boolean)));
  const closedMatches = readJsonArray(CLOSED_CHAT_ROOM_MATCHES_KEY);
  const nextMatch = buildRoomMatch(room || { roomId });
  const nextMatches = [
    ...closedMatches.filter(
      (match) =>
        normalizeRoomId(match.roomId) !== nextMatch.roomId &&
        !(
          nextMatch.landId &&
          nextMatch.counterpartEmail &&
          normalizeValue(match.landId) === nextMatch.landId &&
          normalizeValue(match.counterpartEmail) === nextMatch.counterpartEmail
        ) &&
        !(
          nextMatch.landAddress &&
          nextMatch.counterpartEmail &&
          normalizeValue(match.landAddress) === nextMatch.landAddress &&
          normalizeValue(match.counterpartEmail) === nextMatch.counterpartEmail
        ),
    ),
    nextMatch,
  ];

  localStorage.setItem(CLOSED_CHAT_ROOM_IDS_KEY, JSON.stringify(nextIds));
  localStorage.setItem(CLOSED_CHAT_ROOM_MATCHES_KEY, JSON.stringify(nextMatches));
  window.dispatchEvent(new CustomEvent(CHAT_ROOMS_CHANGED_EVENT));
};

export const removeClosedChatRoomMatch = (room = {}) => {
  // 사용자가 같은 토지로 채팅을 다시 시작한 경우 그 방만 목록에 다시 보이게 합니다.
  const target = buildRoomMatch(room);
  const removedRoomIds = new Set();
  const nextMatches = readJsonArray(CLOSED_CHAT_ROOM_MATCHES_KEY).filter((match) => {
    const sameRoomId = target.roomId && normalizeRoomId(match.roomId) === target.roomId;
    const sameLand = target.landId && normalizeValue(match.landId) === target.landId;
    const sameAddress = target.landAddress && normalizeValue(match.landAddress) === target.landAddress;
    const sameCounterpart = target.counterpartEmail && normalizeValue(match.counterpartEmail) === target.counterpartEmail;
    const shouldRemove =
      sameRoomId ||
      (sameLand && sameCounterpart) ||
      (sameAddress && sameCounterpart) ||
      (sameLand && !target.counterpartEmail) ||
      (sameAddress && !target.counterpartEmail);

    if (shouldRemove && match.roomId) {
      removedRoomIds.add(normalizeRoomId(match.roomId));
    }

    return !shouldRemove;
  });
  const shouldClearLegacyIds = (target.landId || target.landAddress) && !target.roomId && removedRoomIds.size === 0;
  const nextIds = getClosedChatRoomIds().filter(
    (roomId) => !shouldClearLegacyIds && roomId !== target.roomId && !removedRoomIds.has(roomId),
  );

  localStorage.setItem(CLOSED_CHAT_ROOM_IDS_KEY, JSON.stringify(nextIds));
  localStorage.setItem(CLOSED_CHAT_ROOM_MATCHES_KEY, JSON.stringify(nextMatches));
  window.dispatchEvent(new CustomEvent(CHAT_ROOMS_CHANGED_EVENT));
};

export const isClosedChatRoomId = (roomId) => {
  // roomId 타입이 숫자/문자열로 섞여도 같은 방으로 판단합니다.
  return getClosedChatRoomIds().includes(normalizeRoomId(roomId));
};

export const filterOpenChatRooms = (rooms) => {
  // 나간 채팅방을 목록 응답에서 제외합니다.
  const closedIds = new Set(getClosedChatRoomIds());
  const closedMatches = readJsonArray(CLOSED_CHAT_ROOM_MATCHES_KEY);

  return rooms.filter((room) => {
    const roomMatch = buildRoomMatch(room);
    if (closedIds.has(roomMatch.roomId)) return false;

    return !closedMatches.some((match) => {
      const sameLand = roomMatch.landId && normalizeValue(match.landId) === roomMatch.landId;
      const sameAddress = roomMatch.landAddress && normalizeValue(match.landAddress) === roomMatch.landAddress;
      const sameCounterpart =
        roomMatch.counterpartEmail && normalizeValue(match.counterpartEmail) === roomMatch.counterpartEmail;

      return (sameLand || sameAddress) && (!normalizeValue(match.counterpartEmail) || sameCounterpart);
    });
  });
};
