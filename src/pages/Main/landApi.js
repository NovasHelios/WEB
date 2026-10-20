// 인증 헤더를 포함해 API를 호출합니다.
import { authFetch } from "@/lib/auth";

// 백엔드 API endpoint 목록을 가져옵니다.
import { Api } from "@/contents/apiEndpoints";
import { readApiResponse } from "@/utils/apiResponse";

// 검색 결과에서 사용할 전체 등록 토지 목록을 가져옵니다.
export const fetchAllLandList = async () => {
  // 전체 토지 조회 API를 GET 방식으로 호출합니다.
  const response = await authFetch(Api.Lands, {
    method: "GET",
  });

  // 서버 응답 JSON을 파싱합니다.
  const result = await response.json();

  // 실패 응답이면 검색 결과 화면에서 처리할 수 있도록 에러를 발생시킵니다.
  if (!response.ok) {
    throw new Error(
      result?.data?.message ||
        result?.message ||
        "전체 토지 목록 조회에 실패했습니다."
    );
  }

  // 배열 응답과 페이지 형식 응답을 모두 목록으로 변환합니다.
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.content)) return result.data.content;

  // 예상한 목록 형식이 아니면 빈 배열을 반환합니다.
  return [];
};

// 서버에서 단일 토지 상세 정보를 가져옵니다.
export const fetchLandDetail = async (landId) => {
  // landId가 없으면 상세 조회를 하지 않습니다.
  if (!landId) return null;

  try {
    // 배포 환경에서도 백엔드 도메인으로 토지 상세 조회 API를 호출합니다.
    const response = await fetch(Api.Land(landId), {
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
export const fetchFilteredLandList = async (requestBody, { signal } = {}) => {
  // 배포 환경에서도 백엔드 도메인으로 토지 필터 조회 API를 호출합니다.
  const response = await authFetch(Api.LandFilter, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
    // 새 지도 조회가 시작되면 이전 네트워크 요청을 중단할 수 있게 합니다.
    signal,
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

// 선택한 토지의 개발 적합도 분석 결과를 조회합니다.
export const fetchLandDevelopmentAnalysis = async (landId, { signal } = {}) => {
  // 토지 ID가 없으면 개발 적합도 분석을 요청하지 않습니다.
  if (landId === undefined || landId === null || landId === "") {
    return null;
  }

  // 인증 헤더와 토지 ID를 포함해 개발 적합도 분석 API를 호출합니다.
  const response = await authFetch(Api.LandDevelopmentAnalysis(landId), {
    method: "GET",
    signal,
  });

  // 서버 응답을 JSON으로 변환합니다.
  const result = await readApiResponse(
    response,
    "태양광 적합도 분석을 불러오지 못했습니다."
  );

  // 포장 응답과 분석 객체 직접 응답을 모두 같은 형태로 반환합니다.
  return result?.data ?? result ?? null;
};

// 선택한 토지의 AI 종합 보고서를 조회합니다.
export const fetchSolarSummaryReport = async (landId, { signal } = {}) => {
  // 토지 ID가 없으면 보고서를 요청하지 않습니다.
  if (landId === undefined || landId === null || landId === "") return null;

  // 새 API가 요구하는 landId를 쿼리 파라미터로 전달합니다.
  const params = new URLSearchParams({ landId: String(landId) });
  const response = await authFetch(`${Api.SolarSummary}?${params.toString()}`, {
    method: "GET",
    signal,
  });

  // 포장 응답의 data를 실제 보고서 객체로 반환합니다.
  const result = await readApiResponse(response, "AI 종합 보고서를 불러오지 못했습니다.");
  return result?.data ?? result ?? null;
};
