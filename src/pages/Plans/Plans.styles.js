import styled from "styled-components";

// 요금제 화면의 전체 배경입니다.
export const PlanPage = styled.div`
  min-height: 100vh;
  background: var(--color-page-bg);
  color: var(--color-text);
`;

// 제목과 플랜 카드를 담는 반응형 본문입니다.
export const PlanShell = styled.main`
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 2.5rem var(--page-inline-padding-compact) 5rem;
  box-sizing: border-box;
`;

// 플랜 화면 제목 영역입니다.
export const PlanHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const PlanTitle = styled.h1`
  margin: 0;
  font-size: var(--font-page-title);
  font-weight: var(--font-regular);
  letter-spacing: -0.05em;
`;

export const PlanSubtitle = styled.p`
  margin: 12px 0 0;
  color: var(--color-text-muted);
  font-size: var(--font-page-description);
  line-height: 1.6;
`;

// 월간·연간 결제 선택 영역입니다.
export const PlanBillingSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 26px;
  color: var(--color-text-muted);
  font-size: var(--font-sm);

  strong {
    color: var(--color-brand-dark);
    font-weight: var(--font-medium);
  }
`;

export const PlanBillingToggle = styled.button`
  position: relative;
  width: 48px;
  height: 24px;
  padding: 3px;
  border: 0;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#9a7400" : "#c8c8c8")};
  cursor: pointer;

  span {
    display: block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    transform: translateX(${({ $active }) => ($active ? "24px" : "0")});
    transition: transform 160ms ease;
  }
`;

export const PlanBillingBadge = styled.span`
  padding: 4px 9px;
  border-radius: 999px;
  background: #f5e9c5;
  color: var(--color-brand-dark);
  font-size: var(--font-xs);
`;

// 퍼스널과 비즈니스 두 플랜 카드를 화면 중앙에 균형 있게 배치합니다.
export const PlanGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  width: 100%;
  max-width: 1200px;
  gap: clamp(24px, 6vw, 80px);
  margin: 66px auto 0;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 520px;
  }
`;

export const PlanCard = styled.article`
  min-height: 540px;
  padding: 28px 24px;
  border: 1px solid ${({ $featured }) => ($featured ? "#d49f00" : "#d7c9af")};
  border-radius: 8px;
  background: #fff;
  box-shadow: ${({ $featured }) => ($featured ? "0 12px 24px rgba(116, 86, 24, 0.12)" : "none")};
  box-sizing: border-box;
`;

export const PlanCardHeader = styled.div`
  min-height: 86px;
`;

export const PlanCardTitle = styled.h2`
  margin: 0;
  font-size: var(--font-lg);
  font-weight: var(--font-medium);
`;

export const PlanCardDescription = styled.p`
  max-width: 180px;
  margin: 8px 0 0;
  color: var(--color-text-muted);
  font-size: var(--font-sm);
  line-height: 1.45;
`;

export const PlanCardPrice = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 26px;

  strong {
    font-size: clamp(34px, 3vw, 42px);
    font-weight: var(--font-regular);
    letter-spacing: -0.04em;
  }

  span {
    color: var(--color-text-muted);
    font-size: var(--font-sm);
  }
`;

export const PlanCardButton = styled.button`
  width: 100%;
  height: 44px;
  margin-top: 76px;
  border: 1px solid #9a7400;
  border-radius: 4px;
  background: ${({ $current }) => ($current ? "#fff" : "#876600")};
  color: ${({ $current }) => ($current ? "#9a7400" : "#fff")};
  font-size: var(--font-sm);
  cursor: pointer;
  &:disabled { cursor: default; opacity: 0.65; }
`;

// 플랜 변경 확인은 가격 카드와 구분해 짧은 확인 영역으로 표시합니다.
export const PlanConfirmation = styled.section`
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid var(--color-brand);
  border-radius: 0.5rem;
  background: var(--color-surface);
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  p { width: 100%; margin: 0; }
  button { width: auto; margin-top: 0; padding-inline: 1.25rem; }
`;

export const PlanCardFeatures = styled.ul`
  display: grid;
  gap: 14px;
  margin: 26px 0 0;
  padding: 0;
  color: var(--color-text-muted);
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: var(--font-sm);
  }

  svg {
    flex: 0 0 auto;
    color: var(--color-brand-dark);
  }
`;
