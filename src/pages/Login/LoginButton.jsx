import styled from "styled-components";

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 8px;
  padding: 18px;
  margin-bottom: 24px;
  font-size: 1.1875rem;
  font-weight: 600;
  color: white;
  background-color: #FFAB03;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: background-color 0.05s;

  &:hover {
    background-color: #f3a200;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoginButton = ({ onClick, isLoading }) => {
  return (
    <Button onClick={onClick} disabled={isLoading}>
      {isLoading ? "로그인 중..." : "Log In"}
    </Button>
  );
};

export default LoginButton;