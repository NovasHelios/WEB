import { useNavigate } from "react-router-dom";
import homeIcon from "@/images/icon/Home.png";
import businessIcon from "@/images/icon/Search.png";
import landIcon from "@/images/icon/Field.png";
import settingIcon from "@/images/icon/Settings.png";
import logoutIcon from "@/images/icon/Logout.png";
import chatIcon from "@/images/icon/Chat.png";

const NavItem = ({ icon, label, onClick, expanded }) => (
  <button
    onClick={onClick}
    className="flex items-center bg-white rounded-2xl p-3 font-bold text-black text-lg hover:opacity-90 transition-all w-full gap-3"
  >
    <img src={icon} alt={label} className="w-6 h-6 object-contain flex-shrink-0" />
    {expanded && <span className="whitespace-nowrap">{label}</span>}
  </button>
);

const SideBar = ({ expanded }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  return (
    <div
      className="flex flex-col justify-between h-full px-3 py-6"
      style={{ backgroundColor: "#FFAB03", width: expanded ? "180px" : "72px", transition: "width 0.3s" }}
    >
      <div className="flex flex-col gap-3">
        <NavItem icon={homeIcon} label="Home" onClick={() => navigate("/main")} expanded={expanded} />
        <NavItem icon={businessIcon} label="Business" onClick={() => navigate("/business")} expanded={expanded} />
        <NavItem icon={landIcon} label="Land" onClick={() => navigate("/land")} expanded={expanded} />
        <div className="mt-16 flex flex-col gap-3">
          <NavItem icon={settingIcon} label="Setting" onClick={() => navigate("/setting")} expanded={expanded} />
          <NavItem icon={chatIcon} label="Chating" onClick={() => navigate("/chat")} expanded={expanded} />
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center bg-white rounded-2xl p-3 w-full hover:opacity-90 transition-all gap-3"
      >
        <img src={logoutIcon} alt="Log Out" className="w-6 h-6 object-contain flex-shrink-0" />
        {expanded && <span className="font-bold text-red-500 text-lg whitespace-nowrap">Log Out</span>}
      </button>
    </div>
  );
};

export default SideBar;
