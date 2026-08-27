import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
} from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
import { RegisterWorkflowSidebar, useRequireLogin } from "../shared";
import {
  ConditionButton,
  ConditionButtonRow,
  ConditionCard,
  ConditionCardBottomLine,
  ConditionCardContainer,
  ConditionCardLabel,
  ConditionCardSuffix,
  ConditionCardTitle,
  ConditionField,
  ConditionFieldPrefix,
  ConditionFieldValue,
  ConditionPage,
  ConditionSection,
  ConditionTopShell,
} from "./LandRegisterCondition.styled";
import {
  RegisterButtonRow as ConditionFooterButtons,
  RegisterPrimaryButton as ConditionPrimaryButton,
  RegisterSectionDescription as ConditionSectionDescription,
  RegisterSectionTitle as ConditionSectionTitle,
} from "../shared.styled";

const conditionTabs = {
  sale: {
    key: "sale",
    label: "매매",
    cardTitle: "거래 정보",
    valueLabel: "희망 가격",
    prefix: "",
    suffix: "원",
    placeholder: "1,500,000,000",
  },
  rent: {
    key: "rent",
    label: "임대",
    cardTitle: "거래 정보 | 월",
    valueLabel: "희망 가격",
    prefix: "월",
    suffix: "원",
    placeholder: "1,500,000,000",
  },
  hope: {
    key: "hope",
    label: "사업 희망",
    cardTitle: "거래 정보",
    valueLabel: "희망 가격",
    prefix: "",
    suffix: "원",
    placeholder: "입력 불가",
  },
};

function LandRegisterCondition() {
  const navigate = useNavigate();
  useRequireLogin();
  const [selected, setSelected] = useState("sale");
  const [values, setValues] = useState({
    sale: "",
    rent: "",
    hope: "",
  });

  const current = useMemo(() => conditionTabs[selected], [selected]);

  return (
    <ConditionPage>
      {/* 공통 헤더 */}
      <NavBar
        keyword=""
        onChangeKeyword={() => {}}
        onSearch={() => {}}
        isSuggestionOpen={false}
        regionSuggestions={[]}
      />

      {/* 거래 조건 선택 */}
      <ConditionTopShell>
        <ConditionSection>
          <ConditionSectionTitle>5. 조건 등록</ConditionSectionTitle>
          <ConditionSectionDescription>거래에 필요한 조건을 선택해주세요.</ConditionSectionDescription>
        </ConditionSection>

        <ConditionButtonRow>
          {Object.values(conditionTabs).map((tab) => (
            <ConditionButton
              key={tab.key}
              type="button"
              $active={selected === tab.key}
              onClick={() => setSelected(tab.key)}
            >
              {tab.label}
            </ConditionButton>
          ))}
        </ConditionButtonRow>

        <ConditionCard>
          <ConditionCardTitle>{current.cardTitle}</ConditionCardTitle>
          <ConditionCardBottomLine />

          <ConditionCardLabel>{current.valueLabel}</ConditionCardLabel>

          <ConditionCardContainer>
            <ConditionField>
              {current.prefix ? <ConditionFieldPrefix>{current.prefix}</ConditionFieldPrefix> : null}
              <ConditionFieldValue
                inputMode="numeric"
                value={values[selected]}
                disabled={selected === "hope"}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    [selected]: event.target.value,
                  }))
                }
                placeholder={current.placeholder}
                aria-label={current.valueLabel}
                aria-disabled={selected === "hope"}
                readOnly={selected === "hope"}
              />
            </ConditionField>
            <ConditionCardSuffix>{current.suffix}</ConditionCardSuffix>
          </ConditionCardContainer>
          {selected === "hope" ? (
            <ConditionCardLabel style={{ marginTop: "10px", marginBottom: 0 }}>
              사업 희망은 별도 입력이 필요하지 않습니다.
            </ConditionCardLabel>
          ) : null}
        </ConditionCard>



        <ConditionFooterButtons>
          <ConditionPrimaryButton type="button" $outline onClick={() => navigate("/land/register/photos")}>
            <ArrowLeft size={18} strokeWidth={2.4} />
            이전 단계로
          </ConditionPrimaryButton>
          <ConditionPrimaryButton type="button" onClick={() => navigate("/land/register/complete")}>
            등록
          </ConditionPrimaryButton>
        </ConditionFooterButtons>
      </ConditionTopShell>

      {/* 진행 단계 사이드바 */}
      <RegisterWorkflowSidebar activeStep={2} />
    </ConditionPage>
  );
}

export default LandRegisterCondition;
