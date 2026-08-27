import styled, { css } from "styled-components";

export const ConditionPage = styled.div`
  min-height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 270px;
  column-gap: 24px;
  align-items: start;
  background: #fff;
  color: #232323;
  padding-bottom: 84px;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

export const ConditionHeaderShell = styled.header`
  height: 72px;
  border-bottom: 2px solid #111;
  background: #fff;
  grid-column: 1 / -1;
`;

export const ConditionHeader = styled.div`
  width: min(100%, 1500px);
  height: 100%;
  margin: 0 auto;
  padding: 0 22px 0 24px;
  display: grid;
  grid-template-columns: auto 1.15fr 1fr auto;
  align-items: center;
  gap: 20px;
  box-sizing: border-box;

  @media (max-width: 1180px) {
    grid-template-columns: auto 1fr auto;
  }
`;

export const ConditionHeaderLogo = styled.div`
  display: flex;
  align-items: center;
`;

export const ConditionHeaderLogoMark = styled.span`
  font-size: 32px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.06em;
  color: #d3a01d;
`;

export const ConditionHeaderSearch = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 14px;
  border-radius: 2px;
  background: #f4f2f1;
  box-sizing: border-box;

  @media (max-width: 1180px) {
    display: none;
  }
`;

export const ConditionHeaderSearchIcon = styled.span`
  color: #d3a01d;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const ConditionHeaderSearchInput = styled.input`
  flex: 1;
  border: 0;
  background: transparent;
  outline: none;
  font-size: 16px;
  color: #5d5d5d;

  &::placeholder {
    color: #8d8d8d;
  }
`;

export const ConditionHeaderNav = styled.nav`
  @media (max-width: 1180px) {
    display: none;
  }
`;

export const ConditionHeaderNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 30px;
`;

export const ConditionHeaderNavItem = styled.li`
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

export const ConditionHeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-self: end;
  gap: 8px;
  padding-left: 16px;

  @media (max-width: 1180px) {
    padding-left: 0;
  }
`;

export const ConditionHeaderDivider = styled.div`
  width: 1px;
  height: 38px;
  margin-right: 8px;
  background: #d7b15b;
`;

export const ConditionHeaderActionButton = styled.button`
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

export const ConditionTopShell = styled.section`
  grid-column: 1;
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 42px 48px 22px;
  box-sizing: border-box;

  @media (max-width: 1180px) {
    padding: 28px 20px 18px;
  }
`;

export const ConditionSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 28px;
`;

export const ConditionSectionTitle = styled.h1`
  margin: 0;
  font-size: clamp(34px, 3vw, 48px);
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: #202020;
`;

export const ConditionSectionDescription = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: #6f6f6f;
`;

export const ConditionButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 88px;
  margin-bottom: 84px;

  @media (max-width: 900px) {
    gap: 18px;
    flex-wrap: wrap;
  }
`;

export const ConditionButton = styled.button`
  min-width: 120px;
  height: 40px;
  border: 1px solid #111;
  background: #fff;
  color: #222;
  font-size: 18px;
  font-weight: 500;
  padding: 0 18px;
  cursor: pointer;
  box-sizing: border-box;

  ${({ $active }) =>
    $active &&
    css`
      border-color: #d6a81b;
      color: #d6a81b;
      box-shadow: 0 0 0 1px rgba(214, 168, 27, 0.08) inset;
    `}
`;

export const ConditionCard = styled.section`
  border: 1px solid #e5d9c5;
  border-radius: 4px;
  padding: 22px 22px 20px;
  box-sizing: border-box;
  min-height: 180px;
  background: #fff;
`;

export const ConditionCardTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #2a2a2a;
`;

export const ConditionCardBottomLine = styled.div`
  margin: 18px 0 22px;
  height: 1px;
  background: #efe4d1;
`;

export const ConditionCardLabel = styled.p`
  margin: 0 0 14px;
  font-size: 14px;
  color: #8a8a8a;
`;

export const ConditionCardContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  border-bottom: 2px solid #282828;
  padding-bottom: 16px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ConditionField = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  color: #6b7280;
`;

