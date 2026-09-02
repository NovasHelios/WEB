import styled from "styled-components";

// 사업 연결 안내 페이지 전체 배경입니다.
export const BusinessPage = styled.div`
  min-height: 100vh;
  background: #faf7f0;
  color: #211f1b;
`;

// 사업 연결 안내 본문 영역입니다.
export const BusinessShell = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 72px);
  padding: 48px 24px 96px;
`;

// 개발중 안내 카드입니다.
export const BusinessCard = styled.section`
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

// 개발중 상태 아이콘입니다.
export const BusinessIconBox = styled.div`
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

// 개발중 안내 제목입니다.
export const BusinessTitle = styled.h1`
  margin: 0;
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.04em;

  @media (max-width: 640px) {
    font-size: 30px;
  }
`;

// 개발중 안내 설명입니다.
export const BusinessDescription = styled.p`
  margin: 16px auto 0;
  max-width: 480px;
  color: #6f6658;
  font-size: 16px;
  line-height: 1.7;
`;

// 페이지 이동 버튼 묶음입니다.
export const BusinessActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 34px;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

// 페이지 이동 버튼입니다.
export const BusinessButton = styled.button`
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
