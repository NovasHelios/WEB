import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
import {
  ChatComingSoonActions,
  ChatComingSoonButton,
  ChatComingSoonCard,
  ChatComingSoonDescription,
  ChatComingSoonIconBox,
  ChatComingSoonPage,
  ChatComingSoonShell,
  ChatComingSoonTitle,
} from "./ChatComingSoon.styles";

function ChatComingSoon() {
  // 개발중 페이지에서 사용자가 다른 주요 화면으로 이동할 수 있게 합니다.
  const navigate = useNavigate();

  return (
    <ChatComingSoonPage>
      {/* 공통 상단 네비게이션입니다. */}
      <NavBar
        keyword=""
        onChangeKeyword={() => {}}
        onSearch={() => {}}
        isSuggestionOpen={false}
        regionSuggestions={[]}
      />

      <ChatComingSoonShell>
        <ChatComingSoonCard>
          {/* 채팅 기능 개발중 안내입니다. */}
          <ChatComingSoonIconBox>
            <MessageSquare size={42} strokeWidth={1.8} />
          </ChatComingSoonIconBox>

          <ChatComingSoonTitle>채팅은 아직 개발중입니다</ChatComingSoonTitle>
          <ChatComingSoonDescription>
            토지 문의와 사업자 상담을 안정적으로 주고받을 수 있도록 채팅 기능을 준비하고 있습니다.
            기능이 완성되면 이 화면에서 대화 목록과 메시지를 확인할 수 있습니다.
          </ChatComingSoonDescription>

          {/* 사용자가 막히지 않도록 주요 화면 이동 버튼을 제공합니다. */}
          <ChatComingSoonActions>
            <ChatComingSoonButton type="button" $variant="outline" onClick={() => navigate("/")}>
              지도 검색으로 이동
            </ChatComingSoonButton>
            <ChatComingSoonButton type="button" onClick={() => navigate("/space")}>
              내 공간으로 이동
            </ChatComingSoonButton>
          </ChatComingSoonActions>
        </ChatComingSoonCard>
      </ChatComingSoonShell>
    </ChatComingSoonPage>
  );
}

export default ChatComingSoon;
