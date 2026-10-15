// 개발 적합도 분석 요청 상태를 관리하기 위한 React 훅입니다.
import { useEffect, useState } from "react";

// 선택한 토지의 개발 적합도 분석 결과를 조회하는 함수입니다.
import { fetchLandDevelopmentAnalysis } from "@/pages/Main/landApi";
import { useAccount } from "@/contexts/AccountContext";
import useAuthToken from "@/hooks/useAuthToken";
import ReportAccessGate from "./ReportAccessGate";
import {
  AnalysisCard,
  AnalysisCardTitle,
  AnalysisBlurLayer,
  AnalysisContent,
  AnalysisError,
  AnalysisReportBox,
  AnalysisReportItem,
  AnalysisReportItemText,
  AnalysisReportItemTitle,
  AnalysisReportList,
  AnalysisReportSection,
  AnalysisReportText,
  AnalysisReportTitle,
  AnalysisRetryButton,
  AnalysisLoadingOverlay,
  AnalysisLoadingSpinner,
  AnalysisLoadingText,
  AnalysisStatus,
  AnalysisStatusMessage,
  ScoreDivider,
  ScoreFill,
  ScoreGauge,
  ScoreGaugeValue,
  ScoreItem,
  ScoreItemHeader,
  ScoreList,
  ScoreTrack,
  TotalScoreLabel,
  TotalScoreRow,
} from "../Preview.styeld";

// 각 평가 점수의 서버 필드, 화면 이름, 최대 점수를 정의합니다.
const SCORE_ITEMS = [
  { key: "sunlightScore", label: "일사량", maxScore: 25 },
  { key: "slopeScore", label: "경사도", maxScore: 20 },
  { key: "areaScore", label: "개발 가능 면적", maxScore: 10 },
  { key: "roadScore", label: "도로 접근성", maxScore: 10 },
  { key: "regulationScore", label: "토지이용규제", maxScore: 20 },
  { key: "zoneScore", label: "용도지역·용도지구", maxScore: 15 },
];

// 서버 보고서의 제목을 화면 디자인에 맞는 표기로 변환합니다.
const REPORT_SECTION_LABELS = {
  일사량: "일사량",
  경사도: "경사도",
  개발가능면적: "개발 가능 면적",
  도로접근성: "도로 접근성",
  토지이용규제: "토지이용 규제",
  "용도지역·용도지구": "용도 지역·지구",
};

// 대괄호 제목이 포함된 분석 근거를 제목과 설명 목록으로 분리합니다.
const parseAnalysisRationale = (rationale) => {
  // 문자열이 아니거나 비어 있으면 파싱할 보고서가 없는 것으로 처리합니다.
  if (typeof rationale !== "string" || !rationale.trim()) return [];

  // 다음 대괄호 제목 전까지의 모든 문장을 현재 항목의 설명으로 찾습니다.
  const sectionPattern = /\[([^\]]+)\]\s*([\s\S]*?)(?=\s*\[[^\]]+\]|$)/g;

  // 서버가 전달한 항목 순서를 유지하면서 화면용 제목과 원문 설명을 만듭니다.
  return Array.from(rationale.matchAll(sectionPattern), (match) => {
    // 제목 비교 시 공백 차이로 항목을 놓치지 않도록 공백을 제거합니다.
    const normalizedTitle = match[1].replace(/\s+/g, "").trim();

    // 정의된 제목은 디자인 표기로 바꾸고 알 수 없는 제목은 원문을 사용합니다.
    return {
      title: REPORT_SECTION_LABELS[normalizedTitle] || match[1].trim(),
      text: match[2].trim(),
    };
  }).filter((section) => section.text);
};

// 서버 점수를 숫자로 바꾸고 화면에서 허용하는 점수 범위 안으로 제한합니다.
const normalizeScore = (value, maxScore) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.min(Math.max(numericValue, 0), maxScore);
};

