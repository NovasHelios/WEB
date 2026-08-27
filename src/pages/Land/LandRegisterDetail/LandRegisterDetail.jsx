import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Info,
  MapPinned,
  Search,
} from "lucide-react";
import { RegisterPageHeader, RegisterWorkflowSidebar } from "../shared";
import {
  DetailGuideCard,
  DetailGuideText,
  DetailPage,
  DetailRightColumn,
  DetailSection,
  DetailSideCard,
  DetailSideCardTitle,
  DetailStepCircle,
  DetailStepDesc,
  DetailStepItem,
  DetailStepLine,
  DetailStepTitle,
  DetailStepWrapper,
  DetailTextarea,
  DetailTextareaCard,
  DetailTextareaCardHeader,
  DetailTextareaCount,
  DetailTextareaLabel,
  DetailTextareaWrap,
  DetailTopShell,
  DetailTopNote,
  DetailTopNoteIcon,
} from "./LandRegisterDetail.styled";
import {
  RegisterButtonRow as DetailFooterButtons,
  RegisterPrimaryButton as DetailPrimaryButton,
  RegisterSectionDescription as DetailSectionDescription,
  RegisterSectionTitle as DetailSectionTitle,
} from "../shared.styled";

const steps = [
  { number: "1", title: "주소 입력", description: "주소 입력 및 자동 정보 조회" },
  { number: "2", title: "자동 정보 확인", description: "자동 조회 정보 확인 및 수정" },
  { number: "3", title: "상세 정보 입력", description: "거래 정보 및 상세 내용 입력", active: true },
  { number: "4", title: "사진 및 서류", description: "현장 사진 및 증명서류 업로드" },
];

const MAX_LENGTH = 1000;

function LandRegisterDetail() {
  const navigate = useNavigate();
  const [memo, setMemo] = useState("");

  const memoCount = memo.length;
  const memoHint = useMemo(() => {
    if (memoCount === 0) return "특이사항이나 추가 요청사항을 입력해주세요.";
    return `${memoCount} / ${MAX_LENGTH}자`;
  }, [memoCount]);

  return (
    <DetailPage>
      {/* 공통 헤더 */}
      <RegisterPageHeader />

      {/* 상세 메모 입력 */}
      <DetailTopShell>
        <DetailSection>
          <DetailSectionTitle>3. 부지 등록 (상세 정보 입력)</DetailSectionTitle>
        </DetailSection>

        <DetailTextareaCard>
          <DetailTextareaCardHeader>추가 정보 (선택)</DetailTextareaCardHeader>
          <DetailTextareaLabel>기타 참고 사항</DetailTextareaLabel>
          <DetailTextareaWrap>
            <DetailTextarea
              value={memo}
              onChange={(event) => setMemo(event.target.value.slice(0, MAX_LENGTH))}
              maxLength={MAX_LENGTH}
              placeholder="특이사항이나 추가 요청사항을 입력해주세요."
            />
          </DetailTextareaWrap>
          <DetailTextareaCount>{memoHint}</DetailTextareaCount>
        </DetailTextareaCard>

        <DetailTopNote>
          <DetailTopNoteIcon>
            <Info size={14} strokeWidth={2.4} />
          </DetailTopNoteIcon>
          추가 정보는 선택 사항입니다. 필요한 경우에만 간단하고 명확하게 작성해 주세요.
        </DetailTopNote>

        <DetailFooterButtons>
          <DetailPrimaryButton type="button" $outline onClick={() => navigate("/land/register/confirm")}>
            <ArrowLeft size={18} strokeWidth={2.4} />
            이전 단계로
          </DetailPrimaryButton>
          <DetailPrimaryButton type="button" onClick={() => navigate("/land/register/photos")}>
            다음 단계로
            <ChevronRight size={18} strokeWidth={2.4} />
          </DetailPrimaryButton>
        </DetailFooterButtons>
      </DetailTopShell>

      {/* 진행 단계 사이드바 */}
      <RegisterWorkflowSidebar activeStep={3} />
    </DetailPage>
  );
}

export default LandRegisterDetail;
