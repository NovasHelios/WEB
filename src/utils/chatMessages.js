// 본문이 같아도 ID가 다르면 별개 메시지이며 HTTP·소켓 중복 응답은 하나로 합칩니다.
// 시간대가 없는 서버 시각은 한국 현지 시각으로 해석하고, 명시된 오프셋은 그대로 존중합니다.
export function parseChatTimestamp(value) {
  if (!value) return NaN;
  const timestamp = String(value);
  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(timestamp);
  return Date.parse(hasTimezone ? timestamp : `${timestamp}+09:00`);
}

export function mergeChatMessages(current, incoming) {
  const byId = new Map();
  for (const message of [...current, ...incoming]) {
    if (message?.messageId == null) continue;
    byId.set(String(message.messageId), message);
  }
  return [...byId.values()].sort((a, b) => {
    const timeA = parseChatTimestamp(a.sentAt) || 0;
    const timeB = parseChatTimestamp(b.sentAt) || 0;
    return timeA - timeB;
  });
}
