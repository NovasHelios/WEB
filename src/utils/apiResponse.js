// HTML 오류 페이지나 빈 응답을 JSON 오류 그대로 노출하지 않도록 정리합니다.
export async function readApiResponse(response, fallbackMessage) {
  let result;
  try { result = await response.json(); }
  catch { throw new Error(response.ok ? "서버 응답 형식을 확인할 수 없습니다. 다시 시도해 주세요." : fallbackMessage); }
  if (!response.ok) {
    const message = result?.data?.message || result?.message;
    throw new Error(typeof message === "string" ? message : fallbackMessage);
  }
  return result;
}

// 보고서 본문은 문자열만 렌더링해 잘못된 객체 응답으로 화면이 멈추지 않게 합니다.
export function readReportText(data) {
  if (data?.report == null) return "";
  if (typeof data.report !== "string") throw new Error("보고서 형식을 확인할 수 없습니다. 다시 시도해 주세요.");
  return data.report;
}
