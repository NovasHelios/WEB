import styled, { css } from "styled-components";

export const LandRegisterPage = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #fff;
  color: #1f1f1f;
`;

export const LandRegisterTopShell = styled.header`
  height: 72px;
  border-bottom: 1px solid rgba(17, 17, 17, 0.04);
  background: #fff;
`;

export const LandRegisterHeaderWrap = styled.div`
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

export const LandRegisterTopLogo = styled.div`
  display: flex;
  align-items: center;
`;

export const LandRegisterTopLogoMark = styled.span`
  font-size: 32px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.06em;
  color: #d3a01d;
`;

export const LandRegisterHeaderSearch = styled.div`
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

export const LandRegisterHeaderSearchIcon = styled.span`
  color: #d3a01d;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const LandRegisterHeaderSearchInput = styled.input`
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

export const LandRegisterHeaderNav = styled.nav`
  @media (max-width: 1180px) {
    display: none;
  }
`;

export const LandRegisterTopNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 30px;
`;

export const LandRegisterTopNavItem = styled.li`
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

export const LandRegisterTopTools = styled.div`
  display: inline-flex;
  align-items: center;
  justify-self: end;
  gap: 8px;
  padding-left: 16px;

  @media (max-width: 1180px) {
    padding-left: 0;
  }
`;

export const LandRegisterTopToolsDivider = styled.div`
  width: 1px;
  height: 38px;
  margin-right: 8px;
  background: #d7b15b;
`;

export const LandRegisterIconButton = styled.button`
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

export const LandRegisterContainer = styled.div`
  width: min(100%, 1500px);
  margin: 0 auto;
  padding: 40px 48px 40px 48px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 270px;
  gap: 24px;
  box-sizing: border-box;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
    padding: 28px 20px 32px;
  }
`;

export const LandRegisterMain = styled.main`
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
`;

export const LandRegisterSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 12px;
`;

export const LandRegisterSectionTitle = styled.h1`
  margin: 0;
  font-size: clamp(34px, 3vw, 49px);
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: #202020;
`;

export const LandRegisterSectionDescription = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: #6f6f6f;
`;

export const LandRegisterCard = styled.section`
  background: #e7e7e7;
  border-radius: 8px;
  padding: 30px 26px 32px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const LandRegisterCardTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #232323;
`;

export const LandRegisterCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const LandRegisterCardLabel = styled.p`
  margin: 0;
  font-size: 17px;
  line-height: 1.6;
  color: #6f7685;
  letter-spacing: -0.03em;
`;

export const LandRegisterPanelHeading = styled.h3`
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #2a2a2a;
`;

export const LandRegisterPanelSubtext = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #8d7852;
`;

export const LandRegisterAddressFieldWrap = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 98px;
  align-items: end;
  gap: 14px;
`;

export const LandRegisterAddressField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const LandRegisterAddressInput = styled.input`
  width: 100%;
  min-height: 44px;
  border: 0;
  border-bottom: 2px solid #5a5a5a;
  background: transparent;
  padding: 0 0 12px;
  box-sizing: border-box;
  font-size: 18px;
  line-height: 1.45;
  font-weight: 500;
  color: #2c2c2c;
  outline: none;

  &::placeholder {
    color: #6f7685;
  }

  &:focus {
    border-bottom-color: #d6a81b;
  }
`;

export const LandRegisterAddressHelper = styled.p`
  margin: -4px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: #8d7852;
`;

export const LandRegisterStepBadge = styled.span`
  display: inline-flex;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(214, 168, 27, 0.12);
  color: #b98d00;
  font-size: 12px;
  font-weight: 800;
`;

export const LandRegisterPrimaryButton = styled.button`
  border: 0;
  height: 48px;
  border-radius: 0;
  background: #d6a81b;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 18px;
  cursor: pointer;

  &:disabled {
    background: #d8d0bb;
    color: #fff9ef;
    cursor: not-allowed;
    opacity: 0.85;
  }

  ${({ $ghost }) =>
    $ghost &&
    css`
      height: 42px;
      width: 100%;
      background: transparent;
      color: #d6a81b;
      border: 1px solid #d6a81b;
    `}
`;

export const LandRegisterVisualCanvas = styled.div`
  margin-top: 2px;
  min-height: 258px;
  border-radius: 8px;
  background: #f2f2f2;
  border: 1px solid rgba(17, 17, 17, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

export const LandRegisterVisualMapIcon = styled.div`
  color: #d6c391;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const LandRegisterVisualEmpty = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

export const LandRegisterButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
`;

export const LandRegisterBottomButton = styled.button`
  width: 178px;
  height: 60px;
  border: 0;
  background: #d6a81b;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;

  &:disabled {
    background: #d8d0bb;
    color: #fff9ef;
    cursor: not-allowed;
    opacity: 0.85;
  }
`;

export const LandRegisterButtonIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const LandRegisterRightColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const LandRegisterPanel = styled.section`
  border: 1px solid #d7ad2d;
  border-radius: 8px;
  background: #fff;
  padding: 22px 20px 24px;
  min-height: 408px;
  box-sizing: border-box;
`;

export const LandRegisterSteps = styled.div`
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const LandRegisterStepItem = styled.div`
  position: relative;
  padding-left: 16px;
  min-height: 70px;
`;

export const LandRegisterStepLine = styled.div`
  position: absolute;
  left: 12px;
  top: 2px;
  bottom: -18px;
  width: 1px;
  background: #d6c9ab;
`;

export const LandRegisterStepCircle = styled.div`
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

export const LandRegisterStepCount = styled.span`
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
`;

export const LandRegisterStepTitle = styled.h4`
  margin: 0 0 8px;
  padding-left: 18px;
  font-size: 17px;
  line-height: 1.2;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? "#b98d00" : "#666")};
`;

export const LandRegisterStepText = styled.p`
  margin: 0;
  padding-left: 18px;
  font-size: 14px;
  line-height: 1.5;
  color: #868686;
`;

export const LandRegisterSidebarCard = styled.section`
  border-radius: 8px;
  padding: 24px 18px 22px;
  box-sizing: border-box;
  background: ${({ $tone }) => ($tone === "warning" ? "#e7e7e7" : "#f7f7f7")};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const LandRegisterSidebarText = styled.p`
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

export const LandRegisterHelpCard = styled.section`
  border-radius: 8px;
  padding: 24px 18px 22px;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
`;

export const LandRegisterHelpText = styled.p`
  margin: 0;
  font-size: 15px;
  color: #666;
  text-align: center;
`;
