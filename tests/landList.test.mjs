import test from "node:test";
import assert from "node:assert/strict";
import { formatLandDate, landTimestamp, compareNullableNumbers } from "../src/utils/landList.js";

// 억·만원 경계와 누락 금액에서도 원 단위 정렬을 유지합니다.
test("가격 정렬은 표시 단위와 무관하며 누락값은 마지막", () => {
  const values = [400000000, 90000000, null, "150000000", 0];
  assert.deepEqual([...values].sort(compareNullableNumbers), [0, 90000000, "150000000", 400000000, null]);
  assert.deepEqual([...values].sort((a, b) => compareNullableNumbers(a, b, true)), [400000000, "150000000", 90000000, 0, null]);
});

// 한국 새벽 시각, UTC, 오프셋 없는 응답을 같은 날짜로 표시합니다.
test("등록일은 한국 날짜로 표시", () => {
  for (const value of ["2026-10-02T01:00:00+09:00", "2026-10-01T16:00:00Z", "2026-10-02T01:00:00", "2026-10-02"]) {
    assert.equal(formatLandDate(value), "2026.10.02");
  }
  assert.equal(formatLandDate(null), "-");
  assert.equal(formatLandDate("invalid"), "-");
  const milliseconds = Date.parse("2026-10-01T16:00:00Z");
  assert.equal(formatLandDate(milliseconds), "2026.10.02");
  assert.equal(formatLandDate(milliseconds / 1000), "2026.10.02");
});

// 같은 날 등록된 토지도 시·분·초 순서를 유지합니다.
test("최근 등록순은 같은 날의 시간까지 비교", () => {
  const dates = ["2026-10-02T01:00:00", null, "2026-10-02T18:00:00"];
  assert.deepEqual(dates.sort((a, b) => compareNullableNumbers(landTimestamp(a), landTimestamp(b), true)),
    ["2026-10-02T18:00:00", "2026-10-02T01:00:00", null]);
});
