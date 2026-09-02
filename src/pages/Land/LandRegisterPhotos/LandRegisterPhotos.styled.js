import styled, { css } from "styled-components";

export const PhotosPage = styled.div`
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

export const PhotosHeaderShell = styled.header`
  height: 72px;
  border-bottom: 2px solid #111;
  background: #fff;
  grid-column: 1 / -1;
`;

export const PhotosHeader = styled.div`
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

export const PhotosHeaderLogo = styled.div`
  display: flex;
  align-items: center;
`;

export const PhotosHeaderLogoMark = styled.span`
  font-size: 32px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.06em;
  color: #d3a01d;
`;

export const PhotosHeaderSearch = styled.div`
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

export const PhotosHeaderSearchIcon = styled.span`
  color: #d3a01d;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const PhotosHeaderSearchInput = styled.input`
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

export const PhotosHeaderNav = styled.nav`
  @media (max-width: 1180px) {
    display: none;
  }
`;

export const PhotosHeaderNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 30px;
`;

export const PhotosHeaderNavItem = styled.li`
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

export const PhotosHeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-self: end;
  gap: 8px;
  padding-left: 16px;

  @media (max-width: 1180px) {
    padding-left: 0;
  }
`;

export const PhotosHeaderDivider = styled.div`
  width: 1px;
  height: 38px;
  margin-right: 8px;
  background: #d7b15b;
`;

export const PhotosHeaderActionButton = styled.button`
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

export const PhotosTopShell = styled.section`
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

export const PhotosSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 30px;
`;

export const PhotosSectionTitle = styled.h1`
  margin: 0;
  font-size: clamp(34px, 3vw, 48px);
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.05em;
  color: #202020;
`;

export const PhotosSectionDescription = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: #6f6f6f;
`;

export const PhotosCard = styled.section`
  border: 1px solid #e8dfd0;
  border-radius: 8px;
  background: #fff;
  padding: 18px 26px 22px;
  box-sizing: border-box;
  margin-bottom: 22px;
`;

export const PhotosCardTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #202020;
`;

export const PhotosCardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
`;

export const PhotosCardSubtext = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #6f6f6f;
`;

export const PhotosCardLabel = styled.p`
  margin: 0 0 14px;
  font-size: 14px;
  color: #7d7d7d;
`;

export const PhotosCardRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const PhotosUploadCaption = styled.p`
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: #6b5b3a;
  white-space: nowrap;
`;

export const PhotosThumbGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  flex: 1;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const PhotosThumb = styled.div`
  position: relative;
  min-height: 70px;
  border-radius: 4px;
  border: 1px solid #e0d1b2;
  background: linear-gradient(180deg, #eef4e6 0%, #d8e1c4 100%);
  overflow: hidden;
  box-sizing: border-box;
`;

export const PhotosThumbBadge = styled.span`
  position: absolute;
  left: 10px;
  bottom: 8px;
  z-index: 1;
  padding: 4px 8px;
  border-radius: 2px;
  background: rgba(255, 248, 225, 0.9);
  color: #574c2d;
  font-size: 11px;
  line-height: 1;
`;

export const PhotosThumbPlaceholder = styled.div`
  height: 100%;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  color: #5f5f5f;
  text-align: center;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.08));
`;

export const PhotosThumbText = styled.span`
  font-size: 12px;
  line-height: 1.2;
  color: #4b4b4b;
`;

export const PhotosDropbox = styled.button`
  width: 128px;
  min-height: 70px;
  border-radius: 4px;
  border: 2px dashed #d8c39d;
  background: #fff;
  color: #5a5a5a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  padding: 0;
  cursor: default;
  box-sizing: border-box;
`;

export const PhotosDropboxIcon = styled.span`
  display: inline-flex;
  color: #6c5d39;
`;

export const PhotosDropboxHint = styled.span`
  font-size: 12px;
  line-height: 1.2;
  color: #5e5e5e;
`;

export const PhotosDocShell = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 14px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const PhotosDocRow = styled.div`
  min-height: 100px;
  border: 1px solid #e4dccd;
  border-radius: 4px;
  padding: 18px 16px 16px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  column-gap: 14px;
  align-items: center;
  background: #fff;
`;

export const PhotosDocIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 4px;
  background: #f4efdf;
  color: #c89d0f;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const PhotosDocInputRow = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PhotosDocTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #222;
`;

export const PhotosDocBadge = styled.span`
  margin-left: 6px;
  font-size: 12px;
  color: #7f6a2d;
`;

export const PhotosDocText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #6f6f6f;
`;

export const PhotosDocName = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #222;
`;

export const PhotosDocAction = styled.button`
  min-width: 88px;
  height: 28px;
  border: 1px solid #d8c39d;
  background: #fff;
  color: #5b4e28;
  font-size: 12px;
  padding: 0 10px;
  box-sizing: border-box;
  cursor: default;
`;

export const PhotosDocSize = styled.span`
  grid-column: 3;
  margin-top: 6px;
  font-size: 12px;
  color: #a07a09;
  justify-self: end;
`;

export const PhotosDocStatus = styled.span`
  grid-column: 3;
  margin-top: 6px;
  font-size: 12px;
  color: #8b8b8b;
  justify-self: end;
`;

export const PhotosFooterNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 1.55;
  color: #6e5a25;
  margin-top: 10px;
`;

export const PhotosFooterNoteIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #d6a81b;
  margin-top: 1px;
`;

export const PhotosBottomButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
  margin-top: 18px;
`;

export const PhotosPrimaryButton = styled.button`
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

export const PhotosRightColumn = styled.aside`
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

export const PhotosStepWrapper = styled.section`
  border: 1px solid #d7ad2d;
  border-radius: 8px;
  background: #fff;
  padding: 22px 20px 24px;
  box-sizing: border-box;
`;

export const PhotosSideCardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #222;
  letter-spacing: -0.03em;
`;

export const PhotosStepItem = styled.div`
  position: relative;
  padding-left: 18px;
  min-height: 72px;
  margin-top: 28px;
`;

export const PhotosStepLine = styled.div`
  position: absolute;
  left: 12px;
  top: 2px;
  bottom: -18px;
  width: 1px;
  background: #d6c9ab;
`;

export const PhotosStepCircle = styled.div`
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

export const PhotosStepTitle = styled.h4`
  margin: 0 0 8px;
  padding-left: 18px;
  font-size: 17px;
  line-height: 1.2;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? "#b98d00" : "#666")};
`;

export const PhotosStepDesc = styled.p`
  margin: 0;
  padding-left: 18px;
  font-size: 14px;
  line-height: 1.5;
  color: #868686;
`;

export const PhotosSideCard = styled.section`
  border-radius: 8px;
  padding: 24px 18px 22px;
  box-sizing: border-box;
  background: #e7e7e7;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PhotosGuideText = styled.p`
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

export const PhotosGuideCard = styled.section`
  border-radius: 8px;
  padding: 24px 18px 22px;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
  align-items: center;
`;

export const PhotosAddressHint = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #8d7852;
`;

export const PhotosCountText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #8d7852;
`;

export const PhotosUploadArea = styled.div`
  width: 100%;
  border: 1px dashed #d8c39d;
  border-radius: 6px;
  background: #fcfbfa;
  padding: 16px;
  box-sizing: border-box;
`;
