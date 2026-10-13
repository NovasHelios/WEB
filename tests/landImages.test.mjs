import test from "node:test";
import assert from "node:assert/strict";
import { mergeLandImages } from "../src/utils/landImages.js";

// 목록과 수정창에서 서로 다른 이미지 경로를 선택하지 않도록 정규화합니다.
test("새 단일 경로는 이전 이미지 배열을 대체", () => {
  const result = mergeLandImages({ landImagePaths: ["old.jpg"], images: ["old.jpg"] }, { landImagePath: "new.jpg" });
  assert.deepEqual(result.landImagePaths, ["new.jpg"]);
  assert.equal(result.images, undefined);
});
test("새 이미지 배열과 나머지 토지 정보 유지", () => {
  const result = mergeLandImages({ address: "주소", landImagePath: "old.jpg" }, { landImagePaths: ["a.jpg", "b.jpg"] });
  assert.equal(result.landImagePath, "a.jpg");
  assert.equal(result.address, "주소");
});
test("경로가 없으면 업로드한 이미지의 미리보기 사용", () => {
  assert.deepEqual(mergeLandImages({ landImagePaths: ["old.jpg"] }, null, "blob:new").landImagePaths, ["blob:new"]);
});
