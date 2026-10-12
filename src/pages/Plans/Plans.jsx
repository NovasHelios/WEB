import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, AUTH_CHANGED_EVENT } from "@/lib/auth";
import useAuthToken from "@/hooks/useAuthToken";
import { Check } from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
import {
  PlanBillingBadge,
  PlanBillingSwitch,
  PlanBillingToggle,
  PlanCard,
  PlanCardButton,
  PlanCardDescription,
  PlanCardFeatures,
  PlanCardHeader,
  PlanCardPrice,
  PlanCardTitle,
  PlanGrid,
  PlanHeader,
  PlanPage,
  PlanShell,
  PlanSubtitle,
  PlanTitle,
  PlanConfirmation,
} from "./Plans.styles";

const planOptions = [
  {
    id: "FREE", name: "무료 플랜",
    description: "서비스를 체험해보세요",
    monthly: "0",
    yearly: "0",
    features: ["기본 토지 정보 열람", "상담 요청 및 채팅"],
  },
  {
    id: "PRO", name: "프로 플랜",
    description: "더 많은 정보와 기회를 얻으세요",
    monthly: "4,900",
    yearly: "49,000",
    features: ["기본 토지 정보 열람", "자동 조회 정보 열람", "상담 요청 및 채팅", "AI 분석 리포트"],
  },
  {
    id: "BUSINESS", name: "비즈니스 플랜",
    description: "전문적인 분석으로 성공 확률을 높이세요",
    monthly: "14,900",
    yearly: "149,000",
    features: ["모든 자동 조회 정보 열람", "관심 토지 등록", "상담 요청 및 채팅", "AI 분석 리포트", "태양광 적합도 분석", "예상 발전량 및 수익 분석"],
    featured: true,
  },
];

function Plans() {
  const token = useAuthToken();
  return <PlansContent key={token} token={token} />;
}

function PlansContent({ token }) {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("");
  const [selection, setSelection] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  // 현재 이용 플랜은 서버에서 확인한 값만 표시합니다.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    void (async () => {
      try {
        const response = await authFetch(Api.MyPlan);
        if (!response.ok) throw new Error("현재 플랜을 불러오지 못했습니다.");
        const data = await response.json();
        if (!cancelled) setCurrentPlan(data.data.plan);
      } catch (error) {
        if (!cancelled) setMessage(error.message);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  // 결제 주기를 전송하는 API가 없으므로 플랜 변경과 결제를 구분합니다.
  const changePlan = async () => {
    if (!selection || busy) return;
    setBusy(true);
    try {
      const response = await authFetch(Api.MyPlan, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selection.id }),
      });
      if (!response.ok) throw new Error("플랜 변경에 실패했습니다. 다시 시도해주세요.");
      setCurrentPlan(selection.id);
      setSelection(null);
      setMessage("플랜이 변경되었습니다. 결제는 진행하지 않았습니다.");
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <PlanPage>
      {/* 공통 상단 네비게이션입니다. */}
      <NavBar
        keyword=""
        onChangeKeyword={() => {}}
        onSearch={() => {}}
        isSuggestionOpen={false}
        regionSuggestions={[]}
      />

      <PlanShell>
        {/* 플랜 화면의 제목과 결제 주기 선택 영역입니다. */}
        <PlanHeader>
          <PlanTitle>요금제 플랜</PlanTitle>
          <PlanSubtitle>필요한 기능에 맞는 플랜을 선택하고 더 많은 기회를 경험해 보세요.</PlanSubtitle>
          <PlanBillingSwitch>
            <span>월간 결제</span>
            <PlanBillingToggle
              type="button"
              $active={isYearly}
              onClick={() => setIsYearly((previous) => !previous)}
              aria-label="월간 결제와 연간 결제 전환"
              aria-pressed={isYearly}
            >
              <span />
            </PlanBillingToggle>
            <strong>연간 결제</strong>
            <PlanBillingBadge>2개월 무료</PlanBillingBadge>
          </PlanBillingSwitch>
        </PlanHeader>

        <p>가격은 안내용입니다. 현재 플랜 변경은 결제·정기 구독 신청과 별개입니다.</p>
        {message && <p role="status">{message}</p>}
        {selection && <PlanConfirmation role="group" aria-label="플랜 변경 확인">
          <p>{selection.name}으로 변경할까요? 월간·연간 결제는 연결되지 않습니다.</p>
          <PlanCardButton type="button" disabled={busy} onClick={changePlan}>변경 확인</PlanCardButton>
          <PlanCardButton type="button" disabled={busy} onClick={() => setSelection(null)}>취소</PlanCardButton>
        </PlanConfirmation>}
        {/* 플랜 변경은 사용자의 명시적인 확인 후 요청합니다. */}
        <PlanGrid>
          {planOptions.map((plan) => (
            <PlanCard key={plan.name} $featured={plan.featured}>
              <PlanCardHeader>
                <PlanCardTitle>{plan.name}</PlanCardTitle>
                <PlanCardDescription>{plan.description}</PlanCardDescription>
              </PlanCardHeader>
              <PlanCardPrice>
                <strong>{isYearly ? plan.yearly : plan.monthly}</strong>
                <span>원 / {isYearly ? "년" : "월"}</span>
              </PlanCardPrice>
              <PlanCardButton type="button" $current={currentPlan === plan.id}
                disabled={busy || currentPlan === plan.id || Boolean(token && !currentPlan)}
                onClick={() => token ? setSelection(plan) : navigate("/login")}>
                {currentPlan === plan.id ? "현재 이용 중" : token ? "플랜 변경" : "로그인 후 선택"}
              </PlanCardButton>
              <PlanCardFeatures>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check size={16} strokeWidth={2.2} />
                    <span>{feature}</span>
                  </li>
                ))}
              </PlanCardFeatures>
            </PlanCard>
          ))}
        </PlanGrid>
      </PlanShell>
    </PlanPage>
  );
}

export default Plans;
