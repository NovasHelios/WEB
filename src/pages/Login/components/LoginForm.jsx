import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginSigninBox from "../../../components/layout/box/LoginSigninBox";
import LoginError from "./LoginError";
import LoginEmailInput from "./LoginInputEmail";
import LoginPasswordInput from "./LoginInputPassword";
import LoginButton from "./LoginButton";

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // 응답 실패 시 에러 throw
      if (!response.ok) {
        throw new Error(data.message || "이메일 또는 비밀번호가 올바르지 않습니다.");
      }

      // 토큰 로컬스토리지 저장
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // JWT payload 디코딩 후 role 추출
      const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
      const role = payload.role;

      // role 기반 페이지 분기
      if (role === "ADMIN") navigate("/admin");
      else if (role === "COMPANY") navigate("/company");
      else navigate("/");

    } catch (err) {
      // 에러 메시지 표시
      setError(err.message);
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
      <LoginError message={error} />
      <LoginEmailInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
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
        <a href="/signup" className="font-semibold text-black underline hover:text-gray-700">
          Sign up
        </a>
      </p>
    </LoginSigninBox>
  );
};

export default LoginForm;