// 선택한 토지의 태양광 적합도와 플랜에 맞는 AI 보고서를 표시합니다.
function ReportContent({ landId, isReportLocked = false }) {
  // 서버에서 받은 개발 적합도 분석 결과입니다.
  const [analysis, setAnalysis] = useState(null);
  // 개발 적합도 분석을 요청하고 있는지 나타냅니다.
  const [isLoading, setIsLoading] = useState(true);
  // 실패한 개발 적합도 분석 요청을 다시 실행하기 위한 값입니다.
  const [attempt, setAttempt] = useState(0);
  // 개발 적합도 분석 조회에 실패했을 때 표시할 메시지입니다.
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 이전 토지의 비동기 응답이 현재 화면에 반영되는 것을 막습니다.
    let ignore = false;
    const controller = new AbortController();
    // 생성 지연은 기다리되 무한 대기하지 않고 재시도 경로를 제공합니다.
    const timeout = window.setTimeout(() => controller.abort(), 60000);

    // 선택한 토지의 개발 적합도 분석 결과를 불러옵니다.
    const loadDevelopmentAnalysis = async () => {
      // 토지 ID가 없으면 기존 분석 상태만 초기화합니다.
      if (landId === undefined || landId === null || landId === "") {
        window.clearTimeout(timeout);
        setAnalysis(null);
        setErrorMessage("");
        setIsLoading(false);
        return;
      }

      // 새 요청을 시작하기 전에 이전 분석 결과와 오류를 초기화합니다.
      setAnalysis(null);
      setErrorMessage("");
      setIsLoading(true);

      try {
        // 현재 선택된 토지 ID로 개발 적합도 분석을 요청합니다.
        const data = await fetchLandDevelopmentAnalysis(landId, {
          signal: controller.signal,
        });

        // 컴포넌트가 사라졌거나 다른 토지로 변경됐다면 결과를 반영하지 않습니다.
        if (ignore) return;

        // 서버가 반환한 개발 적합도 분석 객체를 화면 상태에 저장합니다.
        setAnalysis(data);

      } catch (error) {
        // 현재 요청이 유효할 때만 오류 메시지를 저장합니다.
        if (!ignore) {
          setErrorMessage(
            controller.signal.aborted
              ? "분석 조회 시간이 초과됐습니다. 잠시 후 다시 시도해 주세요."
              : error?.message || "태양광 적합도 분석을 불러오지 못했습니다."
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

    // 선택된 토지가 바뀔 때 개발 적합도 분석 조회를 실행합니다.
    void loadDevelopmentAnalysis();

    return () => {
      // 컴포넌트가 사라지거나 landId가 바뀌면 이전 요청을 무시합니다.
      ignore = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [landId, attempt]);

  // 서버의 종합 점수를 100점 범위로 정리합니다.
  const totalScore = normalizeScore(analysis?.totalScore, 100);
  // 정상 응답이 준비된 뒤에만 점수 바가 실제 값까지 채워지게 합니다.
  const isAnalysisReady = !isLoading && !errorMessage && Boolean(analysis);
  // 서버의 종합 분석 근거를 보고서 항목 목록으로 변환합니다.
  const reportSections = parseAnalysisRationale(analysis?.rationale);

  return (
    // 분석 조회 상태, 점수, 보고서, 오류 복구 동작을 표시합니다.
    <AnalysisContent aria-live="polite" aria-busy={isLoading}>
      {/* 로딩 중에는 기존 점수 카드와 보고서를 함께 흐리게 표시합니다. */}
      <AnalysisBlurLayer $loading={isLoading} aria-hidden={isLoading}>
        {/* 데이터 상태와 관계없이 점수 카드 UI를 먼저 표시합니다. */}
        <AnalysisCard>
        <AnalysisCardTitle>인허가 적합도 분석</AnalysisCardTitle>

        <TotalScoreRow>
          <TotalScoreLabel>종합 적합도</TotalScoreLabel>
          <ScoreGauge
            $score={totalScore}
            $loaded={isAnalysisReady}
            aria-label={`종합 적합도 ${totalScore}점`}
          >
            {/* 둥근 양 끝과 점수별 색상을 표현하는 반원형 SVG 게이지입니다. */}
            <svg viewBox="0 0 120 64" aria-hidden="true" focusable="false">
              {/* 종합 점수의 전체 범위를 나타내는 회색 기본 바입니다. */}
              <path
                className="gauge-track"
                d="M 10 56 A 50 50 0 0 1 110 56"
                pathLength="100"
              />
              {/* 데이터가 준비되면 실제 종합 점수만큼 채워지는 색상 바입니다. */}
              <path
                className="gauge-progress"
                d="M 10 56 A 50 50 0 0 1 110 56"
                pathLength="100"
              />
            </svg>
            <ScoreGaugeValue>
              {totalScore}
              <small>점</small>
            </ScoreGaugeValue>
          </ScoreGauge>
        </TotalScoreRow>

        {/* 로딩 중 안내와 서버의 등급 또는 결격 상태를 같은 자리에 표시합니다. */}
        <AnalysisStatus $disqualified={analysis?.disqualified}>
          {isLoading
            ? "분석 중"
            : analysis?.disqualified
              ? "인허가 검토 부적합"
              : analysis?.grade
                ? `${analysis.grade} 등급`
                : "\u00A0"}
        </AnalysisStatus>

        <ScoreDivider />

        <ScoreList>
          {SCORE_ITEMS.map(({ key, label, maxScore }) => {
            // 응답 전에는 0점으로 두고 응답 후 실제 점수 비율을 계산합니다.
            const score = normalizeScore(analysis?.[key], maxScore);
            const percent = (score / maxScore) * 100;

            return (
              <ScoreItem key={key}>
                <ScoreItemHeader>
                  <span>{label}</span>
                  <strong>
                    {score}/{maxScore}점
                  </strong>
                </ScoreItemHeader>
                <ScoreTrack aria-hidden="true">
                  <ScoreFill
                    $percent={percent}
                    $loaded={isAnalysisReady}
                  />
                </ScoreTrack>
              </ScoreItem>
            );
          })}
        </ScoreList>
        </AnalysisCard>

      {/* 보고서 UI도 먼저 표시하고 내부 문구만 요청 상태에 따라 교체합니다. */}
      <AnalysisReportSection>
        <AnalysisReportTitle>AI 분석 보고서</AnalysisReportTitle>
        {/* 무료 플랜에서는 실제 보고서 대신 블러 처리된 잠금 안내를 표시합니다. */}
        {isReportLocked ? (
          <ReportAccessGate requiresLogin={false} compact />
        ) : (
          <AnalysisReportBox>
          {/* 개발 적합도 분석을 요청하는 동안 보고서 영역에 로딩 문구를 표시합니다. */}
          {isLoading && (
            <AnalysisStatusMessage $compact role="status">
              태양광 적합도 분석을 불러오는 중입니다.
            </AnalysisStatusMessage>
          )}

          {/* 개발 적합도 분석 조회에 실패하면 오류와 재시도 버튼을 표시합니다. */}
          {!isLoading && errorMessage && (
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

          {/* 조회 결과가 없으면 보고서 영역에서 빈 분석 상태를 안내합니다. */}
          {!isLoading && !errorMessage && !analysis && (
            <AnalysisStatusMessage $compact>
              등록된 적합도 분석 결과가 없습니다.
            </AnalysisStatusMessage>
          )}

          {/* 대괄호 제목을 인식한 분석 근거는 항목별 보고서로 표시합니다. */}
          {isAnalysisReady && reportSections.length > 0 && (
            <AnalysisReportList>
              {reportSections.map((section, index) => (
                <AnalysisReportItem key={`${section.title}-${index}`}>
                  <AnalysisReportItemTitle>
                    {section.title}
                  </AnalysisReportItemTitle>
                  <AnalysisReportItemText>{section.text}</AnalysisReportItemText>
                </AnalysisReportItem>
              ))}
            </AnalysisReportList>
          )}

          {/* 제목 형식을 인식하지 못하면 서버 원문을 기존 문단 형태로 표시합니다. */}
          {isAnalysisReady && reportSections.length === 0 && (
            <AnalysisReportText>
              {analysis.rationale || "등록된 분석 근거가 없습니다."}
            </AnalysisReportText>
          )}
          </AnalysisReportBox>
        )}
      </AnalysisReportSection>
      </AnalysisBlurLayer>

      {/* 분석 데이터를 불러오는 동안 블러 영역 위에 로딩 상태를 표시합니다. */}
      {isLoading && (
        <AnalysisLoadingOverlay role="status" aria-label="태양광 적합도 로딩 중">
          <AnalysisLoadingSpinner aria-hidden="true" />
          <AnalysisLoadingText>로딩 중</AnalysisLoadingText>
        </AnalysisLoadingOverlay>
      )}
    </AnalysisContent>
  );
}

// 로그인·플랜 확인이 끝난 경우에만 보고서 컴포넌트를 마운트해 API를 호출합니다.
export default function SolarSuitability({ landId }) {
  const { isLoggedIn, user, accountError, isAccountLoading, retryAccount } = useAccount();
  const token = useAuthToken();
  if (!isLoggedIn) return <ReportAccessGate requiresLogin />;
  if (isAccountLoading) return <p role="status">계정 정보를 확인하고 있어요.</p>;
  if (accountError || !user) return <div role="alert"><p>{accountError || "계정 정보를 확인할 수 없습니다."}</p><button type="button" onClick={retryAccount}>다시 확인</button></div>;
  // 지원하는 모든 플랜에서 점수 분석은 표시하고 무료 플랜의 보고서만 잠급니다.
  if (!["FREE", "PRO", "BUSINESS"].includes(user.plan)) return <p role="status">이용 중인 플랜을 확인할 수 없습니다. 프로필에서 플랜을 확인해 주세요.</p>;
  return <ReportContent key={`${token}:${landId}`} landId={landId} isReportLocked={user.plan === "FREE"} />;
}
