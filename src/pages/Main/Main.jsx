import SideBar from "../../components/layout/box/SideBar";

function Main() {
  return (
    <div className="flex h-screen w-screen">
      <SideBar />
      <div className="flex-1">{/* 메인 컨텐츠 */}</div>
    </div>
  );
}

export default Main;
