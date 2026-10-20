import { useEffect, useState } from "react";
// 상세보기 팝업에서 사용할 아이콘입니다.
import {
  Bot,
  FileText,
  Image as ImageIcon,
  Info,
  X,
} from "lucide-react";
// 상세보기 팝업 스타일 컴포넌트를 가져옵니다.
import {
  AiOpinion,
  AnalysisCard,
  AnalysisCardBody,
  AnalysisGrid,
  AnalysisItem,
  AnalysisLoadingOverlay,
  AnalysisLoadingSpinner,
  AnalysisLoadingText,
  CloseButton,
  DetailGrid,
  DocumentCard,
  DocumentGrid,
  DocumentIconBox,
  DocumentSection,
  Header,
  HeroImage,
  HeroImageBox,
  ImageCounter,
  ImagePlaceholder,
  InfoCard,
  InfoColumn,
  InfoGrid,
  InfoList,
  InfoRow,
  LocationCard,
  LocationTitle,
  MainContent,
  MetaTable,
  Panel,
  PhotoColumn,
  ScoreBadge,
  SectionTitle,
  SpecificBackdrop,
  Tag,
  TagRow,
  ThumbButton,
  ThumbImage,
  ThumbRow,
  Title,
} from "./Specific.styled";
import SpecificMiniMap from "./SpecificMiniMap";
import {
  buildDocumentList,
  buildImageList,
  formatArea,
  formatPrice,
  formatRegisteredDate,
  formatTransactionType,
} from "./specificFormatters";
// 선택한 토지의 태양광 개발 적합도 분석 결과를 조회합니다.
import {
  fetchLandDevelopmentAnalysis,
  fetchAiLandReport,
} from "@/pages/Main/landApi";
import { useAccount } from "@/contexts/AccountContext";
import ReportAccessGate from "@/components/ui/PreviewComponent/components/ReportAccessGate";

// 태양광 적합도 API 필드와 항목별 실제 만점을 연결합니다.
const SOLAR_ANALYSIS_ITEMS = [
  { key: "sunlightScore", label: "일사량", maxScore: 25 },
  { key: "slopeScore", label: "경사도", maxScore: 20 },
  { key: "areaScore", label: "개발 가능 면적", maxScore: 10 },
  { key: "roadScore", label: "도로 접근성", maxScore: 10 },
  { key: "regulationScore", label: "토지이용규제", maxScore: 20 },
  { key: "zoneScore", label: "용도지역·용도지구", maxScore: 15 },
];

// 서버 점수를 숫자로 변환하고 각 항목의 유효한 점수 범위로 제한합니다.
const normalizeScore = (score, maxScore) => {
  // 숫자로 변환할 수 없는 값은 0점으로 처리합니다.
  const numericScore = Number(score);
  if (!Number.isFinite(numericScore)) return 0;

  // 막대와 표시 점수가 최소 0점, 최대 만점을 벗어나지 않게 합니다.
  return Math.min(Math.max(numericScore, 0), maxScore);
};

// 0점은 유효한 결과로 유지하고 비어 있거나 숫자가 아닌 점수만 평가 불가로 구분합니다.
const hasScoreValue = (value) =>
  value !== null &&
  value !== undefined &&
  String(value).trim() !== "" &&
  Number.isFinite(Number(value));

// 비어 있지 않은 점수 중 하나라도 0점이면 종합 결과를 사업 불가로 구분합니다.
const hasZeroScore = (analysis) =>
  Boolean(analysis) &&
  [analysis.totalScore, ...SOLAR_ANALYSIS_ITEMS.map(({ key }) => analysis[key])].some(
    (value) => hasScoreValue(value) && Number(value) === 0
  );

// 항목별 점수를 기존 막대가 사용하는 백분율 값으로 변환합니다.
const calculateScorePercent = (score, maxScore) => {
  // 만점이 유효하지 않으면 빈 막대를 표시합니다.
  if (!maxScore) return 0;

  // 실제 점수와 만점의 비율을 0~100 범위로 반환합니다.
  return (normalizeScore(score, maxScore) / maxScore) * 100;
};

