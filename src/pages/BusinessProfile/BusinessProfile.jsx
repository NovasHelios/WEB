import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Plus, ShieldCheck } from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, getValidAccessToken } from "@/lib/auth";
import useAuthToken from "@/hooks/useAuthToken";
import { Link, Navigate, useNavigate } from "react-router-dom";
import BusinessTimePicker from "./BusinessTimePicker";
import {
  BusinessBasicGrid,
  BusinessBottomGrid,
  BusinessCertificate,
  BusinessCertificateIcon,
  BusinessCertificateStatus,
  BusinessCredential,
  BusinessCredentialList,
  BusinessField,
  BusinessFieldGrid,
  BusinessFieldInput,
  BusinessFieldTextarea,
  BusinessImageBox,
  BusinessImagePreview,
  BusinessIntroduction,
  BusinessOptionLabel,
  BusinessOptionPanel,
  BusinessProfileActions,
  BusinessProfileDescription,
  BusinessProfileHeader,
  BusinessProfileHint,
  BusinessProfileMain,
  BusinessProfilePage,
  BusinessProfileSection,
  BusinessProfileSectionHeader,
  BusinessProfileSectionTitle,
  BusinessProfileTitle,
  BusinessSaveButton,
  BusinessSaveMessage,
  BusinessSettingCard,
  BusinessSettingRow,
  BusinessSmallButton,
  BusinessSwitch,
  BusinessTag,
  BusinessTags,
} from "./BusinessProfile.styles";


const defaultProfile = {
  name: "",
  company: "",
  department: "",
  position: "",
  phone: "",
  email: "",
  shortIntro: "",
  introduction: "",
};

function BusinessProfile() {
  // 계정 변경 시 입력 상태를 통째로 초기화하고 공용 임시 저장은 사용하지 않습니다.
  const token = useAuthToken();
  return token ? <BusinessProfileForm key={token} /> : <Navigate to="/login" replace />;
}

