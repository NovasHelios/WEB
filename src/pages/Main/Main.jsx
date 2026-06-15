import { useState } from "react";
import Map from "./Map";
import NavBar from "../../components/layout/box/NavBar";

function Main() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw" }}>
      <NavBar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <Map sidebarOpen={sidebarOpen} />
      </div>
    </div>
  );
}

export default Main;
