import styled from "styled-components";

// 프로필 페이지 전체 배경입니다.
export const ProfilePage = styled.div`
  min-height: 100vh;
  background: var(--color-page-bg);
  color: #211f1b;
`;

// 프로필 본문 영역입니다.
export const ProfileShell = styled.main`
  max-width: 980px;
  margin: 0 auto;
  padding: 16px;
`;

// 프로필 페이지 제목입니다.
export const ProfileHeader = styled.section`
  margin-bottom: 16px;

  h1 {
    margin: 0;
    font-size: var(--font-2xl);
    font-weight: var(--font-bold);
    letter-spacing: -0.04em;
  }

  p {
    margin: 12px 0 0;
    color: #766c5e;
    font-size: var(--font-md);
  }
`;

// 프로필 정보 카드입니다.
export const ProfileCard = styled.section`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 16px;
  padding: 16px;
  border: 1px solid #ead9b6;
  border-radius: 18px;
  background: var(--color-surface);
  box-shadow: 0 18px 48px rgba(116, 86, 24, 0.08);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

// 프로필 이미지 영역입니다.
export const ProfileAvatarPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

// 프로필 이미지 미리보기입니다.
export const ProfileAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 148px;
  height: 148px;
  overflow: hidden;
  border: 1px solid #d7bf84;
  border-radius: 50%;
  background: linear-gradient(135deg, #f7ebc8, #ffffff);
  color: #a57900;
  font-size: var(--font-3xl);
  font-weight: var(--font-bold);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// 프로필 이미지 업로드 버튼입니다.
export const ProfileImageButton = styled.button`
  min-width: 148px;
  height: 42px;
  border: 1px solid #d2a91c;
  border-radius: 8px;
  background: #ffffff;
  color: #9a7400;
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`;

// 프로필 입력 폼입니다.
export const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 프로필 입력 필드 묶음입니다.
export const ProfileField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #6d6252;
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
`;

// 프로필 입력창입니다.
export const ProfileInput = styled.input`
  height: 46px;
  border: 0;
  border-bottom: 2px solid #2f2b25;
  background: transparent;
  color: #1f1f1f;
  font-family: inherit;
  font-size: var(--font-md);
  font-weight: var(--font-semibold);
  line-height: 1.4;
  outline: none;

  &:focus {
    border-bottom-color: #d6a81b;
  }

  &:disabled {
    -webkit-text-fill-color: #8d867b;
    color: #8d867b;
    opacity: 1;
  }
`;

// 프로필 버튼 영역입니다.
export const ProfileActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
`;

// 프로필 액션 버튼입니다.
export const ProfileButton = styled.button`
  min-width: 132px;
  height: 46px;
  border: 1px solid ${({ $variant }) => ($variant === "outline" ? "#d7bf84" : "#d6a81b")};
  border-radius: 8px;
  background: ${({ $variant }) => ($variant === "outline" ? "#ffffff" : "#d6a81b")};
  color: ${({ $variant }) => ($variant === "outline" ? "#8a6800" : "#111111")};
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.65;
  }
`;

// 프로필 상태 메시지입니다.
export const ProfileMessage = styled.p`
  margin: 0;
  color: ${({ $error }) => ($error ? "#c2410c" : "#8a6800")};
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
`;

// 프로필 수정 팝업 배경입니다.
export const ProfileDialogBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(24, 20, 14, 0.42);
`;

// 프로필 수정 팝업 카드입니다.
export const ProfileDialog = styled.form`
  width: min(460px, 100%);
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border: 1px solid #ead9b6;
  border-radius: 18px;
  background: var(--color-surface);
  box-shadow: 0 24px 64px rgba(35, 26, 11, 0.22);
`;

// 프로필 수정 팝업 제목 영역입니다.
export const ProfileDialogHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h2 {
    margin: 0;
    color: #211f1b;
    font-size: var(--font-xl);
    font-weight: var(--font-bold);
  }

  p {
    margin: 0;
    color: #766c5e;
    font-size: var(--font-sm);
  }
`;

// 프로필 수정 팝업 버튼 영역입니다.
export const ProfileDialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
`;
