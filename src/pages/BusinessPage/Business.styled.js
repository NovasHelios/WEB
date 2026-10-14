// styled-components를 사용해 사업 연결 페이지 디자인을 정의합니다.
import styled from "styled-components";
import { listPageShell, listPageTitle, listPageDescription, ListPageDivider } from "@/styles/listPage";

// 사업 연결 페이지의 전체 배경입니다.
export const BusinessPageRoot = styled.div`
  min-height: var(--app-viewport-height);
  background: var(--color-list-page-bg);
  color: #1f1f1f;
`;

// 제목과 사업자 목록을 가운데 정렬하는 본문입니다.
export const BusinessMain = styled.main`
  ${listPageShell}
`;

// 페이지 제목과 설명을 묶는 상단 영역입니다.
export const BusinessHeader = styled.header`
  width: 100%;
`;

// 사업 연결 페이지의 대표 제목입니다.
export const BusinessTitle = styled.h1`
  ${listPageTitle}
`;

// 사업 연결 페이지의 목적을 설명하는 문장입니다.
export const BusinessDescription = styled.p`
  ${listPageDescription}
`;

// 페이지 소개와 사업자 목록을 구분하는 선입니다.
export const BusinessDivider = ListPageDivider;

// 사업자 카드를 반응형 열로 배치하는 목록입니다.
export const BusinessGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 21.875rem), 21.875rem));
  gap: 16px;
  justify-content: start;
  margin-top: 40px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

// 한 명의 사업자 정보를 표시하는 카드입니다.
export const BusinessCardContainer = styled.article`
  display: flex;
  width: min(100%, 350px);
  min-height: 510px;
  overflow-wrap: anywhere;
  min-width: 0;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  padding: 24px 24px 16px;
  border: 1px solid #efebe3;
  border-radius: 28px;
  background: #ffffff;
  text-align: center;
`;

// 원형 프로필 이미지가 들어가는 고정 크기 영역입니다.
export const BusinessProfileWrap = styled.div`
  width: min(100%, 250px);
  aspect-ratio: 1;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
  background: #6f706f;
`;

// API에서 받은 사업자 프로필 이미지입니다.
export const BusinessProfileImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 프로필 이미지가 없을 때 표시되는 기본 아이콘 영역입니다.
export const BusinessProfileFallback = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #f2f2f2;
`;

// 사업자 이름입니다.
export const BusinessName = styled.h2`
  margin: 16px 0 0;
  color: #111111;
  font-size: 28px;
  font-weight: var(--font-bold);
  line-height: 1.25;
`;

// 사업자가 소속된 회사명입니다.
export const BusinessCompany = styled.p`
  margin: 20px 0 0;
  color: #252525;
  font-size: 20px;
  line-height: 1.4;
`;

// 사업자가 소속된 부서명입니다.
export const BusinessDepartment = styled.p`
  margin: 0;
  color: #6a6a6a;
  font-size: 18px;
  line-height: 1.4;
`;

// 사업자가 자신 있는 전문 분야입니다.
export const BusinessSpecialty = styled.p`
  margin: 18px 0 0;
  color: #4a4a4a;
  font-size: 18px;
  font-weight: var(--font-bold);
  line-height: 1.45;
