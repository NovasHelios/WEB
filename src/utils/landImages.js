const arrayKeys = ["landImagePaths", "imagePaths", "images", "imageUrls", "landImages", "files"];
const scalarKeys = ["landImagePath", "imagePath", "thumbnailPath", "thumbnailUrl"];

// 새 이미지 응답에 포함된 경로만 사용해 기존 배열과 단일 경로의 충돌을 없앱니다.
export function mergeLandImages(land, update, fallback) {
  const data = update && typeof update === "object" && !Array.isArray(update) ? update : {};
  const scalar = scalarKeys.map((key) => data[key]).find((value) => typeof value === "string" && value);
  const paths = arrayKeys.flatMap((key) => Array.isArray(data[key]) ? data[key] : [])
    .map((item) => typeof item === "string" ? item : item?.url || item?.path || item?.filePath || item?.imageUrl)
    .filter(Boolean);
  const nextPaths = [...new Set([scalar, ...paths].filter(Boolean))];
  if (!nextPaths.length && fallback) nextPaths.push(fallback);
  const result = { ...land, ...data };
  for (const key of [...arrayKeys, ...scalarKeys]) delete result[key];
  return { ...result, landImagePaths: nextPaths, landImagePath: nextPaths[0] || "" };
}
