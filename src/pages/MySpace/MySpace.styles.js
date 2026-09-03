import styled from "styled-components";

export const SpaceWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #faf6ee;
  overflow: hidden;
`;

export const SpaceMain = styled.main`
  min-height: calc(100vh - 56px);
  overflow: auto;
`;

export const SpacePage = styled.div`
  min-height: calc(100vh - 56px);
  background: #faf6ee;
`;

export const SpaceInner = styled.div`
  width: 100%;
  padding: 34px 28px 48px;
  box-sizing: border-box;

  @media (max-width: 760px) {
    padding: 24px 18px 36px;
  }
`;

export const SpaceHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;
  margin-bottom: 26px;
`;

export const SpaceTitle = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.05em;
  color: #1f1c17;
`;

export const SpaceTopNote = styled.p`
  margin: 10px 0 0;
  font-size: 17px;
  line-height: 1.6;
  color: #6f6658;
`;

export const SpaceTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
`;

export const SpaceStatText = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: #2f2a23;

  strong {
    color: #8a6a00;
    font-weight: 800;
  }
`;

export const SpaceTopAction = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  padding: 0 16px;
  border: 0;
  border-radius: 4px;
  background: #d9aa1f;
  color: #1f1c17;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

export const SpaceToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const SpaceFilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const SpaceSortBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

export const SpaceFilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 34px;
  padding: 0 14px;
  border-radius: 9px;
  border: 1px solid ${(props) => (props.$active ? "#8e6b00" : "#d8c5a2")};
  background: ${(props) => (props.$active ? "#8e6b00" : "#fffdf8")};
  color: ${(props) => (props.$active ? "#fff" : "#5d5445")};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

export const SpaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const SpaceCard = styled.article`
  border: 1px solid #eadfc8;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.55);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
  overflow: hidden;
`;

export const SpaceCardRow = styled.div`
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 170px;
  gap: 18px;
  padding: 20px 18px 20px 18px;
  align-items: stretch;

  @media (max-width: 1100px) {
    grid-template-columns: 220px minmax(0, 1fr);
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const SpaceCardImage = styled.div`
  min-height: 206px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, ${(props) => props.$accent?.[0] || "#d8e6c8"}, ${(props) => props.$accent?.[1] || "#84b57f"});
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3);

  span {
    position: absolute;
    left: 14px;
    bottom: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 42px;
    height: 26px;
    padding: 0 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.82);
    color: #6c5d31;
    font-size: 12px;
    font-weight: 700;
  }
`;

export const SpaceCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;

  h3 {
    margin: 0;
    font-size: 22px;
    line-height: 1.4;
    font-weight: 700;
    color: #2a261f;
  }
`;

export const SpaceBadgeRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

export const SpaceBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 10px;
  border: 1px solid #d7cab0;
  border-radius: 4px;
  background: #f8f3ea;
  color: #7d725f;
  font-size: 12px;
  font-weight: 700;
`;

export const SpaceCardMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 28px;
  padding-top: 18px;
  border-top: 1px solid #efe4cf;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const SpaceCardMetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SpaceCardMetaLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  color: #7b7365;
`;

export const SpaceCardMetaValue = styled.div`
  font-size: ${(props) => (props.$highlight ? "18px" : "16px")};
  font-weight: 800;
  color: ${(props) => (props.$highlight ? "#9a7400" : "#2a251c")};
`;

export const SpaceInfoRow = styled.div`
  display: flex;
  gap: 48px;
  flex-wrap: wrap;
  padding-top: 8px;
`;

export const SpaceCardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  color: #6a6458;
  font-size: 14px;
  font-weight: 700;
`;

export const SpaceActionColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 8px;

  @media (max-width: 1100px) {
    grid-column: 1 / -1;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
  }
`;

export const SpaceActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 130px;
  height: 36px;
  border: 1px solid ${(props) => (props.$danger ? "#d5bfa0" : props.$secondary ? "#d5bfa0" : "#a87a00")};
  border-radius: 2px;
  background: ${(props) => (props.$danger ? "#f7f2e9" : props.$secondary ? "#fffaf1" : "#fffdf5")};
  color: ${(props) => (props.$danger ? "#8f7a58" : "#8a6800")};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

export const SpaceModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.38);
  box-sizing: border-box;
`;

export const SpaceModal = styled.form`
  width: min(100%, 520px);
  border: 1px solid #d9aa1f;
  border-radius: 8px;
  background: #fffdf8;
  padding: 28px;
  box-sizing: border-box;
  box-shadow: 0 18px 44px rgba(56, 43, 20, 0.18);
`;

export const SpaceModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #1f1c17;
  }
`;

export const SpaceModalClose = styled.button`
  width: 34px;
  height: 34px;
  border: 1px solid #d8c5a2;
  border-radius: 4px;
  background: #fffaf1;
  color: #5d5445;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
`;

export const SpaceModalField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  color: #5d5445;
  font-size: 13px;
  font-weight: 700;
`;

export const SpaceModalInput = styled.input`
  width: 100%;
  height: 42px;
  border: 0;
  border-bottom: 2px solid #2f2a23;
  background: transparent;
  color: #1f1c17;
  font-size: 16px;
  outline: none;
`;

export const SpaceModalSelect = styled.select`
  width: 100%;
  height: 42px;
  border: 1px solid #d8c5a2;
  border-radius: 4px;
  background: #fff;
  color: #1f1c17;
  font-size: 15px;
  font-weight: 700;
  padding: 0 12px;
  outline: none;
`;

export const SpaceModalTextarea = styled.textarea`
  width: 100%;
  min-height: 96px;
  resize: vertical;
  border: 1px solid #d8c5a2;
  border-radius: 4px;
  background: #fff;
  color: #1f1c17;
  font-size: 15px;
  line-height: 1.5;
  padding: 12px;
  outline: none;
  box-sizing: border-box;
`;

export const SpaceModalError = styled.p`
  margin: 4px 0 14px;
  color: #b42318;
  font-size: 13px;
  font-weight: 700;
`;

export const SpaceModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
`;
