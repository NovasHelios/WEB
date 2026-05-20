import LoginForm from "./components/LoginForm";
import bgimg from "./images/bgimg.png";

function Login() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgimg})` }}
    >
      <LoginForm />
    </div>
  );
}

export default Login;