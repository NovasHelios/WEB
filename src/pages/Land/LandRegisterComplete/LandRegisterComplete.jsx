import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  List,
  PlusCircle,
} from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
import { useRequireLogin } from "../shared";
import {
  CompleteCardBody,
  CompleteCardButton,
  CompleteCardDivider,
  CompleteCardImage,
  CompleteCardImageBadge,
  CompleteCardImageCaption,
  CompleteCardImageFrame,
  CompleteCardImageInner,
  CompleteCardImageLabel,
  CompleteCardInfo,
  CompleteCardInfoItem,
  CompleteCardInfoLabel,
  CompleteCardInfoValue,
  CompleteCardSectionTitle,
  CompleteCardStatus,
  CompleteChoiceButton,
  CompleteChoiceRow,
  CompleteHero,
  CompleteHeroIcon,
  CompleteHeroSubTitle,
  CompleteHeroTitle,
  CompletePage,
  CompleteRecommendButton,
  CompleteRecommendCard,
  CompleteRecommendTitle,
  CompleteSection,
  CompleteSectionWrap,
  CompleteSummaryCard,
  CompleteSummaryHeader,
  CompleteSummaryWrap,
} from "./LandRegisterComplete.styled";
import {
  RegisterButtonRow as CompleteActionButtons,
  RegisterPrimaryButton as CompleteButton,
} from "../shared.styled";

const completionModes = {
  sale: {
    key: "sale",
    label: "매매",
    badge: "매매",
    price: "1,500,000,000 원",
    priceEmphasis: "1,500,000,000 원",
    summary: "등록된 토지는 관리 및 검토 후, 마켓에 노출됩니다.",
  },
  rent: {
    key: "rent",
    label: "임대",
    badge: "임대",
    price: "월 1,500,000원",
    priceEmphasis: "월 1,500,000원",
    summary: "등록된 토지는 관리 및 검토 후, 마켓에 노출됩니다.",
  },
  hope: {
    key: "hope",
    label: "사업 희망",
    badge: "사업 희망",
    price: "가격 미정",
    priceEmphasis: "가격 미정",
    summary: "등록된 토지는 관리 및 검토 후, 마켓에 노출됩니다.",
  },
};

function LandRegisterComplete() {
  const navigate = useNavigate();
  useRequireLogin();
  const [selected, setSelected] = useState("sale");

  const current = useMemo(() => completionModes[selected], [selected]);

  return (
    <CompletePage>
      {/* 공통 헤더 */}
      <NavBar
        keyword=""
        onChangeKeyword={() => {}}
        onSearch={() => {}}
        isSuggestionOpen={false}
        regionSuggestions={[]}
      />

      {/* 등록 완료 요약 */}
      <CompleteSectionWrap>
        <CompleteSection>
          <CompleteHero>
            <CompleteHeroIcon>
              <Check size={28} strokeWidth={3.4} />
            </CompleteHeroIcon>
            <CompleteHeroTitle>토지 등록이 완료되었습니다!</CompleteHeroTitle>
            <CompleteHeroSubTitle>{current.summary}</CompleteHeroSubTitle>
          </CompleteHero>

          <CompleteChoiceRow>
            {Object.values(completionModes).map((mode) => (
              <CompleteChoiceButton
                key={mode.key}
                type="button"
                $active={selected === mode.key}
                onClick={() => setSelected(mode.key)}
              >
                {mode.label}
              </CompleteChoiceButton>
            ))}
          </CompleteChoiceRow>

          <CompleteSummaryCard>
            <CompleteSummaryHeader>
              <CompleteCardSectionTitle>등록된 토지 정보</CompleteCardSectionTitle>
            </CompleteSummaryHeader>
            <CompleteCardDivider />

            <CompleteSummaryWrap>
              <CompleteCardImage>
                <CompleteCardImageFrame>
                  <CompleteCardImageBadge>{current.badge}</CompleteCardImageBadge>
                  <CompleteCardImageInner>
                    <CompleteCardImageLabel>토지 등록 화면 미리보기</CompleteCardImageLabel>
                    <CompleteCardImageCaption>등록 이후 확인 가능한 요약 이미지가 표시됩니다.</CompleteCardImageCaption>
                  </CompleteCardImageInner>
                </CompleteCardImageFrame>

                <CompleteCardButton type="button">
                  <Eye size={18} strokeWidth={2.2} />
                  상세 보기
                </CompleteCardButton>
              </CompleteCardImage>

              <CompleteCardBody>
                <CompleteCardInfo>
                  <CompleteCardInfoItem>
                    <CompleteCardInfoLabel>소재지</CompleteCardInfoLabel>
                    <CompleteCardInfoValue>경기도 안성시 일죽면 산북리 123</CompleteCardInfoValue>
                  </CompleteCardInfoItem>
                  <CompleteCardInfoItem>
                    <CompleteCardInfoLabel>면적</CompleteCardInfoLabel>
                    <CompleteCardInfoValue>6,689 ㎡ (2,023평)</CompleteCardInfoValue>
                  </CompleteCardInfoItem>
                  <CompleteCardInfoItem>
                    <CompleteCardInfoLabel>희망 가격</CompleteCardInfoLabel>
                    <CompleteCardInfoValue $emphasis>{current.priceEmphasis}</CompleteCardInfoValue>
                  </CompleteCardInfoItem>
                  <CompleteCardInfoItem>
                    <CompleteCardInfoLabel>등록 상태</CompleteCardInfoLabel>
                    <CompleteCardStatus>완료</CompleteCardStatus>
                  </CompleteCardInfoItem>
                </CompleteCardInfo>
              </CompleteCardBody>
            </CompleteSummaryWrap>
          </CompleteSummaryCard>

          <CompleteRecommendCard>
            <CompleteRecommendTitle>다음 단계 추천</CompleteRecommendTitle>
            <CompleteRecommendButton type="button" onClick={() => navigate("/land")}>
              <List size={18} strokeWidth={2.2} />
              내 토지 관리 이동
            </CompleteRecommendButton>
            <CompleteRecommendButton type="button" onClick={() => navigate("/land/register")}>
              <PlusCircle size={18} strokeWidth={2.2} />
              토지 등록하기
            </CompleteRecommendButton>
          </CompleteRecommendCard>

          <CompleteActionButtons>
            <CompleteButton type="button" $outline onClick={() => navigate("/")}>
              대시보드로 이동
            </CompleteButton>
            <CompleteButton type="button" onClick={() => navigate("/land")}>
              토지 목록 보기
              <ArrowRight size={18} strokeWidth={2.4} />
            </CompleteButton>
          </CompleteActionButtons>
        </CompleteSection>
      </CompleteSectionWrap>
    </CompletePage>
  );
}

export default LandRegisterComplete;
