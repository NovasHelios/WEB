import styled, { css } from "styled-components";

export const ConfirmPage = styled.div`
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

export const ConfirmNavBarWrap = styled.div`
  /* 공통 Navbar가 등록 페이지 그리드 전체 폭을 차지하게 합니다. */
  grid-column: 1 / -1;
  min-width: 0;
`;

export const ConfirmHeaderShell = styled.header`
  height: 72px;
  border-bottom: 2px solid #111;
  background: #fff;
  grid-column: 1 / -1;
`;

export const ConfirmHeader = styled.div`
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

export const ConfirmHeaderLogo = styled.div`
  display: flex;
  align-items: center;
`;

export const ConfirmHeaderLogoMark = styled.span`
  font-size: 32px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.06em;
  color: #d3a01d;
`;

export const ConfirmHeaderSearch = styled.div`
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

export const ConfirmHeaderSearchIcon = styled.span`
  color: #d3a01d;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const ConfirmHeaderSearchInput = styled.input`
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

export const ConfirmHeaderNav = styled.nav`
  @media (max-width: 1180px) {
    display: none;
  }
`;

export const ConfirmHeaderNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 30px;
`;

export const ConfirmHeaderNavItem = styled.li`
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

export const ConfirmHeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-self: end;
  gap: 8px;
  padding-left: 16px;

  @media (max-width: 1180px) {
    padding-left: 0;
  }
`;

export const ConfirmHeaderDivider = styled.div`
  width: 1px;
  height: 38px;
  margin-right: 8px;
  background: #d7b15b;
`;

export const ConfirmHeaderActionButton = styled.button`
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

export const ConfirmTopShell = styled.section`
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

export const ConfirmSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 30px;
`;

export const ConfirmInfoSection = styled.section`
  margin: 0 0 22px;
`;

export const ConfirmInfoTitle = styled.h2`
  display: inline-block;
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #eadfbd;
  color: #202020;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.04em;
`;

export const ConfirmSectionTitle = styled.h1`
  margin: 0;
  font-size: clamp(34px, 3vw, 48px);
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: #202020;
`;

export const ConfirmSectionDescription = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: #6f6f6f;
`;

export const ConfirmTopRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 22px;
  margin-bottom: 38px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const ConfirmTopRowCard = styled.section`
  min-height: 313px;
  border: 1px solid #d6a81b;
  border-radius: 8px;
  padding: 26px 30px 28px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fff;
`;

export const ConfirmTopRowCardTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #666;
  letter-spacing: -0.03em;
`;

export const ConfirmAddressBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: space-between;
`;

export const ConfirmAddressLabel = styled.p`
  margin: 0;
  font-size: 14px;
  color: #8d8d8d;
`;

export const ConfirmAddressText = styled.p`
  margin: 0;
  font-size: 22px;
  line-height: 1.4;
  font-weight: 500;
  color: #2c2c2c;
`;

export const ConfirmTopRowCaption = styled.p`
  margin: 0;
  font-size: 18px;
  line-height: 1.5;
  color: #565656;
`;

export const ConfirmAddressChangeButton = styled.button`
  width: 116px;
  height: 44px;
  border: 1px solid #d6a81b;
  background: #fff;
  color: #d6a81b;
  font-size: 15px;
  font-weight: 500;
  cursor: default;
`;

export const ConfirmTopPreviewHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ConfirmTopPreview = styled.div`
  position: relative;
  flex: 1;
  min-height: 240px;
  border-radius: 8px;
  background: linear-gradient(180deg, #f4f4f4 0%, #efefef 100%);
  border: 1px solid rgba(17, 17, 17, 0.04);
  overflow: hidden;
`;

export const ConfirmTopPreviewZoomGroup = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  flex-direction: column;
  z-index: 2;
`;

export const ConfirmTopPreviewZoom = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid #c5c5c5;
  background: #fff;
  color: #747474;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

export const ConfirmTopPreviewBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 38px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.2));
  backdrop-filter: blur(2px);
  z-index: 1;
`;

export const ConfirmTopPreviewContent = styled.div`
  position: absolute;
  inset: 38px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $locked }) =>
    $locked &&
    css`
      background: radial-gradient(circle at 68% 36%, rgba(255, 255, 255, 0.4), transparent 28%),
        radial-gradient(circle at 78% 48%, rgba(255, 255, 255, 0.28), transparent 26%);
      flex-direction: column;
      gap: 18px;
    `}
