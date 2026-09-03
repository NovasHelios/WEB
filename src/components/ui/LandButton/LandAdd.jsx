import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, getValidAccessToken } from "@/lib/auth";

// ─── Styled Components ────────────────────────────────────────────────────────

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
  max-height: min(100vh - 48px, 780px);
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

// 거래유형 선택 버튼 그룹
const ToggleGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ToggleButton = styled.button`
  flex: 1;
  height: 56px;
  border: 2px solid ${({ $active }) => ($active ? "#ffb000" : "#e5e7eb")};
  border-radius: 16px;
  background: ${({ $active }) => ($active ? "#fff8e6" : "#f4f4f4")};
  color: ${({ $active }) => ($active ? "#b07d00" : "#555")};
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #ffb000;
  }

  @media (max-width: 760px) {
    height: 50px;
    font-size: 15px;
  }
`;

// 이미지 업로드 영역
const ImageUploadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ImageUploadButton = styled.button`
  width: 100%;
  min-height: 64px;
  border: 2px dashed #d1d5db;
  border-radius: 18px;
  background: #f9fafb;
  padding: 14px 18px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 800;
  color: #6b7280;
  transition: all 0.15s ease;

  &:hover {
    border-color: #ffb000;
    background: #fff8e6;
    color: #b07d00;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const ImagePreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  background: #f3f4f6;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 0;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`;

