import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Api } from "@/contents/apiEndpoints";
import EmailVerifyButton from "@/components/ui/EmailVerifyButton.jsx";
import logoImage from "@/images/logo.png";
import {
  BottomLink,
  BottomText,
  Card,
  Divider,
  EmailInputWrap,
  EmailRow,
  ErrorMessage,
  Form,
  GoogleButton,
  GoogleRow,
  Input,
  InputGroup,
  Label,
  LogoImage,
  LogoWrap,
  Page,
  Row,
  SubmitButton,
  Title,
} from "./Signin_2.styles";

const parseResponseBody = async (response) => {
  // 서버 응답이 JSON이 아닐 수도 있어서 안전하게 파싱합니다.
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
};

const getSignupErrorMessage = (data, status) => {
  // 서버 응답 구조가 달라도 실제 메시지 후보를 한 번에 정리합니다.
  const rawMessage =
    data?.message ||
    data?.data?.message ||
    data?.error ||
    data?.data?.error ||
    "";

  const message = String(rawMessage);
  const normalizedMessage = message.toLowerCase();

  // 이미 가입된 이메일은 사용자에게 바로 이해되는 문구로 표시합니다.
  if (
    status === 409 ||
    normalizedMessage.includes("duplicate") ||
    normalizedMessage.includes("already") ||
    normalizedMessage.includes("exist") ||
    message.includes("이미") ||
    message.includes("중복")
  ) {
    return "이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.";
  }

  return message || "회원가입에 실패했습니다. 입력 정보를 다시 확인해주세요.";
};

function Signin_2() {
  const navigate = useNavigate();
  const location = useLocation();
  // 상위 화면에서 전달한 가입 역할을 유지
  const role = location.state?.role ?? "USER";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    // 입력값을 하나씩 상태에 반영
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 필수 입력값 확인
    if (!form.name || !form.phone || !form.email || !form.password || !form.passwordConfirm) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }

    // 비밀번호 확인 검증
    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 이메일 형식 검증
    if (form.email.includes("@") === false) {
      setError("email 형식에 맞지 않습니다.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(Api.SignUp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 서버가 요구하는 필수 필드만 전송
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
          phone: form.phone,
          role,
        }),
      });

      const data = await parseResponseBody(response);

      if (!response.ok || data?.success === false) {
        throw new Error(getSignupErrorMessage(data, response.status));
      }

      navigate("/login");
    } catch (err) {
      setError(err.message || "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = Api.googleLogin;
  };

  return (
    <Page>
      <LogoWrap>
        {/* 로고 클릭 시 홈 화면으로 돌아갑니다. */}
        <button type="button" onClick={() => navigate("/")}>
          <LogoImage src={logoImage} alt="helios" />
        </button>
      </LogoWrap>

      <Card>
        <Title>기본 정보</Title>
        <Divider />

        <Form onSubmit={handleSubmit}>
          {/* 이메일 인증과 연결되는 기본 입력 영역 */}
          <InputGroup>
            <Label>이메일</Label>
            <EmailRow>
              <EmailInputWrap>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@landregister.com"
                />
              </EmailInputWrap>
              <EmailVerifyButton email={form.email} onError={setError} />
            </EmailRow>
          </InputGroup>

          <Row>
            {/* 비밀번호와 확인 입력은 한 줄에 배치 */}
            <InputGroup>
              <Label>비밀번호</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="8자 이상 특수문자 포함"
              />
            </InputGroup>

            <InputGroup>
              <Label>비밀번호 확인</Label>
              <Input
                type="password"
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호 재입력"
              />
            </InputGroup>
          </Row>

          {/* 이름과 휴대폰은 별도 입력으로 분리 */}
          <InputGroup>
            <Label>이름</Label>
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="실명 입력"
            />
          </InputGroup>

          <InputGroup>
            <Label>휴대폰 번호</Label>
            <Input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="- 없이 숫자만 입력"
            />
          </InputGroup>

          {error ? <ErrorMessage>{error}</ErrorMessage> : null}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "처리 중..." : "가입 완료하기"}
          </SubmitButton>

          <GoogleRow>
            <GoogleButton type="button" onClick={handleGoogleLogin}>
              G Google
            </GoogleButton>
          </GoogleRow>

          <BottomText>
            이미 계정이 있으신가요?{" "}
            <BottomLink type="button" onClick={() => navigate("/login")}>
              로그인 →
            </BottomLink>
          </BottomText>
        </Form>
      </Card>
    </Page>
  );
}

export default Signin_2;
