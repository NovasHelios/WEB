import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
import { ReportContent } from "@/components/ui/PreviewComponent/components/SolarSuitability";
import { formatArea } from "@/components/ui/SpecificPopUp/specificFormatters";
import { useLandRegister } from "@/contexts/LandRegisterContext";
import { getTransactionLabel } from "../landUtils";
import { RegisterStaticMap, useRequireLogin } from "../shared";
import {
  CompleteAnalysisMessage,
  CompleteAnalysisSection,
  CompleteCardBody,
  CompleteCardDivider,
  CompleteCardImage,
  CompleteCardImageFrame,
  CompleteCardInfo,
  CompleteCardInfoItem,
  CompleteCardInfoLabel,
  CompleteCardInfoValue,
  CompleteCardSectionTitle,
  CompleteHero,
  CompleteHeroSubTitle,
  CompleteHeroTitle,
  CompletePage,
  CompleteSection,
  CompleteSectionWrap,
  CompleteSummaryCard,
  CompleteSummaryHeader,
  CompleteSummaryWrap,
} from "./LandRegisterComplete.styled";
import {
  RegisterButtonRow as CompleteActionButtons,
  RegisterPrimaryButton as CompleteButton,
} from "../shared.styled";

// 입력 단계의 쉼표가 포함된 면적을 상세보기 포맷 함수가 처리할 수 있는 숫자로 바꿉니다.
const normalizeAreaValue = (value) => {
  // 빈 값은 공통 포맷 함수가 없음 문구로 처리하도록 그대로 전달합니다.
  if (value === null || value === undefined || value === "") return value;
  // 숫자와 소수점 이외의 문자를 제거해 계산 가능한 면적을 만듭니다.
  const numericValue = Number(String(value).replace(/[^\d.]/g, ""));
  // 숫자로 변환할 수 없는 서버 원문은 손실 없이 그대로 유지합니다.
  return Number.isFinite(numericValue) ? numericValue : value;
};

