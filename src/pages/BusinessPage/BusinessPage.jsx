// 네비게이션 검색어를 관리하기 위한 React 훅입니다.
import { useState } from "react";

// 모든 주요 화면에서 공통으로 사용하는 상단 네비게이션입니다.
import NavBar from "@/components/layout/box/NavBar";

// 개별 사업자 정보를 표시하는 카드 컴포넌트입니다.
import BusinessCard from "./component/BusinessCard";

// 사업 연결 페이지 레이아웃에 필요한 styled 컴포넌트입니다.
import {
  BusinessDescription,
  BusinessDivider,
  BusinessGrid,
  BusinessHeader,
  BusinessMain,
  BusinessPageRoot,
  BusinessTitle,
} from "./Business.styled";

// 사업자 조회 API가 준비되기 전 화면 테스트에 사용할 가상 사업자 데이터입니다.
const MOCK_BUSINESSES = [
  {
    id: 1,
    name: "김도윤",
    company: "솔라브릿지 주식회사",
    department: "사업개발본부",
    specialty: "태양광 인허가 및 사업성 분석",
    isAvailable: true,
    profileImage: null,
  },
];

// 검증된 태양광 사업자를 탐색하는 사업 연결 페이지입니다.
function BusinessPage() {
  // 공통 네비게이션 검색창에 표시할 문자열입니다.
  const [keyword, setKeyword] = useState("");

  return (
    // 페이지 전체 배경과 최소 높이를 담당합니다.
    <BusinessPageRoot>
      {/* 검색 오류 없이 기존 상단 네비게이션을 표시합니다. */}
      <NavBar
        keyword={keyword}
        onChangeKeyword={setKeyword}
        onSearch={() => {}}
        isSuggestionOpen={false}
        regionSuggestions={[]}
        onCloseSuggestions={() => {}}
        onSuggestionClick={() => {}}
        normalizeSido={(value) => value}
      />

      {/* 페이지 소개와 사업자 목록을 담는 본문입니다. */}
      <BusinessMain>
        {/* 사업 연결 페이지의 제목과 설명 영역입니다. */}
        <BusinessHeader>
          <BusinessTitle>사업 연결</BusinessTitle>

          <BusinessDescription>
            태양광 프로젝트를 위한 신뢰할 수 있는 비즈니스 파트너를 찾아보세요.
            검증된 전문가를
            <br />
            확인하고 조건을 비교하여 성공적인 사업을 시작하세요.
          </BusinessDescription>

          <BusinessDivider />
        </BusinessHeader>

        {/* API 도입 전에는 가상 사업자 한 명만 카드로 표시합니다. */}
        <BusinessGrid>
          {MOCK_BUSINESSES.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </BusinessGrid>
      </BusinessMain>
    </BusinessPageRoot>
  );
}

export default BusinessPage;
