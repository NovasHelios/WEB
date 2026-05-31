import useSignForm from "./useSignForm.js";
import * as S from "./signIn.styles.js";
import React, { useState } from "react";
import EmailVerifyButton from "@/components/ui/EmailVerifyButton.jsx";

function BusinessSignIn() {
  // 1: name/number/company, 2: email/password/businessNo
  const [step, setStep] = useState(1);

  const {
    form,
    setForm,
    error,
    isLoading,
    handleOnChange,
    handleSubmit,
    onTabChange,
  } = useSignForm({
    name: "",
    phone: "",
    companyName: "",
    email: "",
    password: "",
    businessNumber: "",
  });

  return (
    <S.Container>
      <S.HeaderTag>Sign up</S.HeaderTag>
      <S.Form onSubmit={handleSubmit}>
        <S.InputGroup>
          <S.Label>Name</S.Label>
          <S.Input
            type="name"
            name="name"
            value={form.name}
            onChange={handleOnChange}
            placeholder="Enter Your Name"
            $error={!!error.name}
          />
          <S.ErrorText $visible={!!error.name}>{error.name || ""}</S.ErrorText>
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>Phone Number</S.Label>
          <S.Input
            type="phone"
            name="phone"
            value={form.phone}
            onChange={handleOnChange}
            placeholder="Enter Your Phone Number"
            $error={!!error.phone}
          />
          <S.ErrorText $visible={!!error.phone}>
            {error.phone || ""}
          </S.ErrorText>
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>Company</S.Label>
          <S.Input
            type="companyName"
            name="companyName"
            value={form.companyName}
            onChange={handleOnChange}
            placeholder="Enter Your Company"
            $error={!!error.companyName}
          />
          <S.ErrorText $visible={!!error.companyName}>
            {error.companyName || ""}
          </S.ErrorText>
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>Company Email</S.Label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <S.Input
              type="text"
              name="email"
              value={form.email}
              onChange={handleOnChange}
              placeholder="Enter Your Email"
              $error={!!error.email}
              style={{ width: "500px" }}
            />
            <EmailVerifyButton email={form.email} />
          </div>
          <S.ErrorText $visible={!!error.email}>
            {error.email || ""}
          </S.ErrorText>
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>Password</S.Label>
          <S.Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleOnChange}
            placeholder="Enter Your Password"
            $error={!!error.password}
          />
          <S.ErrorText $visible={!!error.password}>
            {error.password || ""}
          </S.ErrorText>
        </S.InputGroup>

        <S.InputGroup>
          <S.Label>Business Number</S.Label>
          <S.Input
            type="businessNumber"
            name="businessNumber"
            value={form.businessNumber}
            onChange={handleOnChange}
            placeholder="Enter Your Business Number"
            $error={!!error.businessNumber}
          />
          <S.ErrorText $visible={!!error.businessNumber}>
            {error.businessNumber || ""}
          </S.ErrorText>
        </S.InputGroup>

        <S.SignButton
          type="submit"
          disabled={isLoading}
          $bgcolor={"#FFAB03"}
          $textColor={"#F0F0F0"}
          onClick={handleSubmit}
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </S.SignButton>

        <S.BottomText>
          already have an account?{" "}
          <S.Span onClick={() => onTabChange("/")}>Log In →</S.Span>
        </S.BottomText>
      </S.Form>
    </S.Container>
  );
}

export default BusinessSignIn;
