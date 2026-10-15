import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuthToken from "@/hooks/useAuthToken";

/* eslint-disable react-refresh/only-export-components */

const defaultRegisterData = {
  address: "",
  // 최종 제출에서 발견한 중복 오류를 주소 입력 단계로 전달합니다.
  addressError: "",
  isAddressValid: false,
  confirmedAddress: "",
  confirmedRoadAddress: "",
  confirmedLocation: "",
  latitude: "",
  longitude: "",
  pnu: "",
  area: "",
  desiredArea: "",
  landCategory: "",
  altitude: "",
  roadAccess: "",
  shareCount: "",
  memo: "",
  price: "",
  transactionType: "sale",
  photos: [],
  document: null,
  submittedLand: null,
};

const createDefaultRegisterData = () => ({
  // 배열과 파일 객체가 이전 등록 흐름과 공유되지 않게 새 객체를 만듭니다.
  ...defaultRegisterData,
  photos: [],
  document: null,
  submittedLand: null,
});

const isRegisterRoute = (pathname) => pathname.startsWith("/land/register");

const LandRegisterContext = createContext(null);

function LandRegisterSession({ children }) {
  const { pathname } = useLocation();
  const previousPathnameRef = useRef(pathname);

  // 토지 등록 단계별 입력값을 하나로 보관합니다.
  const [registerData, setRegisterData] = useState(createDefaultRegisterData);

  const resetRegisterData = () => setRegisterData(createDefaultRegisterData());

  useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    const leftRegisterFlow = isRegisterRoute(previousPathname) && !isRegisterRoute(pathname);
    const restartedAfterComplete = previousPathname === "/land/register/complete" && pathname === "/land/register";

    // 등록 플로우를 벗어나거나 완료 후 새 등록을 시작하면 이전 입력값을 비웁니다.
    if (leftRegisterFlow || restartedAfterComplete) {
      resetRegisterData();
    }

    previousPathnameRef.current = pathname;
  }, [pathname]);

  const value = useMemo(
    () => ({
      registerData,
      setRegisterData,
      resetRegisterData,
    }),
    [registerData]
  );

  return <LandRegisterContext.Provider value={value}>{children}</LandRegisterContext.Provider>;
}

// 인증 세션 변경 시 초안과 하위 입력 상태를 함께 폐기해 계정 간 재사용을 막습니다.
export function LandRegisterProvider({ children }) {
  const token = useAuthToken();
  return <LandRegisterSession key={token || "anonymous"}>{children}</LandRegisterSession>;
}

export function useLandRegister() {
  const context = useContext(LandRegisterContext);

  if (!context) {
    throw new Error("LandRegisterProvider 안에서 사용해야 합니다.");
  }

  return context;
}
