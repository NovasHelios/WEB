import { useState } from "react";
import { Wrench } from "lucide-react";
import SideBar from "@/components/layout/box/SideBar";
import NavBar from "@/components/layout/box/NavBar";

function DevelopmentNotice() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? "180px" : "72px";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", zIndex: 30 }}>
        <NavBar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          keyword=""
          onChangeKeyword={() => {}}
          onSearch={() => {}}
          isSuggestionOpen={false}
          regionSuggestions={[]}
        />
      </div>

      <div
        style={{
          position: "fixed",
          left: 0,
          top: "56px",
          bottom: 0,
          zIndex: 20,
          width: sidebarWidth,
          transition: "width 0.3s",
        }}
      >
        <SideBar expanded={sidebarOpen} />
      </div>

      <main
        style={{
          width: "100%",
          height: "calc(100vh - 56px)",
          marginLeft: sidebarWidth,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          transition: "margin-left 0.3s",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            transform: "translateY(-18px)",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
              boxSizing: "border-box",
            }}
          >
            <Wrench size={76} strokeWidth={2.2} color="#000" />
          </div>

          <h1
            style={{
              margin: "-6px 0 0",
              fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.06em",
              fontWeight: 900,
              color: "#000",
              textAlign: "center",
            }}
          >
            개발중 입니다.
          </h1>
        </div>
      </main>
    </div>
  );
}

export default DevelopmentNotice;
