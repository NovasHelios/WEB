import { useEffect, useState } from "react";
import { BadgeCheck, Plus, ShieldCheck } from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, getValidAccessToken } from "@/lib/auth";
import useAuthToken from "@/hooks/useAuthToken";
import { Link, Navigate } from "react-router-dom";
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
  BusinessPill,
  BusinessPillRow,
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
  BusinessTimeInput,
  BusinessSmallButton,
  BusinessSwitch,
  BusinessTag,
  BusinessTags,
} from "./BusinessProfile.styles";

const additionalSpecialties = ["태양광 유지보수", "EPC 관리", "개발 컨설팅"];
const regions = ["대구", "경북", "경남", "서울/수도권", "충청/세종", "전라권", "강원권", "제주"];

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
  const [isSaving, setIsSaving] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [nationwideActive, setNationwideActive] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
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
      setStartTime((current) => business.consultationStartTime || current);
      setEndTime((current) => business.consultationEndTime || current);
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
    if (!profile.company.trim() || !businessMeta.businessNumber.trim()) {
      setSaveMessage("회사명과 사업자등록번호를 입력해주세요.");
      return;
    }
    if (isConsultationActive && (!startTime || !endTime || startTime >= endTime)) {
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
      setSaveMessage("사업자 프로필이 서버에 저장되었습니다.");
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

  const addSpecialty = () => {
    const nextSpecialty = additionalSpecialties.find((item) => !selectedSpecialties.includes(item));
    if (nextSpecialty) setSelectedSpecialties((current) => [...current, nextSpecialty]);
  };

  const toggleRegion = (region) => {
    setSelectedRegions((current) => current.includes(region)
      ? current.filter((item) => item !== region)
      : [...current, region]);
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
            <BusinessField>
              대표 분야 *
              <BusinessTags>
                {selectedSpecialties.map((specialty) => <BusinessTag key={specialty} type="button" onClick={() => toggleSpecialty(specialty)}>{specialty} ×</BusinessTag>)}
                <BusinessTag type="button" $add onClick={addSpecialty}><Plus size={13} /> 분야 추가</BusinessTag>
              </BusinessTags>
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
              <BusinessOptionLabel>활동 가능 권역 선택 <label><input type="checkbox" checked={nationwideActive} onChange={(event) => setNationwideActive(event.target.checked)} /> 전국 협의 가능</label></BusinessOptionLabel>
              <BusinessPillRow>
                {regions.map((region) => <BusinessPill key={region} type="button" $active={selectedRegions.includes(region)} onClick={() => toggleRegion(region)}>{region}</BusinessPill>)}
              </BusinessPillRow>
              <BusinessSettingCard>
                <BusinessSettingRow><div><strong>상담 요청 활성화</strong><br /><span>활성화 시 토지주로부터 즉시 상담 요청을 받습니다.</span></div><BusinessSwitch as="button" type="button" $active={isConsultationActive} aria-pressed={isConsultationActive} onClick={() => setIsConsultationActive((current) => !current)} /></BusinessSettingRow>
                <BusinessSettingRow>
                  <div><strong>상담 가능 시간대</strong></div>
                  <div>
                    {/* 상담 가능한 시작·종료 시간을 직접 입력합니다. */}
                    <BusinessTimeInput type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} aria-label="상담 시작 시간" />
                    <span>~</span>
                    <BusinessTimeInput type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} aria-label="상담 종료 시간" />
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
