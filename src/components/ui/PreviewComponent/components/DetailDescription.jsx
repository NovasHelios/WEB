// 상세 설명과 AI 종합 평가의 요청 상태를 관리하기 위한 React 훅입니다.
import { useEffect, useState } from "react";

// 계정과 인증 상태에 따라 AI 종합 평가 API 호출 여부를 결정합니다.
import { useAccount } from "@/contexts/AccountContext";
import useAuthToken from "@/hooks/useAuthToken";
import { fetchLandDevelopmentAnalysis } from "@/pages/Main/landApi";
import {
  AnalysisError,
  AnalysisRetryButton,
  AnalysisStatusMessage,
  DetailDescriptionBox,
  DetailDescriptionContent,
  DetailDescriptionSection,
  DetailDescriptionText,
  DetailDescriptionTitle,
} from "../Preview.styeld";

// AI 종합 평가 API를 사용할 수 있는 유료 플랜 목록입니다.
const ANALYSIS_PLANS = ["PRO", "BUSINESS"];

// 등록자 설명과 개발 적합도 분석의 AI 종합 평가를 표시합니다.
export default function DetailDescription({ landId, description }) {
  // 현재 계정의 로그인, 플랜, 오류 상태를 가져옵니다.
  const { isLoggedIn, user, accountError, isAccountLoading, retryAccount } =
    useAccount();
  // 인증 토큰이 변경되면 현재 토지의 분석을 다시 요청합니다.
  const token = useAuthToken();
  // 서버에서 받은 AI 종합 평가 문장입니다.
  const [rationale, setRationale] = useState("");
  // AI 종합 평가를 요청하고 있는지 나타냅니다.
  const [isLoading, setIsLoading] = useState(false);
  // AI 종합 평가 조회에 실패했을 때 표시할 메시지입니다.
  const [errorMessage, setErrorMessage] = useState("");
  // 실패한 AI 종합 평가 요청을 다시 실행하기 위한 값입니다.
  const [attempt, setAttempt] = useState(0);

  // 로그인 계정이 개발 적합도 분석을 사용할 수 있는 플랜인지 확인합니다.
  const canRequestAnalysis =
    isLoggedIn && ANALYSIS_PLANS.includes(user?.plan);
  // 유효한 토지 ID가 있을 때만 개발 적합도 분석을 요청합니다.
  const hasLandId =
    landId !== undefined && landId !== null && landId !== "";
  // 계정 권한과 토지 ID 조건을 모두 충족한 경우에만 API를 호출합니다.
  const canLoadAnalysis = canRequestAnalysis && hasLandId;

  useEffect(() => {
    // 계정 확인 중이거나 요청 조건이 충족되지 않으면 API를 호출하지 않습니다.
    if (isAccountLoading || accountError || !canLoadAnalysis) return undefined;

    // 이전 토지의 비동기 응답이 현재 화면에 반영되는 것을 막습니다.
    let ignore = false;
    const controller = new AbortController();
    // 생성 지연은 기다리되 무한 대기하지 않고 재시도 경로를 제공합니다.
    const timeout = window.setTimeout(() => controller.abort(), 60000);

    // 현재 토지의 개발 적합도 분석에서 AI 종합 평가를 가져옵니다.
    const loadRationale = async () => {
      setRationale("");
      setErrorMessage("");
      setIsLoading(true);

      try {
        // 태양광 적합도와 동일한 개발 적합도 분석 API를 호출합니다.
        const data = await fetchLandDevelopmentAnalysis(landId, {
          signal: controller.signal,
        });

        // 컴포넌트가 사라졌거나 다른 토지로 변경됐다면 결과를 반영하지 않습니다.
        if (ignore) return;

        // 문자열 형식의 분석 근거만 AI 종합 평가로 저장합니다.
        setRationale(
          typeof data?.rationale === "string" ? data.rationale : ""
        );
      } catch (error) {
        // 현재 요청이 유효할 때만 오류 메시지를 저장합니다.
        if (!ignore) {
          setErrorMessage(
            controller.signal.aborted
              ? "분석 조회 시간이 초과됐습니다. 잠시 후 다시 시도해 주세요."
              : error?.message || "AI 종합 평가를 불러오지 못했습니다."
          );
        }
      } finally {
        window.clearTimeout(timeout);
        // 현재 요청이 유효할 때만 로딩 상태를 종료합니다.
        if (!ignore) setIsLoading(false);
      }
    };

    // 상세 설명 탭이 열리거나 재시도할 때 AI 종합 평가를 요청합니다.
    void loadRationale();

    return () => {
      // 컴포넌트가 사라지거나 요청 조건이 바뀌면 이전 요청을 취소합니다.
      ignore = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [accountError, attempt, canLoadAnalysis, isAccountLoading, landId, token]);

  return (
    <DetailDescriptionContent>
      {/* 토지 등록자가 작성한 상세 설명을 표시합니다. */}
      <DetailDescriptionSection>
        <DetailDescriptionTitle>설명글</DetailDescriptionTitle>
        <DetailDescriptionBox>
          <DetailDescriptionText>
            {description || "등록된 설명글이 없습니다."}
          </DetailDescriptionText>
        </DetailDescriptionBox>
      </DetailDescriptionSection>

      {/* 개발 적합도 API에서 받은 분석 근거를 AI 종합 평가로 표시합니다. */}
      <DetailDescriptionSection>
        <DetailDescriptionTitle>AI 종합 평가</DetailDescriptionTitle>
        <DetailDescriptionBox aria-live="polite">
          {/* 로그인 전에는 API를 호출하지 않고 로그인 필요 상태를 표시합니다. */}
          {!isLoggedIn && (
            <AnalysisStatusMessage $compact>
              로그인 후 AI 종합 평가를 확인할 수 있습니다.
            </AnalysisStatusMessage>
          )}

          {/* 로그인 계정 정보를 확인하는 동안 로딩 상태를 표시합니다. */}
          {isLoggedIn && isAccountLoading && (
            <AnalysisStatusMessage $compact role="status">
              계정 정보를 확인하고 있습니다.
            </AnalysisStatusMessage>
          )}

          {/* 계정 정보 조회 실패 시 계정 확인을 다시 실행합니다. */}
          {isLoggedIn && !isAccountLoading && (accountError || !user) && (
            <AnalysisError role="alert">
              <p>{accountError || "계정 정보를 확인할 수 없습니다."}</p>
              <AnalysisRetryButton type="button" onClick={retryAccount}>
                다시 확인
              </AnalysisRetryButton>
            </AnalysisError>
          )}

          {/* 무료 플랜에서는 개발 적합도 분석을 요청하지 않습니다. */}
          {isLoggedIn && !isAccountLoading && user?.plan === "FREE" && (
            <AnalysisStatusMessage $compact>
              AI 종합 평가는 유료 플랜에서 제공됩니다.
            </AnalysisStatusMessage>
          )}

          {/* 알 수 없는 플랜은 분석 API를 호출하지 않고 확인 문구를 표시합니다. */}
          {isLoggedIn &&
            !isAccountLoading &&
            user &&
            !accountError &&
            !ANALYSIS_PLANS.includes(user.plan) &&
            user.plan !== "FREE" && (
              <AnalysisStatusMessage $compact>
                이용 중인 플랜을 확인할 수 없습니다.
              </AnalysisStatusMessage>
            )}

          {/* 토지 ID가 없으면 AI 종합 평가 요청 없이 결과 없음 상태를 표시합니다. */}
          {canRequestAnalysis && !hasLandId && (
            <AnalysisStatusMessage $compact>
              등록된 AI 종합 평가가 없습니다.
            </AnalysisStatusMessage>
          )}

          {/* AI 종합 평가를 불러오는 동안 로딩 문구를 표시합니다. */}
          {canLoadAnalysis && isLoading && (
            <AnalysisStatusMessage $compact role="status">
              AI 종합 평가를 불러오는 중입니다.
            </AnalysisStatusMessage>
          )}

          {/* AI 종합 평가 조회에 실패하면 오류와 재시도 버튼을 표시합니다. */}
          {canLoadAnalysis && !isLoading && errorMessage && (
            <AnalysisError role="alert">
              <p>{errorMessage}</p>
              <AnalysisRetryButton
                type="button"
                onClick={() => setAttempt((value) => value + 1)}
              >
                다시 시도
              </AnalysisRetryButton>
            </AnalysisError>
          )}

          {/* 조회가 끝나면 서버에서 받은 AI 종합 평가를 표시합니다. */}
          {canLoadAnalysis && !isLoading && !errorMessage && (
            <DetailDescriptionText>
              {rationale || "등록된 AI 종합 평가가 없습니다."}
            </DetailDescriptionText>
          )}
        </DetailDescriptionBox>
      </DetailDescriptionSection>
    </DetailDescriptionContent>
  );
}
