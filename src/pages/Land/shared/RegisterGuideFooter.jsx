import { useLocation } from "react-router-dom";
import { AlertTriangle, HelpCircle, ShieldCheck } from "lucide-react";
import styled from "styled-components";
import { listPageShell } from "@/styles/listPage";
import { WorkflowSidebarText, WorkflowSidebarTitle } from "./RegisterWorkflowSidebar.styled";

// 등록 안내는 입력 그리드 밖에서 화면 전체 너비를 차지하는 하단 영역입니다.
const GuideFooter = styled.footer`
  width: 100%;
  background: #e7e7e7;
  border-top: 1px solid #d8d8d8;
`;
const GuideInner = styled.div`
  ${listPageShell}
  display: grid;
  gap: 1rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  p { overflow-wrap: anywhere; }
`;

export default function RegisterGuideFooter() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "");
  if (!["/land/register", "/land/register/confirm", "/land/register/detail", "/land/register/photos", "/land/register/condition"].includes(path)) return null;
  return <GuideFooter aria-label="토지 등록 안내">
    <GuideInner>
      <WorkflowSidebarTitle>등록 안내</WorkflowSidebarTitle>
      <WorkflowSidebarText><ShieldCheck size={17} aria-hidden="true" />정확한 토지 정보는 태양광 후보지 검토와 사업자 상담에 도움이 됩니다.</WorkflowSidebarText>
      <WorkflowSidebarText><HelpCircle size={17} aria-hidden="true" />등록된 토지 정보는 관리자 검토 후 플랫폼에 공개됩니다.</WorkflowSidebarText>
      <WorkflowSidebarText><AlertTriangle size={17} aria-hidden="true" />허위 정보 등록 시 서비스 이용에 제한이 있을 수 있습니다.</WorkflowSidebarText>
    </GuideInner>
  </GuideFooter>;
}
