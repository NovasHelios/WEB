import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./signIn.styles.js";
import EmailVerifyButton from "../../components/ui/EmailVerifyButton";

function NormalSignIn() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        businessNumber:""
    })

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleOnChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setError("");
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (form.email.includes("@") === false) {
        setError("email 형식에 맞지 않습니다.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("http://localhost:8080/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message);
        }

        navigate("/login");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <S.Container>
        <S.HeaderTag>Sign up</S.HeaderTag>
        <S.Form onSubmit={handleSubmit}>
          <S.InputGroup>
            <S.Label>Email</S.Label>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <S.Input
                type="text"
                name="email"
                value={form.email}
                onChange={handleOnChange}
                placeholder="example@email.com"
                style={{ width: "500px" }}
              />
              <EmailVerifyButton email={form.email} />
            </div>
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>아이디</S.Label>
            <S.Input
              type="text"
              name="username"
              value={form.username}
              onChange={handleOnChange}
              placeholder="아이디를 입력해주세요"
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>비밀번호 (8자 이상)</S.Label>
            <S.Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleOnChange}
              placeholder="비밀번호를 입력해주세요"
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>비밀번호 확인</S.Label>
            <S.Input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleOnChange}
              placeholder="비밀번호를 다시 입력해주세요"
            />
          </S.InputGroup>

          {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

          <S.SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "처리 중..." : "회원가입"}
          </S.SubmitButton>

          <S.BottomText>
            이미 계정이 있으신가요?{" "}
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>로그인 →</span>
          </S.BottomText>
        </S.Form>
      </S.Container>
    );
}

export default NormalSignIn;