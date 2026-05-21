import { useState, useRef, useEffect } from "react";

const VerificationCodeModal = ({ onClose, onVerify, onResend }) => {
  const [codes, setCodes] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const inputs = useRef([]);

  // 카운트다운 타이머
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...codes];
    next[index] = value;
    setCodes(next);
    setError("");
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = codes.join("");
    if (code.length < 6) {
      setError("인증코드를 모두 입력해주세요.");
      return;
    }
    onVerify?.(code);
  };

  const handleResend = () => {
    setCodes(Array(6).fill(""));
    setError("");
    setTimeLeft(60);
    onResend?.();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-3xl p-8 w-[400px] shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Verification Code</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-lg">✕</button>
        </div>

        {/* 코드 입력 */}
        <p className="text-sm text-gray-600 mb-3">Enter code</p>
        <div className="flex gap-2 mb-1">
          {codes.map((val, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-12 h-12 text-center text-lg font-semibold rounded-xl bg-gray-100 focus:outline-none focus:ring-2 ${error ? "ring-2 ring-red-400" : "focus:ring-yellow-400"}`}
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
          className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-lg rounded-2xl transition-colors mb-4"
        >
          Verify Code
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
};

export default VerificationCodeModal;
