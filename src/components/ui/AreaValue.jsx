// 실제 면적과 희망 면적에 같은 단위·빈값·줄바꿈 규칙을 적용합니다.
export default function AreaValue({ value }) {
  const area = Number(String(value ?? "").replace(/,/g, "").replace(/\s*(㎡|m²|m2)\s*$/, "").trim());
  if (!Number.isFinite(area) || area <= 0) return <span>정보 없음</span>;
  const number = area.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  const pyeong = Math.round(area / 3.3058).toLocaleString("ko-KR");
  return <span style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.25em" }}>
    <span style={{ whiteSpace: "nowrap" }}>{number}㎡</span>
    <span style={{ whiteSpace: "nowrap" }}>(약 {pyeong}평)</span>
  </span>;
}
