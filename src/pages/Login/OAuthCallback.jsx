import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { markLoginNotice, setAccessToken, setStoredUserDisplayName } from "@/lib/auth";

const getEmailFromToken = (token) => {
  // OAuth 직후 프로필 API 응답 전에도 계정 표시가 흔들리지 않게 JWT subject를 사용합니다.
  const payload = token.split(".")[1];
  if (!payload) return "";

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return JSON.parse(atob(padded))?.sub || "";
  } catch {
    return "";
  }
};

function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // OAuth 콜백으로 전달된 토큰을 저장한 뒤 홈으로 이동합니다.
    const token = searchParams.get("token") || searchParams.get("accessToken");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setAccessToken(token);
    setStoredUserDisplayName(getEmailFromToken(token));
    markLoginNotice();
    navigate("/", { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-[#232323]">
      {/* OAuth 처리 중 사용자에게 짧은 상태를 표시합니다. */}
      로그인 처리 중입니다...
    </div>
  );
}

export default OAuthCallback;
