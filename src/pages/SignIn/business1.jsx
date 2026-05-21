import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as S from "./signIn.styles";

function BusinessSignIn1() {
    const [form, setForm] = useState({
        name: "",
        pNumber: "",
        cName: "",
    })

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

      setIsLoading(true);
      setError("");
    };

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
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>Phone Number</S.Label>
            <S.Input
              type="pNumber"
              name="pNumber"
              value={form.pNumber}
              onChange={handleOnChange}
              placeholder="Enter Your Phone Number"
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>Company</S.Label>
            <S.Input
              type="cName"
              name="cName"
              value={form.cName}
              onChange={handleOnChange}
              placeholder="Enter Your Company"
            />
          </S.InputGroup>

          <S.DotWrapper>
            <S.Dot
              onClick={() => navigate("/signup/business")}
              $active={location.pathname === "/signup/business"}
            />
            <S.Dot
              onClick={() => navigate("/signup/business/2")}
              $active={location.pathname === "/signup/business/2"}
            />
          </S.DotWrapper>

          <S.SignButton
            type="submit"
            disabled={isLoading}
            $bgcolor={"#FFAB03"}
            $textColor={"#F0F0F0"}
            onClick={() => navigate("/signup/business/2")}
          >
            {isLoading ? "Loading..." : "Sign Up"}
          </S.SignButton>

          <S.BottomText>
            already have an account?{" "}
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>Log In →</span>
          </S.BottomText>
        </S.Form>
      </S.Container>
    );
}

export default BusinessSignIn1;