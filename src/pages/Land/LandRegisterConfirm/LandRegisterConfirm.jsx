import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  MapPinned,
  Minus,
  Plus,
} from "lucide-react";
import { RegisterPageHeader, RegisterWorkflowSidebar } from "../shared";
import {
  ConfirmAddressBox,
  ConfirmAddressChangeButton,
  ConfirmAddressLabel,
  ConfirmAddressText,
  ConfirmCard,
  ConfirmCardGrid,
  ConfirmGuideCard,
  ConfirmGuideText,
  ConfirmPage,
  ConfirmRightColumn,
  ConfirmSection,
  ConfirmSideCard,
  ConfirmSideCardTitle,
  ConfirmStepCircle,
  ConfirmStepDesc,
  ConfirmStepItem,
  ConfirmStepLine,
  ConfirmStepTitle,
  ConfirmStepWrapper,
  ConfirmTable,
  ConfirmTableCell,
  ConfirmTableRow,
  ConfirmTopNote,
  ConfirmTopPreview,
  ConfirmTopPreviewBar,
  ConfirmTopPreviewContent,
  ConfirmTopPreviewHeader,
  ConfirmTopPreviewZoom,
  ConfirmTopPreviewZoomGroup,
  ConfirmTopPreviewImage,
  ConfirmTopPreviewPin,
  ConfirmTopRow,
  ConfirmTopRowCard,
  ConfirmTopRowCardTitle,
  ConfirmTopRowCaption,
  ConfirmTopShell,
  ConfirmTopNoteIcon,
} from "./LandRegisterConfirm.styled";
import {
  RegisterButtonRow as ConfirmFooterButtons,
  RegisterPrimaryButton as ConfirmPrimaryButton,
  RegisterSectionDescription as ConfirmSectionDescription,
  RegisterSectionTitle as ConfirmSectionTitle,
} from "../shared.styled";

const steps = [
  {
    number: "1",
    title: "주소 입력",
    description: "주소 입력 및 자동 정보 조회",
  },
  {
    number: "2",
    title: "자동 정보 확인",
    description: "자동 조회 정보 확인 및 수정",
    active: true,
  },
  {
    number: "3",
    title: "상세 정보 입력",
    description: "거래 정보 및 상세 내용 입력",
  },
  {
    number: "4",
    title: "사진 및 서류",
    description: "현장 사진 및 증명서류 업로드",
  },
];

function LandRegisterConfirm() {
  const navigate = useNavigate();

  return (
    <ConfirmPage>
      {/* 공통 헤더 */}
      <RegisterPageHeader />

      {/* 자동 조회 정보 확인 */}
      <ConfirmTopShell>
        <ConfirmSection>
          <ConfirmSectionTitle>2. 자동 정보 확인</ConfirmSectionTitle>
          <ConfirmSectionDescription>
            입력하신 주소를 기반으로 자동 조회된 정보를 확인해주세요.
          </ConfirmSectionDescription>
        </ConfirmSection>

        <ConfirmTopRow>
          <ConfirmTopRowCard>
            <ConfirmTopRowCardTitle>입력 주소</ConfirmTopRowCardTitle>
            <ConfirmAddressBox>
              <ConfirmAddressLabel>입력 주소</ConfirmAddressLabel>
              <ConfirmAddressText>경기도 안성시 일죽면 산북리 123</ConfirmAddressText>
              <ConfirmTopRowCaption>지번 : 산북리 123</ConfirmTopRowCaption>
              <ConfirmAddressChangeButton type="button" onClick={() => navigate("/land/register")}>
                주소 변경
              </ConfirmAddressChangeButton>
            </ConfirmAddressBox>
          </ConfirmTopRowCard>

          <ConfirmTopRowCard>
            <ConfirmTopPreviewHeader>
              <ConfirmTopRowCardTitle>위치 확인</ConfirmTopRowCardTitle>
              <ConfirmTopRowCaption>(지도로 확인한 위치입니다.)</ConfirmTopRowCaption>
            </ConfirmTopPreviewHeader>

            <ConfirmTopPreview>
              <ConfirmTopPreviewZoomGroup>
                <ConfirmTopPreviewZoom type="button" aria-label="확대">
                  <Plus size={18} />
                </ConfirmTopPreviewZoom>
                <ConfirmTopPreviewZoom type="button" aria-label="축소">
                  <Minus size={18} />
                </ConfirmTopPreviewZoom>
              </ConfirmTopPreviewZoomGroup>

              <ConfirmTopPreviewBar />

              <ConfirmTopPreviewContent>
                <ConfirmTopPreviewImage />
                <ConfirmTopPreviewPin>
                  <MapPinned size={34} strokeWidth={1.5} />
                </ConfirmTopPreviewPin>
              </ConfirmTopPreviewContent>
            </ConfirmTopPreview>
          </ConfirmTopRowCard>
        </ConfirmTopRow>

        <ConfirmSection>
          <ConfirmAddressLabel>자동 조회 정보</ConfirmAddressLabel>
        </ConfirmSection>

        <ConfirmCardGrid>
          <ConfirmCard>
            <ConfirmTable>
              <ConfirmTableRow>
                <ConfirmTableCell>좌표</ConfirmTableCell>
                <ConfirmTableCell />
              </ConfirmTableRow>
              <ConfirmTableRow>
                <ConfirmTableCell>공유인 수</ConfirmTableCell>
                <ConfirmTableCell />
              </ConfirmTableRow>
              <ConfirmTableRow>
                <ConfirmTableCell>PNU</ConfirmTableCell>
                <ConfirmTableCell />
              </ConfirmTableRow>
            </ConfirmTable>
          </ConfirmCard>

          <ConfirmCard aria-hidden="true" />
        </ConfirmCardGrid>

        <ConfirmTopNote>
          <ConfirmTopNoteIcon>
            <AlertTriangle size={14} strokeWidth={2.6} />
          </ConfirmTopNoteIcon>
          자동으로 조회된 정보입니다. 공공데이터와 사용자 입력정보를 기반으로 한 사전 분석 결과이며 실제 사업 가능 여부와 차이가 발생할 수 있습니다.
        </ConfirmTopNote>

        <ConfirmFooterButtons>
          <ConfirmPrimaryButton type="button" $outline onClick={() => navigate("/land/register")}>
            <ArrowLeft size={18} strokeWidth={2.4} />
            이전 단계로
          </ConfirmPrimaryButton>
          <ConfirmPrimaryButton type="button" onClick={() => navigate("/land/register/detail")}>
            다음 단계로
            <ChevronRight size={18} strokeWidth={2.4} />
          </ConfirmPrimaryButton>
        </ConfirmFooterButtons>
      </ConfirmTopShell>

      {/* 진행 단계 사이드바 */}
      <RegisterWorkflowSidebar activeStep={2} />
    </ConfirmPage>
  );
}

export default LandRegisterConfirm;
