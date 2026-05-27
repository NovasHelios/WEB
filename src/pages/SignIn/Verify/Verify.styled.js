// styled-components
export const CodeRow = styled.div`
  display: flex;
  gap: 16px;
`;

export const CodeInput = styled.input`
  width: 96px;
  height: 96px;
  border-radius: 26px;
  border: 4px solid ${({ $error }) => ($error ? "#ff5656" : "#d9d9d9")};
  background: #fff;
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  outline: none;

  &:focus {
    border-color: ${({ $error }) => ($error ? "#ff5656" : "#ffab03")};
  }
`;

export const CodeError = styled.p`
  margin-top: 12px;
  text-align: right;
  color: #ff5656;
  font-size: 38px;
  font-weight: 700;
`;

