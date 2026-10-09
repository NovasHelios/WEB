// AI 보고서 요청 상태를 관리하기 위한 React 훅입니다.
import { useEffect, useState } from "react";

// 선택한 토지의 AI 분석 보고서를 조회하는 함수입니다.
import { fetchAiReport } from "@/pages/Main/landApi";
import { useAccount } from "@/contexts/AccountContext";
import useAuthToken from "@/hooks/useAuthToken";
import ReportAccessGate from "./ReportAccessGate";
import { readReportText } from "@/utils/apiResponse";

// 선택한 토지의 태양광 적합도와 AI 보고서를 표시하는 컴포넌트입니다.
function ReportContent({ landId }) {
  // 서버에서 받은 AI 분석 보고서 본문입니다.
  const [report, setReport] = useState("");
  // AI 보고서를 요청하고 있는지 나타냅니다.
  const [isLoading, setIsLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  // AI 보고서 조회에 실패했을 때 표시할 메시지입니다.
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 이전 토지의 비동기 응답이 현재 화면에 반영되는 것을 막습니다.
    let ignore = false;
    const controller = new AbortController();
    // 생성 지연은 기다리되 무한 대기하지 않고 재시도 경로를 제공합니다.
    const timeout = window.setTimeout(() => controller.abort(), 60000);

    // 선택한 토지의 AI 분석 보고서를 불러옵니다.
    const loadAiReport = async () => {
      // 토지 ID가 없으면 기존 보고서 상태만 초기화합니다.
      if (landId === undefined || landId === null || landId === "") {
        window.clearTimeout(timeout);
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
        const data = await fetchAiReport(landId, { signal: controller.signal });

        // 컴포넌트가 사라졌거나 다른 토지로 변경됐다면 결과를 반영하지 않습니다.
        if (ignore) return;

        // 서버가 반환한 report 문자열을 화면 상태에 저장합니다.
        setReport(readReportText(data));
      } catch (error) {
        // 현재 요청이 유효할 때만 오류 메시지를 저장합니다.
        if (!ignore) {
          setErrorMessage(
            controller.signal.aborted ? "보고서 조회 시간이 초과됐습니다. 잠시 후 다시 시도해 주세요." : error?.message || "AI 분석 보고서를 불러오지 못했습니다."
          );
        }
      } finally {
        window.clearTimeout(timeout);
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
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [landId, attempt]);

  return (
    // 보고서 조회 상태와 오류 복구 동작을 표시합니다.
    <section aria-live="polite">
      {/* AI 보고서를 요청하는 동안 로딩 문구를 표시합니다. */}
      {isLoading && <p>AI 분석 보고서를 불러오는 중입니다.</p>}

      {/* AI 보고서 조회에 실패하면 서버 또는 기본 오류 문구를 표시합니다. */}
      {!isLoading && errorMessage && <div role="alert"><p>{errorMessage}</p><button type="button" onClick={() => setAttempt((value) => value + 1)}>다시 시도</button></div>}

      {/* 조회가 끝나면 서버에서 받은 AI 분석 보고서를 표시합니다. */}
      {!isLoading && !errorMessage && (
        <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{report || "등록된 분석 보고서가 없습니다."}</p>
      )}
    </section>
  );
}

// 로그인·플랜 확인이 끝난 경우에만 보고서 컴포넌트를 마운트해 API를 호출합니다.
export default function SolarSuitability({ landId }) {
  const { isLoggedIn, user, accountError, isAccountLoading, retryAccount } = useAccount();
  const token = useAuthToken();
  if (!isLoggedIn) return <ReportAccessGate requiresLogin />;
  if (isAccountLoading) return <p role="status">계정 정보를 확인하고 있어요.</p>;
  if (accountError || !user) return <div role="alert"><p>{accountError || "계정 정보를 확인할 수 없습니다."}</p><button type="button" onClick={retryAccount}>다시 확인</button></div>;
  if (user.plan === "FREE") return <ReportAccessGate requiresLogin={false} />;
  if (!["PRO", "BUSINESS"].includes(user.plan)) return <p role="status">이용 중인 플랜을 확인할 수 없습니다. 프로필에서 플랜을 확인해 주세요.</p>;
  return <ReportContent key={`${token}:${landId}`} landId={landId} />;
}
