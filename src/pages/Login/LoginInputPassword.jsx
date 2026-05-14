import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-bottom: 32px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 30vw;
  padding: 16px 48px 16px 20px;
  font-size: 1.0625rem;
  color: #374151;
  background-color: #f9fafb;
  border: none;
  border-radius: 16px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    box-shadow: 0 0 0 2px #3b82f6;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;

  &:hover {
    color: #4b5563;
  }
`;

const LoginPasswordInput = ({ value, onChange, onKeyDown, disabled }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Wrapper>
      <Label>Password</Label>
      <InputWrapper>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter Your Password"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
        />
        <ToggleButton
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </ToggleButton>
      </InputWrapper>
    </Wrapper>
  );
};

export default LoginPasswordInput;