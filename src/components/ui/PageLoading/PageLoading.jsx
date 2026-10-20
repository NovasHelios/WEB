// 여러 페이지에서 동일한 로딩 화면을 만들기 위한 스타일 도구입니다.
import styled, { keyframes } from "styled-components";

// 점 형태 로더를 시계 방향으로 회전시킵니다.
const pageLoadingSpin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

// 로딩 오버레이의 위치 기준과 초기 목록 높이를 확보합니다.
const PageLoadingFrame = styled.div`
  position: relative;
  /* 전역 로딩에서는 화면 전체, 부분 로딩에서는 기존 최소 높이를 확보합니다. */
  min-height: ${({ $loading, $fullScreen }) =>
    $fullScreen ? "100dvh" : $loading ? "320px" : "0"};
`;

// 데이터를 불러오는 동안 기존 페이지 내용을 흐리게 표시합니다.
const PageLoadingContent = styled.div`
  filter: ${({ $loading }) => ($loading ? "blur(4px)" : "none")};
  opacity: ${({ $loading }) => ($loading ? 0.55 : 1)};
  pointer-events: ${({ $loading }) => ($loading ? "none" : "auto")};
  transition:
    filter 180ms ease,
    opacity 180ms ease;
`;

// 흐려진 페이지 내용 중앙에 로딩 상태를 배치합니다.
const PageLoadingOverlay = styled.div`
  position: absolute;
  inset: 20px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #555555;
`;

// 태양광 적합도와 같은 점선 원형 로더를 표시합니다.
const PageLoadingSpinner = styled.span`
  width: 44px;
  height: 44px;
  border: 6px dotted #777777;
  border-radius: 50%;
  animation: ${pageLoadingSpin} 1.1s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// 원형 로더 아래에 로딩 안내 문구를 표시합니다.
const PageLoadingText = styled.strong`
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
`;

// 페이지의 기존 내용을 유지하면서 공통 로딩 애니메이션을 표시합니다.
export default function PageLoading({ isLoading, children, fullScreen = false }) {
  return (
    // 전역 여부에 맞는 높이를 확보한 뒤 기존 로딩 애니메이션을 재사용합니다.
    <PageLoadingFrame
      $loading={isLoading}
      $fullScreen={fullScreen}
      aria-busy={isLoading}
    >
      {/* 로딩 중에는 목록을 유지한 채 흐리게 처리하고 입력을 막습니다. */}
      <PageLoadingContent $loading={isLoading} aria-hidden={isLoading}>
        {children}
      </PageLoadingContent>

      {/* 데이터 요청이 끝날 때까지 중앙에 회전 로더를 표시합니다. */}
      {isLoading && (
        <PageLoadingOverlay role="status" aria-label="페이지 정보 로딩 중">
          <PageLoadingSpinner aria-hidden="true" />
          <PageLoadingText>로딩 중</PageLoadingText>
        </PageLoadingOverlay>
      )}
    </PageLoadingFrame>
  );
}
