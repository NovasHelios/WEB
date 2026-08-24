// 상세보기 팝업에서 사용할 닫기 아이콘입니다.
import { X } from "lucide-react";

// 상세보기 팝업 스타일 컴포넌트를 가져옵니다.
import {
  SpecificBackdrop,
  SpecificPanel,
  SpecificHeader,
  SpecificTitle,
  SpecificTagRow,
  SpecificTag,
  SpecificCloseButton,
  SpecificBody,
  SpecificSection,
  SpecificSectionTitle,
  SpecificPlaceholderBox,
} from "./Specific.styled";

// 상세보기 팝업 컴포넌트입니다.
function Specific({ land, onClose }) {
  // 선택된 토지가 없으면 팝업을 보여주지 않습니다.
  if (!land) return null;

  // 상세보기 제목에 사용할 주소입니다.
  const address = land.address || land.ldCodeNm || "토지 주소";

  return (
    // 팝업 뒤 배경을 덮고 블러 처리하는 영역입니다.
    <SpecificBackdrop>
      {/* 실제 상세보기 팝업 박스입니다. */}
      <SpecificPanel>
        {/* 팝업 상단 제목 영역입니다. */}
        <SpecificHeader>

          {/* 닫기 버튼입니다. */}
          <SpecificCloseButton
            type="button"
            onClick={onClose}
            aria-label="상세보기 닫기"
          >
            <X size={24} strokeWidth={1.8} />
          </SpecificCloseButton>

          {/* 토지 주소 제목입니다. */}
          <SpecificTitle>{address}</SpecificTitle>

          {/* 토지 태그 영역입니다. */}
          <SpecificTagRow>
            <SpecificTag>전</SpecificTag>
            <SpecificTag>계획관리지역</SpecificTag>
            <SpecificTag>보전관리지역</SpecificTag>
          </SpecificTagRow>
        </SpecificHeader>

        {/* 팝업 본문 영역입니다. */}
        <SpecificBody>
          {/* 상단 핵심 상세 정보 영역입니다. */}
          <SpecificSection>
            <SpecificSectionTitle>상단 상세 정보 영역</SpecificSectionTitle>

            {/* 나중에 이미지, 거래 정보, 지도 요약을 배치할 자리입니다. */}
            <SpecificPlaceholderBox>
              이미지 / 거래 정보 / 위치 요약 영역
            </SpecificPlaceholderBox>
          </SpecificSection>

          {/* 서류 및 파일 영역입니다. */}
          <SpecificSection>
            <SpecificSectionTitle>서류 및 파일</SpecificSectionTitle>

            {/* 나중에 파일 카드 목록을 배치할 자리입니다. */}
            <SpecificPlaceholderBox>파일 카드 목록 영역</SpecificPlaceholderBox>
          </SpecificSection>

          {/* 기본 정보와 분석 영역입니다. */}
          <SpecificSection>
            <SpecificSectionTitle>
              기본 정보 / 태양광 적합도 분석
            </SpecificSectionTitle>

            {/* 나중에 기본 정보 카드와 분석 카드를 배치할 자리입니다. */}
            <SpecificPlaceholderBox>
              기본 정보 카드 / 분석 카드 영역
            </SpecificPlaceholderBox>
          </SpecificSection>

          {/* AI 의견 영역입니다. */}
          <SpecificSection>
            <SpecificSectionTitle>AI 의견</SpecificSectionTitle>

            {/* 나중에 더보기 기능이 들어갈 긴 텍스트 영역입니다. */}
            <SpecificPlaceholderBox>AI 의견 텍스트 영역</SpecificPlaceholderBox>
          </SpecificSection>
        </SpecificBody>
      </SpecificPanel>
    </SpecificBackdrop>
  );
}

// 다른 파일에서 사용할 수 있도록 내보냅니다.
export default Specific;
