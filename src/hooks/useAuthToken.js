import { useEffect, useState } from "react";
import { AUTH_CHANGED_EVENT, getValidAccessToken } from "@/lib/auth";

// 같은 탭의 인증 변경과 다른 탭의 로그아웃·토큰 만료를 함께 반영합니다.
export default function useAuthToken() {
  const [token, setToken] = useState(getValidAccessToken);
  useEffect(() => {
    const sync = () => setToken(getValidAccessToken());
    window.addEventListener(AUTH_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    const timer = window.setInterval(sync, 1000);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      window.clearInterval(timer);
    };
  }, []);
  return token;
}
