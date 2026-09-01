import { authFetch } from "@/lib/auth";

// 서버에서 단일 토지 상세 정보를 가져옵니다.
export const fetchLandDetail = async (landId) => {
  // landId가 없으면 상세 조회를 하지 않습니다.
  if (!landId) return null;

  try {
    // 서버의 단일 토지 상세 조회 API를 호출합니다.
    const response = await fetch(`/api/lands/${landId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 서버 응답 JSON을 파싱합니다.
    const result = await response.json();

    // 서버 응답이 실패하면 에러를 발생시킵니다.
    if (!response.ok) {
      throw new Error(result.message || "토지 상세 정보 조회에 실패했습니다.");
    }

    // 서버 응답의 data만 상세 정보로 사용합니다.
    return result.data || null;
  } catch (error) {
    // 상세 조회 실패 시 기존 마커 정보를 사용할 수 있도록 null을 반환합니다.
    console.error("토지 상세 정보 조회 실패:", error);
    return null;
  }
};

// 필터 조건으로 서버에서 토지 목록을 조회합니다.
export const fetchFilteredLandList = async (requestBody) => {
  // 백엔드에서 필터링된 토지 목록을 조회합니다.
  const response = await authFetch("/api/lands/filter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  // 서버 응답을 JSON으로 변환합니다.
  const result = await response.json();

  // 응답 상태와 원본 결과를 호출부에서 확인할 수 있도록 함께 반환합니다.
  return {
    status: response.status,
    ok: response.ok,
    result,
  };
};
