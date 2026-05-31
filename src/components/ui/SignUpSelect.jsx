import { useNavigate } from "react-router-dom";
import handshakeIcon from "../../images/icon/Handshake.png";
import profileIcon from "../../images/icon/Profile.png";

const SignUpSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-10 w-[480px] shadow-xl flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Helios</h1>
      <p className="text-gray-500 mb-2">Create account with...</p>

      <button
        onClick={() => navigate("/signup/business", { state: { role: "COMPANY" } })}
        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-lg"
        style={{ backgroundColor: "#FFAB03" }}
      >
        <img src={handshakeIcon} alt="Business" className="w-6 h-6 object-contain" />
        Sign up as Business
      </button>

      <button
        onClick={() => navigate("/signup/individual", { state: { role: "USER" } })}
        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-lg"
        style={{ backgroundColor: "#FFAB03" }}
      >
        <img src={profileIcon} alt="Individual" className="w-6 h-6 object-contain" />
        Sign up as Individual
      </button>
    </div>
  );
};

export default SignUpSelect;
