import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import logo from "@/images/logo.png";
import { listPageShell } from "@/styles/listPage";

// 본문과 같은 좌우 여백을 사용하며, 고정 배치 없이 콘텐츠 다음에 표시합니다.
const FooterRoot = styled.footer`
  ${listPageShell}
  padding-top: 2rem;
  padding-bottom: 2rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-soft);
  color: var(--color-text-muted);
  font-size: var(--font-sm);
  line-height: var(--line-relaxed);

  p { margin: 0; }
  a {
    color: inherit;
    text-decoration: none;
    border-radius: 0.25rem;
  }
  a:hover { color: var(--color-brand-dark); }
  a:focus-visible {
    outline: 2px solid var(--color-brand-dark);
    outline-offset: 4px;
  }
`;

// 좁은 화면에서는 브랜드와 링크가 자연스럽게 다음 줄로 이동합니다.
const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem 3rem;
  padding-bottom: 1.5rem;

  img { display: block; width: 9rem; height: auto; margin-bottom: 0.75rem; }
  nav { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; }
  nav a { display: inline-flex; align-items: center; min-height: 2.75rem; }
`;

const FooterNote = styled.div`
  display: grid;
  gap: 0.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
  overflow-wrap: anywhere;
`;

// 지도·채팅의 화면 높이와 OAuth 리다이렉트 흐름에는 footer를 추가하지 않습니다.
export default function Footer() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "") || "/";
  if (["/", "/chat", "/oauth2/callback"].includes(path)) return null;

  return (
    <FooterRoot aria-label="서비스 정보">
      <FooterTop>
        <div>
          <Link to="/" aria-label="HELIOS 지도 검색으로 이동">
            <img src={logo} alt="helios" />
          </Link>
          <p>태양광 후보지 사전분석부터 사업자 연결까지.</p>
        </div>
        <nav aria-label="하단 메뉴">
          <Link to="/">지도 검색</Link>
          <Link to="/business-connections">사업 연결</Link>
          <Link to="/plans">요금제 플랜</Link>
        </nav>
      </FooterTop>
      <FooterNote>
        <p>분석 결과는 사전 검토용 참고 정보입니다. 실제 설치 가능 여부와 비용·수익성은 현장 확인 및 사업자 상담을 통해 검토해 주세요.</p>
        <p>© {new Date().getFullYear()} HELIOS</p>
      </FooterNote>
    </FooterRoot>
  );
}
