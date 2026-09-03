import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background: #fff;
  color: #202020;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px 56px;
  box-sizing: border-box;
`;

export const LogoWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;

  button {
    border: 0;
    background: transparent;
    padding: 0;
    cursor: pointer;
  }
`;

export const LogoImage = styled.img`
  /* 로그인 화면처럼 상단 로고 크기를 안정적으로 고정 */
  height: 64px;
  width: auto;
  object-fit: contain;
`;

export const Card = styled.div`
  width: min(100%, 720px);
  border: 1px solid #efc23a;
  border-radius: 10px;
  background: #fff;
  box-sizing: border-box;
  padding: 24px 30px 20px;
  box-shadow: 0 28px 56px rgba(214, 168, 27, 0.12);

  @media (max-width: 720px) {
    padding: 34px 22px 36px;
  }
`;

export const Title = styled.h1`
  margin: 0 0 28px;
  font-size: 26px;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.05em;
  color: #222;
`;

export const Subtitle = styled.p`
  margin: 0 0 18px;
  font-size: 16px;
  line-height: 1.6;
  color: #6f6251;
  text-align: center;
`;

export const Divider = styled.div`
  height: 1px;
  background: #e2d2b6;
  margin: 0 0 22px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #605442;
`;

export const Input = styled.input`
  width: 100%;
  border: 0;
  border-bottom: 2px solid #bec5d1;
  background: transparent;
  padding: 0 0 12px;
  box-sizing: border-box;
  outline: none;
  font-size: 17px;
  color: #303030;

  &::placeholder {
    color: #7b8597;
  }

  &:focus {
    border-bottom-color: #d6a81b;
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 28px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 18px;
  }
`;

export const EmailRow = styled.div`
  display: flex;
  align-items: end;
  gap: 14px;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const EmailInputWrap = styled.div`
  flex: 1;
  min-width: 0;
`;

export const VerifyButton = styled.button`
  width: 126px;
  height: 44px;
  border: 1px solid #efc23a;
  background: #fff;
  color: #d6a81b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  flex: 0 0 auto;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: #c62828;
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 60px;
  border: 0;
  background: #d6a81b;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const GoogleButton = styled.button`
  width: 176px;
  height: 38px;
  border: 1px solid #e1cfb0;
  background: #fff;
  color: #252525;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;

export const BottomText = styled.p`
  margin: 22px 0 0;
  text-align: center;
  font-size: 16px;
  color: #4f4a42;
`;

export const BottomLink = styled.button`
  border: 0;
  background: transparent;
  color: #b48909;
  font-size: 16px;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;
  padding: 0;
`;

export const GoogleRow = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 16px;
`;
