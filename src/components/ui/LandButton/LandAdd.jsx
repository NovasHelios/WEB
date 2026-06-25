import { useEffect, useState } from "react";
import styled from "styled-components";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, getValidAccessToken } from "@/lib/auth";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.72);
  box-sizing: border-box;
`;

const Modal = styled.div`
  width: min(100%, 460px);
  max-height: min(100vh - 48px, 680px);
  overflow: auto;
  border-radius: 22px;
  background: #fff;
  padding: 20px 18px 22px;
  box-sizing: border-box;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);

  @media (max-width: 760px) {
    width: min(100%, 92vw);
    padding: 18px 16px 20px;
    border-radius: 20px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 4px;
`;

const CloseButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  font-size: 40px;
  line-height: 0.8;
  font-weight: 900;
  color: #000;
  cursor: pointer;

  @media (max-width: 760px) {
    font-size: 48px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldTitle = styled.span`
  display: inline-flex;
  width: fit-content;
  font-size: 20px;
  line-height: 1;
  font-weight: 900;
  color: #1a1a1a;
  letter-spacing: -0.05em;

  @media (max-width: 760px) {
    font-size: 18px;
  }
`;

const TextInput = styled.input`
  width: 100%;
  height: 64px;
  border: 0;
  border-radius: 18px;
  background: #f4f4f4;
  padding: 0 18px;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 800;
  color: #111;
  outline: none;

  &::placeholder {
    color: #8f8f8f;
    font-weight: 800;
  }

  @media (max-width: 760px) {
    height: 58px;
    border-radius: 16px;
    padding: 0 14px;
    font-size: 15px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 96px;
  border: 0;
  border-radius: 18px;
  background: #f4f4f4;
  padding: 16px 18px;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 800;
  color: #111;
  outline: none;
  resize: none;
  line-height: 1.4;

  &::placeholder {
    color: #8f8f8f;
    font-weight: 800;
  }

  @media (max-width: 760px) {
    min-height: 84px;
    border-radius: 16px;
    padding: 14px 14px;
    font-size: 15px;
  }
`;

const RegisterButton = styled.button`
  width: 100%;
  height: 62px;
  border: 0;
  border-radius: 16px;
  background: #ffb000;
  color: #fff;
  font-size: 22px;
  font-weight: 900;
  cursor: pointer;
  margin-top: 8px;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.05);
  letter-spacing: -0.04em;

  &:hover {
    filter: brightness(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  @media (max-width: 760px) {
    height: 56px;
    border-radius: 14px;
    font-size: 18px;
  }
`;

const ErrorText = styled.p`
  margin: 0;
  color: #d92d20;
  font-size: 14px;
  font-weight: 700;
`;

function LandAdd({ open = true, onClose = () => {}, onSuccess = () => {} }) {
  const [form, setForm] = useState({
    address: "",
    amount: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setForm({ address: "", amount: "", description: "" });
      setError("");
      setIsLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const extractLandId = (payload) => {
    const candidates = [
      payload?.landId,
      payload?.id,
      payload?.data?.landId,
      payload?.data?.id,
      payload?.result?.landId,
      payload?.result?.id,
      payload?.data?.result?.landId,
      payload?.data?.result?.id,
    ];

    for (const candidate of candidates) {
      if (candidate !== undefined && candidate !== null && candidate !== "") {
        return candidate;
      }
    }

    return null;
  };

  const registerLand = async ({ address, desiredPrice, description }) => {
    const response = await authFetch(Api.Lands, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        desiredPrice,
        description,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || data?.data?.message || "토지 등록에 실패했습니다.");
    }

    return data;
  };

  const uploadSelectedImage = async (landId, file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("image", file);

    const response = await authFetch(Api.LandImage(landId), {
      method: "PATCH",
      redirect: "manual",
      body: formData,
    });

    if (response.type === "opaqueredirect" || (response.status >= 300 && response.status < 400)) {
      throw new Error("로그인이 필요하거나 인증이 만료됐어요. 다시 로그인해 주세요.");
    }

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : null;

    if (!response.ok) {
      throw new Error(
        data?.message || data?.data?.message || "토지 이미지를 업로드하지 못했습니다."
      );
    }

    return data;
  };

  const queueImageUpload = (landId, file) => {
    window.setTimeout(() => {
      void uploadSelectedImage(landId, file).catch((uploadError) => {
        console.warn("토지 이미지를 나중에 업로드하지 못했습니다.", uploadError);
      });
    }, 3000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const accessToken = getValidAccessToken();
    if (!accessToken) {
      setError("로그인 후 토지 등록을 이용할 수 있습니다.");
      return;
    }

    if (!form.address.trim() || !form.amount.trim() || !form.description.trim()) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    const desiredPrice = Number(form.amount.replace(/[^\d]/g, ""));
    if (Number.isNaN(desiredPrice)) {
      setError("금액은 숫자로 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const landResponse = await registerLand({
        address: form.address.trim(),
        desiredPrice,
        description: form.description.trim(),
      });

      const landId = extractLandId(landResponse);
      if (!landId) {
        console.warn("토지 등록 응답에서 landId를 찾지 못했습니다.");
      }

      onSuccess(landResponse);
      onClose();
      setForm({ address: "", amount: "", description: "" });
    } catch (err) {
      setError(err.message || "토지 등록에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Overlay role="dialog" aria-modal="true" aria-label="토지 등록">
      <Modal>
        <Header>
          <CloseButton type="button" onClick={onClose} aria-label="닫기">
            X
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <Field>
            <FieldTitle>토지 주소(지번)</FieldTitle>
            <TextInput
              value={form.address}
              onChange={handleChange("address")}
              placeholder="토지 주소를 입력해주세요"
              disabled={isLoading}
            />
          </Field>

          <Field>
            <FieldTitle>금액</FieldTitle>
            <TextInput
              value={form.amount}
              onChange={handleChange("amount")}
              placeholder="금액을 입력해주세요"
              disabled={isLoading}
            />
          </Field>

          <Field>
            <FieldTitle>상세 설명</FieldTitle>
            <TextArea
              value={form.description}
              onChange={handleChange("description")}
              placeholder="토지에 대한 상세 설명을 입력해주세요"
              disabled={isLoading}
            />
          </Field>

          {error && <ErrorText>{error}</ErrorText>}

          <RegisterButton type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </RegisterButton>
        </Form>
      </Modal>
    </Overlay>
  );
}

export default LandAdd;
