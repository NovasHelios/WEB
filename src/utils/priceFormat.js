export const formatKoreanMoneyFromManwon = (value, emptyText = "-") => {
  // 서버와 등록 입력값은 만원 단위로 관리합니다.
  if (value === null || value === undefined || value === "") return emptyText;

  const numeric = typeof value === "number" ? value : Number(String(value).replace(/[^\d]/g, ""));
  if (Number.isNaN(numeric)) return String(value);

  const jo = Math.floor(numeric / 100000000);
  const restAfterJo = numeric % 100000000;
  const eok = Math.floor(restAfterJo / 10000);
  const man = numeric % 10000;

  if (jo > 0) {
    // 조 단위 이상은 카드가 깨지지 않도록 대표 단위만 약식으로 표시합니다.
    const roundedJo = eok >= 5000 ? jo + 1 : jo;
    return `약 ${roundedJo.toLocaleString("ko-KR")}조`;
  }

  if (eok > 0 && man > 0) {
    return `${eok.toLocaleString("ko-KR")}억 ${man.toLocaleString("ko-KR")}만원`;
  }

  if (eok > 0) {
    return `${eok.toLocaleString("ko-KR")}억원`;
  }

  return `${numeric.toLocaleString("ko-KR")}만원`;
};

export const formatCompactKoreanMoneyFromManwon = (value, emptyText = "-") => {
  // 좁은 지도 마커에서는 가격을 짧은 단위로 축약합니다.
  if (value === null || value === undefined || value === "") return emptyText;

  const numeric = typeof value === "number" ? value : Number(String(value).replace(/[^\d]/g, ""));
  if (Number.isNaN(numeric)) return String(value);

  const jo = Math.floor(numeric / 100000000);
  const eok = Math.floor((numeric % 100000000) / 10000);
  const man = numeric % 10000;

  if (jo > 0) {
    // 지도 마커는 더 좁아서 약식 가격만 표시합니다.
    const roundedJo = eok >= 5000 ? jo + 1 : jo;
    return `약 ${roundedJo.toLocaleString("ko-KR")}조`;
  }
  if (eok > 0) return `약 ${eok.toLocaleString("ko-KR")}억`;
  return `${numeric.toLocaleString("ko-KR")}만`;
};

export const formatExactKoreanMoneyFromManwon = (value, emptyText = "-") => {
  // 상세보기에서는 만원 단위 가격을 생략 없이 표시합니다.
  if (value === null || value === undefined || value === "") return emptyText;

  const numeric = typeof value === "number" ? value : Number(String(value).replace(/[^\d]/g, ""));
  if (Number.isNaN(numeric)) return String(value);

  const jo = Math.floor(numeric / 100000000);
  const restAfterJo = numeric % 100000000;
  const eok = Math.floor(restAfterJo / 10000);
  const man = restAfterJo % 10000;
  const parts = [];

  if (jo > 0) parts.push(`${jo.toLocaleString("ko-KR")}조`);
  if (eok > 0) parts.push(`${eok.toLocaleString("ko-KR")}억`);
  if (man > 0 || parts.length === 0) parts.push(`${man.toLocaleString("ko-KR")}만원`);

  return parts.join(" ");
};
