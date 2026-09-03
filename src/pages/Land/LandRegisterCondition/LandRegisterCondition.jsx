import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
} from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
import { RegisterWorkflowSidebar, useRequireLogin } from "../shared";
import { Api } from "@/contents/apiEndpoints";
import { authFetch } from "@/lib/auth";
import { useLandRegister } from "@/contexts/LandRegisterContext";
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
    suffix: "만원",
    placeholder: "150000",
  },
  rent: {
    key: "rent",
    label: "임대",
    cardTitle: "거래 정보 | 월",
    valueLabel: "희망 가격",
    prefix: "월",
    suffix: "만원",
    placeholder: "350",
  },
  hope: {
    key: "hope",
    label: "사업 희망",
    cardTitle: "거래 정보",
    valueLabel: "희망 가격",
    prefix: "",
    suffix: "만원",
    placeholder: "입력 불가",
  },
};

const toServerTransactionType = (value) => {
  // 서버는 SALE/LEASE만 받으므로 화면 값을 서버 enum으로 변환합니다.
  if (value === "rent") return "LEASE";
  return "SALE";
};

function LandRegisterCondition() {
  const navigate = useNavigate();
  useRequireLogin();
  const { registerData, setRegisterData } = useLandRegister();
  const [selected, setSelected] = useState(registerData.transactionType || "sale");
  const [values, setValues] = useState({
    sale: registerData.transactionType === "sale" ? registerData.price || "" : "",
    rent: registerData.transactionType === "rent" ? registerData.price || "" : "",
    hope: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const current = useMemo(() => conditionTabs[selected], [selected]);

  const handleValueChange = (event) => {
    const nextValue = event.target.value;

    setValues((prev) => ({
      ...prev,
      [selected]: nextValue,
    }));

    if (selected !== "hope") {
      setRegisterData((prev) => ({
        ...prev,
        transactionType: selected,
        price: nextValue,
      }));
    }

    setError("");
  };

  const handleTabSelect = (key) => {
    // 거래 방식 탭을 바꾸면 전역 등록 데이터에도 즉시 반영합니다.
    setSelected(key);
    setRegisterData((prev) => ({
      ...prev,
      transactionType: key,
      price: key === "hope" ? "" : values[key],
    }));
    setError("");
  };

  const handleSubmit = async () => {
    // 마지막 조건 단계에서 모든 등록 정보를 한 번에 multipart로 전송합니다.
    const images = registerData.photos || [];
    const desiredPrice = Number((selected === "hope" ? "" : values[selected]).replace(/[^\d]/g, ""));

    if (!registerData.address?.trim()) {
      setError("주소를 먼저 입력해주세요.");
      return;
    }

    if (images.length < 3) {
      setError("사진을 최소 3장 이상 업로드해주세요.");
      return;
    }

    if (selected !== "hope" && (!desiredPrice || Number.isNaN(desiredPrice))) {
      setError("희망 가격을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        address: registerData.address.trim(),
        transactionType: toServerTransactionType(selected),
      });

      if (selected !== "hope") {
        params.append("desiredPrice", String(desiredPrice));
      }

      if (registerData.memo?.trim()) {
        params.append("description", registerData.memo.trim());
      }

      const formData = new FormData();
      images.forEach((image) => formData.append("images", image.file));
      if (registerData.document) formData.append("document", registerData.document);

      const response = await authFetch(`${Api.Lands}?${params.toString()}`, {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || data?.data?.message || "토지 등록에 실패했습니다.");
      }

      setRegisterData((prev) => ({
        ...prev,
        submittedLand: data?.data ?? data,
        price: selected === "hope" ? "가격 미정" : values[selected],
        transactionType: selected,
      }));

      navigate("/land/register/complete");
    } catch (err) {
      setError(err.message || "토지 등록에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

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
              onClick={() => handleTabSelect(tab.key)}
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
                onChange={handleValueChange}
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

        {error ? (
          <ConditionCardLabel style={{ color: "#d92d20", marginTop: "16px" }}>
            {error}
          </ConditionCardLabel>
        ) : null}

        <ConditionFooterButtons>
          <ConditionPrimaryButton
            type="button"
            $outline
            onClick={() => navigate("/land/register/photos")}
            disabled={isLoading}
          >
            <ArrowLeft size={18} strokeWidth={2.4} />
            이전 단계로
          </ConditionPrimaryButton>
          <ConditionPrimaryButton type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "등록 중..." : "등록"}
          </ConditionPrimaryButton>
        </ConditionFooterButtons>
      </ConditionTopShell>

      {/* 진행 단계 사이드바 */}
      <RegisterWorkflowSidebar activeStep={5} />
    </ConditionPage>
  );
}

export default LandRegisterCondition;
