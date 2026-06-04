import { useNavigate } from "react-router-dom";
import homeIcon from "@/images/icon/Home.png";
import businessIcon from "../../../images/icon/Search.png";
import landIcon from "../../../images/icon/Field.png";
import settingIcon from "../../../images/icon/Settings.png";
import logoutIcon from "../../../images/icon/Logout.png";
import chatIcon from "../../../images/icon/Chat.png";

const NavItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between bg-white rounded-2xl p-3 font-bold text-black text-lg hover:opacity-90 transition-all w-full"
  >
    <img src={icon} alt={label} className="w-6 h-6 object-contain flex-shrink-0" />
    <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-300">
      {label}
    </span>
  </button>
);

const SideBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  return (
    <div
      className="group flex flex-col justify-between h-full px-3 py-6 transition-all duration-300"
      style={{ backgroundColor: "#FFAB03", width: "72px" }}
      onMouseEnter={e => e.currentTarget.style.width = "200px"}
      onMouseLeave={e => e.currentTarget.style.width = "72px"}
    >
      {/* 상단 메뉴 */}
      <div className="flex flex-col gap-3">
        <NavItem icon={homeIcon} label="Home" onClick={() => navigate("/main")} />
        <NavItem icon={businessIcon} label="Business" onClick={() => navigate("/business")} />
        <NavItem icon={landIcon} label="Land" onClick={() => navigate("/land")} />
        <div className="mt-16 flex flex-col gap-3">
          <NavItem icon={settingIcon} label="Setting" onClick={() => navigate("/setting")} />
          <NavItem icon={chatIcon} label="Chating" onClick={() => navigate("/chat")} />
        </div>
      </div>

      {/* 로그아웃 */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-between bg-white rounded-2xl p-3 w-full hover:opacity-90 transition-all"
      >
        <img src={logoutIcon} alt="Log Out" className="w-6 h-6 object-contain flex-shrink-0" />
        <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-300 font-bold text-red-500 text-lg">
          Log Out
        </span>
      </button>
    </div>
  );
};

export default SideBar;
