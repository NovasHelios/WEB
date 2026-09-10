// 라우터 이동 기능과 현재 경로 확인을 위한 훅입니다.
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// 로그인 토큰 확인을 위한 인증 유틸입니다.
import {
  authFetch,
  getStoredUserDisplayName,
  getValidAccessToken,
  setStoredUserDisplayName,
  USER_DISPLAY_NAME_CHANGED_EVENT,
} from "@/lib/auth";
import { Api } from "@/contents/apiEndpoints";

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

const formatDisplayName = (value) => {
  // 이메일이 내려오면 @ 앞부분만 사용해 navbar 폭을 안정화합니다.
  const name = String(value || "").trim();
  if (!name) return "";
  return name.includes("@") ? name.split("@")[0] : name;
};

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
  const { pathname } = useLocation();

  // 추천 리스트에서 강조할 시도명을 계산합니다.
  const sidoName = normalizeSido?.(keyword) || keyword;

  // 현재 로그인 상태를 확인합니다.
  const isLoggedIn = Boolean(getValidAccessToken());
  const [displayName, setDisplayName] = useState(() => formatDisplayName(getStoredUserDisplayName()));

  useEffect(() => {
    const handleDisplayNameChange = (event) => {
      // 프로필 수정 직후 navbar 이름을 즉시 갱신합니다.
      setDisplayName(formatDisplayName(event.detail || getStoredUserDisplayName()));
    };

    window.addEventListener(USER_DISPLAY_NAME_CHANGED_EVENT, handleDisplayNameChange);

    const fetchUserName = async () => {
      // 로그인 상태일 때만 사용자 이름을 가져옵니다.
      if (!isLoggedIn) {
        setDisplayName("");
        return;
      }

      try {
        const response = await authFetch(Api.MyProfile, { method: "GET" });
        const data = await response.json();

        if (!response.ok) {
          setDisplayName("");
          return;
        }

        const nextDisplayName = formatDisplayName(data?.data?.name || data?.data?.email);
        setDisplayName(nextDisplayName);
        setStoredUserDisplayName(nextDisplayName);
      } catch {
        setDisplayName("");
      }
    };

    void fetchUserName();

    return () => {
      window.removeEventListener(USER_DISPLAY_NAME_CHANGED_EVENT, handleDisplayNameChange);
    };
  }, [isLoggedIn]);

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

  // 현재 페이지와 연결되는 상단 메뉴 목록입니다.
  const menuItems = [
    { label: "지도 검색", icon: Map, url: "/", activePaths: ["/", "/land"] },
    {
      label: "내 공간",
      icon: Mountain,
      url: "/space",
      activePaths: ["/space", "/land/register"],
    },
    { label: "관심 토지", icon: Heart, url: "/land/favorites", activePaths: ["/land/favorites"] },
    {
      label: "사업 연결",
      icon: Handshake,
      url: "/business-connections",
      activePaths: ["/business-connections"],
    },
  ];

  const isMenuActive = (activePaths) => {
    // 등록 단계처럼 하위 경로가 있는 페이지도 같은 메뉴로 표시합니다.
    return activePaths.some((path) => {
      if (pathname === path) return true;

      // 지도 검색용 /land는 관심 토지 하위 경로와 겹치지 않게 정확히 일치할 때만 씁니다.
      if (path === "/" || path === "/land") return false;

      return pathname.startsWith(`${path}/`);
    });
  };

  const isChatActive = pathname === "/chat";
  const isSettingsActive = pathname === "/settings";
  const isProfileActive = pathname === "/profile";

  return (
    <>
      {/* navbar는 화면 기준 좌표에 고정하고, 아래 spacer로 본문 겹침을 막습니다. */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-[72px] w-full min-w-0 flex-shrink-0 items-center border-b border-[#e8e1cf] bg-white px-5">
        {/* 왼쪽 로고 영역입니다. */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex h-full flex-shrink-0 items-center"
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
        <div className="relative ml-8 mr-auto w-[448px] max-w-[36vw] flex-shrink min-w-[260px]">
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
        <nav className="flex h-full flex-shrink-0 items-center gap-7 text-sm font-medium text-[#555555]">
          {/* 현재 페이지와 일치하는 메뉴는 색상과 밑줄로 표시합니다. */}
          {menuItems.map(({ label, icon: Icon, url, activePaths }) => {
            const active = isMenuActive(activePaths);

            return (
            <button
              key={label}
              type="button"
              className={`relative flex h-full items-center gap-2 whitespace-nowrap border-b-2 transition-colors ${
                active
                  ? "border-[#d49f00] text-[#a87900]"
                  : "border-transparent text-[#555555] hover:text-[#a87900]"
              }`}
              aria-current={active ? "page" : undefined}
              onClick={() => {
                // 상단 메뉴는 SPA 라우터로 화면을 이동합니다.
                if (url) navigate(url);
              }}
            >
              {/* 메뉴별 아이콘입니다. */}
              <Icon className={`h-4 w-4 ${active ? "text-[#a87900]" : "text-[#555555]"}`} strokeWidth={1.9} />

              {/* 메뉴 텍스트입니다. */}
              <span>{label}</span>
            </button>
            );
          })}

          {/* 메뉴와 설정 영역을 나누는 구분선입니다. */}
          <div className="h-9 w-px bg-[#d8cfba]" />

          {/* 채팅 버튼은 채팅 목록 화면으로 이동합니다. */}
          <button
            type="button"
            onClick={() => navigate(isLoggedIn ? "/chat" : "/login")}
            className={`flex h-9 w-9 items-center justify-center border-b-2 transition-colors ${
              isChatActive ? "border-[#d49f00] text-[#a87900]" : "border-transparent text-[#555555] hover:text-[#a87900]"
            }`}
            aria-label="채팅"
            aria-current={isChatActive ? "page" : undefined}
          >
            <MessageSquare className="h-5 w-5" strokeWidth={1.9} />
          </button>

          {/* 설정 버튼은 개발중 안내 화면으로 이동합니다. */}
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className={`flex h-9 w-9 items-center justify-center border-b-2 transition-colors ${
              isSettingsActive
                ? "border-[#d49f00] text-[#a87900]"
                : "border-transparent text-[#555555] hover:text-[#a87900]"
            }`}
            aria-label="설정"
            aria-current={isSettingsActive ? "page" : undefined}
          >
            <Settings className="h-5 w-5" strokeWidth={1.9} />
          </button>

          {/* 로그인 상태를 텍스트로 명확하게 표시합니다. */}
          <button
            type="button"
            onClick={handleProfileClick}
            className={`flex h-9 min-w-[82px] items-center justify-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors ${
              isProfileActive
                ? "border-[#d49f00] bg-[#fff7da] text-[#a87900]"
                : "border-[#d8cfba] bg-[#f8f8f8] text-[#5f4b20] hover:border-[#d49f00]"
            }`}
            aria-label={isLoggedIn ? "프로필" : "로그인"}
            aria-current={isProfileActive ? "page" : undefined}
          >
            {isLoggedIn ? (
              <span>{displayName ? `${displayName}님` : "내 프로필"}</span>
            ) : (
              <>
                <UserCircle className="h-5 w-5" strokeWidth={1.9} />
                <span>로그인</span>
              </>
            )}
          </button>
        </nav>
      </header>
      <div className="h-[72px] flex-shrink-0" aria-hidden="true" />
    </>
  );
};

export default NavBar;
