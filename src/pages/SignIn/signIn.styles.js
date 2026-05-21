import styled from "styled-components";

export const Container = styled.div`
  width: 700px;
  height: 900px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #f0f0f0;
  border-radius: 40px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const Input = styled.input`
  background-color: #ffffff;
  border-radius: 25px;
  width: 622px;
  height: 88px;
  font-size: 20px;
  font-weight: 600;
  border: #f0f0f0;
  padding-left: 26px;
  &::placeholder {
    font-size: 20px;
    font-weight: 900;
  }
`;

export const Label = styled.label`
  padding-left: 20px;
  font-size: 24px;
  margin-bottom: 8px;
  font-weight: 600;
`;

export const HeaderTag = styled.div`
  font-size: 40px;
  padding-bottom: 79px;
  font-weight: 600;
`;

export const SignButton = styled.button`
  width: 567px;
  height: 100px;
  border-radius: 20px;
  font-size: 32px;
  font-weight: 900;
  background-color: ${({ $bgcolor }) => $bgcolor};
  color: ${({ $textColor }) => $textColor};
  border: none;
  cursor: pointer;
  margin-top: 40px;
`;

export const DotWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 24px;
`;

export const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ $active }) => ($active ? "#FFAB03" : "#ccc")};
  cursor: pointer;
`;

export const ErrorMessage = styled.p`
  color: #b91c1c;
  font-size: 14px;
  margin-bottom: 8px;
  padding-left: 4px;
`;

export const SubmitButton = styled.button`
  width: 567px;
  height: 100px;
  border-radius: 20px;
  font-size: 32px;
  font-weight: 900;
  background-color: #FFAB03;
  color: #F0F0F0;
  border: none;
  cursor: pointer;
  margin-top: 40px;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const BottomText = styled.div`
  justify-content: center;
  display: flex;
  align-items: center;
  padding-top: 18px;
`;
