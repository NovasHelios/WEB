import styled from "styled-components";
import LoginForm from "./component/LoginForm";
import bgimg from "./images/bgimg.png";

const Background = styled.div`
  background-image: url(${bgimg});
  background-size: cover;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Login() {
  return (
    <Background>
      <LoginForm />
    </Background>
  );
}

export default Login;