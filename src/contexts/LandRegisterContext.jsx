import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/* eslint-disable react-refresh/only-export-components */

const defaultRegisterData = {
  address: "",
  isAddressValid: false,
  confirmedAddress: "",
  confirmedRoadAddress: "",
  confirmedLocation: "",
  latitude: "",
  longitude: "",
  pnu: "",
  area: "",
  officialLandPrice: "",
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

export function LandRegisterProvider({ children }) {
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

export function useLandRegister() {
  const context = useContext(LandRegisterContext);

  if (!context) {
    throw new Error("LandRegisterProvider 안에서 사용해야 합니다.");
  }

  return context;
}
