const NavBar = ({ onToggleSidebar }) => {
  return (
    <div
      className="flex items-center px-4 gap-4 h-14 flex-shrink-0"
      style={{ backgroundColor: "#FFAB03" }}
    >
      {/* 햄버거 */}
      <button
        onClick={onToggleSidebar}
        className="flex flex-col gap-1.5 p-1"
      >
        <span className="block w-6 h-0.5 bg-black" />
        <span className="block w-6 h-0.5 bg-black" />
        <span className="block w-6 h-0.5 bg-black" />
      </button>

      {/* 로고 */}
      <span className="font-bold text-xl">Helios</span>

      {/* 검색창 */}
      <div className="flex items-center bg-white rounded-full px-4 py-1.5 flex-1 max-w-md gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input type="text" placeholder="주소 검색" className="outline-none w-full text-sm" />
      </div>

      <div className="flex-1" />

      {/* 로그인 버튼 */}
      <button className="border border-black rounded-lg px-4 py-1 font-semibold text-sm">
        로그인
      </button>
    </div>
  );
};

export default NavBar;
