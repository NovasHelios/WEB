import styled from "styled-components";

export const WorkflowSidebarCard = styled.section`
  border: 1px solid #d7ad2d;
  border-radius: 8px;
  background: #fff;
  padding: 22px 20px 24px;
  box-sizing: border-box;
  margin-right: 16px;
`;

export const WorkflowSidebarTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #222;
  letter-spacing: -0.03em;
`;

export const WorkflowSidebarSteps = styled.div`
  margin-top: 18px;
  display: flex;
  flex-direction: column;
`;

export const WorkflowSidebarStepItem = styled.div`
  position: relative;
  padding-left: 16px;
  min-height: 70px;
`;

export const WorkflowSidebarStepLine = styled.div`
  position: absolute;
  left: 12px;
  top: 2px;
  bottom: -18px;
  width: 1px;
  background: #d6c9ab;
`;

export const WorkflowSidebarStepCircle = styled.div`
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

export const WorkflowSidebarStepCount = styled.span`
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
`;

export const WorkflowSidebarStepTitle = styled.h4`
  margin: 0 0 8px;
  padding-left: 18px;
  font-size: 17px;
  line-height: 1.2;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? "#b98d00" : "#666")};
`;

export const WorkflowSidebarStepDesc = styled.p`
  margin: 0;
  padding-left: 18px;
  font-size: 14px;
  line-height: 1.5;
  color: #868686;
`;

export const WorkflowSidebarInfoCard = styled.section`
  border-radius: 8px;
  padding: 24px 18px 22px;
  box-sizing: border-box;
  background: #e7e7e7;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WorkflowSidebarHelpCard = styled.section`
  border-radius: 8px;
  padding: 24px 18px 22px;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
`;

export const WorkflowSidebarText = styled.p`
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

export const WorkflowSidebarHelpText = styled.p`
  margin: 0;
  font-size: 15px;
  color: #666;
  text-align: center;
`;
