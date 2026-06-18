import { useNavigate } from "react-router-dom";
import homeIcon from "@/images/icon/Home.png";
import businessIcon from "@/images/icon/Search.png";
import landIcon from "@/images/icon/Field.png";
import settingIcon from "@/images/icon/Settings.png";
import chatIcon from "@/images/icon/Chat.png";
import profileIcon from "@/images/icon/Profile.png";

const NavItem = ({ icon, label, onClick, expanded }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-start bg-white rounded-2xl p-3 font-bold text-black text-lg hover:opacity-90 w-full gap-3"
  >
    <img src={icon} alt={label} className="w-6 h-6 object-contain flex-shrink-0" />
    <span style={{ overflow: "hidden", maxWidth: expanded ? "200px" : "0px", opacity: expanded ? 1 : 0, transition: "max-width 0.3s, opacity 0.3s", whiteSpace: "nowrap" }}>{label}</span>
  </button>
);

const SideBar = ({ expanded }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col justify-between h-full px-3 py-6"
      style={{ backgroundColor: "#FFAB03", width: expanded ? "180px" : "72px", transition: "width 0.3s" }}
    >
      <div className="flex flex-col gap-3">
        <NavItem icon={homeIcon} label="Home" onClick={() => navigate("/")} expanded={expanded} />
        <NavItem icon={businessIcon} label="Business" onClick={() => navigate("/business")} expanded={expanded} />
        <NavItem icon={landIcon} label="Land" onClick={() => navigate("/land")} expanded={expanded} />
        <div className="mt-16 flex flex-col gap-3">
          <NavItem icon={settingIcon} label="Setting" onClick={() => navigate("/setting")} expanded={expanded} />
          <NavItem icon={chatIcon} label="Chating" onClick={() => navigate("/chat")} expanded={expanded} />
            <NavItem icon={profileIcon} label="Profile" onClick={() => navigate("/profile")} expanded={expanded} />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