// 종합 적합도 점수에 따라 Preview 게이지와 동일한 색상을 반환합니다.
const getTotalScoreColor = (score) => {
  // 60점 미만은 낮은 적합도를 나타내는 기존 붉은색을 사용합니다.
  if (score < 60) return "#ff5757";
  // 60점 이상 80점 미만은 보통 적합도를 나타내는 기존 노란색을 사용합니다.
  if (score < 80) return "#ffd33d";
  // 80점 이상은 높은 적합도를 나타내는 기존 초록색을 사용합니다.
  return "#5dde88";
};

// 예상 발전 정보의 숫자를 천 단위 구분과 단위가 포함된 문구로 변환합니다.
const formatExpectedValue = (value, unit) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? `${numericValue.toLocaleString("ko-KR")} ${unit}` : "없음";
};

// 상세보기 팝업 컴포넌트입니다.
function Specific({ land, onClose }) {
  // 토지가 바뀌면 이미지 선택·실패 상태를 함께 새로 만듭니다.
  return land ? <SpecificContent key={land.id ?? land.landId ?? land.address} land={land} onClose={onClose} /> : null;
}

function SpecificContent({ land, onClose }) {
  // 예상 설비용량과 발전량을 확인할 수 있는 현재 계정 플랜을 가져옵니다.
  const { isLoggedIn, user } = useAccount();
  // 예상 정보는 비즈니스 플랜에서만 확인할 수 있습니다.
  const accountPlan = String(user?.plan || "").toUpperCase();
  const canViewExpectedInfo = accountPlan === "BUSINESS";
  // AI 의견은 프로 및 비즈니스 플랜에서 확인할 수 있습니다.
  const canViewAiOpinion = ["PRO", "BUSINESS"].includes(accountPlan);
  // 상세보기 분석 API에 사용할 토지 ID를 정리합니다.
  const analysisLandId = land?.id ?? land?.landId;
  // 대표 이미지 로딩 실패 시 깨진 이미지 대신 placeholder를 보여줍니다.
  const [isHeroImageFailed, setIsHeroImageFailed] = useState(false);
  // 현재 대표 이미지로 보여줄 이미지 번호입니다.
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // 현재 토지의 태양광 개발 적합도 분석 결과입니다.
  const [developmentAnalysis, setDevelopmentAnalysis] = useState(null);
  // 적합도 분석 조회 실패 시 기존 카드 안에 표시할 오류 문구입니다.
  const [developmentAnalysisError, setDevelopmentAnalysisError] = useState("");
  // 토지 투자 가치 AI 보고서와 요청 상태입니다.
  const [aiLandReport, setAiLandReport] = useState("");
  const [aiLandReportError, setAiLandReportError] = useState("");
  const [isAiLandReportLoading, setIsAiLandReportLoading] = useState(true);
  // 유효한 토지 ID가 있으면 분석 결과를 받을 때까지 로딩 화면을 표시합니다.
  const [isDevelopmentAnalysisLoading, setIsDevelopmentAnalysisLoading] =
    useState(
      () =>
        analysisLandId !== undefined &&
        analysisLandId !== null &&
        analysisLandId !== ""
    );

  // 상세보기 대상 토지가 바뀔 때 해당 토지의 적합도 분석 결과를 조회합니다.
  useEffect(() => {
    // 상세보기 데이터에서 사용할 수 있는 토지 ID를 선택합니다.
    // 토지 ID가 없으면 분석 API를 호출하지 않습니다.
    if (
      analysisLandId === undefined ||
      analysisLandId === null ||
      analysisLandId === ""
    ) {
      return undefined;
    }

    // 팝업이 닫히거나 토지가 바뀌면 진행 중인 요청을 취소합니다.
    const controller = new AbortController();

    // 선택한 토지의 개발 적합도 분석 결과를 요청합니다.
    fetchLandDevelopmentAnalysis(analysisLandId, { signal: controller.signal })
      .then((analysis) => {
        // 취소되지 않은 요청의 결과만 현재 상세보기에 반영합니다.
        if (!controller.signal.aborted) {
          setDevelopmentAnalysis(analysis);
        }
      })
      .catch((error) => {
        // 요청 취소는 화면 오류로 표시하지 않습니다.
        if (controller.signal.aborted || error?.name === "AbortError") return;

        // 실제 조회 실패는 콘솔과 기존 AI 의견 영역에 표시합니다.
        console.error("상세보기 태양광 적합도 분석 조회 실패:", error);
        setDevelopmentAnalysisError(
          error?.message || "태양광 적합도 분석을 불러오지 못했습니다."
        );
      })
      .finally(() => {
        // 취소되지 않은 요청이 끝나면 성공·실패와 관계없이 로딩 화면을 종료합니다.
        if (!controller.signal.aborted) {
          setIsDevelopmentAnalysisLoading(false);
        }
      });

    // 컴포넌트 정리 시 진행 중인 분석 요청을 취소합니다.
    return () => controller.abort();
  }, [analysisLandId]);

  // 상세보기 대상 토지가 바뀌면 토지 투자 가치 AI 보고서를 조회합니다.
  useEffect(() => {
    // AI 의견 열람 플랜이 아니거나 유효한 토지 ID가 없으면 보고서를 요청하지 않습니다.
    if (!canViewAiOpinion || analysisLandId === undefined || analysisLandId === null || analysisLandId === "") {
      return undefined;
    }

    // 팝업이 닫힐 때 진행 중인 보고서 요청을 취소합니다.
    const controller = new AbortController();

    // 비동기 함수 안에서 상태를 초기화하고 새 투자 가치 보고서를 요청합니다.
    const loadAiLandReport = async () => {
      setAiLandReport("");
      setAiLandReportError("");
      setIsAiLandReportLoading(true);

      try {
        const report = await fetchAiLandReport(analysisLandId, { signal: controller.signal });
        if (!controller.signal.aborted) setAiLandReport(typeof report?.report === "string" ? report.report : "");
      } catch (error) {
        if (!controller.signal.aborted && error?.name !== "AbortError") {
          setAiLandReportError(error?.message || "토지 AI 보고서를 불러오지 못했습니다.");
        }
      } finally {
        if (!controller.signal.aborted) setIsAiLandReportLoading(false);
      }
    };

    // 현재 토지의 투자 가치 보고서 조회를 시작합니다.
    void loadAiLandReport();

    // 컴포넌트 정리 시 진행 중인 보고서 요청을 취소합니다.
    return () => controller.abort();
  }, [analysisLandId, canViewAiOpinion]);


  // 선택된 토지가 없으면 팝업을 보여주지 않습니다.
  if (!land) return null;

  // 서버 상세 정보의 주소를 제목으로 사용합니다.
  const address = land.address || land.ldCodeNm || "토지 주소";

  // 서버 이미지 경로를 화면 이미지 목록으로 변환합니다.
  const images = buildImageList(land);

  // 상세보기 팝업에서 실제 img src로 사용하는 이미지 주소를 확인합니다.
  console.log("상세보기 이미지 URL 목록:", images);

  // 서버 문서 경로를 문서 카드 목록으로 변환합니다.
  const documents = buildDocumentList(land);

  // 현재 선택된 대표 이미지 URL입니다.
  const selectedImage = images[selectedImageIndex] || images[0];

  // 종합 점수는 API의 100점 만점 값을 사용합니다.
  const totalScore = normalizeScore(developmentAnalysis?.totalScore, 100);
  // 종합 점수가 비어 있으면 0점 대신 평가 불가 상태로 표시합니다.
  const isTotalScoreAvailable = Boolean(developmentAnalysis) && hasScoreValue(developmentAnalysis?.totalScore);
  // 유효한 평가 점수에 0점이 포함되면 종합 적합도만 사업 불가로 표시합니다.
  const isBusinessUnavailable = hasZeroScore(developmentAnalysis);

  return (
    // 팝업 뒤 배경을 덮고 블러 처리하는 영역입니다.
    <SpecificBackdrop>
      {/* 실제 상세보기 팝업 박스입니다. */}
      <Panel>
        {/* 팝업 상단 제목과 닫기 버튼 영역입니다. */}
        <Header>
          {/* 공개 상태 배지입니다. */}
          <Tag $soft>{land.status || "상태 정보 없음"}</Tag>

          {/* 팝업 닫기 버튼입니다. */}
          <CloseButton type="button" onClick={onClose} aria-label="닫기">
            <X size={24} strokeWidth={1.8} />
          </CloseButton>

          {/* 상세 토지 주소 제목입니다. */}
          <Title>{address}</Title>

          {/* 서버 필드 기반 토지 태그입니다. */}
          <TagRow>
            <Tag>{land.lcCodeNm || "지목 정보 없음"}</Tag>
            <Tag>{land.regstrSeCodeNm || "대장 정보 없음"}</Tag>
            <Tag>{land.ldCodeNm || "지역 정보 없음"}</Tag>
          </TagRow>
        </Header>

        {/* 상세보기 본문 스크롤 영역입니다. */}
        <MainContent>
          {/* 상단 이미지, 거래 정보, 위치 요약 영역입니다. */}
          <DetailGrid>
            {/* 토지 사진 영역입니다. */}
            <PhotoColumn>
              <HeroImageBox>
                {selectedImage && !isHeroImageFailed ? (
                  // 서버에서 받은 대표 이미지를 표시합니다.
                  <HeroImage
                    src={selectedImage}
                    alt="토지 대표 이미지"
                    onError={() => {
                      // 접근 불가능한 이미지 URL이면 빈 이미지 영역으로 대체합니다.
                      setIsHeroImageFailed(true);
                    }}
                  />
                ) : (
                  // 이미지가 없으면 임시 이미지 박스를 표시합니다.
                  <ImagePlaceholder>
                    <ImageIcon size={34} strokeWidth={1.5} />
                  </ImagePlaceholder>
                )}

                {/* 이미지 개수 표시입니다. */}
                <ImageCounter>
                  ▣ {selectedImageIndex + 1}/{Math.max(images.length, 1)}
                </ImageCounter>
              </HeroImageBox>

              {/* 썸네일 영역입니다. */}
              <ThumbRow>
                {(images.length ? images : ["", "", "", ""]).map(
                  (src, imageIndex) => (
                    <ThumbButton
                      key={`${src || "empty"}-${imageIndex}`}
                      type="button"
                      $active={imageIndex === selectedImageIndex}
                      onClick={() => {
                        // 클릭한 썸네일 이미지를 대표 이미지로 변경합니다.
                        setSelectedImageIndex(imageIndex);
                        // 새 대표 이미지를 불러올 때 이전 이미지의 실패 상태를 초기화합니다.
                        setIsHeroImageFailed(false);
                      }}
                    >
                      {src ? (
                        // 실제 이미지 썸네일입니다.
                        <ThumbImage
                          src={src}
                          alt={`토지 썸네일 ${imageIndex + 1}`}
                          onError={(event) => {
                            // 썸네일도 실패하면 깨진 이미지 아이콘을 숨깁니다.
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        // 이미지가 없을 때 표시하는 빈 썸네일입니다.
                        <ImageIcon size={20} strokeWidth={1.4} />
                      )}
                    </ThumbButton>
                  )
                )}
              </ThumbRow>
            </PhotoColumn>

            {/* 서버 상세 정보 요약 테이블입니다. */}
            <MetaTable>
              <InfoRow>
                <span>거래 방식</span>
                <strong>{formatTransactionType(land.transactionType)}</strong>
              </InfoRow>
              <InfoRow>
                <span>희망 가격</span>
                <strong>{formatPrice(land.desiredPrice)}</strong>
              </InfoRow>
              <InfoRow>
                <span>면적</span>
                <strong>{formatArea(land.area)}</strong>
              </InfoRow>
              <InfoRow>
                <span>지목</span>
                <strong>{land.lcCodeNm || "-"}</strong>
              </InfoRow>
              <InfoRow>
                <span>등록일</span>
                <strong>{formatRegisteredDate(land)}</strong>
              </InfoRow>
              <InfoRow>
                <span>주소</span>
                <strong>{address}</strong>
              </InfoRow>
              <InfoRow>
                <span>PNU</span>
                <strong>{land.pnu || "-"}</strong>
              </InfoRow>
            </MetaTable>

            {/* 위치 요약 카드입니다. */}
            <LocationCard>
              <SpecificMiniMap land={land} />
              <LocationTitle>위치</LocationTitle>
            </LocationCard>
          </DetailGrid>

          {/* 서류 및 파일 영역입니다. */}
          <DocumentSection>
            <SectionTitle>서류 및 파일</SectionTitle>

            <DocumentGrid>
              {(documents.length
                ? documents
                : [{ name: "등록된 파일 없음", url: "" }]
              ).map((document, index) => (
                <DocumentCard
                  key={`${document.name}-${index}`}
                  as={document.url ? "a" : "div"}
                  href={document.url || undefined}
                  target={document.url ? "_blank" : undefined}
                  rel={document.url ? "noreferrer" : undefined}
                >
                  <DocumentIconBox>
                    <FileText size={18} strokeWidth={1.8} />
                  </DocumentIconBox>
                  <div>
                    <strong>{document.name}</strong>
                    <span>{formatRegisteredDate(land)}</span>
                  </div>
                </DocumentCard>
              ))}
            </DocumentGrid>
          </DocumentSection>

          {/* 기본 정보와 분석 카드 영역입니다. */}
          <InfoGrid>
            <InfoColumn>
              <InfoCard>
                <SectionTitle>
                  <Info size={18} strokeWidth={2} />
                  기본 정보
                </SectionTitle>

                <InfoList>
                  <InfoRow>
                    <span>용도지역</span>
                    <strong>{land.ldCodeNm || "-"}</strong>
                  </InfoRow>
                  <InfoRow>
                    <span>도로 접면</span>
                    <strong>{land.regstrSeCodeNm || "-"}</strong>
                  </InfoRow>
                  <InfoRow>
                    <span>공유 인원</span>
                    <strong>{land.cnrsPsnCo || "-"}</strong>
                  </InfoRow>
                  <InfoRow>
                    <span>소유자</span>
                    <strong>{land.ownerEmail || "-"}</strong>
                  </InfoRow>
                </InfoList>
              </InfoCard>

              <InfoCard>
                <SectionTitle>예상 정보</SectionTitle>
                {canViewExpectedInfo ? (
                  <InfoList>
                    <InfoRow>
                      <span>설치 용량</span>
                      <strong>{formatExpectedValue(land.installedCapacityKw, "kW")}</strong>
                    </InfoRow>
                    <InfoRow>
                      <span>발전량</span>
                      <strong>{formatExpectedValue(land.annualGenerationKwh, "kWh")}/년</strong>
                    </InfoRow>
                  </InfoList>
                ) : (
                  // 무료 또는 비로그인 사용자는 실제 값을 대신해 공통 잠금 안내를 표시합니다.
                  <ReportAccessGate
                    requiresLogin={!isLoggedIn}
                    compact
                    lockedTitle="예상 정보는 비즈니스 플랜에서 제공돼요"
                    lockedDescription="예상 설비용량과 발전량은 비즈니스 플랜에서 확인할 수 있어요."
                  />
                )}
              </InfoCard>
            </InfoColumn>

            <AnalysisCard>
              {/* 로딩 중에는 기존 분석 결과 UI를 유지한 채 흐리게 표시합니다. */}
              <AnalysisCardBody
                $loading={isDevelopmentAnalysisLoading}
                aria-hidden={isDevelopmentAnalysisLoading}
              >
                <SectionTitle>
                  <Bot size={18} strokeWidth={2} />
                  태양광 적합도 분석
                  {/* 평가 불가와 사업 불가 배지는 경고 의미가 드러나도록 붉은색으로 표시합니다. */}
                  <ScoreBadge
                    $unavailable={
                      Boolean(developmentAnalysisError) ||
                      (Boolean(developmentAnalysis) &&
                        (isBusinessUnavailable || !isTotalScoreAvailable))
                    }
                  >
                    {isDevelopmentAnalysisLoading
                      ? "분석 중"
                      : developmentAnalysisError
                        ? "분석 실패"
                        : developmentAnalysis
                          ? isBusinessUnavailable
                            ? "사업 불가"
                            : isTotalScoreAvailable
                              ? `${totalScore}점 / 100점`
                              : "평가 불가"
                          : "분석 결과 없음"}
                  </ScoreBadge>
                </SectionTitle>

                <AnalysisGrid>
                  <AnalysisItem
                    $score={isTotalScoreAvailable && !isBusinessUnavailable ? totalScore : 0}
                    $barColor={isTotalScoreAvailable && !isBusinessUnavailable ? getTotalScoreColor(totalScore) : undefined}
                  >
                    <span>종합 적합도</span>
                    <strong>
                      {developmentAnalysis
                        ? isBusinessUnavailable
                          ? "사업 불가"
                          : isTotalScoreAvailable
                            ? `${totalScore}점 / 100점`
                            : "평가 불가"
                        : "-점 / 100점"}
                    </strong>
                  </AnalysisItem>
                  {SOLAR_ANALYSIS_ITEMS.map((item) => {
                    // 비어 있는 항목은 점수 계산에서 제외하고 회색 막대와 평가 불가 문구를 표시합니다.
                    const isItemScoreAvailable = Boolean(developmentAnalysis) && hasScoreValue(developmentAnalysis?.[item.key]);
                    const itemScore = normalizeScore(
                      developmentAnalysis?.[item.key],
                      item.maxScore
                    );

                    return (
                      <AnalysisItem
                        key={item.key}
                        $score={isItemScoreAvailable ? calculateScorePercent(itemScore, item.maxScore) : 0}
                      >
                        <span>{item.label}</span>
                        <strong>
                          {developmentAnalysis
                            ? isItemScoreAvailable
                              ? `${itemScore}점 / ${item.maxScore}점`
                              : "평가 불가"
                            : `-점 / ${item.maxScore}점`}
                        </strong>
                      </AnalysisItem>
                    );
                  })}
                </AnalysisGrid>
              </AnalysisCardBody>

              {/* 분석 결과를 불러오는 동안 카드 중앙에 로딩 상태를 표시합니다. */}
              {isDevelopmentAnalysisLoading && (
                <AnalysisLoadingOverlay
                  role="status"
                  aria-label="태양광 적합도 로딩 중"
                >
                  <AnalysisLoadingSpinner aria-hidden="true" />
                  <AnalysisLoadingText>로딩 중</AnalysisLoadingText>
                </AnalysisLoadingOverlay>
              )}
            </AnalysisCard>
          </InfoGrid>

          {/* 판매자가 작성한 상세 설명 영역입니다. */}
          <AiOpinion>
            <SectionTitle>상세 설명</SectionTitle>
            <p>{land.description || "등록된 상세 설명이 없습니다."}</p>
          </AiOpinion>

          {/* 토지 AI 보고서 API가 반환한 투자 가치 분석을 표시합니다. */}
          <AiOpinion>
            <SectionTitle>AI 의견</SectionTitle>
            {canViewAiOpinion ? (
              <p>
                {isAiLandReportLoading
                  ? "토지 AI 보고서를 불러오는 중입니다."
                  : aiLandReport || aiLandReportError || "등록된 토지 AI 보고서가 없습니다."}
              </p>
            ) : (
              // 무료 또는 비로그인 사용자는 실제 보고서를 대신해 공통 잠금 안내를 표시합니다.
              <ReportAccessGate requiresLogin={!isLoggedIn} compact />
            )}
          </AiOpinion>
        </MainContent>
      </Panel>
    </SpecificBackdrop>
  );
}

// 다른 파일에서 사용할 수 있도록 내보냅니다.
export default Specific;
