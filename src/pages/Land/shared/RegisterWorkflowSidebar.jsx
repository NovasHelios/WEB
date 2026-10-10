import {
  WorkflowSidebarCard,
  WorkflowSidebarStepCircle,
  WorkflowSidebarStepCount,
  WorkflowSidebarStepDesc,
  WorkflowSidebarStepItem,
  WorkflowSidebarStepLine,
  WorkflowSidebarSteps,
  WorkflowSidebarStepTitle,
  WorkflowSidebarTitle,
} from "./RegisterWorkflowSidebar.styled";

const workflowSteps = [
  { number: "1", title: "주소 입력", description: "주소 입력 및 자동 정보 조회" },
  { number: "2", title: "자동 정보 확인", description: "자동 조회 정보 확인 및 수정" },
  { number: "3", title: "상세 정보 입력", description: "거래 정보 및 상세 내용 입력" },
  { number: "4", title: "사진 및 서류", description: "현장 사진 및 증명서류 업로드" },
  { number: "5", title: "조건 등록", description: "구매 조건 등록" },
];

function RegisterWorkflowSidebar({ activeStep = 1 }) {
  return (
    <>
      <WorkflowSidebarCard $inset={activeStep === 1}>
        <WorkflowSidebarTitle>등록 진행 현황</WorkflowSidebarTitle>
        <WorkflowSidebarSteps>
          {workflowSteps.map((step, index) => {
            const stepNumber = Number(step.number);
            const active = stepNumber <= activeStep;
            const isLast = index === workflowSteps.length - 1;

            return (
              <WorkflowSidebarStepItem key={step.number}>
                {/* 마지막 단계는 연결선을 숨김 */}
                {!isLast && <WorkflowSidebarStepLine />}
                <WorkflowSidebarStepCircle $active={active}>
                  <WorkflowSidebarStepCount>{step.number}</WorkflowSidebarStepCount>
                </WorkflowSidebarStepCircle>
                <WorkflowSidebarStepTitle $active={active}>{step.title}</WorkflowSidebarStepTitle>
                <WorkflowSidebarStepDesc>{step.description}</WorkflowSidebarStepDesc>
              </WorkflowSidebarStepItem>
            );
          })}
        </WorkflowSidebarSteps>
      </WorkflowSidebarCard>

    </>
  );
}

export default RegisterWorkflowSidebar;
