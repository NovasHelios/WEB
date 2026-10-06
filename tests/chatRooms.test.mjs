import test from "node:test";
import assert from "node:assert/strict";
import { addClosedChatRoomId, filterOpenChatRooms } from "../src/lib/chatRooms.js";

// 실제 브라우저 저장소 대신 메모리 저장소로 계정 격리를 검증합니다.
test("채팅 숨김은 계정별로 분리하고 같은 토지의 새 방은 유지", () => {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
  };
  globalThis.window = { dispatchEvent() {} };
  globalThis.CustomEvent = class {};
  const login = (sub) => localStorage.setItem("accessToken", `header.${Buffer.from(JSON.stringify({ sub })).toString("base64url")}.signature`);
  const room = { roomId: 1, landId: 7, counterpartEmail: "provider@example.test" };
  login("A");
  addClosedChatRoomId(room.roomId);
  assert.equal(filterOpenChatRooms([room]).length, 0);
  assert.equal(filterOpenChatRooms([{ ...room, roomId: 2 }]).length, 1);
  login("B");
  assert.equal(filterOpenChatRooms([room]).length, 1);
  login("A");
  assert.equal(filterOpenChatRooms([room]).length, 0);
  localStorage.setItem("accessToken", "invalid");
  assert.equal(filterOpenChatRooms([room]).length, 1);
});