// 등록된 토지 ID를 기반으로 태양광 적합도 분석 결과를 표시합니다.
function LandRegisterComplete() {
  // 하단 이동 버튼에서 사용할 라우터 이동 함수를 준비합니다.
  const navigate = useNavigate();
  // 로그인 사용자만 적합도 결과 페이지에 접근할 수 있게 유지합니다.
  useRequireLogin();
  // 직전 등록 API 응답에서 분석 요청에 필요한 토지 정보를 가져옵니다.
  const { registerData } = useLandRegister();
  // 백엔드 응답의 두 가지 ID 필드 형식을 모두 지원합니다.
  const landId = registerData.submittedLand?.landId ?? registerData.submittedLand?.id;
  // 숫자 0을 포함해 비어 있지 않은 ID만 분석 요청에 사용합니다.
  const hasLandId = landId !== undefined && landId !== null && landId !== "";
  // 상세 정보는 등록 응답을 우선 사용하고 입력 단계의 값으로 누락 항목을 보완합니다.
  const submittedLand = registerData.submittedLand || {};
  // 화면에 표시할 주소는 서버 응답과 사용자가 확정한 주소 순서로 선택합니다.
  const landAddress = submittedLand.address || registerData.address || "-";
  // 실제 면적과 희망 면적은 기존 상세보기의 제곱미터·평 형식으로 통일합니다.
  const landArea = formatArea(normalizeAreaValue(submittedLand.area ?? registerData.area));
  const desiredArea = formatArea(normalizeAreaValue(submittedLand.desiredArea ?? registerData.desiredArea));
  // 입력 단계의 거래 유형을 서버 코드로 바꿔 공통 한국어 표기를 적용합니다.
  const transactionTypeCode = submittedLand.transactionType || {
    sale: "SALE",
    rent: "LEASE",
    hope: "BUSINESS_HOPE",
  }[registerData.transactionType];

  return (
    <CompletePage>
      {/* 다른 등록 단계와 동일한 공통 헤더를 표시합니다. */}
      <NavBar
        keyword=""
        onChangeKeyword={() => {}}
        onSearch={() => {}}
        isSuggestionOpen={false}
        regionSuggestions={[]}
      />

      {/* 등록 API가 생성한 토지 ID를 사용해 적합도 분석 결과를 표시합니다. */}
      <CompleteSectionWrap>
        <CompleteSection>
          <CompleteHero>
            <CompleteHeroTitle>태양광 적합도 분석</CompleteHeroTitle>
            <CompleteHeroSubTitle>
              입력한 토지 조건을 기반으로 인허가 적합도와 AI 분석 보고서를 생성했습니다.
            </CompleteHeroSubTitle>
          </CompleteHero>

          {/* 적합도 결과의 기준이 된 토지를 분석 위에서 먼저 확인할 수 있게 표시합니다. */}
          <CompleteSummaryCard>
            <CompleteSummaryHeader>
              <CompleteCardSectionTitle>토지 상세보기</CompleteCardSectionTitle>
            </CompleteSummaryHeader>
            <CompleteCardDivider />

            <CompleteSummaryWrap>
              <CompleteCardImage>
                <CompleteCardImageFrame>
                  {/* 사용자가 선택한 토지 좌표를 정적 지도에 표시합니다. */}
                  <RegisterStaticMap
                    latitude={submittedLand.y ?? registerData.latitude}
                    longitude={submittedLand.x ?? registerData.longitude}
                    emptyText="토지 위치를 확인할 수 없습니다."
                  />
                </CompleteCardImageFrame>
              </CompleteCardImage>

              <CompleteCardBody>
                <CompleteCardInfo>
                  <CompleteCardInfoItem>
                    <CompleteCardInfoLabel>소재지</CompleteCardInfoLabel>
                    <CompleteCardInfoValue>{landAddress}</CompleteCardInfoValue>
                  </CompleteCardInfoItem>
                  <CompleteCardInfoItem>
                    <CompleteCardInfoLabel>면적</CompleteCardInfoLabel>
                    <CompleteCardInfoValue>{landArea}</CompleteCardInfoValue>
                  </CompleteCardInfoItem>
                  <CompleteCardInfoItem>
                    <CompleteCardInfoLabel>희망 면적</CompleteCardInfoLabel>
                    <CompleteCardInfoValue>{desiredArea}</CompleteCardInfoValue>
                  </CompleteCardInfoItem>
                  <CompleteCardInfoItem>
                    <CompleteCardInfoLabel>거래 유형</CompleteCardInfoLabel>
                    <CompleteCardInfoValue>
                      {getTransactionLabel(transactionTypeCode)}
                    </CompleteCardInfoValue>
                  </CompleteCardInfoItem>
                </CompleteCardInfo>
              </CompleteCardBody>
            </CompleteSummaryWrap>
          </CompleteSummaryCard>

          <CompleteAnalysisSection>
            {hasLandId ? (
              // 기존 미리보기 분석 UI를 재사용하고 완료 화면에서는 두 결과를 좌우로 배치합니다.
              <ReportContent landId={landId} isReportLocked={false} splitLayout />
            ) : (
              // 완료 경로에 직접 접근해 등록 ID가 없을 때 잘못된 분석 요청을 막습니다.
              <CompleteAnalysisMessage role="alert">
                분석할 토지 정보를 찾을 수 없습니다. 조건 등록을 다시 진행해 주세요.
              </CompleteAnalysisMessage>
            )}
          </CompleteAnalysisSection>

          {/* 기존 완료 화면의 지도 검색과 토지 목록 이동 기능은 그대로 유지합니다. */}
          <CompleteActionButtons>
            <CompleteButton type="button" $outline onClick={() => navigate("/")}>
              지도 검색으로 이동
            </CompleteButton>
            <CompleteButton type="button" onClick={() => navigate("/space")}>
              토지 목록 보기
              <ArrowRight size={18} strokeWidth={2.4} />
            </CompleteButton>
          </CompleteActionButtons>
        </CompleteSection>
      </CompleteSectionWrap>
    </CompletePage>
  );
}

// 토지 등록 후 적합도 결과 페이지를 라우트에서 사용할 수 있도록 내보냅니다.
export default LandRegisterComplete;
