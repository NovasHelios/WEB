import {
  ChevronRight,
  Search,
  MapPinned,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/layout/box/NavBar";
import { RegisterWorkflowSidebar, useRequireLogin } from "../shared";
import { useLandRegister } from "@/contexts/LandRegisterContext";
import { fetchVworldLandInfo } from "@/API/vworldAPI";
import { findDetailedLandAddress } from "@/utils/validateLandAddress";
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
  LandRegisterKakaoMap,
  LandRegisterVisualCanvas,
  LandRegisterVisualEmpty,
  LandRegisterVisualMapIcon,
} from "./LandRegister.styled";

function LandRegister() {
  const navigate = useNavigate();
  useRequireLogin();
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const { registerData, setRegisterData } = useLandRegister();
  const [isAddressChecking, setIsAddressChecking] = useState(false);
  const [addressMessage, setAddressMessage] = useState("");
  // 주소 안내는 입력창 아래 한 위치에서 표시하며 오류만 빨간색으로 구분합니다.
  const [hasAddressError, setHasAddressError] = useState(false);
  const addressValidationIdRef = useRef(0);
  // 화면 이탈 후 늦게 도착한 주소 조회가 새 등록 데이터를 덮어쓰지 않게 합니다.
  useEffect(() => () => { addressValidationIdRef.current += 1; }, []);
  const hasValidLocation = Boolean(registerData.isAddressValid && registerData.latitude && registerData.longitude);

  useEffect(() => {
    // 검증된 주소 좌표가 있으면 Kakao 지도를 생성하고 위치를 표시합니다.
    if (!hasValidLocation || !mapElementRef.current || !window.kakao?.maps) return;

    const lat = Number(registerData.latitude);
    const lng = Number(registerData.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const position = new window.kakao.maps.LatLng(lat, lng);

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.kakao.maps.Map(mapElementRef.current, {
        center: position,
        level: 3,
        draggable: false,
        scrollwheel: false,
        disableDoubleClick: true,
        disableDoubleClickZoom: true,
      });
    }

    mapInstanceRef.current.setCenter(position);
    mapInstanceRef.current.setLevel(3);
    mapInstanceRef.current.setDraggable(false);
    mapInstanceRef.current.setZoomable(false);
    mapInstanceRef.current.relayout();

    if (!markerRef.current) {
      markerRef.current = new window.kakao.maps.Marker({
        map: mapInstanceRef.current,
        position,
      });
      return;
    }

    markerRef.current.setMap(mapInstanceRef.current);
    markerRef.current.setPosition(position);
  }, [hasValidLocation, registerData.latitude, registerData.longitude]);

  const validateAddress = async (value) => {
    // 등록과 수정에 같은 검증 규칙과 제한 시간을 적용합니다.
    const matched = await findDetailedLandAddress(value);
    if (!matched) return null;
    return {
      address: matched.address_name || value,
      roadAddress: matched.road_address?.address_name || "",
      x: matched.x || "", y: matched.y || "", isDetailedAddress: true,
    };
  };

  const handleSearch = (event) => {
    // 주소 입력 후 유효성 검사를 진행합니다.
    event.preventDefault();
    const trimmed = registerData.address.trim();

    if (!trimmed) {
      setHasAddressError(true);
      setAddressMessage("주소를 입력한 뒤 검색해 주세요.");
      return;
    }

    setIsAddressChecking(true);
    setHasAddressError(false);
    setAddressMessage("주소를 확인하는 중입니다.");
    const validationId = addressValidationIdRef.current + 1;
    addressValidationIdRef.current = validationId;

    validateAddress(trimmed)
      .then(async (result) => {
        if (validationId !== addressValidationIdRef.current) return;

        if (!result || !result.isDetailedAddress) {
          setHasAddressError(true);
          setAddressMessage("시·군·구가 아닌 상세 지번 또는 도로명 주소를 입력해 주세요.");
          setRegisterData((prev) => ({
            ...prev,
            isAddressValid: false,
            confirmedAddress: "",
            confirmedRoadAddress: "",
            confirmedLocation: "",
            latitude: "",
            longitude: "",
          }));
          return;
        }

        let vworldInfo;
        try {
          vworldInfo = await fetchVworldLandInfo(trimmed);
        } catch {
          // 공공 데이터 조회 실패가 주소 검증 결과까지 무효화하지 않도록 처리합니다.
          vworldInfo = null;
        }

        if (validationId !== addressValidationIdRef.current) return;

        setHasAddressError(false);
        setAddressMessage("유효한 주소로 확인되었습니다.");
        setRegisterData((prev) => ({
          ...prev,
          address: trimmed,
          isAddressValid: true,
          confirmedAddress: vworldInfo?.confirmedAddress || result.address,
          confirmedRoadAddress: result.roadAddress,
          confirmedLocation: vworldInfo?.confirmedLocation || (result.x && result.y ? `${result.y}, ${result.x}` : ""),
          latitude: vworldInfo?.latitude || result.y,
          longitude: vworldInfo?.longitude || result.x,
          pnu: vworldInfo?.pnu || "",
          area: vworldInfo?.area || "",
          officialLandPrice: vworldInfo?.officialLandPrice || "",
          landCategory: vworldInfo?.landCategory || "",
          altitude: vworldInfo?.altitude || "",
          roadAccess: vworldInfo?.roadAccess || "",
          shareCount: vworldInfo?.shareCount || "0명 (단독소유)",
        }));
      })
      .catch(() => {
        // 지난 검색의 오류가 새 입력 안내를 덮어쓰지 않게 합니다.
        if (validationId !== addressValidationIdRef.current) return;
        setHasAddressError(true);
        setAddressMessage("주소를 확인하지 못했습니다. 잠시 후 다시 검색해주세요.");
        setRegisterData((prev) => ({ ...prev, isAddressValid: false }));
      })
      .finally(() => {
        if (validationId === addressValidationIdRef.current) {
          setIsAddressChecking(false);
        }
      });
  };

  const handleAddressChange = (event) => {
    // 주소가 바뀌면 이전 검증 결과를 초기화합니다.
    addressValidationIdRef.current += 1;
    setIsAddressChecking(false);
    setHasAddressError(false);
    setAddressMessage("");
    setRegisterData((prev) => ({
      ...prev,
      address: event.target.value,
      isAddressValid: false,
      confirmedAddress: "",
      confirmedRoadAddress: "",
      confirmedLocation: "",
      latitude: "",
      longitude: "",
      pnu: "",
      area: "",
      officialLandPrice: "",
      landCategory: "",
      altitude: "",
      roadAccess: "",
      shareCount: "",
    }));
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
              사업에 필요한 토지 정보를 입력해주세요.
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
                    aria-label="등록할 토지 주소"
                    aria-describedby="land-address-helper"
                    aria-invalid={hasAddressError}
                    value={registerData.address}
                    onChange={handleAddressChange}
                    placeholder="주소를 입력해주세요. (예: 경기도 안성시 일죽면 산북리 123)"
                  />
                </LandRegisterAddressField>

                <LandRegisterPrimaryButton type="submit" disabled={isAddressChecking}>
                  <Search size={16} strokeWidth={2.2} />
                  {isAddressChecking ? "확인 중" : "검색"}
                </LandRegisterPrimaryButton>
              </LandRegisterAddressFieldWrap>

              <LandRegisterAddressHelper id="land-address-helper" $error={hasAddressError} aria-live="polite" aria-atomic="true">
                {addressMessage || "상세 지번 또는 건물번호가 포함된 도로명 주소를 입력해주세요. 시·군·구만으로는 등록할 수 없습니다."}
              </LandRegisterAddressHelper>

              <LandRegisterPanelSubtext>
                현재 입력된 주소를 기반으로 자동 조회 결과가 아래에 표시됩니다.
              </LandRegisterPanelSubtext>

              <LandRegisterVisualCanvas>
                {hasValidLocation ? <LandRegisterKakaoMap ref={mapElementRef} /> : null}
                {!hasValidLocation ? (
                  <>
                    <LandRegisterVisualMapIcon>
                      <MapPinned size={34} strokeWidth={1.7} />
                    </LandRegisterVisualMapIcon>
                    <LandRegisterVisualEmpty>
                      주소를 검색하면 지도에 위치가 표시됩니다.
                    </LandRegisterVisualEmpty>
                  </>
                ) : null}
              </LandRegisterVisualCanvas>
            </LandRegisterCardBody>
          </LandRegisterCard>

          <LandRegisterButtonWrap>
            <LandRegisterBottomButton
              type="button"
              disabled={!registerData.address.trim() || !registerData.isAddressValid || isAddressChecking}
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
