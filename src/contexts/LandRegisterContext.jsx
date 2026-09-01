import { createContext, useContext, useMemo, useState } from "react";

/* eslint-disable react-refresh/only-export-components */

const defaultRegisterData = {
  address: "",
  isAddressValid: false,
  confirmedAddress: "",
  confirmedRoadAddress: "",
  confirmedLocation: "",
  latitude: "",
  longitude: "",
  memo: "",
  price: "",
  transactionType: "sale",
  photos: [],
  submittedLand: null,
};

const LandRegisterContext = createContext(null);

export function LandRegisterProvider({ children }) {
  // 토지 등록 단계별 입력값을 하나로 보관합니다.
  const [registerData, setRegisterData] = useState(defaultRegisterData);

  const value = useMemo(
    () => ({
      registerData,
      setRegisterData,
      resetRegisterData: () => setRegisterData(defaultRegisterData),
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
