// 프로필 대체 이미지와 상담 가능 상태에 사용할 아이콘입니다.
import { CircleCheck, UserRound } from "lucide-react";

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
} from "../Business.styled";

// 한 명의 사업자 정보를 표시하는 카드입니다.
function BusinessCard({ business }) {
  // 카드에 표시할 사업자 필드를 안전하게 꺼냅니다.
  const {
    name,
    company,
    department,
    specialty,
    isAvailable,
    profileImage,
  } = business;

  // 이름에 사업가 문구가 없으면 카드 디자인에 맞게 뒤에 붙입니다.
  const displayName = name?.includes("사업가") ? name : `${name} 사업가`;

  return (
    // 사업자의 프로필과 전문 정보를 하나의 카드로 표시합니다.
    <BusinessCardContainer>
      {/* 프로필 이미지가 없으면 기본 사용자 아이콘을 표시합니다. */}
      <BusinessProfileWrap>
        {profileImage ? (
          <BusinessProfileImage src={profileImage} alt={`${name} 프로필`} />
        ) : (
          <BusinessProfileFallback aria-label="기본 프로필 이미지">
            <UserRound size={112} strokeWidth={1.2} />
          </BusinessProfileFallback>
        )}
      </BusinessProfileWrap>

      {/* 사업자 이름을 디자인에 맞는 형식으로 표시합니다. */}
      <BusinessName>{displayName}</BusinessName>

      {/* 사업자가 소속된 회사와 부서입니다. */}
      <BusinessCompany>{company}</BusinessCompany>
      <BusinessDepartment>{department}</BusinessDepartment>

      {/* 사업자의 주요 전문 분야입니다. */}
      <BusinessSpecialty>{specialty}</BusinessSpecialty>

      {/* 현재 상담 가능 여부를 상태 배지로 표시합니다. */}
      <BusinessAvailability $available={isAvailable}>
        {isAvailable ? "상담 가능" : "상담 불가"}
        <CircleCheck size={15} strokeWidth={2} aria-hidden="true" />
      </BusinessAvailability>
    </BusinessCardContainer>
  );
}

export default BusinessCard;
