import { createContext, useContext, useEffect, useState } from "react";
import { Api } from "@/contents/apiEndpoints";
import { authFetch, AUTH_CHANGED_EVENT, getValidAccessToken, USER_DISPLAY_NAME_CHANGED_EVENT } from "@/lib/auth";
import useAuthToken from "@/hooks/useAuthToken";
import { readApiResponse } from "@/utils/apiResponse";

const AccountContext = createContext(null);

// 라우트 바깥에서 계정 정보를 유지해 navbar 재마운트 때 재조회하지 않습니다.
export function AccountProvider({ children }) {
  const token = useAuthToken();
  const [revision, setRevision] = useState(0);
  const [snapshot, setSnapshot] = useState(null);
  const [requestState, setRequestState] = useState(null);

  useEffect(() => {
    // 같은 토큰의 플랜 변경도 반영하며 프로필 이름 변경은 즉시 표시합니다.
    const refresh = () => setRevision((value) => value + 1);
    const updateName = (event) => {
      const currentToken = getValidAccessToken();
      setSnapshot((previous) => previous?.token === currentToken
        ? { ...previous, user: { ...previous.user, name: event.detail } }
        : previous);
    };
    window.addEventListener(AUTH_CHANGED_EVENT, refresh);
    window.addEventListener(USER_DISPLAY_NAME_CHANGED_EVENT, updateName);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, refresh);
      window.removeEventListener(USER_DISPLAY_NAME_CHANGED_EVENT, updateName);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    // 로그아웃한 계정 정보는 메모리에서도 제거합니다.
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSnapshot(null);
      return undefined;
    }
    // 최초 조회가 멈추더라도 무한 확인 상태 대신 재시도할 수 있게 합니다.
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    void (async () => {
      try {
        const response = await authFetch(Api.MyProfile, { signal: controller.signal });
        if (!cancelled && token === getValidAccessToken() && response.status === 403) setSnapshot(null);
        const data = await readApiResponse(response, "계정 정보를 불러오지 못했습니다.");
        if (!data?.data || typeof data.data !== "object" || Array.isArray(data.data)) throw new Error("계정 정보 응답을 확인할 수 없습니다.");
        if (cancelled || token !== getValidAccessToken()) return;
        setSnapshot({ token, user: data.data });
        setRequestState({ token, revision, error: "" });
      } catch (error) {
        // 일시적인 네트워크 실패로 이미 확인한 메뉴가 사라지지 않게 유지합니다.
        if (!cancelled && token === getValidAccessToken()) {
          setRequestState({ token, revision, error: controller.signal.aborted ? "계정 조회 시간이 초과됐습니다." : error.message || "계정 정보를 불러오지 못했습니다." });
        }
      } finally {
        window.clearTimeout(timeout);
      }
    })();
    return () => { cancelled = true; window.clearTimeout(timeout); controller.abort(); };
  }, [token, revision]);

  // 새 계정 조회 중에는 이전 계정의 메뉴나 이름을 노출하지 않습니다.
  const user = token && snapshot?.token === token ? snapshot.user : null;
  const settled = requestState?.token === token && requestState?.revision === revision;
  const accountError = settled ? requestState.error : "";
  const isAccountLoading = Boolean(token) && !settled;
  const retryAccount = () => setRevision((value) => value + 1);
  return <AccountContext.Provider value={{ isLoggedIn: Boolean(token), user, accountError, isAccountLoading, retryAccount }}>{children}</AccountContext.Provider>;
}

// 공통 계정 상태는 화면 표시용이며 실제 권한 검사는 서버가 수행합니다.
// eslint-disable-next-line react-refresh/only-export-components
export function useAccount() {
  const account = useContext(AccountContext);
  if (!account) throw new Error("AccountProvider 안에서 사용해야 합니다.");
  return account;
}