function BusinessProfileForm() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [nationwideActive, setNationwideActive] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  // 분야는 입력 후 명시적으로 추가하며 취소한 초안은 저장하지 않습니다.
  const [isAddingSpecialty, setIsAddingSpecialty] = useState(false);
  const [specialtyDraft, setSpecialtyDraft] = useState("");
  const [specialtyError, setSpecialtyError] = useState("");
  const specialtyInputRef = useRef(null);
  const specialtyButtonRef = useRef(null);

  useEffect(() => {
    if (isAddingSpecialty) specialtyInputRef.current?.focus();
  }, [isAddingSpecialty]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  // 활동 지역도 직접 입력한 값만 태그로 추가합니다.
  const [isAddingRegion, setIsAddingRegion] = useState(false);
  const [regionDraft, setRegionDraft] = useState("");
  const [regionError, setRegionError] = useState("");
  const regionInputRef = useRef(null);
  const regionButtonRef = useRef(null);
  useEffect(() => {
    if (isAddingRegion) regionInputRef.current?.focus();
  }, [isAddingRegion]);
  const [isConsultationActive, setIsConsultationActive] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [imagePreview, setImagePreview] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [businessMeta, setBusinessMeta] = useState({ businessNumber: "", businessVerified: false });

  useEffect(() => {
    let isCancelled = false;

    const loadProfile = async () => {
      // 스웨거의 사용자·사업자 프로필 API를 함께 조회합니다.
      if (!getValidAccessToken()) return;

      const [userResponse, businessResponse] = await Promise.all([
        authFetch(Api.MyProfile, { method: "GET" }),
        authFetch(Api.BusinessProfile, { method: "GET" }),
      ]);

      if (isCancelled) return;

      const userData = userResponse.ok ? await userResponse.json() : null;
      const businessData = businessResponse.ok ? await businessResponse.json() : null;
      if (isCancelled) return;
      if (!userResponse.ok || (!businessResponse.ok && businessResponse.status !== 404)) {
        throw new Error("프로필을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.");
      }
      const user = userData?.data || {};
      const business = businessData?.data || {};
      // 사업자 화면도 로그인한 사용자의 실제 프로필 사진을 표시합니다.
      const imagePath = String(user.profileImagePath || "");
      const relativePath = imagePath.replace(/^\/+/, "");
      setImagePreview(!imagePath ? null : /^https?:\/\//.test(imagePath) ? imagePath
        : `https://api.helioss.site/${relativePath.startsWith("uploads/") ? relativePath : `uploads/profiles/${relativePath}`}`);
      if (user.plan !== "BUSINESS") throw new Error("사업자 프로필은 BUSINESS 플랜에서 사용할 수 있습니다.");
      setNationwideActive(Boolean(business.nationwideActive));
      setIsReady(true);

      setProfile((current) => ({
        ...current,
        name: user.name || current.name,
        phone: user.phone || current.phone,
        email: user.email || current.email,
        company: business.companyName || current.company,
        department: business.department || current.department,
        position: business.jobTitle || current.position,
        shortIntro: business.mainFieldDescription || current.shortIntro,
        introduction: business.businessDescription || current.introduction,
      }));
      setBusinessMeta({
        businessNumber: business.businessNumber || "",
        businessVerified: Boolean(business.businessVerified),
        businessLicensePath: business.businessLicensePath || "",
      });
      setSelectedSpecialties((current) => (
        Array.isArray(business.mainFields) ? business.mainFields : current
      ));
      setSelectedRegions((current) => (
        Array.isArray(business.activeRegions) ? business.activeRegions : current
      ));
      setIsConsultationActive((current) => business.consultationAvailable ?? current);
      setStartTime((current) => business.consultationStartTime?.slice(0, 5) || current);
      setEndTime((current) => business.consultationEndTime?.slice(0, 5) || current);
    };

    void loadProfile().catch((error) => {
      if (!isCancelled) setSaveMessage(error.message);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Swagger 요청 필드만 서버에 저장하고 실패를 완료로 표시하지 않습니다.
  const handleSave = async () => {
    if (isSaving || !isReady) return;
    if (isAddingRegion && regionDraft.trim()) {
      setRegionError("입력한 지역을 추가하거나 취소한 뒤 저장해주세요.");
      regionInputRef.current?.focus();
      return;
    }
    if (isAddingSpecialty && specialtyDraft.trim()) {
      setSpecialtyError("입력한 분야를 추가하거나 취소한 뒤 저장해주세요.");
      specialtyInputRef.current?.focus();
      return;
    }
    if (!profile.company.trim() || !businessMeta.businessNumber.trim()) {
      setSaveMessage("회사명과 사업자등록번호를 입력해주세요.");
      return;
    }
    // 직접 입력한 시간도 서버에 보내기 전에 형식과 순서를 확인합니다.
    if (![startTime, endTime].every((time) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time))) {
      setSaveMessage("상담 시간을 24시간 형식으로 입력해주세요. 예: 09:00, 18:30");
      return;
    }
    if (isConsultationActive && startTime >= endTime) {
      setSaveMessage("상담 종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }
    setIsSaving(true);
    setSaveMessage("");
    try {
      const response = await authFetch(Api.BusinessProfile, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: profile.company.trim(), businessNumber: businessMeta.businessNumber.trim(),
          department: profile.department, jobTitle: profile.position,
          mainFields: selectedSpecialties, mainFieldDescription: profile.shortIntro,
          businessDescription: profile.introduction, activeRegions: selectedRegions,
          nationwideActive, consultationAvailable: isConsultationActive,
          consultationStartTime: startTime, consultationEndTime: endTime,
        }),
      });
      if (!response.ok) throw new Error("사업자 프로필 저장에 실패했습니다. 플랜과 입력값을 확인해주세요.");
      // 서버 저장이 성공한 경우에만 지도 화면으로 이동합니다.
      navigate("/", { replace: true });
    } catch (error) {
      setSaveMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateProfile = (field) => (event) => {
    setProfile((current) => ({ ...current, [field]: event.target.value }));
    setSaveMessage("");
  };

  const toggleSpecialty = (specialty) => {
    setSelectedSpecialties((current) => current.filter((item) => item !== specialty));
    setSaveMessage("");
  };

  const closeSpecialtyInput = () => {
    setIsAddingSpecialty(false);
    setSpecialtyDraft("");
    setSpecialtyError("");
    specialtyButtonRef.current?.focus();
  };

  // 공백을 정리하고 대소문자만 다른 중복 분야도 차단합니다.
  const addSpecialty = () => {
    const nextSpecialty = specialtyDraft.trim().replace(/\s+/g, " ");
    if (!nextSpecialty) {
      setSpecialtyError("추가할 분야를 입력해주세요.");
      specialtyInputRef.current?.focus();
      return;
    }
    if (selectedSpecialties.some((item) => item.trim().replace(/\s+/g, " ").toLowerCase() === nextSpecialty.toLowerCase())) {
      setSpecialtyError("이미 추가한 분야입니다.");
      specialtyInputRef.current?.focus();
      return;
    }
    setSelectedSpecialties((current) => [...current, nextSpecialty]);
    setSaveMessage("");
    closeSpecialtyInput();
  };

  const closeRegionInput = () => {
    setIsAddingRegion(false);
    setRegionDraft("");
    setRegionError("");
    regionButtonRef.current?.focus();
  };

  // 빈 지역과 공백·대소문자만 다른 중복 입력을 차단합니다.
  const addRegion = () => {
    const region = regionDraft.trim().replace(/\s+/g, " ");
    if (!region || selectedRegions.some((item) => item.trim().replace(/\s+/g, " ").toLowerCase() === region.toLowerCase())) {
      setRegionError(region ? "이미 추가한 지역입니다." : "추가할 지역을 입력해주세요.");
      regionInputRef.current?.focus();
      return;
    }
    setSelectedRegions((current) => [...current, region]);
    setSaveMessage("");
    closeRegionInput();
  };

  return (
    <BusinessProfilePage>
      {/* 공통 네비게이션 */}
      <NavBar keyword="" onChangeKeyword={() => {}} onSearch={() => {}} isSuggestionOpen={false} regionSuggestions={[]} />

      <BusinessProfileMain>
        <BusinessProfileHeader>
          <BusinessProfileTitle>사업자 프로필</BusinessProfileTitle>
          <BusinessProfileDescription>당신의 사업자로서의 자질을 표현하세요.</BusinessProfileDescription>
        </BusinessProfileHeader>

        {/* 조회·저장 중에는 모든 입력을 잠가 서버와 화면의 값이 달라지지 않게 합니다. */}
        <fieldset disabled={!isReady || isSaving} aria-busy={!isReady || isSaving} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <BusinessProfileSection>
          <BusinessProfileSectionHeader>
            <BusinessProfileSectionTitle><span>1</span>기본 정보</BusinessProfileSectionTitle>
            <BusinessProfileHint>* 표시는 필수 항목입니다.</BusinessProfileHint>
          </BusinessProfileSectionHeader>

          <BusinessBasicGrid>
            <BusinessImageBox>
              <span>프로필 사진</span>
              <Link to="/profile">사진·연락처 수정은 내 프로필로 이동</Link>
              {imagePreview ? <BusinessImagePreview src={imagePreview} alt="프로필 미리보기" /> : null}
            </BusinessImageBox>

            <BusinessFieldGrid>
              <BusinessField>이름<BusinessFieldInput value={profile.name} readOnly /></BusinessField>
              <BusinessField>회사명 *<BusinessFieldInput value={profile.company} onChange={updateProfile("company")} /></BusinessField>
              <BusinessField>소속 / 부서<BusinessFieldInput value={profile.department} onChange={updateProfile("department")} /></BusinessField>
              <BusinessField>직책 / 직함<BusinessFieldInput value={profile.position} onChange={updateProfile("position")} /></BusinessField>
              <BusinessField>연락처<BusinessFieldInput value={profile.phone} readOnly /></BusinessField>
              <BusinessField>이메일<BusinessFieldInput value={profile.email} readOnly /></BusinessField>
              <BusinessField>사업자등록번호 *<BusinessFieldInput value={businessMeta.businessNumber} onChange={(event) => setBusinessMeta((current) => ({ ...current, businessNumber: event.target.value }))} /></BusinessField>
            </BusinessFieldGrid>
          </BusinessBasicGrid>
        </BusinessProfileSection>

        <BusinessProfileSection>
          <BusinessProfileSectionHeader>
            <BusinessProfileSectionTitle><span>2</span>대표 분야 및 소개</BusinessProfileSectionTitle>
          </BusinessProfileSectionHeader>
          <BusinessIntroduction>
            <BusinessField as="div">
              대표 분야 *
              <BusinessTags>
                {selectedSpecialties.map((specialty) => <BusinessTag key={specialty} type="button" aria-label={`${specialty} 삭제`} onClick={() => toggleSpecialty(specialty)}>{specialty} ×</BusinessTag>)}
                <BusinessTag ref={specialtyButtonRef} type="button" $add aria-expanded={isAddingSpecialty} aria-controls="specialty-editor" onClick={() => {
                  setIsAddingSpecialty(true);
                  specialtyInputRef.current?.focus();
                }}><Plus size={13} /> 분야 추가</BusinessTag>
              </BusinessTags>
              {/* 한글 조합 중 Enter는 무시하고, Enter 추가와 Escape 취소를 지원합니다. */}
              {isAddingSpecialty && <div id="specialty-editor">
                <BusinessFieldInput
                  ref={specialtyInputRef}
                  aria-label="추가할 분야"
                  placeholder="분야를 입력해주세요 (예: 태양광 유지보수)"
                  value={specialtyDraft}
                  aria-invalid={Boolean(specialtyError)}
                  aria-describedby={specialtyError ? "specialty-error" : undefined}
                  onChange={(event) => { setSpecialtyDraft(event.target.value); setSpecialtyError(""); }}
                  onKeyDown={(event) => {
                    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
                    if (event.key === "Enter") { event.preventDefault(); addSpecialty(); }
                    if (event.key === "Escape") { event.preventDefault(); closeSpecialtyInput(); }
                  }}
                />
                <BusinessTags>
                  <BusinessSmallButton type="button" onClick={addSpecialty}>추가</BusinessSmallButton>
                  <BusinessSmallButton type="button" onClick={closeSpecialtyInput}>취소</BusinessSmallButton>
                </BusinessTags>
                {specialtyError && <p id="specialty-error" role="alert">{specialtyError}</p>}
              </div>}
            </BusinessField>
            <BusinessField>대표 분야 한 줄 소개 *<BusinessFieldInput value={profile.shortIntro} onChange={updateProfile("shortIntro")} /></BusinessField>
            <BusinessField>사업자 소개 *<BusinessFieldTextarea value={profile.introduction} onChange={updateProfile("introduction")} /></BusinessField>
          </BusinessIntroduction>
        </BusinessProfileSection>

        <BusinessBottomGrid>
          <BusinessProfileSection>
            <BusinessProfileSectionHeader>
              <BusinessProfileSectionTitle><span>3</span>활동 지역 및 상담 가능 여부</BusinessProfileSectionTitle>
            </BusinessProfileSectionHeader>
            <BusinessOptionPanel>
              {/* 활동 지역은 아래 지역 추가 입력으로 관리합니다. */}
              <BusinessOptionLabel>활동 가능 지역</BusinessOptionLabel>
              {/* 저장된 지역은 유지하고 새 지역은 직접 입력하여 추가합니다. */}
              <BusinessTags>
                {selectedRegions.map((region) => <BusinessTag key={region} type="button" aria-label={`${region} 삭제`} onClick={() => {
                  setSelectedRegions((current) => current.filter((item) => item !== region));
                  setSaveMessage("");
                }}>{region} ×</BusinessTag>)}
                <BusinessTag ref={regionButtonRef} type="button" $add aria-expanded={isAddingRegion} aria-controls="region-editor" onClick={() => {
                  setIsAddingRegion(true);
                  regionInputRef.current?.focus();
                }}><Plus size={13} /> 지역 추가</BusinessTag>
              </BusinessTags>
              {isAddingRegion && <div id="region-editor">
                <BusinessFieldInput ref={regionInputRef} aria-label="추가할 지역"
                  placeholder="지역을 입력해주세요 (예: 대구, 서울/수도권)"
                  value={regionDraft} aria-invalid={Boolean(regionError)}
                  aria-describedby={regionError ? "region-error" : undefined}
                  onChange={(event) => { setRegionDraft(event.target.value); setRegionError(""); }}
                  onKeyDown={(event) => {
                    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
                    if (event.key === "Enter") { event.preventDefault(); addRegion(); }
                    if (event.key === "Escape") { event.preventDefault(); closeRegionInput(); }
                  }} />
                <BusinessTags>
                  <BusinessSmallButton type="button" onClick={addRegion}>추가</BusinessSmallButton>
                  <BusinessSmallButton type="button" onClick={closeRegionInput}>취소</BusinessSmallButton>
                </BusinessTags>
                {regionError && <p id="region-error" role="alert">{regionError}</p>}
              </div>}
              <BusinessSettingCard>
                <BusinessSettingRow><div><strong>상담 요청 활성화</strong><br /><span>활성화 시 토지주로부터 즉시 상담 요청을 받습니다.</span></div><BusinessSwitch as="button" type="button" $active={isConsultationActive} aria-pressed={isConsultationActive} onClick={() => setIsConsultationActive((current) => !current)} /></BusinessSettingRow>
                <BusinessSettingRow>
                  <div><strong>상담 가능 시간대</strong></div>
                  <div>
                    {/* 시작 시간은 종료 시간보다 앞선 시간만 선택할 수 있습니다. */}
                    <BusinessTimePicker
                      value={startTime}
                      onChange={setStartTime}
                      label="상담 시작 시간"
                      disabled={!isReady || isSaving}
                      maxExclusive={endTime}
                    />
                    <span>~</span>
                    {/* 종료 시간은 시작 시간보다 늦은 시간만 선택할 수 있습니다. */}
                    <BusinessTimePicker
                      value={endTime}
                      onChange={setEndTime}
                      label="상담 종료 시간"
                      disabled={!isReady || isSaving}
                      minExclusive={startTime}
                    />
                  </div>
                </BusinessSettingRow>
              </BusinessSettingCard>
            </BusinessOptionPanel>
          </BusinessProfileSection>

          <BusinessProfileSection>
            <BusinessProfileSectionHeader>
              <BusinessProfileSectionTitle><span>4</span>사업자 인증 및 자격증 정보</BusinessProfileSectionTitle>
            </BusinessProfileSectionHeader>
            <BusinessCertificate>
              <BusinessCertificateStatus>
                <BusinessCertificateIcon><ShieldCheck size={21} /></BusinessCertificateIcon>
                <div>
                  <strong>
                    {businessMeta.businessVerified ? "사업자등록증 인증 완료" : businessMeta.businessLicensePath ? "사업자등록증 검토 중" : "사업자등록증 미등록"}
                    {businessMeta.businessVerified ? <small> VERIFIED</small> : null}
                  </strong>
                  <span>
                    {businessMeta.businessNumber
                      ? `등록번호: ${businessMeta.businessNumber} | 상호: ${profile.company || "-"}`
                      : "등록된 사업자 정보가 없습니다."}
                  </span>
                </div>
              </BusinessCertificateStatus>
              <BusinessSmallButton type="button">서류 재업로드 / 갱신</BusinessSmallButton>
            </BusinessCertificate>
            <BusinessOptionLabel>보유 자격증 현황 <span>+ 자격증 추가</span></BusinessOptionLabel>
            <BusinessCredentialList>
              <BusinessCredential><BadgeCheck size={15} /> 등록된 자격증이 없습니다.</BusinessCredential>
            </BusinessCredentialList>
          </BusinessProfileSection>
        </BusinessBottomGrid>

        </fieldset>
        <BusinessProfileActions>
          {saveMessage && <BusinessSaveMessage>{saveMessage}</BusinessSaveMessage>}
          <BusinessSaveButton type="button" disabled={isSaving || !isReady} onClick={handleSave}>{isSaving ? "저장 중…" : "저장하기"}</BusinessSaveButton>
        </BusinessProfileActions>
      </BusinessProfileMain>
    </BusinessProfilePage>
  );
}

export default BusinessProfile;
