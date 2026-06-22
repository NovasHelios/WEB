const NavBar = ({
  onToggleSidebar,
  keyword,
  onChangeKeyword,
  onSearch,

  // 검색창 아래에 붙일 추천 리스트 관련 props
  isSuggestionOpen,
  regionSuggestions = [],
  onCloseSuggestions,
  onSuggestionClick,
  normalizeSido,
}) => {
  const sidoName = normalizeSido?.(keyword) || keyword;

  return (
    <div
      className="flex items-center flex-shrink-0 gap-4 px-4 h-14"
      style={{ backgroundColor: "#FFAB03" }}
    >
      <button onClick={onToggleSidebar} className="flex flex-col gap-1.5 p-1">
        <span className="block w-6 h-0.5 bg-black" />
        <span className="block w-6 h-0.5 bg-black" />
        <span className="block w-6 h-0.5 bg-black" />
      </button>


      <span className="font-bold text-xl">Helios</span>


      {/* 검색창과 추천 리스트를 같은 relative 박스 안에 넣어야 서로 붙음 */}
      <div className="relative flex-1 max-w-md">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
          className={`flex items-center bg-white px-4 py-1.5 gap-2 ${
            isSuggestionOpen ? "rounded-t-3xl rounded-b-none" : "rounded-full"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>

          <input
            type="text"
            placeholder="주소 검색"
            className="outline-none w-full text-sm"
            value={keyword}
            onChange={(event) => onChangeKeyword(event.target.value)}
          />

          {isSuggestionOpen && (
            <button
              type="button"
              onClick={onCloseSuggestions}
              className="text-gray-400 text-lg leading-none"
            >
              ×
            </button>
          )}
        </form>

        {/* 검색창 바로 아래에 붙는 자동완성 리스트 */}
        {isSuggestionOpen && (
          <div className="absolute left-0 right-0 top-full z-50 bg-white border-t border-gray-100 rounded-b-2xl shadow-lg overflow-hidden">
            <div className="px-4 py-2 text-sm text-gray-900">
              지역{" "}
              <strong className="text-green-600">
                {regionSuggestions.length}
              </strong>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {regionSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onSuggestionClick(suggestion)}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                >
                  <span className="font-semibold text-green-600">
                    {sidoName}
                  </span>
                  <span className="font-medium text-gray-900">
                    {suggestion.replace(sidoName, "")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" />

      <button className="border border-black rounded-lg px-4 py-1 font-semibold text-sm">
        로그인
      </button>
    </div>
  );
};

export default NavBar;
