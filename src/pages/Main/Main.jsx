import { useState } from "react";
import SideBar from "../../components/layout/box/SideBar";
import NavBar from "../../components/layout/box/NavBar";

function Main() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen w-screen">
      <NavBar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex flex-1 overflow-hidden">
        <SideBar expanded={sidebarOpen} />
        <div className="flex-1">{/* 메인 컨텐츠 */}</div>
      </div>
    </div>
  );
}

export default Main;
