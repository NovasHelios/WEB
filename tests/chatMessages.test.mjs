import test from "node:test";
import assert from "node:assert/strict";
import { mergeChatMessages } from "../src/utils/chatMessages.js";

// 같은 문구 재전송과 HTTP·소켓 중복 수신을 구분합니다.
test("같은 문구라도 메시지 ID가 다르면 모두 유지", () => {
  assert.equal(mergeChatMessages([{ messageId: 1, content: "네" }], [{ messageId: 2, content: "네" }]).length, 2);
});
test("동일 ID의 전송 응답과 소켓 수신은 한 번만 표시", () => {
  assert.equal(mergeChatMessages([{ messageId: 2 }], [{ messageId: "2" }]).length, 1);
});
test("저장 ID 없는 메시지는 저장 완료 목록에 추가하지 않음", () => {
  assert.deepEqual(mergeChatMessages([], [{ content: "네" }]), []);
});
