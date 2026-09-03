import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginSigninBox from "../../../components/layout/box/LoginSigninBox";
import LoginEmailInput from "./LoginInputEmail";
import LoginPasswordInput from "./LoginInputPassword";
import LoginButton from "./LoginButton";
import LoginError from "./LoginError";
import logoImage from "@/images/logo.png";
import { Api } from "@/contents/apiEndpoints";
import { setAccessToken } from "@/lib/auth";

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

      setAccessToken(data.data.accessToken);

      const role = data.data.role;

      if (role === "ADMIN") navigate("/");
      else if (role === "COMPANY") navigate("/");
      else if (role === "USER") navigate("/");
      else navigate("/");
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
      <div className="flex flex-col items-center text-center">
        {/* 로고 클릭 시 뒤로가기 대신 홈으로 명확하게 이동합니다. */}
        <button type="button" onClick={() => navigate("/")} className="cursor-pointer">
          <img
            src={logoImage}
            alt="Helios"
            className="h-[48px] w-auto object-contain max-[640px]:h-[48px]"
          />
        </button>
        <h1 className="mt-6 text-[56px] font-medium leading-none tracking-[-0.07em] text-[#1f1f1f] max-[640px]:text-[40px]">
          만나서 반갑습니다
        </h1>
        <p className="mt-4 text-[18px] leading-7 text-[#6f6251] max-[640px]:text-base">
          로그인하여 당신만의 엄선된 공간을 확인해 보세요.
        </p>
      </div>

      <div className="mx-auto mt-10 w-full max-w-[660px] rounded-[10px] border border-[#f0dfb2] bg-[#fffdf8] px-8 py-9 max-[640px]:px-5 max-[640px]:py-7">
        <LoginError message={error} />

        <div className="space-y-6">
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
        </div>

        <div className="mt-2 flex items-center justify-between gap-4 text-sm max-[640px]:flex-col max-[640px]:items-start">
          <label className="flex items-center gap-3 text-[16px] text-[#3a352e]">
            <input
              type="checkbox"
              className="h-5 w-5 rounded-full border-[#9c8e74] text-[#d6a81b] focus:ring-[#d6a81b]"
            />
            로그인 상태 유지
          </label>
          <button
            type="button"
            className="text-[#b18600] underline underline-offset-4"
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>

        <div className="mt-8">
          <LoginButton onClick={handleLogin} isLoading={isLoading} />
        </div>

        <div className="mt-8 flex items-center gap-4 text-[#6f6251]">
          <div className="h-px flex-1 bg-[#e0d2b7]" />
          <span className="whitespace-nowrap text-[15px]">또는 다음 계정으로 계속하기</span>
          <div className="h-px flex-1 bg-[#e0d2b7]" />
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            className="flex h-12 min-w-[160px] items-center justify-center gap-2 border border-[#d9c9af] bg-white px-5 text-[15px] font-medium text-[#232323]"
          >
            <span className="text-[17px] font-bold text-[#444]">G</span>
            Google
          </button>
        </div>

        <p className="mt-8 text-center text-[16px] text-[#5f5a52]">
          아직 계정이 없으신가요?{" "}
          <a href="/signup" className="font-semibold text-[#b18600] underline underline-offset-4">
            회원가입
          </a>
        </p>
      </div>
    </LoginSigninBox>
  );
};

export default LoginForm;
