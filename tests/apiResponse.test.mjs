import test from "node:test";
import assert from "node:assert/strict";
import { readApiResponse, readReportText } from "../src/utils/apiResponse.js";

// 프록시 HTML 오류·잘못된 JSON·보고서 객체 응답이 UI까지 전파되지 않는지 검증합니다.
test("JSON 오류 응답은 서버 안내를 사용", async () => {
  await assert.rejects(readApiResponse(new Response(JSON.stringify({ data: { message: "권한 없음" } }), { status: 403 }), "조회 실패"), /권한 없음/);
});
test("HTML 오류 응답은 기본 안내로 변환", async () => {
  await assert.rejects(readApiResponse(new Response("<html>502</html>", { status: 502 }), "조회 실패"), /조회 실패/);
});
test("성공 상태의 잘못된 JSON도 오류로 처리", async () => {
  await assert.rejects(readApiResponse(new Response("invalid"), "조회 실패"), /응답 형식/);
});
test("보고서 문자열과 빈 본문 처리", () => {
  assert.equal(readReportText({ report: "분석 결과\n주의사항" }), "분석 결과\n주의사항");
  assert.equal(readReportText(null), "");
  assert.throws(() => readReportText({ report: { text: "잘못된 형식" } }), /보고서 형식/);
});