`;

export const ConfirmTopPreviewImage = styled.div`
  width: 68%;
  height: 62%;
  border-radius: 4px;
  border: 4px solid #fff;
  box-shadow: 0 18px 36px rgba(17, 17, 17, 0.18);
  background:
    linear-gradient(180deg, rgba(217, 215, 205, 0.8), rgba(170, 174, 163, 0.72)),
    linear-gradient(135deg, rgba(120, 94, 52, 0.55), rgba(204, 175, 120, 0.2));
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.14) 0 3%, transparent 3% 12%, rgba(255, 255, 255, 0.08) 12% 13%, transparent 13% 100%),
      linear-gradient(180deg, transparent 0 52%, rgba(255, 255, 255, 0.1) 52% 54%, transparent 54% 100%),
      radial-gradient(circle at 54% 40%, rgba(255, 210, 94, 0.85), transparent 0 8%),
      radial-gradient(circle at 54% 42%, rgba(0, 105, 255, 0.46), transparent 0 16%);
    mix-blend-mode: screen;
    opacity: 0.35;
  }
`;

export const ConfirmTopPreviewPin = styled.div`
  position: absolute;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 46px;
  border-radius: 999px 999px 999px 8px;
  background: #d6a81b;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 24px rgba(214, 168, 27, 0.34);

  svg {
    transform: translateY(2px);
  }

  ${({ $locked }) =>
    $locked &&
    css`
      position: static;
      width: 86px;
      height: 86px;
      border-radius: 16px;
      transform: none;
      margin-top: 16px;
      box-shadow: none;
      svg {
        transform: none;
      }
    `}
`;

export const ConfirmTopNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 1.55;
  color: #6e5a25;
  margin-bottom: 26px;
`;

export const ConfirmTopNoteIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #d6a81b;
  margin-top: 1px;
`;

export const ConfirmCardGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 22px;
  margin-bottom: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const ConfirmCard = styled.section`
  min-height: 244px;
  border: 1px solid #d6a81b;
  border-radius: 8px;
  padding: 22px 24px;
  box-sizing: border-box;
  background: #fff;
`;

export const ConfirmTable = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ConfirmTableRow = styled.div`
  min-height: 62px;
  display: grid;
  grid-template-columns: 98px minmax(0, 1fr);
  align-items: center;
  border-bottom: 1px solid #ece0c3;
  gap: 16px;

  &:last-child {
    border-bottom: 0;
  }
`;

export const ConfirmTableCell = styled.div`
  font-size: 13px;
  color: #707070;
`;

export const ConfirmTableValue = styled.div`
  font-size: 18px;
  line-height: 1.45;
  color: #2d2d2d;
  text-align: right;
  min-width: 0;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const ConfirmPrimaryButton = styled.button`
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
  cursor: default;

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

export const ConfirmRightColumn = styled.aside`
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

export const ConfirmStepWrapper = styled.section`
  border: 1px solid #d7ad2d;
  border-radius: 8px;
  background: #fff;
  padding: 22px 20px 24px;
  box-sizing: border-box;
`;

export const ConfirmSideCardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #222;
  letter-spacing: -0.03em;
`;

export const ConfirmStepItem = styled.div`
  position: relative;
  padding-left: 18px;
  min-height: 72px;
  margin-top: 28px;
`;

export const ConfirmStepLine = styled.div`
  position: absolute;
  left: 12px;
  top: 2px;
  bottom: -18px;
  width: 1px;
  background: #d6c9ab;
`;

export const ConfirmStepCircle = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? "#d6a81b" : "#cbbfa5")};
  background: ${({ $active }) => ($active ? "#d6a81b" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#b8aa90")};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ $active }) => ($active ? "0 2px 8px rgba(214,168,27,0.35)" : "none")};
`;

export const ConfirmStepTitle = styled.h4`
  margin: 0 0 8px;
  padding-left: 18px;
  font-size: 17px;
  line-height: 1.2;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? "#b98d00" : "#666")};
`;

export const ConfirmStepDesc = styled.p`
  margin: 0;
  padding-left: 18px;
  font-size: 14px;
  line-height: 1.5;
  color: #868686;
`;

export const ConfirmSideCard = styled.section`
  border-radius: 8px;
  padding: 24px 18px 22px;
  box-sizing: border-box;
  background: #e7e7e7;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ConfirmGuideText = styled.p`
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

export const ConfirmGuideCard = styled.section`
  border-radius: 8px;
  padding: 24px 18px 22px;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
  align-items: center;
`;

export const ConfirmFooterWrap = styled.div`
  grid-column: 1 / -1;
  z-index: 40;
  background: #0a0a0a;
  box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.04);
`;

export const ConfirmFooter = styled.div`
  width: min(100%, 1500px);
  margin: 0 auto;
  padding: 0 48px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  box-sizing: border-box;

  @media (max-width: 1180px) {
    padding: 0 20px;
  }
`;

export const ConfirmFooterNote = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #d7b15b;
  font-size: 12px;
  line-height: 1.5;
  max-width: 640px;
`;

export const ConfirmFooterNoteIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ConfirmFooterButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  width: 100%;
  justify-content: flex-end;
  margin-top: 4px;
`;
