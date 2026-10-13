import test from "node:test";
import assert from "node:assert/strict";
import { withRequestTimeout, forEachConcurrent } from "../src/utils/asyncRequests.js";

// 지연된 보완 요청의 동시 실행 개수와 취소 전달을 검증합니다.
test("보완 요청 동시 실행 제한", async () => {
  let active = 0;
  let peak = 0;
  const completed = [];
  await forEachConcurrent([1, 2, 3, 4, 5], async (item) => {
    peak = Math.max(peak, ++active);
    await new Promise((resolve) => setTimeout(resolve, 1));
    completed.push(item);
    active--;
  }, 2);
  assert.equal(peak, 2);
  assert.equal(completed.length, 5);
});
test("제한 시간이 지나면 요청 신호 취소", async () => {
  await assert.rejects(withRequestTimeout((signal) => new Promise((resolve, reject) => {
    signal.addEventListener("abort", () => reject(new Error("취소")));
  }), undefined, 5), /취소/);
});
test("상위 화면 취소도 요청으로 전달", async () => {
  const controller = new AbortController();
  controller.abort();
  await withRequestTimeout(async (signal) => assert.equal(signal.aborted, true), controller.signal);
});
