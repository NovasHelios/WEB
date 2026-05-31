import useSignForm from "./useSignForm.js";
import * as S from "./signIn.styles.js";
import React, { useState } from "react";
import EmailVerifyButton from "@/components/ui/EmailVerifyButton.jsx";



function BusinessSignIn() {
  // 1: name/number/company, 2: email/password/businessNo
  const [step, setStep] = useState(1);

  const { form, setForm, error, isLoading, handleOnChange, handleSubmit, onTabChange } = useSignForm({
    name: "",
    pNumber: "",
    cName: "",
    cEmail: "",
    password: "",
    businessNumber: "",
  });

  return (
    <S.Container>
      <S.HeaderTag>Sign up</S.HeaderTag>
      <S.Form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <S.InputGroup>
              
            </S.InputGroup>
          </>
        )}

        {step === 2 && (
          <>
            <S.InputGroup>
              <S.Label>Company Email</S.Label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <S.Input
                  type="text"
                  name="cEmail"
                  value={form.cEmail}
                  onChange={handleOnChange}
                  placeholder="Enter Your Email"
                  $error={!!error.cEmail}
                  style={{ width: "500px" }}
                />
                <EmailVerifyButton />
              </div>
              <S.ErrorText $visible={!!error.cEmail}>
                {error.cEmail || ""}
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
          </>
        )}

        <S.DotWrapper>
          <S.Dot onClick={() => setStep(1)} $active={step === 1} />
          <S.Dot onClick={() => setStep(2)} $active={step === 2} />
        </S.DotWrapper>

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
