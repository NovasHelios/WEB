import * as S from "./signIn.styles.js";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BusinessSignIn2() {
  const [form, setForm] = useState({
    cEmail: "",
    password: "",
    businessNumber: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.cEmail.includes("@") === false) {
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
      const response = await fetch(
        "POST /api/auth/email/send?email=test@test.com",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      console.log("회원가입 성공", data);

      onTabChange("login"); // 성공 시 로그인 탭으로 이동
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
          <S.Label>Company Email</S.Label>
          <S.Input
            type="text"
            name="cEmail"
            value={form.cEmail}
            onChange={handleOnChange}
            placeholder="Enter Your Email"
          />
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>Password</S.Label>
          <S.Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleOnChange}
            placeholder="Enter Your Password"
          />
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>Business Number</S.Label>
          <S.Input
            type="businessNumber"
            name="businessNumber"
            value={form.businessNumber}
            onChange={handleOnChange}
            placeholder="Enter Your Business Number"
          />
        </S.InputGroup>

        <S.DotWrapper>
          <S.Dot
              onClick={() => navigate("/")}
              $active={location.pathname === "/"}
          />
          <S.Dot
              onClick={() => navigate("/2")}
              $active={location.pathname === "/2"}
          />
        </S.DotWrapper>

        <S.SignButton
          type="submit"
          disabled={isLoading}
          $bgcolor={"#FFAB03"}
          $textColor={"#F0F0F0"}
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </S.SignButton>

        <S.BottomText>
          already have an account?{" "}
          <span onClick={() => onTabChange("login")}>Log In →</span>
        </S.BottomText>
      </S.Form>
    </S.Container>
  );
}

export default BusinessSignIn2;
