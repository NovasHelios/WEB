import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
import {
  SettingsActions,
  SettingsButton,
  SettingsCard,
  SettingsDescription,
  SettingsIconBox,
  SettingsPage,
  SettingsShell,
  SettingsTitle,
} from "./SettingsComingSoon.styles";

function SettingsComingSoon() {
  // 개발중 페이지에서 다른 화면으로 이동할 수 있게 합니다.
  const navigate = useNavigate();

  return (
    <SettingsPage>
      {/* 공통 상단 네비게이션입니다. */}
      <NavBar
        keyword=""
        onChangeKeyword={() => {}}
        onSearch={() => {}}
        isSuggestionOpen={false}
        regionSuggestions={[]}
      />

      <SettingsShell>
        <SettingsCard>
          {/* 설정 기능 개발중 안내입니다. */}
          <SettingsIconBox>
            <Settings size={42} strokeWidth={1.8} />
          </SettingsIconBox>

          <SettingsTitle>설정은 아직 개발중입니다</SettingsTitle>
          <SettingsDescription>
            계정 설정, 알림 설정, 서비스 환경 설정을 한곳에서 관리할 수 있도록 준비하고 있습니다.
            기능이 확정되면 이 화면에서 설정 메뉴를 사용할 수 있습니다.
          </SettingsDescription>

          {/* 사용자가 막히지 않도록 주요 화면 이동 버튼을 제공합니다. */}
          <SettingsActions>
            <SettingsButton type="button" $variant="outline" onClick={() => navigate("/")}>
              지도 검색으로 이동
            </SettingsButton>
            <SettingsButton type="button" onClick={() => navigate("/profile")}>
              프로필로 이동
            </SettingsButton>
          </SettingsActions>
        </SettingsCard>
      </SettingsShell>
    </SettingsPage>
  );
}

export default SettingsComingSoon;
