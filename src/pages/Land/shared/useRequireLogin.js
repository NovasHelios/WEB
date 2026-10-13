import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthToken from "@/hooks/useAuthToken";

function useRequireLogin() {
  const navigate = useNavigate();
  const accessToken = useAuthToken();

  useEffect(() => {
    // 로그인되지 않은 사용자는 로그인 화면으로 돌려보냅니다.
    if (!accessToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate, accessToken]);
}

export default useRequireLogin;
