import test from "node:test";
import assert from "node:assert/strict";
import { validateLandAddress } from "../src/utils/validateLandAddress.js";

// 실제 주소 API 호출 없이 등록·수정의 공통 예외 규칙을 검증합니다.
test("상세주소만 허용하고 SDK 실패와 시간 초과를 차단", async () => {
  const original = globalThis.window;
  let expire;
  const setup = (results, status = "OK") => {
    globalThis.window = {
      setTimeout(callback) { expire = callback; return 1; },
      clearTimeout() {},
      kakao: { maps: { services: {
        Status: { OK: "OK" },
        Geocoder: class { addressSearch(_address, callback) { callback(results, status); } },
      } } },
    };
  };
  try {
    setup([{ address_type: "REGION", address: {} }]);
    assert.equal(await validateLandAddress("대구 달성군"), false);
    setup([{ address_type: "REGION_ADDR", address: { main_address_no: "0" } }]);
    assert.equal(await validateLandAddress("대구 달성군"), false);
    setup([{ address_type: "REGION_ADDR", address: { main_address_no: "324" } }]);
    assert.equal(await validateLandAddress("창리 324"), true);
    setup([{ address_type: "ROAD_ADDR", road_address: { main_building_no: "93" } }]);
    assert.equal(await validateLandAddress("창리로11길 93"), true);
    setup([], "ERROR");
    assert.equal(await validateLandAddress("없는 주소"), false);
    setup(null);
    assert.equal(await validateLandAddress("주소"), false);
    setup([]);
    globalThis.window.kakao.maps.services.Geocoder = class { addressSearch() {} };
    const pending = validateLandAddress("주소");
    expire();
    assert.equal(await pending, false);
    globalThis.window = {};
    assert.equal(await validateLandAddress("주소"), false);
  } finally {
    if (original === undefined) delete globalThis.window;
    else globalThis.window = original;
  }
});
