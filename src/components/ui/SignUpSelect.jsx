import { useNavigate } from "react-router-dom";

const SignUpSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-10 w-[480px] shadow-xl flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Helios</h1>
      <p className="text-gray-500 mb-2">Create account with...</p>

      <button
        onClick={() => navigate("/signup/business")}
        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-lg"
        style={{ backgroundColor: "#FFAB03" }}
      >
        <span className="text-2xl">🤝</span>
        Sign up as Business
      </button>

      <button
        onClick={() => navigate("/signup/individual")}
        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-lg"
        style={{ backgroundColor: "#FFAB03" }}
      >
        <span className="text-2xl">👤</span>
        Sign up as Individual
      </button>
    </div>
  );
};

export default SignUpSelect;
