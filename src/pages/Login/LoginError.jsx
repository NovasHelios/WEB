import styled from "styled-components";

const ErrorBox = styled.div`
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 0.875rem;
  color: #b91c1c;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 16px;
`;

const LoginError = ({ message }) => {
  if (!message) return null;

  return <ErrorBox>{message}</ErrorBox>;
};

export default LoginError;