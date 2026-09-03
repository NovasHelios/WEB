export const formatKoreanMoneyFromManwon = (value, emptyText = "-") => {
  // 서버 가격 데이터는 원 단위로 관리합니다.
  if (value === null || value === undefined || value === "") return emptyText;

  const numeric = typeof value === "number" ? value : Number(String(value).replace(/[^\d]/g, ""));
  if (Number.isNaN(numeric)) return String(value);

  const eok = Math.floor(numeric / 100000000);
  const man = Math.floor((numeric % 100000000) / 10000);
  const won = numeric % 10000;

  if (eok > 0 && man > 0) {
    return `${eok.toLocaleString("ko-KR")}억 ${man.toLocaleString("ko-KR")}만원`;
  }

  if (eok > 0) {
    return `${eok.toLocaleString("ko-KR")}억원`;
  }

  if (man > 0) {
    return `${man.toLocaleString("ko-KR")}만원`;
  }

  return `${won.toLocaleString("ko-KR")}원`;
};

export const formatCompactKoreanMoneyFromManwon = (value, emptyText = "-") => {
  // 좁은 지도 마커에서는 원 단위 가격을 짧게 축약합니다.
  if (value === null || value === undefined || value === "") return emptyText;

  const numeric = typeof value === "number" ? value : Number(String(value).replace(/[^\d]/g, ""));
  if (Number.isNaN(numeric)) return String(value);

  const eok = Math.floor(numeric / 100000000);
  const man = Math.floor((numeric % 100000000) / 10000);

  // 지도 마커는 조 단위를 쓰지 않고 억 단위까지만 축약합니다.
  if (eok > 0) return `약 ${eok.toLocaleString("ko-KR")}억`;
  if (man > 0) return `${man.toLocaleString("ko-KR")}만`;
  return `${numeric.toLocaleString("ko-KR")}원`;
};

export const formatExactKoreanMoneyFromManwon = (value, emptyText = "-") => {
  // 상세보기에서는 원 단위 가격을 생략 없이 표시합니다.
  if (value === null || value === undefined || value === "") return emptyText;

  const numeric = typeof value === "number" ? value : Number(String(value).replace(/[^\d]/g, ""));
  if (Number.isNaN(numeric)) return String(value);

  const eok = Math.floor(numeric / 100000000);
  const man = Math.floor((numeric % 100000000) / 10000);
  const won = numeric % 10000;
  const parts = [];

  if (eok > 0) parts.push(`${eok.toLocaleString("ko-KR")}억`);
  if (man > 0) parts.push(`${man.toLocaleString("ko-KR")}만원`);
  if (won > 0 || parts.length === 0) parts.push(`${won.toLocaleString("ko-KR")}원`);

  return parts.join(" ");
};
