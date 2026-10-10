import { LockKeyhole, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// 실제 보고서 대신 장식용 모형만 흐리게 표시해 잠금 상태에서 정보를 노출하지 않습니다.
const Gate = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: var(--color-surface);
  display: grid;
  min-height: 30rem;
  text-align: center;
  word-break: keep-all;
  overflow-wrap: anywhere;
  .preview {
    grid-area: 1 / 1; min-width: 0;
    display: grid; align-content: start; gap: 1.5rem;
    padding: 2rem; text-align: left;
    filter: blur(7px); pointer-events: none; user-select: none;
  }
  .preview-heading { font-size: var(--font-xl); font-weight: var(--font-bold); }
  .preview-section { display: grid; gap: 0.75rem; }
  .preview-label { font-weight: var(--font-semibold); color: #63583f; }
  .preview-line { display: block; height: 0.6rem; border-radius: 0.25rem; background: #a69d8b; }
  .preview-line:last-child { width: 72%; }
  .preview-summary { padding: 1.25rem; border: 1px solid #d7c9a6; border-radius: 0.75rem; background: #f6efd9; }
  /* 안내 카드로 가리지 않고 보고서 위에 반투명 잠금 레이어를 겹칩니다. */
  .overlay {
    grid-area: 1 / 1; z-index: 1; min-width: 0;
    display: grid; place-items: center;
    padding: 2rem 1rem; background: rgba(255, 253, 248, 0.4);
  }
  .content {
    max-width: 26rem;
    text-shadow: 0 1px 6px #fffdf8, 0 0 16px #fffdf8;
  }
  .lock {
    display: grid; place-items: center; width: 3.5rem; height: 3.5rem;
    margin: 0 auto 1rem; border-radius: 50%; background: #f6ebc8;
    color: var(--color-brand-dark);
  }
  h3 { margin: 0 0 0.75rem; font-size: var(--font-xl); font-weight: var(--font-bold); }
  p { margin: 0; color: var(--color-text-muted); font-size: var(--font-sm); line-height: 1.65; }
  a {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    max-width: 100%; margin-top: 1.5rem; padding: 0.75rem 1.25rem;
    border-radius: 0.5rem; background: var(--color-brand); color: var(--color-text);
    font-weight: var(--font-semibold); text-decoration: none;
  }
  a:hover { background: var(--color-brand-strong); }
  a:focus-visible { outline: 2px solid var(--color-brand-dark); outline-offset: 4px; }
`;

// 비로그인과 무료 플랜의 다음 행동을 서로 다른 문구와 링크로 안내합니다.
export default function ReportAccessGate({ requiresLogin }) {
  return <Gate aria-label="AI 분석 보고서 이용 안내">
    {/* 공개용 모형이며 실제 분석 결과나 점수를 포함하지 않습니다. */}
    <div className="preview" aria-hidden="true">
      <div className="preview-heading">AI 분석 보고서</div>
      {["주요 판단 근거", "긍정적인 조건", "주의가 필요한 조건", "추가 확인사항"].map((label, index) => (
        <div className={`preview-section${index === 0 ? " preview-summary" : ""}`} key={label}>
          <div className="preview-label">{label}</div>
          {Array.from({ length: 3 }, (_, i) => <span className="preview-line" key={i} />)}
        </div>
      ))}
    </div>
    <div className="overlay">
    <div className="content">
      <div className="lock"><LockKeyhole size={26} aria-hidden="true" /></div>
      <h3>{requiresLogin ? "로그인 후 확인할 수 있어요" : "AI 보고서는 유료 플랜에서 제공돼요"}</h3>
      <p>{requiresLogin
        ? "토지의 AI 분석 보고서를 확인하려면 로그인해 주세요. 로그인 후 이용 중인 플랜을 확인합니다."
        : "무료 플랜에서는 AI 분석 보고서를 열람할 수 없어요. 프로·비즈니스 플랜의 제공 기능을 확인해 보세요."}</p>
      <Link to={requiresLogin ? "/login" : "/plans"}>
        {requiresLogin ? "로그인하기" : "플랜 확인하기"}<ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
    </div>
  </Gate>;
}
