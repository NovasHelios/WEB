import styled from "styled-components";

export const LandPage = styled.div`
  height: 100%;
  width: 100%;
  background: #ffffff;
  position: relative;
  z-index: 1;
`;

export const LandInner = styled.div`
  width: 100%;
  padding: 28px 28px 36px 28px;
  box-sizing: border-box;

  @media (max-width: 1100px) {
    padding-left: 92px;
  }

  @media (max-width: 760px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

export const LandToolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 12px 0 20px;
`;

export const LandAddButton = styled.button`
  min-width: 360px;
  height: 48px;
  border: 0;
  border-radius: 10px;
  background: #f1a332;
  color: #000;
  font-size: 20px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);
  letter-spacing: -0.02em;

  &:hover {
    filter: brightness(0.98);
  }

  @media (max-width: 760px) {
    min-width: 220px;
    height: 48px;
    font-size: 18px;
  }
`;

export const LandGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px 22px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const LandCard = styled.article`
  display: grid;
  grid-template-columns: 214px 1fr;
  gap: 12px;
  align-items: stretch;
  min-height: 220px;
  padding: 6px;
  border: 4px solid #f7a200;
  border-radius: 20px;
  background: #fff;
  box-sizing: border-box;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const LandThumbImage = styled.img`
  width: 100%;
  height: 100%;
  min-height: 204px;
  border-radius: 10px;
  border: 3px solid #222;
  background: #f7f7f7;
  object-fit: cover;
  display: block;

  @media (max-width: 900px) {
    min-height: 180px;
  }
`;

export const LandCardBody = styled.div`
  padding: 10px 10px 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 14px;
  color: #111;
  font-weight: 800;
`;

export const LandMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 15px;
  line-height: 1.55;

  strong {
    font-weight: 800;
  }
`;

export const LandDescription = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  word-break: keep-all;
`;

export const LandCardPreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const LandCardPreviewLabel = styled.span`
  font-size: 13px;
  font-weight: 900;
  color: #444;
  letter-spacing: -0.03em;
`;

export const LandCardPreviewBox = styled.div`
  width: 100%;
  height: 118px;
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  background: #f8f8f8;
`;

export const LandCardPreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const LandCardPreviewEmpty = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
`;

export const LandCardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
`;

export const LandEditButton = styled.button`
  min-width: 132px;
  height: 40px;
  border: 0;
  border-radius: 999px;
  background: #111;
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  padding: 0 16px;

  &:hover {
    filter: brightness(1.08);
  }

  @media (max-width: 760px) {
    min-width: 120px;
    height: 38px;
    font-size: 13px;
  }
`;

export const LandImageModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.72);
  box-sizing: border-box;
`;

export const LandImageModal = styled.div`
  width: min(100%, 460px);
  max-height: none;
  overflow: visible;
  border-radius: 22px;
  background: #fff;
  padding: 20px 18px 22px;
  box-sizing: border-box;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const LandImageModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LandImageModalTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.05em;
`;

export const LandImageModalClose = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  font-size: 36px;
  line-height: 0.8;
  font-weight: 900;
  color: #000;
  cursor: pointer;
`;

export const LandImageModalMeta = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #555;
  word-break: keep-all;
`;

export const LandImageModalError = styled.p`
  margin: 0;
  color: #d92d20;
  font-size: 14px;
  font-weight: 700;
`;

export const LandImageModalSubmit = styled.button`
  width: 100%;
  height: 58px;
  border: 0;
  border-radius: 16px;
  background: #ffb000;
  color: #fff;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
  margin-top: 0;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const LandShell = styled.div`
  min-height: 100vh;
  width: 100vw;
  flex: 0 0 100vw;
  overflow-x: hidden;
  background: #fff;
`;

export const LandNavbarWrap = styled.div`
  position: relative;
  z-index: 30;
`;

export const LandSidebarWrap = styled.div`
  position: fixed;
  left: 0;
  top: 56px;
  bottom: 0;
  z-index: 20;

  @media (max-width: 760px) {
    display: none;
  }
`;

export const LandMain = styled.main`
  height: calc(100vh - 56px);
  background: #fff;
  overflow: hidden;
`;

export const LandScrollArea = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;
