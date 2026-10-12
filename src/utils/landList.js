// 서버의 오프셋 없는 등록 시각은 서비스 기준인 한국 시간으로 해석합니다.
export function landTimestamp(value) {
  if (value === null || value === undefined || value === "") return null;
  let input = value;
  if (typeof input === "number" && input < 100000000000) input *= 1000;
  if (typeof input === "string" && /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?$/.test(input)) {
    input = `${input.length === 10 ? `${input}T00:00:00` : input.replace(" ", "T")}+09:00`;
  }
  const timestamp = new Date(input).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

// 등록일은 브라우저 위치와 무관하게 한국 날짜로 표시합니다.
export function formatLandDate(value) {
  const timestamp = landTimestamp(value);
  if (timestamp === null) return "-";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(timestamp);
  const get = (type) => parts.find((part) => part.type === type).value;
  return `${get("year")}.${get("month")}.${get("day")}`;
}

// 표시용 억/만원 문자열이 아닌 원 단위 숫자로 정렬합니다. 누락값은 끝에 둡니다.
export function compareNullableNumbers(a, b, descending = false) {
  const parse = (value) => value === null || value === undefined || value === "" ? NaN : Number(value);
  const left = parse(a);
  const right = parse(b);
  if (!Number.isFinite(left)) return Number.isFinite(right) ? 1 : 0;
  if (!Number.isFinite(right)) return -1;
  return descending ? right - left : left - right;
}
