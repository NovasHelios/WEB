import styled from "styled-components";

const Wrapper = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 30vw;
  padding: 16px 20px;
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

const LoginEmailInput = ({ value, onChange, onKeyDown, disabled }) => {
  return (
    <Wrapper>
      <Label>Email</Label>
      <Input
        type="email"
        placeholder="Enter Your Email"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={disabled}
      />
    </Wrapper>
  );
};

export default LoginEmailInput;