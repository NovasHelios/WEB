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
import {
  findDetailedLandAddress,
  searchDetailedLandAddresses,
} from "@/utils/validateLandAddress";
// 주소 존재 여부와 별도로 현재 사용자의 중복 등록 여부를 확인합니다.
import { assertLandNotRegistered, DUPLICATE_LAND_MESSAGE, isDuplicateLandError } from "../landDuplicate";
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
  LandRegisterAddressSearchArea,
  LandRegisterAddressResultButton,
  LandRegisterAddressResults,
  LandRegisterKakaoMap,
  LandRegisterVisualCanvas,
  LandRegisterVisualEmpty,
  LandRegisterVisualMapIcon,
} from "./LandRegister.styled";

// 토지 등록에서 일부 주소 검색 후 전체 도로명 주소를 선택하도록 안내합니다.
const FULL_ROAD_ADDRESS_MESSAGE =
  "주소 일부를 입력한 뒤 검색 결과에서 전체 도로명 주소를 선택해 주세요.";

function LandRegister() {
  const navigate = useNavigate();
  useRequireLogin();
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const { registerData, setRegisterData } = useLandRegister();
  const [isAddressChecking, setIsAddressChecking] = useState(false);
  // 일부 주소 검색으로 찾은 전체 도로명 주소 후보를 보관합니다.
  const [addressCandidates, setAddressCandidates] = useState([]);
  // 최종 제출에서 돌아온 중복 오류도 기존 주소 안내 위치에 표시합니다.
  const [addressMessage, setAddressMessage] = useState(registerData.addressError || "");
  // 주소 안내는 입력창 아래 한 위치에서 표시하며 오류만 빨간색으로 구분합니다.
  const [hasAddressError, setHasAddressError] = useState(Boolean(registerData.addressError));
  const addressValidationIdRef = useRef(0);
  // 화면 이탈 후 늦게 도착한 주소 조회가 새 등록 데이터를 덮어쓰지 않게 합니다.
  useEffect(() => () => { addressValidationIdRef.current += 1; }, []);
  const hasValidLocation = Boolean(registerData.isAddressValid && registerData.latitude && registerData.longitude);

  useEffect(() => {
    // 주소 재검색으로 위치가 무효화되면 제거된 지도 DOM의 객체를 재사용하지 않습니다.
    if (!hasValidLocation) {
      // 기존 마커를 지도에서 제거해 이전 주소의 위치 표시를 정리합니다.
      markerRef.current?.setMap(null);
      // 다음 검색에서는 새 지도와 마커를 생성하도록 참조를 초기화합니다.
      markerRef.current = null;
      mapInstanceRef.current = null;
      return;
    }

    // 검증된 주소 좌표가 있으면 Kakao 지도를 생성하고 위치를 표시합니다.
    if (!mapElementRef.current || !window.kakao?.maps) return;

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
    // 토지 등록은 여러 지역에 같은 도로명이 있어도 혼동하지 않도록 전체 도로명 주소만 허용합니다.
    const matched = await findDetailedLandAddress(value, {
      requireFullRoadAddress: true,
    });
    if (!matched) return null;
    return {
      // 도로명으로 검색해도 표준 지번 주소를 함께 확보해 중복 비교에 사용합니다.
      address: matched.address?.address_name || matched.address_name || value,
      roadAddress: matched.road_address?.address_name || "",
      x: matched.x || "", y: matched.y || "", isDetailedAddress: true,
    };
  };

  // 사용자가 선택한 전체 도로명 주소로 기존 공공데이터와 중복 검사를 진행합니다.
  const validateSelectedAddress = async (selectedAddress) => {
    setIsAddressChecking(true);
    // 선택한 전체 도로명 주소를 입력창에 반영하고 이전 위치 결과를 초기화합니다.
    setRegisterData((prev) => ({
      ...prev,
      address: selectedAddress,
      isAddressValid: false,
      addressError: "",
      confirmedAddress: "",
      confirmedRoadAddress: "",
      confirmedLocation: "",
      latitude: "",
      longitude: "",
    }));
    setHasAddressError(false);
    setAddressMessage("주소를 확인하는 중입니다.");
    const validationId = addressValidationIdRef.current + 1;
    addressValidationIdRef.current = validationId;

    try {
      const result = await validateAddress(selectedAddress);
      if (validationId !== addressValidationIdRef.current) return;

      if (!result || !result.isDetailedAddress) {
        setHasAddressError(true);
        setAddressMessage("선택한 도로명 주소를 확인하지 못했습니다. 다시 검색해 주세요.");
        return;
      }

      let vworldInfo;
      try {
        vworldInfo = await fetchVworldLandInfo(selectedAddress);
      } catch {
        // 공공 데이터 조회 실패가 주소 검증 결과까지 무효화하지 않도록 처리합니다.
        vworldInfo = null;
      }

      if (validationId !== addressValidationIdRef.current) return;

      // 내 토지 목록과 선택 주소·표준 주소·PNU를 비교한 뒤에만 검증을 완료합니다.
      await assertLandNotRegistered({
        address: selectedAddress,
        confirmedAddress: result.address,
        confirmedRoadAddress: result.roadAddress,
        refinedAddress: vworldInfo?.confirmedAddress,
        pnu: vworldInfo?.pnu,
      });

      // 중복 확인 도중 주소가 바뀌었으면 이전 응답을 새 입력에 반영하지 않습니다.
      if (validationId !== addressValidationIdRef.current) return;

      setHasAddressError(false);
      setAddressMessage("유효한 주소로 확인되었습니다.");
      setRegisterData((prev) => ({
        ...prev,
        address: selectedAddress,
        // 정상 주소의 중복 확인이 끝나면 이전 제출 오류를 제거합니다.
        addressError: "",
        isAddressValid: true,
        confirmedAddress: vworldInfo?.confirmedAddress || result.address,
        confirmedRoadAddress: result.roadAddress,
        confirmedLocation: vworldInfo?.confirmedLocation || (result.x && result.y ? `${result.y}, ${result.x}` : ""),
        latitude: vworldInfo?.latitude || result.y,
        longitude: vworldInfo?.longitude || result.x,
        pnu: vworldInfo?.pnu || "",
        area: vworldInfo?.area || "",
        landCategory: vworldInfo?.landCategory || "",
        altitude: vworldInfo?.altitude || "",
        roadAccess: vworldInfo?.roadAccess || "",
        shareCount: vworldInfo?.shareCount || "0명 (단독소유)",
      }));
    } catch (error) {
      // 지난 검색의 오류가 새 입력 안내를 덮어쓰지 않게 합니다.
      if (validationId !== addressValidationIdRef.current) return;
      setHasAddressError(true);
      // 중복 오류는 지정 문구로, 조회 실패는 재확인 안내로 표시합니다.
      const message = isDuplicateLandError(error)
        ? DUPLICATE_LAND_MESSAGE
        : error?.message || "주소를 확인하지 못했습니다. 잠시 후 다시 검색해주세요.";
      setAddressMessage(message);
      // 검증 실패 상태를 저장해 다음 단계와 최종 제출을 함께 차단합니다.
      setRegisterData((prev) => ({ ...prev, isAddressValid: false, addressError: message }));
    } finally {
      if (validationId === addressValidationIdRef.current) {
        setIsAddressChecking(false);
      }
    }
  };

  const handleSearch = async (event) => {
    // 일부 주소를 Kakao 검색에 전달하고 선택 가능한 전체 도로명 주소 후보를 요청합니다.
    event.preventDefault();
    const trimmed = registerData.address.trim();

    if (!trimmed) {
      setHasAddressError(true);
      setAddressMessage("주소를 입력한 뒤 검색해 주세요.");
      return;
    }

    setIsAddressChecking(true);
    setAddressCandidates([]);
    setHasAddressError(false);
    setAddressMessage("주소 검색 결과를 불러오는 중입니다.");
    // 새 검색 중에는 이전에 확인한 주소로 다음 단계에 진입하지 못하게 합니다.
    setRegisterData((prev) => ({ ...prev, isAddressValid: false, addressError: "" }));
    const validationId = addressValidationIdRef.current + 1;
    addressValidationIdRef.current = validationId;

    try {
      const candidates = await searchDetailedLandAddresses(trimmed, {
        requireRoadAddress: true,
      });
      if (validationId !== addressValidationIdRef.current) return;

      if (candidates.length === 0) {
        setHasAddressError(true);
        setAddressMessage("검색 결과가 없습니다. 도로명과 건물번호를 확인해 주세요.");
        return;
      }

      // 검색된 후보를 그대로 표시하고 사용자가 전체 도로명 주소를 선택하게 합니다.
      setAddressCandidates(candidates);
      setAddressMessage("검색 결과에서 등록할 전체 도로명 주소를 선택해 주세요.");
    } catch (error) {
      if (validationId !== addressValidationIdRef.current) return;
      setHasAddressError(true);
      setAddressMessage(error?.message || "주소 검색 결과를 불러오지 못했습니다.");
    } finally {
      if (validationId === addressValidationIdRef.current) {
        setIsAddressChecking(false);
      }
    }
  };

  const handleAddressCandidateSelect = (candidate) => {
    // 후보의 전체 도로명 주소만 등록 주소로 사용합니다.
    const selectedAddress = candidate.road_address?.address_name || "";
    if (!selectedAddress) return;
    setAddressCandidates([]);
    void validateSelectedAddress(selectedAddress);
  };

  const handleAddressChange = (event) => {
    // 주소가 바뀌면 이전 검증 결과를 초기화합니다.
    addressValidationIdRef.current += 1;
    setIsAddressChecking(false);
    setAddressCandidates([]);
    setHasAddressError(false);
    setAddressMessage("");
    setRegisterData((prev) => ({
      ...prev,
      address: event.target.value,
      // 다른 주소를 입력하면 이전 중복 오류를 지우고 새 검증을 기다립니다.
      addressError: "",
      isAddressValid: false,
      confirmedAddress: "",
      confirmedRoadAddress: "",
      confirmedLocation: "",
      latitude: "",
      longitude: "",
      pnu: "",
      area: "",
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
                {/* 주소 입력선 너비를 기준으로 검색 결과 드롭다운을 겹쳐 표시합니다. */}
                <LandRegisterAddressSearchArea>
                  <LandRegisterAddressField>
                    <LandRegisterAddressInput
                      aria-label="등록할 토지 주소"
                      aria-describedby="land-address-helper"
                      aria-invalid={hasAddressError}
                      value={registerData.address}
                      onChange={handleAddressChange}
                      placeholder="도로명 주소 일부를 입력해주세요. (예: 테헤란로 152)"
                    />
                  </LandRegisterAddressField>

                  {/* 일부 주소로 검색된 전체 도로명 주소 후보를 드롭다운 목록으로 표시합니다. */}
                  {addressCandidates.length > 0 ? (
                    <LandRegisterAddressResults aria-label="도로명 주소 검색 결과">
                      {addressCandidates.map((candidate) => {
                        // 도로명 주소를 기본 문구로, 지번 주소를 보조 문구로 표시합니다.
                        const roadAddress = candidate.road_address?.address_name || "";
                        const parcelAddress = candidate.address?.address_name || candidate.address_name || "";

                        return (
                          <li key={`${roadAddress}-${candidate.x}-${candidate.y}`}>
                            <LandRegisterAddressResultButton
                              type="button"
                              onClick={() => handleAddressCandidateSelect(candidate)}
                              disabled={isAddressChecking}
                            >
                              <strong>{roadAddress}</strong>
                              {parcelAddress ? <span>지번 {parcelAddress}</span> : null}
                            </LandRegisterAddressResultButton>
                          </li>
                        );
                      })}
                    </LandRegisterAddressResults>
                  ) : null}
                </LandRegisterAddressSearchArea>

                <LandRegisterPrimaryButton type="submit" disabled={isAddressChecking}>
                  <Search size={16} strokeWidth={2.2} />
                  {isAddressChecking ? "확인 중" : "검색"}
                </LandRegisterPrimaryButton>
              </LandRegisterAddressFieldWrap>

              <LandRegisterAddressHelper id="land-address-helper" $error={hasAddressError} aria-live="polite" aria-atomic="true">
                {addressMessage || FULL_ROAD_ADDRESS_MESSAGE}
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
              // 중복 오류나 확인 중 상태에서는 다음 단계 버튼을 비활성화합니다.
              disabled={!registerData.address.trim() || !registerData.isAddressValid || hasAddressError || isAddressChecking}
              onClick={() => {
                // 이벤트 호출에서도 검증 상태를 확인해 다음 단계 이동을 차단합니다.
                if (!registerData.isAddressValid || hasAddressError || isAddressChecking) return;
                navigate("/land/register/confirm");
              }}
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
