// 라우터 이동 기능을 사용하기 위한 훅입니다.
import { useNavigate } from "react-router-dom";

// 로그인 토큰 확인을 위한 인증 유틸입니다.
import { getValidAccessToken } from "@/lib/auth";

// 상단 메뉴에 사용할 아이콘입니다.
import {
  Heart,
  Handshake,
  Map,
  MessageSquare,
  Mountain,
  UserCircle,
  Search,
  Settings,
} from "lucide-react";

// 새 홈 화면 상단 로고 이미지입니다.
import heliosLogo from "@/images/logo.png";

const NavBar = ({
  // 검색창에 입력된 키워드입니다.
  keyword,

  // 검색창 입력값 변경 함수입니다.
  onChangeKeyword,

  // 검색 실행 함수입니다.
  onSearch,

  // 추천 목록 표시 여부입니다.
  isSuggestionOpen,

  // 추천 지역 목록입니다.
  regionSuggestions = [],

  // 추천 목록 닫기 함수입니다.
  onCloseSuggestions,

  // 추천 지역 클릭 함수입니다.
  onSuggestionClick,

  // 시도 이름 정규화 함수입니다.
  normalizeSido,
}) => {
  // 페이지 이동을 위해 navigate를 준비합니다.
  const navigate = useNavigate();

  // 추천 리스트에서 강조할 시도명을 계산합니다.
  const sidoName = normalizeSido?.(keyword) || keyword;

  // 현재 로그인 상태를 확인합니다.
  const isLoggedIn = Boolean(getValidAccessToken());

  // 프로필 버튼을 눌렀을 때 로그인 상태에 따라 이동합니다.
  const handleProfileClick = () => {
    // 로그인 상태이면 프로필 페이지로 이동합니다.
    if (isLoggedIn) {
      navigate("/profile");
      return;
    }

    // 비로그인 상태이면 로그인 페이지로 이동합니다.
    navigate("/login");
  };

  // 아직 기능이 없는 상단 메뉴는 화면 디자인만 유지합니다.
  const menuItems = [
    { label: "지도 검색", icon: Map, url: "/" },
    { label: "내 공간", icon: Mountain, url: "/space" },
    { label: "관심 토지", icon: Heart, url: "/land/favorites" },
    { label: "사업 연결", icon: Handshake, url: "/business-connections" },
  ];

  return (
    // 시안처럼 흰색 상단 헤더를 고정 높이로 구성합니다.
    <header className="flex h-[72px] w-full items-center justify-between border-b border-[#e8e1cf] bg-white px-5">
      {/* 왼쪽 로고 영역입니다. */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="flex items-center h-full"
        aria-label="홈으로 이동"
      >
        {/* 첨부한 helios 로고 이미지를 표시합니다. */}
        <img
          src={heliosLogo}
          alt="helios"
          className="object-contain w-auto h-10"
        />
      </button>

      {/* 가운데 검색창과 추천 리스트 영역입니다. */}
      <div className="relative ml-8 mr-auto w-[448px] max-w-[36vw]">
        {/* 검색 form은 기존 검색 기능과 연결합니다. */}
        <form
          onSubmit={(event) => {
            // form 기본 새로고침을 막습니다.
            event.preventDefault();

            // 기존 주소 검색 함수를 실행합니다.
            onSearch();
          }}
          className="flex h-[38px] items-center gap-3 bg-[#f4f2f2] px-4"
        >
          {/* 검색 아이콘입니다. */}
          <Search className="h-4 w-4 text-[#d49f00]" strokeWidth={2.2} />

          {/* 검색어 입력 필드입니다. */}
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="h-full w-full bg-transparent text-sm text-[#333333] outline-none placeholder:text-[#8a8a8a]"
            value={keyword}
            onChange={(event) => onChangeKeyword(event.target.value)}
          />

          {/* 추천 목록이 열렸을 때 닫기 버튼을 표시합니다. */}
          {isSuggestionOpen && (
            <button
              type="button"
              onClick={onCloseSuggestions}
              className="text-lg leading-none text-gray-400"
              aria-label="검색 추천 닫기"
            >
              ×
            </button>
          )}
        </form>

        {/* 검색창 바로 아래 추천 리스트입니다. */}
        {isSuggestionOpen && (
          <div className="absolute left-0 right-0 z-50 overflow-hidden bg-white shadow-lg top-full">
            {/* 추천 결과 개수 표시입니다. */}
            <div className="px-4 py-2 text-sm text-gray-900">
              지역{" "}
              <strong className="text-[#d49f00]">
                {regionSuggestions.length}
              </strong>
            </div>

            {/* 추천 결과 목록입니다. */}
            <div className="overflow-y-auto max-h-72">
              {regionSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onSuggestionClick(suggestion)}
                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                >
                  {/* 시도명 부분입니다. */}
                  <span className="font-semibold text-[#d49f00]">
                    {sidoName}
                  </span>

                  {/* 시도명을 제외한 나머지 주소 부분입니다. */}
                  <span className="font-medium text-gray-900">
                    {suggestion.replace(sidoName, "")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 오른쪽 메뉴 영역입니다. */}
      <nav className="flex h-full items-center gap-7 text-sm font-medium text-[#555555]">
        {/* 아직 연결되지 않은 기능들은 버튼 UI만 둡니다. */}
        {menuItems.map(({ label, icon: Icon, url }) => (
          <button
            key={label}
            type="button"
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={() => {
              // 상단 메뉴는 SPA 라우터로 화면을 이동합니다.
              if (url) navigate(url);
            }}
          >
            {/* 메뉴별 아이콘입니다. */}
            <Icon className="h-4 w-4 text-[#555555]" strokeWidth={1.9} />

            {/* 메뉴 텍스트입니다. */}
            <span>{label}</span>
          </button>
        ))}

        {/* 메뉴와 설정 영역을 나누는 구분선입니다. */}
        <div className="h-9 w-px bg-[#d8cfba]" />

        {/* 채팅 버튼은 채팅 목록 화면으로 이동합니다. */}
        <button
          type="button"
          onClick={() => navigate(isLoggedIn ? "/chat" : "/login")}
          className="flex items-center justify-center h-9 w-9"
          aria-label="채팅"
        >
          <MessageSquare className="h-5 w-5 text-[#555555]" strokeWidth={1.9} />
        </button>

        {/* 설정 버튼은 개발중 안내 화면으로 이동합니다. */}
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="flex items-center justify-center h-9 w-9"
          aria-label="설정"
        >
          <Settings className="h-5 w-5 text-[#555555]" strokeWidth={1.9} />
        </button>

        {/* 프로필 버튼은 로그인 상태에 따라 프로필 또는 로그인으로 이동합니다. */}
        <button
          type="button"
          onClick={handleProfileClick}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8cfba] bg-[#f8f8f8] text-[#777777]"
          aria-label="프로필"
        >
          <UserCircle className="h-5 w-5" strokeWidth={1.9} />
        </button>
      </nav>
    </header>
  );
};

export default NavBar;
