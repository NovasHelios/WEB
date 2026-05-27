import { verify } from "crypto";
import * as S from "../signIn.styles";
import * as C from "./Verify.styled";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

function EmailVerify() {
  const { token } = useParams();
  const [status, setStatus] = useState(loading);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch("api 수조", {
          method: "GET",
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "이메일 인증 완료");
        } else {
          setStatus("error");
          setMessage(data.message || "인증 실패 토큰 환인 바람");
        }
      } catch (error) {
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

  // 핵심: input 6개를 map으로 만들고, 한 칸 입력하면 다음 칸으로 focus 이동
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (idx, value) => {
    const v = value.replace(/\D/g, "").slice(0, 1); // 숫자 1개만
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
  return (
    <S.Container>
      <S.HeaderTag>Verification Code</S.HeaderTag>
      <S.Label>Enter code</S.Label>
      <C.CodeRow>
        <C.CodeInput
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          value={digit}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          className={`code-box ${error ? "error" : ""}`}
          inputMode="numeric"
          maxLength={1}
        />
      </C.CodeRow>
      <S.SignButton>
        
      </S.SignButton>
      <S.BottomText />
    </S.Container>
  );
}

export default EmailVerify;
