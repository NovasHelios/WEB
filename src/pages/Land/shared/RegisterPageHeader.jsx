import {
  BellDot,
  Heart,
  HelpCircle,
  Home,
  Map,
  MapPinned,
  MessageSquareText,
  Search,
  Settings,
  UserCircle2,
} from "lucide-react";
import {
  RegisterHeader,
  RegisterHeaderActionButton,
  RegisterHeaderActions,
  RegisterHeaderDivider,
  RegisterHeaderLogo,
  RegisterHeaderLogoMark,
  RegisterHeaderNav,
  RegisterHeaderNavItem,
  RegisterHeaderNavList,
  RegisterHeaderSearch,
  RegisterHeaderSearchIcon,
  RegisterHeaderSearchInput,
  RegisterHeaderShell,
} from "../shared.styled";

function RegisterPageHeader() {
  return (
    <RegisterHeaderShell>
      <RegisterHeader>
        <RegisterHeaderLogo>
          <RegisterHeaderLogoMark>Logo</RegisterHeaderLogoMark>
        </RegisterHeaderLogo>

        <RegisterHeaderSearch>
          <RegisterHeaderSearchIcon>
            <Search size={16} strokeWidth={2.2} />
          </RegisterHeaderSearchIcon>
          <RegisterHeaderSearchInput placeholder="검색어를 입력하세요" />
        </RegisterHeaderSearch>

        <RegisterHeaderNav aria-label="주요 메뉴">
          <RegisterHeaderNavList>
            <RegisterHeaderNavItem>
              <Map size={16} strokeWidth={2} />
              지도 검색
            </RegisterHeaderNavItem>
            <RegisterHeaderNavItem>
              <Home size={16} strokeWidth={2} />
              내 공간
            </RegisterHeaderNavItem>
            <RegisterHeaderNavItem>
              <Heart size={16} strokeWidth={2} />
              관심 토지
            </RegisterHeaderNavItem>
            <RegisterHeaderNavItem>
              <MapPinned size={16} strokeWidth={2} />
              사업 연결
            </RegisterHeaderNavItem>
          </RegisterHeaderNavList>
        </RegisterHeaderNav>

        <RegisterHeaderActions>
          <RegisterHeaderDivider />
          <RegisterHeaderActionButton type="button" aria-label="알림">
            <MessageSquareText size={17} strokeWidth={2} />
            <span />
          </RegisterHeaderActionButton>
          <RegisterHeaderActionButton type="button" aria-label="설정">
            <Settings size={17} strokeWidth={2} />
          </RegisterHeaderActionButton>
          <RegisterHeaderActionButton type="button" aria-label="도움말">
            <HelpCircle size={17} strokeWidth={2} />
          </RegisterHeaderActionButton>
          <RegisterHeaderActionButton type="button" aria-label="프로필">
            <UserCircle2 size={22} strokeWidth={1.6} />
          </RegisterHeaderActionButton>
        </RegisterHeaderActions>
      </RegisterHeader>
    </RegisterHeaderShell>
  );
}

export default RegisterPageHeader;
