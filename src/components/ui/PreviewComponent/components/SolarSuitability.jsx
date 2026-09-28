// AI 보고서 요청 상태를 관리하기 위한 React 훅입니다.
import { useEffect, useState } from "react";

// 선택한 토지의 AI 분석 보고서를 조회하는 함수입니다.
import { fetchAiReport } from "@/pages/Main/landApi";

// 선택한 토지의 태양광 적합도와 AI 보고서를 표시하는 컴포넌트입니다.
function SolarSuitability({ landId }) {
  // 서버에서 받은 AI 분석 보고서 본문입니다.
  const [report, setReport] = useState("");
  // AI 보고서를 요청하고 있는지 나타냅니다.
  const [isLoading, setIsLoading] = useState(false);
  // AI 보고서 조회에 실패했을 때 표시할 메시지입니다.
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 이전 토지의 비동기 응답이 현재 화면에 반영되는 것을 막습니다.
    let ignore = false;

    // 선택한 토지의 AI 분석 보고서를 불러옵니다.
    const loadAiReport = async () => {
      // 토지 ID가 없으면 기존 보고서 상태만 초기화합니다.
      if (landId === undefined || landId === null || landId === "") {
        setReport("");
        setErrorMessage("");
        setIsLoading(false);
        return;
      }

      // 새 요청을 시작하기 전에 이전 보고서와 오류를 초기화합니다.
      setReport("");
      setErrorMessage("");
      setIsLoading(true);

      try {
        // 현재 선택된 토지 ID로 AI 보고서를 요청합니다.
        const data = await fetchAiReport(landId);

        // 컴포넌트가 사라졌거나 다른 토지로 변경됐다면 결과를 반영하지 않습니다.
        if (ignore) return;

        // 서버가 반환한 report 문자열을 화면 상태에 저장합니다.
        setReport(data?.report || "");
      } catch (error) {
        // 현재 요청이 유효할 때만 오류 메시지를 저장합니다.
        if (!ignore) {
          setErrorMessage(
            error?.message || "AI 분석 보고서를 불러오지 못했습니다."
          );
        }
      } finally {
        // 현재 요청이 유효할 때만 로딩 상태를 종료합니다.
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    // 선택된 토지가 바뀔 때 AI 보고서 조회를 실행합니다.
    void loadAiReport();

    return () => {
      // 컴포넌트가 사라지거나 landId가 바뀌면 이전 요청을 무시합니다.
      ignore = true;
    };
  }, [landId]);

  return (
    // 다음 단계에서 태양광 적합도 디자인을 적용할 임시 콘텐츠 영역입니다.
    <section aria-live="polite">
      {/* AI 보고서를 요청하는 동안 로딩 문구를 표시합니다. */}
      {isLoading && <p>AI 분석 보고서를 불러오는 중입니다.</p>}

      {/* AI 보고서 조회에 실패하면 서버 또는 기본 오류 문구를 표시합니다. */}
      {!isLoading && errorMessage && <p>{errorMessage}</p>}

      {/* 조회가 끝나면 서버에서 받은 AI 분석 보고서를 표시합니다. */}
      {!isLoading && !errorMessage && (
        <p>{report || "아직 지원하지 않는 기능입니다"}</p>
      )}
    </section>
  );
}

export default SolarSuitability;
