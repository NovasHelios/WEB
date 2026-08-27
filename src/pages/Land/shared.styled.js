import styled, { css } from "styled-components";

export const RegisterHeaderShell = styled.header`
  height: 72px;
  border-bottom: 2px solid #111;
  background: #fff;
  width: 100%;
  grid-column: 1 / -1;
`;

export const RegisterHeader = styled.div`
  width: min(100%, 1500px);
  height: 100%;
  margin: 0 auto;
  padding: 0 22px 0 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-sizing: border-box;
`;

export const RegisterHeaderLogo = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

export const RegisterHeaderLogoMark = styled.span`
  font-size: 32px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.06em;
  color: #d3a01d;
`;

export const RegisterHeaderSearch = styled.div`
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

export const RegisterHeaderSearchIcon = styled.span`
  color: #d3a01d;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
`;

export const RegisterHeaderSearchInput = styled.input`
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

export const RegisterHeaderNav = styled.nav`
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;

  @media (max-width: 1180px) {
    display: none;
  }
`;

export const RegisterHeaderNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 30px;
  width: 100%;
`;

export const RegisterHeaderNavItem = styled.li`
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

export const RegisterHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  padding-left: 16px;
`;

export const RegisterHeaderDivider = styled.div`
  width: 1px;
  height: 38px;
  margin-right: 8px;
  background: #d7b15b;
`;

export const RegisterHeaderActionButton = styled.button`
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

export const RegisterSectionTitle = styled.h1`
  margin: 0;
  font-size: clamp(34px, 3vw, 48px);
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: #202020;
`;

export const RegisterSectionDescription = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: #6f6f6f;
`;

export const RegisterPrimaryButton = styled.button`
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

export const RegisterButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
  margin-top: 18px;
  flex-wrap: wrap;
`;
