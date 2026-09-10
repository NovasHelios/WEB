import styled from "styled-components";
import { useEffect, useState } from "react";
import bgimg from "../images/HeliosBackground.png";
import { consumeLoginNotice } from "@/lib/auth";

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
  font-size: 15px;
  font-weight: 700;
  box-shadow: 0 10px 30px rgba(61, 45, 12, 0.14);
`;

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
      {children}
    </BgWrapper>
  );
}

export default Background;