export const ConditionFieldPrefix = styled.span`
  font-size: 18px;
  color: #566078;
  white-space: nowrap;
`;

export const ConditionFieldValue = styled.input`
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 18px;
  line-height: 1.4;
  color: #7a7a7a;
  padding: 0;
  min-width: 0;

  &::placeholder {
    color: #9a9a9a;
    opacity: 1;
  }

  &:disabled {
    color: #9b9b9b;
    cursor: not-allowed;
    -webkit-text-fill-color: #9b9b9b;
  }
`;

export const ConditionCardSuffix = styled.span`
  flex-shrink: 0;
  font-size: 14px;
  color: #5f5f5f;
  margin-bottom: 3px;
`;

export const ConditionTopNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 1.55;
  color: #6e5a25;
  margin-top: 10px;
`;

export const ConditionTopNoteIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #d6a81b;
  margin-top: 1px;
`;

export const ConditionFooterButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
  margin-top: 18px;
`;

export const ConditionPrimaryButton = styled.button`
  border: 0;
  height: 58px;
  min-width: 198px;
  padding: 0 20px;
  background: #d6a81b;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;

  ${({ $outline }) =>
    $outline &&
    css`
      background: #fff;
      color: #d6a81b;
      border: 1px solid #d6a81b;
      min-width: 178px;
    `}

  ${({ $ghost }) =>
    $ghost &&
    css`
      width: 212px;
      height: 42px;
      background: #fff;
      color: #d6a81b;
      border: 1px solid #d6a81b;
      font-size: 15px;
    `}
`;

export const ConditionRightColumn = styled.aside`
  width: 270px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  grid-column: 2;
  align-self: start;
  position: sticky;
  top: 20px;
  margin: 92px 48px 0 0;
  justify-self: end;

  @media (max-width: 1180px) {
    position: static;
    width: 100%;
    margin: 0;
    padding: 0 20px 24px;
    box-sizing: border-box;
    justify-self: stretch;
    grid-column: 1;
  }
`;

export const ConditionStepWrapper = styled.section`
  border: 1px solid #d7ad2d;
  border-radius: 8px;
  background: #fff;
  padding: 22px 20px 24px;
  box-sizing: border-box;
`;

export const ConditionSideCardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #222;
  letter-spacing: -0.03em;
`;

export const ConditionStepItem = styled.div`
  position: relative;
  padding-left: 18px;
  min-height: 72px;
  margin-top: 28px;
`;

export const ConditionStepLine = styled.div`
  position: absolute;
  left: 12px;
  top: 2px;
  bottom: -18px;
  width: 1px;
  background: #d6c9ab;
`;

export const ConditionStepCircle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: 1px solid ${({ $completed }) => ($completed ? "#d6a81b" : "#cbbfa5")};
  background: ${({ $completed }) => ($completed ? "#d6a81b" : "#fff")};
  color: ${({ $completed }) => ($completed ? "#fff" : "#b8aa90")};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ $completed }) => ($completed ? "0 2px 8px rgba(214, 168, 27, 0.35)" : "none")};
`;

export const ConditionStepTitle = styled.h4`
  margin: 0 0 8px;
  padding-left: 18px;
  font-size: 17px;
  line-height: 1.2;
  font-weight: 500;
  color: ${({ $completed }) => ($completed ? "#b98d00" : "#666")};
`;

export const ConditionStepDesc = styled.p`
  margin: 0;
  padding-left: 18px;
  font-size: 14px;
  line-height: 1.5;
  color: #868686;
`;

export const ConditionSideCard = styled.section`
  border-radius: 8px;
  padding: 24px 18px 22px;
  box-sizing: border-box;
  background: #e7e7e7;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ConditionGuideText = styled.p`
  margin: 0;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 14px;
  line-height: 1.6;
  color: #5f5f5f;

  svg {
    flex-shrink: 0;
    margin-top: 1px;
    color: #d6a81b;
  }
`;

export const ConditionGuideCard = styled.section`
  border-radius: 8px;
  padding: 24px 18px 22px;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
  align-items: center;
`;
