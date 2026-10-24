import { useEffect } from "react";

const HIDDEN_SCROLLBAR_CLASS = "helios-hide-page-scrollbar";

// 지정된 페이지가 열려 있는 동안 문서 스크롤바의 UI만 숨깁니다.
export default function useHiddenPageScrollbar() {
  useEffect(() => {
    // 브라우저별 실제 스크롤 컨테이너 차이를 고려해 html과 body에 모두 적용합니다.
    document.documentElement.classList.add(HIDDEN_SCROLLBAR_CLASS);
    document.body.classList.add(HIDDEN_SCROLLBAR_CLASS);

    // 다른 페이지로 이동하면 전역 스크롤바 표시 상태를 원래대로 복원합니다.
    return () => {
      document.documentElement.classList.remove(HIDDEN_SCROLLBAR_CLASS);
      document.body.classList.remove(HIDDEN_SCROLLBAR_CLASS);
    };
  }, []);
}
