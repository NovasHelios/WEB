import styled, { css } from "styled-components";

export const CompletePage = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #fff;
  color: #232323;
  overflow-x: hidden;
`;

export const CompleteHeaderShell = styled.header`
  height: 72px;
  border-bottom: 2px solid #111;
  background: #fff;
`;

export const CompleteHeader = styled.div`
  width: min(100%, 1500px);
  height: 100%;
  margin: 0 auto;
  padding: 0 22px 0 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-sizing: border-box;
`;

export const CompleteHeaderLogo = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

export const CompleteHeaderLogoMark = styled.span`
  font-size: 32px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.06em;
  color: #d3a01d;
`;

export const CompleteHeaderSearch = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 14px;
  border-radius: 2px;
  background: #f4f2f1;
  box-sizing: border-box;
  flex: 1 1 520px;
  min-width: 0;
`;

export const CompleteHeaderSearchIcon = styled.span`
  color: #d3a01d;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
`;

export const CompleteHeaderSearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  outline: none;
  font-size: 16px;
  color: #5d5d5d;

  &::placeholder {
    color: #8d8d8d;
  }
`;

export const CompleteHeaderNav = styled.nav`
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;
`;

export const CompleteHeaderNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 30px;
  width: 100%;
`;

export const CompleteHeaderNavItem = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #5c5c5c;
  font-weight: 500;
  white-space: nowrap;

  svg {
    color: #5b5b5b;
    flex-shrink: 0;
  }
`;

export const CompleteHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  padding-left: 16px;
`;

export const CompleteHeaderDivider = styled.div`
  width: 1px;
  height: 38px;
  margin-right: 8px;
  background: #d7b15b;
`;

export const CompleteHeaderActionButton = styled.button`
  position: relative;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(17, 17, 17, 0.12);
  border-radius: 999px;
  background: #fff;
  color: #5b5b5b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: default;

  span {
    position: absolute;
    top: 7px;
    right: 7px;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: #c92a2a;
  }
`;

export const CompleteSectionWrap = styled.main`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const CompleteSection = styled.section`
  width: min(100%, 1060px);
  padding: 20px 24px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CompleteHero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  margin-bottom: 16px;
  text-align: center;
`;

export const CompleteHeroIcon = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 16px;
  background: #f7efd2;
  color: #8b6a00;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CompleteHeroTitle = styled.h1`
  margin: 0;
  font-size: clamp(28px, 2.8vw, 40px);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.04em;
  color: #202020;
`;

export const CompleteHeroSubTitle = styled.p`
  margin: 0;
  font-size: 18px;
  line-height: 1.4;
  color: #6a5e4a;
`;

export const CompleteChoiceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 78px;
  margin: 16px 0 42px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const CompleteChoiceButton = styled.button`
  min-width: 116px;
  height: 40px;
  border: 1px solid #232323;
  background: #fff;
  color: #222;
  font-size: 18px;
  font-weight: 500;
  padding: 0 18px;
  cursor: default;
  box-sizing: border-box;
  pointer-events: none;

  ${({ $active }) =>
    $active &&
    css`
      border-color: #d6a81b;
      color: #d6a81b;
    `}

  &:disabled {
    opacity: 1;
  }
`;

export const CompleteSummaryCard = styled.section`
  width: 100%;
  border: 1px solid #e6d8ac;
  border-radius: 8px;
  padding: 28px 30px 18px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const CompleteSummaryHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const CompleteCardSectionTitle = styled.h2`
  margin: 0;
  font-size: 28px;
  font-weight: 500;
  color: #222;
  letter-spacing: -0.03em;
`;

export const CompleteCardDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #ece2cd;
`;

export const CompleteSummaryWrap = styled.div`
  display: flex;
  align-items: stretch;
  gap: 28px;
  flex-wrap: wrap;
`;

export const CompleteCardImage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 0 0 296px;
`;

export const CompleteCardImageFrame = styled.div`
  border: 1px solid #e0d9c3;
  border-radius: 4px;
  background: linear-gradient(180deg, #f7f7f7 0%, #ededed 100%);
  min-height: 328px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 12px;
  box-sizing: border-box;
  position: relative;
`;

export const CompleteCardImageBadge = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #d6a81b;
  color: #a57b00;
  background: #fff8de;
  font-size: 13px;
  line-height: 1;
`;

export const CompleteCardImageInner = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 2px;
  border: 1px solid rgba(20, 20, 20, 0.05);
  background:
    radial-gradient(circle at 30% 55%, rgba(18, 84, 34, 0.24), transparent 18%),
    radial-gradient(circle at 60% 50%, rgba(47, 122, 52, 0.18), transparent 15%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.05)),
    linear-gradient(135deg, #d9e6bb 0%, #c6d6a3 38%, #c8d7b0 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 18px;
  box-sizing: border-box;
`;

export const CompleteCardImageLabel = styled.p`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #30411f;
`;

export const CompleteCardImageCaption = styled.p`
  margin: 0;
  font-size: 12px;
  color: #3f4e34;
`;

export const CompleteCardButton = styled.button`
  height: 40px;
  border: 1px solid #d6a81b;
  background: #fff;
  color: #a07a06;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
`;

export const CompleteCardBody = styled.div`
  flex: 1;
  display: flex;
  align-items: stretch;
  min-width: 0;
`;

export const CompleteCardInfo = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 44px 112px;
  padding: 8px 0 0;
  box-sizing: border-box;
`;

export const CompleteCardInfoItem = styled.div`
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CompleteCardInfoLabel = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6f6f6f;
`;

export const CompleteCardInfoValue = styled.p`
  margin: 0;
  font-size: 20px;
  line-height: 1.4;
  color: ${({ $emphasis }) => ($emphasis ? "#8b6a00" : "#2f2f2f")};
  font-weight: ${({ $emphasis }) => ($emphasis ? 700 : 500)};
`;

export const CompleteCardStatus = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 30px;
  border: 1px solid #83d94d;
  border-radius: 999px;
  color: #61b71b;
  font-size: 14px;
  background: #f6fff1;
`;

export const CompleteRecommendCard = styled.section`
  width: 100%;
  border: 1px solid #e6d8ac;
  border-radius: 8px;
  padding: 22px 24px 24px;
  margin-top: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CompleteRecommendTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 500;
  color: #222;
`;

export const CompleteRecommendButton = styled.button`
  width: 100%;
  min-height: 36px;
  border: 1px solid #d6a81b;
  background: #fff;
  color: #7f6000;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
`;

export const CompleteActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

export const CompleteButton = styled.button`
  min-width: 150px;
  height: 36px;
  border: 0;
  padding: 0 16px;
  background: #d6a81b;
  color: #fff;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;

  ${({ $outline }) =>
    $outline &&
    css`
      background: #fff;
      border: 1px solid #d6a81b;
      color: #9a7400;
    `}
`;
