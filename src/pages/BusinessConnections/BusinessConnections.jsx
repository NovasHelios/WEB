import { useNavigate } from "react-router-dom";
import { Handshake } from "lucide-react";
import NavBar from "@/components/layout/box/NavBar";
import {
  BusinessActions,
  BusinessButton,
  BusinessCard,
  BusinessDescription,
  BusinessIconBox,
  BusinessPage,
  BusinessShell,
  BusinessTitle,
} from "./BusinessConnections.styles";

function BusinessConnections() {
  // 임시 페이지에서 다른 주요 화면으로 이동할 수 있게 합니다.
  const navigate = useNavigate();

  return (
    <BusinessPage>
      {/* 공통 상단 네비게이션입니다. */}
      <NavBar
        keyword=""
        onChangeKeyword={() => {}}
        onSearch={() => {}}
        isSuggestionOpen={false}
        regionSuggestions={[]}
      />

      <BusinessShell>
        <BusinessCard>
          {/* 사업 연결 기능 개발중 안내입니다. */}
          <BusinessIconBox>
            <Handshake size={42} strokeWidth={1.8} />
          </BusinessIconBox>

          <BusinessTitle>사업 연결은 아직 개발중입니다</BusinessTitle>
          <BusinessDescription>
            토지 소유자와 사업자를 안전하게 연결하기 위한 기능을 준비하고 있습니다.
            기능이 완성되면 이 화면에서 연결 요청과 진행 상태를 확인할 수 있습니다.
          </BusinessDescription>

          {/* 사용자가 막히지 않도록 주요 화면 이동 버튼을 제공합니다. */}
          <BusinessActions>
            <BusinessButton type="button" $variant="outline" onClick={() => navigate("/")}>
              지도 검색으로 이동
            </BusinessButton>
            <BusinessButton type="button" onClick={() => navigate("/space")}>
              내 공간으로 이동
            </BusinessButton>
          </BusinessActions>
        </BusinessCard>
      </BusinessShell>
    </BusinessPage>
  );
}

export default BusinessConnections;
