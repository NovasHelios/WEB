import styled from "styled-components";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bgimg from "../images/HeliosBackground.png";
import { Api } from "@/contents/apiEndpoints";
import {
  authFetch,
  clearProfileImagePromptPending,
  consumeLoginNotice,
  getValidAccessToken,
  isProfileImagePromptPending,
} from "@/lib/auth";

const BgWrapper = styled.div`
  background-image: url(${({ $bgimg }) => $bgimg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: block;
  overflow-x: hidden;
  z-index: 0;
`;

const LoginNotice = styled.div`
  position: fixed;
  top: 92px;
  left: 50%;
  z-index: 100;
  transform: translateX(-50%);
  padding: 14px 22px;
  border: 1px solid #e1c77b;
  border-radius: 999px;
  background: #fffdf6;
  color: #6f5200;
  font-size: var(--font-sm);
  font-weight: var(--font-bold);
  box-shadow: 0 10px 30px rgba(61, 45, 12, 0.14);
`;

const ProfilePromptBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(24, 20, 14, 0.42);
`;

const ProfilePrompt = styled.div`
  width: min(420px, 100%);
  padding: 28px;
  border: 1px solid #ead9b6;
  border-radius: 20px;
  background: var(--color-surface);
  text-align: center;
  box-shadow: 0 24px 64px rgba(35, 26, 11, 0.22);

  h2 {
    margin: 0;
    color: #211f1b;
    font-size: var(--font-xl);
  }

  p {
    margin: 10px 0 20px;
    color: #766c5e;
    font-size: var(--font-sm);
    line-height: 1.6;
    white-space: nowrap;
  }
`;

const ProfilePromptAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  margin: 0 auto;
  border-radius: 50%;
  background: #f7ebc8;
  color: #a57900;
  font-size: var(--font-2xl);
  font-weight: var(--font-bold);
`;

const ProfilePromptActions = styled.div`
  display: flex;
  gap: 10px;

  button {
    flex: 1;
    height: 44px;
    border: 1px solid #d7bf84;
    border-radius: 8px;
    background: #fff;
    color: #8a6800;
    font: inherit;
    font-size: var(--font-sm);
    font-weight: var(--font-bold);
    cursor: pointer;
  }

  button:last-child {
    border-color: #d6a81b;
    background: #d6a81b;
    color: #111;
  }

  button:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`;

const getProfileImage = (user) => (
  user?.profileImagePath ||
  user?.profileImageUrl ||
  user?.imagePath ||
  user?.imageUrl ||
  user?.profileImage ||
  ""
);

function ProfileImagePrompt() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 로그인 직후 프로필을 확인하고 이미지가 없을 때만 팝업을 표시합니다.
    if (!isProfileImagePromptPending() || !getValidAccessToken()) return undefined;

    let cancelled = false;

    const checkProfileImage = async () => {
      try {
        const response = await authFetch(Api.MyProfile, { method: "GET" });
        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json") ? await response.json() : null;
        const user = data?.data || data || {};

        if (cancelled) return;

        if (!response.ok || getProfileImage(user)) {
          clearProfileImagePromptPending();
          return;
        }

        setIsOpen(true);
      } catch {
        // 프로필 조회 실패 시에는 기존 로그인 흐름을 막지 않습니다.
      }
    };

    void checkProfileImage();
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  const handleSkip = () => {
    // 나중에 선택하면 이번 로그인 동안은 다시 표시하지 않습니다.
    clearProfileImagePromptPending();
    setIsOpen(false);
  };

  const handleMoveToProfile = () => {
    // 팝업을 닫고 프로필 페이지의 이미지 변경 기능으로 이동합니다.
    clearProfileImagePromptPending();
    setIsOpen(false);
    navigate("/profile");
  };

  if (!isOpen) return null;

  return (
    <ProfilePromptBackdrop role="presentation">
      <ProfilePrompt role="dialog" aria-modal="true" aria-labelledby="profile-image-prompt-title">
        <ProfilePromptAvatar>H</ProfilePromptAvatar>
        <h2 id="profile-image-prompt-title">프로필 이미지를 설정해 주세요</h2>
        <p>프로필 이미지를 등록하면 더 쉽게 알아볼 수 있어요.</p>
        <ProfilePromptActions>
          <button type="button" onClick={handleSkip}>나중에</button>
          <button type="button" onClick={handleMoveToProfile}>프로필로 이동</button>
        </ProfilePromptActions>
      </ProfilePrompt>
    </ProfilePromptBackdrop>
  );
}

function Background({ children }) {
  const [showLoginNotice, setShowLoginNotice] = useState(false);

  useEffect(() => {
    // 로그인 성공 직후 한 번만 안내 팝업을 표시합니다.
    if (!consumeLoginNotice()) return undefined;

    setShowLoginNotice(true);
    const timerId = window.setTimeout(() => setShowLoginNotice(false), 2200);

    return () => window.clearTimeout(timerId);
  }, []);

  return (
    <BgWrapper $bgimg={bgimg}>
      {showLoginNotice ? <LoginNotice>로그인 되었습니다.</LoginNotice> : null}
      <ProfileImagePrompt />
      {children}
    </BgWrapper>
  );
}

export default Background;
