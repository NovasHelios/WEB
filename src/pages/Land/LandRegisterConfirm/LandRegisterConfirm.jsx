import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
import { RegisterStaticMap, RegisterWorkflowSidebar, useRequireLogin } from "../shared";
import { useLandRegister } from "@/contexts/LandRegisterContext";
import {
  ConfirmAddressBox,
  ConfirmAddressChangeButton,
  ConfirmAddressLabel,
  ConfirmAddressText,
  ConfirmCard,
  ConfirmCardGrid,
  ConfirmInfoSection,
  ConfirmInfoTitle,
  ConfirmNavBarWrap,
  ConfirmPage,
  ConfirmSection,
  ConfirmTable,
  ConfirmTableCell,
  ConfirmTableRow,
  ConfirmTableValue,
  ConfirmTopNote,
  ConfirmTopPreview,
  ConfirmTopPreviewHeader,
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

function LandRegisterConfirm() {
  const navigate = useNavigate();
  useRequireLogin();
  const { registerData } = useLandRegister();

  return (
    <ConfirmPage>
      <ConfirmNavBarWrap>
        <NavBar
          keyword=""
          onChangeKeyword={() => {}}
          onSearch={() => {}}
          isSuggestionOpen={false}
          regionSuggestions={[]}
        />
      </ConfirmNavBarWrap>

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
              <ConfirmAddressText>{registerData.address || "입력된 주소가 없습니다."}</ConfirmAddressText>
              <ConfirmTopRowCaption>
                {registerData.confirmedRoadAddress || registerData.confirmedAddress || "주소를 다시 입력해 주세요."}
              </ConfirmTopRowCaption>
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
              <RegisterStaticMap
                latitude={registerData.latitude}
                longitude={registerData.longitude}
                emptyText="주소 검색 후 위치 지도가 표시됩니다."
              />
            </ConfirmTopPreview>
          </ConfirmTopRowCard>
        </ConfirmTopRow>

        <ConfirmInfoSection>
          <ConfirmInfoTitle>자동 조회 정보</ConfirmInfoTitle>
        </ConfirmInfoSection>

        <ConfirmCardGrid>
          <ConfirmCard>
            <ConfirmTable>
              <ConfirmTableRow>
                <ConfirmTableCell>좌표</ConfirmTableCell>
                <ConfirmTableValue>{registerData.confirmedLocation || "-"}</ConfirmTableValue>
              </ConfirmTableRow>
              <ConfirmTableRow>
                <ConfirmTableCell>공유인 수</ConfirmTableCell>
                <ConfirmTableValue>{registerData.shareCount || "0명 (단독소유)"}</ConfirmTableValue>
              </ConfirmTableRow>
              <ConfirmTableRow>
                <ConfirmTableCell>PNU</ConfirmTableCell>
                <ConfirmTableValue>{registerData.pnu || "-"}</ConfirmTableValue>
              </ConfirmTableRow>
            </ConfirmTable>
          </ConfirmCard>

          <ConfirmCard>
            <ConfirmTable>
              <ConfirmTableRow>
                <ConfirmTableCell>면적</ConfirmTableCell>
                <ConfirmTableValue>{registerData.area || "-"}</ConfirmTableValue>
              </ConfirmTableRow>
              <ConfirmTableRow>
                <ConfirmTableCell>고도</ConfirmTableCell>
                <ConfirmTableValue>{registerData.altitude || "-"}</ConfirmTableValue>
              </ConfirmTableRow>
              <ConfirmTableRow>
                <ConfirmTableCell>지목</ConfirmTableCell>
                <ConfirmTableValue>{registerData.landCategory || "-"}</ConfirmTableValue>
              </ConfirmTableRow>
              <ConfirmTableRow>
                <ConfirmTableCell>도로 접근성</ConfirmTableCell>
                <ConfirmTableValue>{registerData.roadAccess || "-"}</ConfirmTableValue>
              </ConfirmTableRow>
            </ConfirmTable>
          </ConfirmCard>
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

      <RegisterWorkflowSidebar activeStep={2} />
    </ConfirmPage>
  );
}

export default LandRegisterConfirm;
