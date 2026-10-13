// 본문이 같아도 ID가 다르면 별개 메시지이며 HTTP·소켓 중복 응답은 하나로 합칩니다.
export function mergeChatMessages(current, incoming) {
  const byId = new Map();
  for (const message of [...current, ...incoming]) {
    if (message?.messageId == null) continue;
    byId.set(String(message.messageId), message);
  }
  return [...byId.values()].sort((a, b) => {
    const timeA = Date.parse(a.sentAt) || 0;
    const timeB = Date.parse(b.sentAt) || 0;
    return timeA - timeB;
  });
}
