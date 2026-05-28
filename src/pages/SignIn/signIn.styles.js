import styled from "styled-components";

export const Container = styled.div`
  width: 700px;
  height: 960px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #f0f0f0;
  transform: scale(0.75); /* 추가 */

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
  padding-left: 26px;
  color: ${({ $error }) => ($error ? "#E24B4A" : "inherit")};
  border: 2px solid ${({ $error }) => ($error ? "#E24B4A" : "#f0f0f0")};

  &::placeholder {
    font-size: 20px;
    font-weight: 900;
    color: ${({ $error }) => ($error ? "#ef9a9a" : "#b6b6b6")};
  }
  &:focus {
    background-color: #ffffff;
    border: 2px solid ${({ $error }) => ($error ? "#E24B4A" : "#FFAB03")};
    outline: none;
  }
`;



export const ErrorText = styled.p`
  margin: 8px 0 0 20px;
  min-height: 16px; /* 자리 고정 */
  font-size: 20px;
  color: #e24b4a;
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
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

export const Span = styled.span`
    color: black;
    font-weight: 900;
    margin: 0 0 0 10px;
`;
// 마진 없어서 딱 붙어있어서 수정함

export const DotWrapper = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`;

export const Dot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${({ $active }) => ($active ? "#FFAB03" : "#C0C0C0")};
  cursor: pointer;
`;
