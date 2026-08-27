import {
  ChevronRight,
  Search,
  MapPinned,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/box/NavBar";
import { RegisterWorkflowSidebar, useRequireLogin } from "../shared";
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
  useRequireLogin();
  const [address, setAddress] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isAddressChecking, setIsAddressChecking] = useState(false);
  const [addressMessage, setAddressMessage] = useState("");

  const previewMessage = useMemo(() => {
    // 검색 결과가 있으면 미리보기 문구로 사용
    if (addressMessage) {
      return addressMessage;
    }

    if (searchResult) {
      return searchResult;
    }
    return "주소를 검색하면 지도에 위치가 표시됩니다.";
  }, [addressMessage, searchResult]);

  const validateAddress = async (value) => {
    // Kakao 주소 검색 결과로 입력 주소의 유효성을 확인합니다.
    if (!window.kakao?.maps?.services?.Geocoder) {
      return false;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    return new Promise((resolve) => {
      geocoder.addressSearch(value, (result, status) => {
        resolve(status === window.kakao.maps.services.Status.OK && result.length > 0);
      });
    });
  };

  const handleSearch = (event) => {
    // 주소 입력 후 유효성 검사를 진행합니다.
    event.preventDefault();
    const trimmed = address.trim();

    if (!trimmed) {
      setIsAddressValid(false);
      setAddressMessage("주소를 입력한 뒤 검색해 주세요.");
      return;
    }

    setIsAddressChecking(true);
    setAddressMessage("주소를 확인하는 중입니다.");

    validateAddress(trimmed)
      .then((isValid) => {
        if (!isValid) {
          setIsAddressValid(false);
          setSearchResult("");
          setAddressMessage("유효한 주소를 찾지 못했습니다. 다시 확인해 주세요.");
          return;
        }

        setIsAddressValid(true);
        setSearchResult(`입력된 주소: ${trimmed}`);
        setAddressMessage("유효한 주소로 확인되었습니다.");
      })
      .finally(() => {
        setIsAddressChecking(false);
      });
  };

  const handleAddressChange = (event) => {
    // 주소가 바뀌면 이전 검증 결과를 초기화합니다.
    setAddress(event.target.value);
    setIsAddressValid(false);
    setSearchResult("");
    setAddressMessage("");
  };

  return (
    <LandRegisterPage>
      {/* 공통 헤더 */}
      <NavBar
        keyword=""
        onChangeKeyword={() => {}}
        onSearch={() => {}}
        isSuggestionOpen={false}
        regionSuggestions={[]}
      />

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
                    onChange={handleAddressChange}
                    placeholder="주소를 입력해주세요. (예: 경기도 안성시 일죽면 산북리 123)"
                  />
                </LandRegisterAddressField>

                <LandRegisterPrimaryButton type="submit" disabled={isAddressChecking}>
                  <Search size={16} strokeWidth={2.2} />
                  {isAddressChecking ? "확인 중" : "검색"}
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
            <LandRegisterBottomButton
              type="button"
              disabled={!address.trim() || !isAddressValid || isAddressChecking}
              onClick={() => navigate("/land/register/confirm")}
            >
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
