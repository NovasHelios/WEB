import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginSigninBox from "../../../components/layout/box/LoginSigninBox";
import LoginEmailInput from "./LoginInputEmail";
import LoginPasswordInput from "./LoginInputPassword";
import LoginButton from "./LoginButton";
import { Api } from "@/contents/apiEndpoints";

const LoginForm = () => {
  const navigate = useNavigate();

  // 입력값 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    // 빈 값 입력 방지
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    // 요청 시작 - 로딩 ON, 에러 초기화
    setIsLoading(true);
    setError("");

    try {
      // 로그인 API 요청
      const response = await fetch(Api.Login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.status !== 200) {
        throw new Error(
          data.data?.message || "이메일 또는 비밀번호가 올바르지 않습니다."
        );
      }

      localStorage.setItem("accessToken", data.data.accessToken);

      const role = data.data.role;

      if (role === "ADMIN") navigate("/main");
      else if (role === "COMPANY") navigate("/main");
      else if (role === "USER") navigate("/main");
      else navigate("/main");
    } catch (err) {
      // 에러 메시지 표시
      console.log("Login error:", err);
      setError("이메일 또는 비밀번호를 확인해주세요.");
    } finally {
      // 요청 종료 - 로딩 OFF
      setIsLoading(false);
    }
  };

  // 엔터키 입력 시 로그인 실행
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <LoginSigninBox>
      <h1 className="mb-8 text-3xl font-bold text-center">Login</h1>
      <LoginEmailInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        error={error}
      />
      <LoginPasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <LoginButton onClick={handleLogin} isLoading={isLoading} />
      <p className="text-sm text-center text-gray-600">
        Don't have an account?{" "}
        <a
          href="/signup"
          className="font-semibold text-black underline hover:text-gray-700"
        >
          Sign up
        </a>
      </p>
    </LoginSigninBox>
  );
};

export default LoginForm;
