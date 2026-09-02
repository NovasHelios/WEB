import styled from "styled-components";

// 채팅 개발중 페이지 전체 배경입니다.
export const ChatComingSoonPage = styled.div`
  min-height: 100vh;
  background: #faf7f0;
  color: #211f1b;
`;

// 채팅 개발중 본문 영역입니다.
export const ChatComingSoonShell = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 72px);
  padding: 48px 24px 96px;
`;

// 채팅 개발중 안내 카드입니다.
export const ChatComingSoonCard = styled.section`
  width: min(720px, 100%);
  padding: 56px 48px;
  border: 1px solid #e1c27a;
  border-radius: 18px;
  background: #fffdf8;
  text-align: center;
  box-shadow: 0 22px 60px rgba(116, 86, 24, 0.1);

  @media (max-width: 640px) {
    padding: 42px 24px;
  }
`;

// 채팅 개발중 아이콘 박스입니다.
export const ChatComingSoonIconBox = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  margin-bottom: 24px;
  border-radius: 24px;
  background: #f6edcf;
  color: #a57900;
`;

// 채팅 개발중 제목입니다.
export const ChatComingSoonTitle = styled.h1`
  margin: 0;
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.04em;

  @media (max-width: 640px) {
    font-size: 30px;
  }
`;

// 채팅 개발중 설명입니다.
export const ChatComingSoonDescription = styled.p`
  margin: 16px auto 0;
  max-width: 500px;
  color: #6f6658;
  font-size: 16px;
  line-height: 1.7;
`;

// 채팅 개발중 버튼 묶음입니다.
export const ChatComingSoonActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 34px;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

// 채팅 개발중 이동 버튼입니다.
export const ChatComingSoonButton = styled.button`
  min-width: 156px;
  height: 46px;
  border: 1px solid ${({ $variant }) => ($variant === "outline" ? "#d7bf84" : "#d6a81b")};
  border-radius: 8px;
  background: ${({ $variant }) => ($variant === "outline" ? "#ffffff" : "#d6a81b")};
  color: ${({ $variant }) => ($variant === "outline" ? "#8a6800" : "#111111")};
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
`;
