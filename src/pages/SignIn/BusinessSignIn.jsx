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
              <S.Label>Name</S.Label>
              <S.Input
                type="name"
                name="name"
                value={form.name}
                onChange={handleOnChange}
                placeholder="Enter Your Name"
                $error={!!error.name}
              />
              <S.ErrorText $visible={!!error.name}>
                {error.name || ""}
              </S.ErrorText>
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>Phone Number</S.Label>
              <S.Input
                type="pNumber"
                name="pNumber"
                value={form.pNumber}
                onChange={handleOnChange}
                placeholder="Enter Your Phone Number"
                $error={!!error.pNumber}
              />
              <S.ErrorText $visible={!!error.pNumber}>
                {error.pNumber || ""}
              </S.ErrorText>
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>Company</S.Label>
              <S.Input
                type="cName"
                name="cName"
                value={form.cName}
                onChange={handleOnChange}
                placeholder="Enter Your Company"
                $error={!!error.cName}
              />
              <S.ErrorText $visible={!!error.cName}>
                {error.cName || ""}
              </S.ErrorText>
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