const ImageCountHint = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: ${({ $error }) => ($error ? "#d92d20" : "#6b7280")};
`;

// 서류 업로드
const DocumentUploadButton = styled.button`
  width: 100%;
  min-height: 56px;
  border: 0;
  border-radius: 18px;
  background: #f4f4f4;
  padding: 0 18px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 15px;
  font-weight: 800;
  color: #111;

  &:hover {
    background: #efefef;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
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

const HiddenInput = styled.input`
  display: none;
`;

// ─── Component ────────────────────────────────────────────────────────────────

const MAX_IMAGES = 5;
const MIN_IMAGES = 3;

const toWonPrice = (value) => {
  // 추가 모달에서는 만원 단위로 입력받고 서버에는 원 단위로 전송합니다.
  const manwonPrice = Number(String(value).replace(/[^\d]/g, ""));
  return Number.isNaN(manwonPrice) ? 0 : manwonPrice * 10000;
};

function LandAdd({ open = true, onClose = () => {}, onSuccess = () => {} }) {
  const [form, setForm] = useState({
    address: "",
    desiredPrice: "",
    description: "",
    transactionType: "SALE", // "SALE" | "LEASE"
  });
  const [images, setImages] = useState([]); // { file: File, previewUrl: string }[]
  const [document, setDocument] = useState(null); // File | null
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  // 모달 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      queueMicrotask(() => {
        setForm({ address: "", desiredPrice: "", description: "", transactionType: "SALE" });
        setImages([]);
        setDocument(null);
        setError("");
        setIsLoading(false);
      });
    }
  }, [open, images]);

  if (!open) return null;

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleTransactionType = (type) => {
    setForm((prev) => ({ ...prev, transactionType: type }));
  };

  // 이미지 선택
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const remaining = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, remaining).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...toAdd]);
    event.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  // 서류 선택
  const handleDocumentChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setDocument(file);
    event.target.value = "";
  };

  // 등록 제출
  const handleSubmit = async (event) => {
    event.preventDefault();

    const accessToken = getValidAccessToken();
    if (!accessToken) {
      setError("로그인 후 토지 등록을 이용할 수 있습니다.");
      return;
    }

    if (!form.address.trim()) {
      setError("토지 주소를 입력해주세요.");
      return;
    }

    if (images.length < MIN_IMAGES) {
      setError(`이미지를 최소 ${MIN_IMAGES}장 이상 첨부해주세요. (현재 ${images.length}장)`);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const desiredPrice = form.desiredPrice
        ? toWonPrice(form.desiredPrice)
        : undefined;

      // query string 파라미터 구성
      const params = new URLSearchParams({
        address: form.address.trim(),
        transactionType: form.transactionType,
      });
      if (desiredPrice) params.append("desiredPrice", String(desiredPrice));
      if (form.description.trim()) params.append("description", form.description.trim());

      // multipart/form-data body 구성
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img.file));
      if (document) formData.append("document", document);

      const response = await authFetch(`${Api.Lands}?${params.toString()}`, {
        method: "POST",
        body: formData,
        // Content-Type은 FormData를 사용할 때 브라우저가 자동으로 설정 (boundary 포함)
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || data?.data || "토지 등록에 실패했습니다.");
      }

      onSuccess(data);
      onClose();
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
            ×
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          {/* 주소 */}
          <Field>
            <FieldTitle>토지 주소(지번)</FieldTitle>
            <TextInput
              value={form.address}
              onChange={handleChange("address")}
              placeholder="예) 서울 종로구 사직로 161"
              disabled={isLoading}
            />
          </Field>

          {/* 거래 유형 */}
          <div>
            <FieldTitle style={{ display: "block", marginBottom: "8px" }}>거래 유형</FieldTitle>
            <ToggleGroup>
              <ToggleButton
                type="button"
                $active={form.transactionType === "SALE"}
                onClick={() => handleTransactionType("SALE")}
                disabled={isLoading}
              >
                매매
              </ToggleButton>
              <ToggleButton
                type="button"
                $active={form.transactionType === "LEASE"}
                onClick={() => handleTransactionType("LEASE")}
                disabled={isLoading}
              >
                임대
              </ToggleButton>
            </ToggleGroup>
          </div>

          {/* 희망 가격 */}
          <Field>
            <FieldTitle>희망 가격 (만원 단위, 선택)</FieldTitle>
            <TextInput
              value={form.desiredPrice}
              onChange={handleChange("desiredPrice")}
              placeholder="예) 15000"
              disabled={isLoading}
            />
          </Field>

          {/* 상세 설명 */}
          <Field>
            <FieldTitle>상세 설명 (선택)</FieldTitle>
            <TextArea
              value={form.description}
              onChange={handleChange("description")}
              placeholder="토지에 대한 상세 설명을 입력해주세요"
              disabled={isLoading}
            />
          </Field>

          {/* 토지 이미지 (필수 3~5장) */}
          <div>
            <FieldTitle style={{ display: "block", marginBottom: "8px" }}>
              토지 이미지
            </FieldTitle>
            <ImageUploadArea>
              {images.length > 0 && (
                <ImagePreviewGrid>
                  {images.map((img, index) => (
                    <ImagePreviewItem key={index}>
                      <PreviewImage src={img.previewUrl} alt={`토지 이미지 ${index + 1}`} />
                      <RemoveImageButton
                        type="button"
                        onClick={() => removeImage(index)}
                        disabled={isLoading}
                        aria-label={`이미지 ${index + 1} 삭제`}
                      >
                        ×
                      </RemoveImageButton>
                    </ImagePreviewItem>
                  ))}
                </ImagePreviewGrid>
              )}

              {images.length < MAX_IMAGES && (
                <ImageUploadButton
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isLoading}
                >
                  + 이미지 추가 ({images.length}/{MAX_IMAGES})
                </ImageUploadButton>
              )}

              <ImageCountHint $error={images.length > 0 && images.length < MIN_IMAGES}>
                최소 {MIN_IMAGES}장 ~ 최대 {MAX_IMAGES}장 필수 (jpg, png, webp, gif)
              </ImageCountHint>
            </ImageUploadArea>

            <HiddenInput
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={isLoading}
            />
          </div>

          {/* 서류 첨부 (선택) */}
          <div>
            <FieldTitle style={{ display: "block", marginBottom: "8px" }}>
              서류 첨부 (선택)
            </FieldTitle>
            <DocumentUploadButton
              type="button"
              onClick={() => documentInputRef.current?.click()}
              disabled={isLoading}
            >
              <span>{document ? document.name : "서류 파일을 첨부해주세요"}</span>
              <span style={{ fontSize: "20px", fontWeight: 900 }}>+</span>
            </DocumentUploadButton>
            <HiddenInput
              ref={documentInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.hwp,image/*"
              onChange={handleDocumentChange}
              disabled={isLoading}
            />
          </div>

          {error && <ErrorText role="alert">{error}</ErrorText>}

          <RegisterButton type="submit" disabled={isLoading}>
            {isLoading ? "등록 중..." : "토지 등록하기"}
          </RegisterButton>
        </Form>
      </Modal>
    </Overlay>
  );
}

export default LandAdd;
