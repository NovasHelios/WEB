import {
  ChevronRight,
  Search,
  MapPinned,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterPageHeader, RegisterWorkflowSidebar } from "../shared";
import {
  LandRegisterBottomButton,
  LandRegisterButtonIcon,
  LandRegisterButtonWrap,
  LandRegisterCard,
  LandRegisterCardBody,
  LandRegisterCardLabel,
  LandRegisterCardTitle,
  LandRegisterContainer,
  LandRegisterMain,
  LandRegisterPage,
  LandRegisterPanelSubtext,
  LandRegisterPrimaryButton,
  LandRegisterRightColumn,
  LandRegisterSection,
  LandRegisterSectionDescription,
  LandRegisterSectionTitle,
  LandRegisterAddressField,
  LandRegisterAddressFieldWrap,
  LandRegisterAddressInput,
  LandRegisterAddressHelper,
  LandRegisterVisualCanvas,
  LandRegisterVisualEmpty,
  LandRegisterVisualMapIcon,
} from "./LandRegister.styled";

function LandRegister() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const previewMessage = useMemo(() => {
    // 검색 결과가 있으면 미리보기 문구로 사용
    if (searchResult) {
      return searchResult;
    }
    return "주소를 검색하면 지도에 위치가 표시됩니다.";
  }, [searchResult]);

  const handleSearch = (event) => {
    // 주소 입력 후 미리보기 검색 처리
    event.preventDefault();
    const trimmed = address.trim();
    if (!trimmed) {
      setSearchResult("주소를 입력한 뒤 검색해 주세요.");
      return;
    }

    setSearchResult(`입력된 주소: ${trimmed}`);
  };

  return (
    <LandRegisterPage>
      {/* 공통 헤더 */}
      <RegisterPageHeader />

      {/* 주소 입력과 지도 미리보기 */}
      <LandRegisterContainer>
        <LandRegisterMain>
          <LandRegisterSection>
            <LandRegisterSectionTitle>1. 토지 등록</LandRegisterSectionTitle>
            <LandRegisterSectionDescription>
              안전하고 정확한 거래를 위해 토지 정보를 등록해주세요.
            </LandRegisterSectionDescription>
          </LandRegisterSection>

          <LandRegisterCard>
            <LandRegisterCardTitle>주소 입력</LandRegisterCardTitle>
            <LandRegisterCardBody>
              <LandRegisterCardLabel>
                토지의 주소를 입력하면 자동으로 공공 데이터를 조회합니다.
              </LandRegisterCardLabel>

              <LandRegisterAddressFieldWrap onSubmit={handleSearch}>
                <LandRegisterAddressField>
                  <LandRegisterAddressInput
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="주소를 입력해주세요. (예: 경기도 안성시 일죽면 산북리 123)"
                  />
                </LandRegisterAddressField>

                <LandRegisterPrimaryButton type="submit">
                  <Search size={16} strokeWidth={2.2} />
                  검색
                </LandRegisterPrimaryButton>
              </LandRegisterAddressFieldWrap>

              <LandRegisterAddressHelper>
                도로명, 지번, 건물명 등 다양한 방법으로 검색 가능합니다.
              </LandRegisterAddressHelper>

              <LandRegisterPanelSubtext>
                현재 입력된 주소를 기반으로 자동 조회 결과가 아래에 표시됩니다.
              </LandRegisterPanelSubtext>

              <LandRegisterVisualCanvas>
                <LandRegisterVisualMapIcon>
                  <MapPinned size={34} strokeWidth={1.7} />
                </LandRegisterVisualMapIcon>
                <LandRegisterVisualEmpty>
                  {previewMessage}
                </LandRegisterVisualEmpty>
              </LandRegisterVisualCanvas>
            </LandRegisterCardBody>
          </LandRegisterCard>

          <LandRegisterButtonWrap>
            <LandRegisterBottomButton type="button" onClick={() => navigate("/land/register/confirm")}>
              다음 단계로
              <LandRegisterButtonIcon>
                <ChevronRight size={18} strokeWidth={2.4} />
              </LandRegisterButtonIcon>
            </LandRegisterBottomButton>
          </LandRegisterButtonWrap>
        </LandRegisterMain>

        {/* 진행 단계와 안내 문구 */}
        <LandRegisterRightColumn>
          <RegisterWorkflowSidebar activeStep={1} />
        </LandRegisterRightColumn>
      </LandRegisterContainer>
    </LandRegisterPage>
  );
}

export default LandRegister;
