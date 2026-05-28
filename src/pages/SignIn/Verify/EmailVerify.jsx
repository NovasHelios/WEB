import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Api } from "../../../context/apiEndPoints";

function EmailVerify() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${Api.EmailVarify}?token=${token}`, {
          method: "GET",
        });
        const data = await response.json();
        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "이메일 인증 완료");
        } else {
          setStatus("error");
          setMessage(data.message || "인증 실패 토큰 확인 바람");
        }
      } catch (err) {
        setStatus("error");
        setMessage("서버와 연결 실패");
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage("유효하지 않은 접근");
    }
  }, [token]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleChange = (idx, value) => {
    const v = value.replace(/\D/g, "").slice(0, 1);
    const next = [...code];
    next[idx] = v;
    setCode(next);
    if (v && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const joined = code.join("");
    if (joined.length < 6) {
      setError("인증코드를 모두 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${Api.EmailVarify}?token=${token}&code=${joined}`,
        { method: "POST" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "인증에 실패했습니다.");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setCode(["", "", "", "", "", ""]);
    setError("");
    setTimeLeft(60);
    try {
      await fetch(`${Api.EmailSend}?token=${token}`, { method: "POST" });
    } catch {
      setError("재전송에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500">
      <div className="bg-white rounded-3xl p-8 w-[420px] shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Verification Code</h2>
        </div>

        {/* 코드 입력 */}
        <p className="text-sm text-gray-600 mb-3">Enter code</p>
        <div className="flex gap-2 mb-1">
          {code.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`w-12 h-12 text-center text-lg font-semibold rounded-xl bg-gray-100 focus:outline-none focus:ring-2 ${
                error ? "ring-2 ring-red-400" : "focus:ring-yellow-400"
              }`}
            />
          ))}
        </div>
        <div className="h-5 text-right mb-4">
          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
        </div>

        {/* 타이머 */}
        <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2 text-yellow-500 text-sm font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Code expiers in
          </div>
          <span className={`text-sm font-bold ${timeLeft <= 10 ? "text-red-500" : "text-yellow-500"}`}>
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* 버튼 */}
        <button
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-lg rounded-2xl transition-colors mb-4 disabled:opacity-60"
        >
          {isLoading ? "확인 중..." : "Verify Code"}
        </button>

        {/* 재전송 */}
        <p className="text-center text-sm text-gray-500">
          Didn't receive the code?{" "}
          <button onClick={handleResend} className="text-yellow-500 font-semibold hover:underline">
            Resend code
          </button>
        </p>
      </div>
    </div>
  );
}

export default EmailVerify;
