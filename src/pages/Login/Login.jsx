import LoginForm from "./components/LoginForm";
import bgimg from "./images/bgimg.png";

function Login() {
  return (
    <div
      className="login"
      style={{
        backgroundImage: `url(${bgimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
      }}
    >
      <LoginForm />
    </div>
  );
}

export default Login;