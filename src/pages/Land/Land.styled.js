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
