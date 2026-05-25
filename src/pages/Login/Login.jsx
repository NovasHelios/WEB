import LoginForm from "./components/LoginForm";
import bgimg from "../../images/HeliosBackground.png";

function Login() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-center bg-cover"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      <LoginForm />
    </div>
  );
}

export default Login;