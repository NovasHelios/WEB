import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getValidAccessToken } from "@/lib/auth";

function useRequireLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인되지 않은 사용자는 로그인 화면으로 돌려보냅니다.
    const accessToken = getValidAccessToken();

    if (!accessToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);
}

export default useRequireLogin;
