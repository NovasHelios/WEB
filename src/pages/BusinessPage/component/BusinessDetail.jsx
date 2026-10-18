import { ArrowLeft, BadgeCheck, BriefcaseBusiness, Building2, Clock3, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import {
  BusinessBackButton,
  BusinessConsultButton,
  BusinessDetailLayout,
  BusinessDetailSection,
  BusinessDetailToolbar,
  BusinessFieldChip,
  BusinessFieldList,
  BusinessInformationCard,
  BusinessInformationSection,
  BusinessLeadText,
  BusinessProfileFallback,
  BusinessProfileImage,
  BusinessSectionDescription,
  BusinessSectionTitle,
  BusinessSummaryAvatar,
  BusinessSummaryCard,
  BusinessSummaryDepartment,
  BusinessSummaryFacts,
  BusinessSummaryRole,
  BusinessSummaryTitle,
  BusinessVerificationList,
} from "../Business.styled";

// 서버의 HH:mm:ss 또는 HH:mm 값을 화면용 HH:mm 형식으로 정리합니다.
const formatTime = (value) => {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})/);
  return match ? `${match[1].padStart(2, "0")}:${match[2]}` : "";
};

// 목록 또는 상세 응답에 이미지가 추가되는 경우 사용할 실제 경로를 찾습니다.
const getProfileImage = (profile) => (
  profile.profileImageUrl
  || profile.profileImagePath
  || profile.profileImage
  || ""
);

// 상세 API 응답을 사업자 소개 화면에 배치합니다.
function BusinessDetail({ profile, onBack, onStartChat }) {
  const [failedImage, setFailedImage] = useState("");
  // 배열이 아닌 응답이 들어와도 상세 화면이 깨지지 않도록 정규화합니다.
  const fields = Array.isArray(profile.mainFields) ? profile.mainFields.filter(Boolean) : [];
  const regions = Array.isArray(profile.activeRegions) ? profile.activeRegions.filter(Boolean) : [];
  const profileImage = getProfileImage(profile);
  const startTime = formatTime(profile.consultationStartTime);
  const endTime = formatTime(profile.consultationEndTime);
  // 상담 상태와 등록된 시간에 따라 사용자에게 보여줄 문장을 구성합니다.
  const consultationText = profile.consultationAvailable
    ? startTime && endTime
      ? `상담 가능 (${startTime} - ${endTime})`
      : "상담 가능 (시간 미등록)"
    : "상담 불가";
  // 전국 활동 여부를 우선하고 지역 목록이 없을 때는 미등록 상태를 표시합니다.
  const regionText = profile.nationwideActive
    ? "전국"
    : regions.join(", ") || "활동 지역이 등록되지 않았습니다.";

  return (
    <BusinessDetailSection aria-label="사업자 상세 정보">
      {/* 상세 화면에서 기존 사업자 목록으로 돌아갑니다. */}
      <BusinessDetailToolbar>
        <BusinessBackButton type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          목록으로
        </BusinessBackButton>
      </BusinessDetailToolbar>

      <BusinessDetailLayout>
        {/* 회사와 담당 업무를 빠르게 확인하는 요약 영역입니다. */}
        <BusinessSummaryCard>
          <BusinessSummaryAvatar>
            {profileImage && failedImage !== profileImage ? (
              <BusinessProfileImage
                src={profileImage}
                alt={`${profile.companyName || "사업자"} 프로필`}
                onError={() => setFailedImage(profileImage)}
              />
            ) : (
              <BusinessProfileFallback aria-label="기본 프로필 이미지">
                <UserRound size={92} strokeWidth={1.2} />
              </BusinessProfileFallback>
            )}
          </BusinessSummaryAvatar>
          <BusinessSummaryRole>{profile.jobTitle || "태양광 사업자"}</BusinessSummaryRole>
          <BusinessSummaryTitle>{profile.companyName || "회사명 미등록"}</BusinessSummaryTitle>
          {profile.department ? <BusinessSummaryDepartment>{profile.department}</BusinessSummaryDepartment> : null}

          {/* API에서 확인 가능한 항목만 요약 수치로 표시합니다. */}
          <BusinessSummaryFacts>
            <div><span>대표 분야</span><strong>{fields.length}개</strong></div>
            <div><span>활동 지역</span><strong>{profile.nationwideActive ? "전국" : `${regions.length}곳`}</strong></div>
            <div><span>인증 상태</span><strong>{profile.businessVerified ? "완료" : "확인 중"}</strong></div>
          </BusinessSummaryFacts>

          {/* 사업자에게 토지 선택 기반 채팅을 시작합니다. */}
          <BusinessConsultButton type="button" onClick={onStartChat}>사업자와 채팅하기</BusinessConsultButton>
        </BusinessSummaryCard>

        {/* 상세 API가 제공하는 소개·활동·상담·인증 정보를 표시합니다. */}
        <BusinessInformationCard>
          <BusinessInformationSection>
            <BusinessSectionTitle><BriefcaseBusiness size={20} aria-hidden="true" />대표 분야</BusinessSectionTitle>
            <BusinessLeadText>{profile.mainFieldDescription || fields.join(" · ") || "대표 분야 소개가 등록되지 않았습니다."}</BusinessLeadText>
            {fields.length > 0 ? (
              <BusinessFieldList aria-label="전문 분야 목록">
                {fields.map((field) => <BusinessFieldChip key={field}>#{field}</BusinessFieldChip>)}
              </BusinessFieldList>
            ) : null}
          </BusinessInformationSection>

          <BusinessInformationSection>
            <BusinessSectionTitle><Building2 size={20} aria-hidden="true" />사업자 소개</BusinessSectionTitle>
            <BusinessSectionDescription>{profile.businessDescription || "사업자 소개가 등록되지 않았습니다."}</BusinessSectionDescription>
          </BusinessInformationSection>

          <BusinessInformationSection>
            <BusinessSectionTitle><MapPin size={20} aria-hidden="true" />활동 지역</BusinessSectionTitle>
            <BusinessSectionDescription>{regionText}</BusinessSectionDescription>
          </BusinessInformationSection>

          <BusinessInformationSection>
            <BusinessSectionTitle><Clock3 size={20} aria-hidden="true" />상담 가능 여부</BusinessSectionTitle>
            <BusinessSectionDescription>{consultationText}</BusinessSectionDescription>
          </BusinessInformationSection>

          <BusinessInformationSection>
            <BusinessSectionTitle><ShieldCheck size={20} aria-hidden="true" />사업자 인증 정보</BusinessSectionTitle>
            <BusinessVerificationList>
              <li data-verified={profile.businessVerified}>
                <BadgeCheck size={17} aria-hidden="true" />
                {profile.businessVerified ? "사업자등록증 검증 완료" : "사업자등록증 확인 중"}
              </li>
              {profile.businessLicensePath ? (
                <li data-verified="true"><BadgeCheck size={17} aria-hidden="true" />사업자등록증 제출 완료</li>
              ) : null}
            </BusinessVerificationList>
          </BusinessInformationSection>
        </BusinessInformationCard>
      </BusinessDetailLayout>
    </BusinessDetailSection>
  );
}

export default BusinessDetail;
