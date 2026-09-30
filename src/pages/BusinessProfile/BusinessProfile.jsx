import { useEffect, useRef, useState } from "react";
import { BadgeCheck, ImagePlus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
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
  BusinessImageActions,
  BusinessImageBox,
  BusinessImageButton,
  BusinessImageCaption,
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

const specialties = ["태양광 발전소", "토지 개발", "인허가 컨설팅", "EPC 시공"];
const additionalSpecialties = ["태양광 유지보수", "EPC 관리", "개발 컨설팅"];
const regions = ["대구", "경북", "경남", "서울/수도권", "충청/세종", "전라권", "강원권", "제주"];
const BUSINESS_PROFILE_DRAFT_KEY = "business-profile-draft";

const defaultProfile = {
  name: "배길수",
  company: "림버스 컴퍼니",
  department: "LCB 부서 소속",
  position: "대표 사업가",
  phone: "010-3849-2819",
  email: "gilsoo.bae@limbuscompany.co.kr",
  shortIntro: "태양광 발전소 개발·시공·인허가 토지 분석부터 준공까지 원스톱 솔루션",
  introduction: "안녕하세요. 태양광 및 신재생에너지 사업 총괄 전문가 배길수입니다. 10년 이상의 전국 필지 개발 및 인허가 현장 실무 경험을 바탕으로, 복잡한 계통 연계와 태양광부터 지자체 조례 심의, EPC 턴키 시공까지 가장 신속하고 신뢰할 수 있는 개발 솔루션을 제공합니다.",
};

function readSavedProfile() {
  try {
    return JSON.parse(localStorage.getItem(BUSINESS_PROFILE_DRAFT_KEY) || "null") || {};
  } catch {
    return {};
  }
}

function BusinessProfile() {
  const savedProfile = readSavedProfile();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({ ...defaultProfile, ...savedProfile.profile });
  const [selectedSpecialties, setSelectedSpecialties] = useState(savedProfile.specialties || specialties);
  const [selectedRegions, setSelectedRegions] = useState(savedProfile.regions || regions.slice(0, 3));
  const [isConsultationActive, setIsConsultationActive] = useState(savedProfile.isConsultationActive ?? true);
  const [startTime, setStartTime] = useState(savedProfile.startTime || "09:00");
  const [endTime, setEndTime] = useState(savedProfile.endTime || "18:00");
  const [imagePreview, setImagePreview] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  // 입력한 사업자 프로필을 브라우저에 임시 저장합니다.
  const handleSave = () => {
    localStorage.setItem(BUSINESS_PROFILE_DRAFT_KEY, JSON.stringify({
      profile,
      specialties: selectedSpecialties,
      regions: selectedRegions,
      isConsultationActive,
      startTime,
      endTime,
    }));
    setSaveMessage("저장되었습니다.");
  };

  // 업로드한 이미지를 현재 화면에 미리 표시합니다.
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImagePreview((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    event.target.value = "";
  };

  useEffect(() => () => {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

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

        <BusinessProfileSection>
          <BusinessProfileSectionHeader>
            <BusinessProfileSectionTitle><span>1</span>기본 정보</BusinessProfileSectionTitle>
            <BusinessProfileHint>* 표시는 필수 항목입니다.</BusinessProfileHint>
          </BusinessProfileSectionHeader>

          <BusinessBasicGrid>
            <BusinessImageBox>
              <span>프로필 사진</span>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleImageChange} />
              {imagePreview ? <BusinessImagePreview src={imagePreview} alt="프로필 미리보기" /> : null}
              <BusinessImageButton type="button" onClick={() => fileInputRef.current?.click()}>
                {!imagePreview && <ImagePlus size={28} />}
                {imagePreview ? "이미지 변경" : "이미지 업로드"}
              </BusinessImageButton>
              <BusinessImageCaption>권장 사이즈: 400×400px<br />(JPG, PNG, WebP)</BusinessImageCaption>
              <BusinessImageActions>
                <button type="button" onClick={() => fileInputRef.current?.click()}>업로드</button>
                <button type="button" onClick={() => setImagePreview(null)}><Trash2 size={12} /> 삭제</button>
              </BusinessImageActions>
            </BusinessImageBox>

            <BusinessFieldGrid>
              <BusinessField>이름 *<BusinessFieldInput value={profile.name} onChange={updateProfile("name")} /></BusinessField>
              <BusinessField>회사명 *<BusinessFieldInput value={profile.company} onChange={updateProfile("company")} /></BusinessField>
              <BusinessField>소속 / 부서<BusinessFieldInput value={profile.department} onChange={updateProfile("department")} /></BusinessField>
              <BusinessField>직책 / 직함<BusinessFieldInput value={profile.position} onChange={updateProfile("position")} /></BusinessField>
              <BusinessField>업무용 연락처 *<BusinessFieldInput value={profile.phone} onChange={updateProfile("phone")} /></BusinessField>
              <BusinessField>업무용 이메일 *<BusinessFieldInput value={profile.email} onChange={updateProfile("email")} /></BusinessField>
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
              <BusinessOptionLabel>활동 가능 권역 선택 <span>전국 협의 가능</span></BusinessOptionLabel>
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
                <div><strong>사업자등록증 인증 완료 <small>VERIFIED</small></strong><span>등록번호: 123-45-67890　|　상호: 림버스 컴퍼니</span></div>
              </BusinessCertificateStatus>
              <BusinessSmallButton type="button">서류 재업로드 / 갱신</BusinessSmallButton>
            </BusinessCertificate>
            <BusinessOptionLabel>보유 자격증 현황 <span>+ 자격증 추가</span></BusinessOptionLabel>
            <BusinessCredentialList>
              <BusinessCredential><BadgeCheck size={15} /> 신재생에너지발전설비기사</BusinessCredential>
              <BusinessCredential><BadgeCheck size={15} /> 전기기사</BusinessCredential>
            </BusinessCredentialList>
          </BusinessProfileSection>
        </BusinessBottomGrid>

        <BusinessProfileActions>
          {saveMessage && <BusinessSaveMessage>{saveMessage}</BusinessSaveMessage>}
          <BusinessSaveButton type="button" onClick={handleSave}>저장하기</BusinessSaveButton>
        </BusinessProfileActions>
      </BusinessProfileMain>
    </BusinessProfilePage>
  );
}

export default BusinessProfile;