`;

// 긴 실제 정보가 있어도 카드 밖으로 밀리지 않는 상세 조회 버튼입니다.
export const BusinessDetailButton = styled.button`
  margin-top: 1rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid var(--color-brand-dark);
  border-radius: 0.5rem;
  background: transparent;
  color: var(--color-brand-dark);
  font: inherit;
  cursor: pointer;
  &:hover { background: #fff7df; }
  &:disabled { opacity: 0.6; cursor: wait; }
  &:focus-visible { outline: 2px solid var(--color-brand-dark); outline-offset: 3px; }
`;

// 사업자의 현재 상담 가능 상태입니다.
export const BusinessAvailability = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 16px;
  padding: 5px 7px;
  border-radius: 4px;
  background: ${({ $available }) => ($available ? "#ffe69a" : "#eeeeee")};
  color: ${({ $available }) => ($available ? "#413100" : "#777777")};
  font-size: 16px;
`;

// 목록 헤더 아래에서 사업자 상세 화면 전체를 감쌉니다.
export const BusinessDetailSection = styled.section`
  width: 100%;
  margin-top: 24px;
`;

// 목록 이동 버튼을 상세 콘텐츠 위에 배치합니다.
export const BusinessDetailToolbar = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
`;

// 상세 화면에서 목록으로 돌아가는 명령 버튼입니다.
export const BusinessBackButton = styled.button`
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border: 1px solid #d8d1c6;
  border-radius: 6px;
  background: #ffffff;
  color: #3f3a33;
  font: inherit;
  font-weight: var(--font-medium);
  cursor: pointer;

  &:hover { background: #f7f4ee; }
  &:focus-visible { outline: 2px solid var(--color-brand-dark); outline-offset: 2px; }
`;

// 요약 카드와 상세 정보 카드를 안정적인 두 열로 배치합니다.
export const BusinessDetailLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 350px) minmax(0, 1fr);
  align-items: start;
  gap: 48px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

// 회사·직책·활동 요약을 표시하는 왼쪽 카드입니다.
export const BusinessSummaryCard = styled.aside`
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  padding: 28px;
  border: 1px solid #e5ded3;
  border-radius: 8px;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 1px 2px rgba(60, 48, 30, 0.04);
`;

// 프로필 이미지 또는 기본 아이콘을 담는 원형 영역입니다.
export const BusinessSummaryAvatar = styled.div`
  width: min(190px, 70vw);
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid #e1d8ca;
  border-radius: 50%;
  background: #727372;
`;

// 담당자의 직책을 회사명 위에 보조 정보로 표시합니다.
export const BusinessSummaryRole = styled.p`
  margin: 24px 0 0;
  color: #777067;
  font-size: var(--font-sm);
`;

// 상세 화면의 회사명입니다.
export const BusinessSummaryTitle = styled.h2`
  max-width: 100%;
  margin: 6px 0 0;
  color: #171717;
  font-size: 1.5rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
`;

// 회사 내 소속 부서를 표시합니다.
export const BusinessSummaryDepartment = styled.p`
  margin: 6px 0 0;
  color: #68625b;
  font-size: var(--font-sm);
`;

// API에서 계산 가능한 세 가지 요약값을 구분선 형태로 표시합니다.
export const BusinessSummaryFacts = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 28px;
  padding: 18px 0;
  border-top: 1px solid #e9e2d8;
  border-bottom: 1px solid #e9e2d8;

  div { min-width: 0; padding: 0 8px; }
  div + div { border-left: 1px solid #e9e2d8; }
  span, strong { display: block; overflow-wrap: anywhere; }
  span { color: #898177; font-size: 0.75rem; }
  strong { margin-top: 6px; color: #b68400; font-size: var(--font-sm); }
`;

// 상세 소개 항목을 담는 오른쪽 정보 카드입니다.
export const BusinessInformationCard = styled.article`
  min-width: 0;
  padding: 30px 36px;
  border: 1px solid #e5ded3;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(60, 48, 30, 0.04);

  @media (max-width: 620px) { padding: 22px 18px; }
`;

// 각 상세 정보 묶음을 구분선과 일정한 여백으로 나눕니다.
export const BusinessInformationSection = styled.section`
  padding: 26px 0;
  border-bottom: 1px solid #ebe5dc;

  &:first-child { padding-top: 4px; }
  &:last-child { padding-bottom: 4px; border-bottom: 0; }
`;

// 각 정보 영역의 제목과 아이콘을 정렬합니다.
export const BusinessSectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  color: #202020;
  font-size: 1.125rem;
  line-height: 1.4;
`;

// 대표 분야의 핵심 설명을 다른 본문보다 강조합니다.
export const BusinessLeadText = styled.p`
  display: inline;
  margin: 16px 0 0;
  color: #2f2c28;
  font-size: var(--font-md);
  font-weight: var(--font-bold);
  line-height: 1.65;
  box-shadow: inset 0 -0.35em #ead88f;
  white-space: pre-wrap;
`;

// 전문 분야 태그가 카드 너비 안에서 자연스럽게 줄바꿈되도록 합니다.
export const BusinessFieldList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
`;

// 개별 전문 분야를 해시태그 형태로 표시합니다.
export const BusinessFieldChip = styled.li`
  padding: 7px 12px;
  border: 1px solid #e1ddd7;
  border-radius: 999px;
  background: #f5f5f4;
  color: #45413b;
  font-size: 0.8125rem;
`;

// 소개·활동 지역·상담 시간의 여러 줄 본문입니다.
export const BusinessSectionDescription = styled.p`
  margin: 14px 0 0;
  color: #4f4a43;
  font-size: var(--font-sm);
  line-height: 1.75;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

// 사업자 인증 결과를 아이콘과 함께 나열합니다.
export const BusinessVerificationList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;

  li { display: inline-flex; align-items: center; gap: 7px; color: #777168; font-size: var(--font-sm); }
  li[data-verified="true"] { color: #168c67; }
`;
