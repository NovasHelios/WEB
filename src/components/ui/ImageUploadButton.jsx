import { useRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.span`
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

const TriggerButton = styled.button`
  width: 100%;
  min-height: 64px;
  border: 0;
  border-radius: 18px;
  background: #f4f4f4;
  padding: 14px 18px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  text-align: left;
  color: #111;
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover {
    background: #efefef;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  @media (max-width: 760px) {
    min-height: 58px;
    border-radius: 16px;
    padding: 12px 14px;
  }
`;

const TriggerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const Title = styled.span`
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.04em;
`;

const FileName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #6f6f6f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Chevron = styled.span`
  flex-shrink: 0;
  font-size: 18px;
  font-weight: 900;
  color: #111;
`;

const HiddenInput = styled.input`
  display: none;
`;

const LaterButton = styled.button`
  align-self: flex-end;
  border: 0;
  background: transparent;
  padding: 0;
  color: #6b7280;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: #111827;
  }
`;

function ImageUploadButton({
  label = "이미지 업로드",
  selectedFileName = "",
  placeholder = "이미지 파일을 선택해주세요",
  helperText = "jpg, png, webp, gif 허용",
  accept = "image/*",
  disabled = false,
  showLaterButton = true,
  onLater = () => {},
  onFileSelect = () => {},
}) {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    onFileSelect(file);
    event.target.value = "";
  };

  const handleLater = () => {
    onLater();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Wrapper>
      <Label>{label}</Label>
      <TriggerButton type="button" onClick={handleClick} disabled={disabled}>
        <TriggerText>
          <Title>{selectedFileName || placeholder}</Title>
          <FileName>{selectedFileName ? "선택 완료" : helperText}</FileName>
        </TriggerText>
        <Chevron>+</Chevron>
      </TriggerButton>
      <HiddenInput
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
      />
      {showLaterButton && (
        <LaterButton type="button" onClick={handleLater} disabled={disabled}>
          나중에 추가
        </LaterButton>
      )}
    </Wrapper>
  );
}

export default ImageUploadButton;
