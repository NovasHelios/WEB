// 프로필 이미지가 없을 때 사용할 대체 아이콘입니다.
import { UserRound } from "lucide-react";
import { useState } from "react";

// 사업자 카드에 필요한 styled 컴포넌트입니다.
import {
  BusinessAvailability,
  BusinessCardContainer,
  BusinessCompany,
  BusinessDepartment,
  BusinessName,
  BusinessProfileFallback,
  BusinessProfileImage,
  BusinessProfileWrap,
  BusinessSpecialty,
  BusinessDetailButton,
} from "../Business.styled";

// 서버 상담 시간을 카드에서 사용할 HH:mm 형식으로 정리합니다.
const formatConsultationTime = (value) => {
  // 시간이 등록되지 않았으면 빈 값으로 처리합니다.
  if (!value) return "";

  // HH:mm:ss 또는 HH:mm 형식에서 시와 분만 가져옵니다.
  const timeMatch = String(value).match(/^(\d{1,2}):(\d{2})/);

  // 예상한 시간 형식이 아니면 서버 값을 그대로 사용합니다.
  if (!timeMatch) return String(value);

  // 한 자리 시각도 두 자리로 맞춰 일관된 시간 형식으로 반환합니다.
  return `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`;
};

// 한 명의 사업자 정보를 표시하는 카드입니다.
function BusinessCard({ business, onViewDetail, isLoading }) {
  const [failedImage, setFailedImage] = useState(null);
  // 카드에 표시할 사업자 필드를 안전하게 꺼냅니다.
  const {
    name,
    company,
    department,
    specialty,
    isAvailable,
    consultationStartTime,
    consultationEndTime,
    profileImage,
    regions,
  } = business;

  // API에 담당자 이름이 없으면 실제 회사명을 사용하고 가상 이름은 만들지 않습니다.
  const displayName = name ? (name.includes("사업가") ? name : `${name} 사업가`) : company || "회사명 미등록";
  // 상담 시작·종료 시간을 카드에 표시할 형식으로 변환합니다.
  const formattedStartTime = formatConsultationTime(consultationStartTime);
  const formattedEndTime = formatConsultationTime(consultationEndTime);
  // 상담 가능 상태에는 시간대를, 불가능 상태에는 기존 문구를 표시합니다.
  const availabilityLabel = isAvailable
    ? formattedStartTime && formattedEndTime
      ? `${formattedStartTime}~${formattedEndTime}`
      : "상담 시간 미등록"
    : "상담 불가";

  return (
    // 사업자의 프로필과 전문 정보를 하나의 카드로 표시합니다.
    <BusinessCardContainer>
      {/* 프로필 이미지가 없으면 기본 사용자 아이콘을 표시합니다. */}
      <BusinessProfileWrap>
        {profileImage && failedImage !== profileImage ? (
          <BusinessProfileImage src={profileImage} alt={`${displayName} 프로필`} onError={() => setFailedImage(profileImage)} />
        ) : (
          <BusinessProfileFallback aria-label="기본 프로필 이미지">
            <UserRound size={112} strokeWidth={1.2} />
          </BusinessProfileFallback>
        )}
      </BusinessProfileWrap>

      {/* 사업자 이름을 디자인에 맞는 형식으로 표시합니다. */}
      <BusinessName>{displayName}</BusinessName>

      {/* 사업자가 소속된 회사와 부서입니다. */}
      {name && company ? <BusinessCompany>{company}</BusinessCompany> : null}
      {department ? <BusinessDepartment>{department}</BusinessDepartment> : null}

      {/* 사업자의 주요 전문 분야입니다. */}
      <BusinessSpecialty>{specialty}</BusinessSpecialty>
      {regions ? <BusinessDepartment>{regions}</BusinessDepartment> : null}

      {/* 현재 상담 가능 여부를 상태 배지로 표시합니다. */}
      <BusinessAvailability $available={isAvailable}>
        {availabilityLabel}
      </BusinessAvailability>
      {/* 기존 카드 디자인 안에서 실제 상세 조회 기능을 유지합니다. */}
      {onViewDetail && <BusinessDetailButton type="button" onClick={onViewDetail} disabled={isLoading}>
        {isLoading ? "불러오는 중…" : "상세 보기"}
      </BusinessDetailButton>}
    </BusinessCardContainer>
  );
}

export default BusinessCard;
