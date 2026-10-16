// BUSINESS 플랜의 내 공간 직접 접근을 차단하기 위한 라우터 기능입니다.
import { Navigate, Route, Routes } from "react-router-dom";
import Background from "./pages/Background";
import Footer from "./components/layout/Footer";
import RegisterGuideFooter from "./pages/Land/shared/RegisterGuideFooter";
import Login from "./pages/Login/Login";
import OAuthCallback from "./pages/Login/OAuthCallback";
import Signin_2 from "./pages/SignIn/Signin_2.jsx";
import Map from "./pages/Main/Map";
import MySpace from "./pages/MySpace";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import BusinessPage from "./pages/BusinessPage/BusinessPage";
import Settings from "./pages/Settings";
import Plans from "./pages/Plans";
import BusinessProfile from "./pages/BusinessProfile/BusinessProfile";
import { LandRegisterProvider } from "./contexts/LandRegisterContext";
// 현재 로그인한 사용자의 플랜을 공통 계정 상태에서 확인합니다.
import { useAccount } from "./contexts/AccountContext";
import {
  LandRegister,
  LandRegisterComplete,
  LandRegisterCondition,
  LandRegisterConfirm,
  LandRegisterDetail,
  LandRegisterPhotos,
  LandFavorites,
} from "./pages/Land";

// BUSINESS 플랜 사용자에게 제공하지 않는 화면의 직접 접근을 차단합니다.
function NonBusinessRoute({ children }) {
  // 계정 확인이 끝난 뒤 현재 플랜에 따라 접근 여부를 결정합니다.
  const { isLoggedIn, user, isAccountLoading } = useAccount();

  // 계정 조회 중에는 제한 화면이 잠깐 노출되지 않게 합니다.
  if (isAccountLoading) return null;

  // BUSINESS 플랜은 제한 화면 대신 지도 검색 페이지로 이동합니다.
  if (isLoggedIn && user?.plan === "BUSINESS") {
    return <Navigate to="/" replace />;
  }

  // 그 외 사용자는 기존 내 공간 화면을 그대로 이용합니다.
  return children;
}

function App() {
  return (
    <Background>
      <LandRegisterProvider>
        <Routes>
          <Route path="/signup" element={<Signin_2 />} />
          <Route path="/" element={<Map />} />
          {/* 내 공간의 기존 별칭에도 BUSINESS 플랜 접근 제한을 적용합니다. */}
          <Route path="/land" element={<NonBusinessRoute><MySpace /></NonBusinessRoute>} />
          <Route path="/land/favorites" element={<LandFavorites />} />
          <Route path="/land/register" element={<LandRegister />} />
          <Route path="/land/register/confirm" element={<LandRegisterConfirm />} />
          <Route path="/land/register/detail" element={<LandRegisterDetail />} />
          <Route path="/land/register/photos" element={<LandRegisterPhotos />} />
          <Route path="/land/register/condition" element={<LandRegisterCondition />} />
          <Route path="/land/register/complete" element={<LandRegisterComplete />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/business" element={<BusinessProfile />} />
          <Route path="/business/profile" element={<BusinessProfile />} />
          <Route path="/chat" element={<Chat />} />
          {/* BUSINESS 플랜은 사업 연결 주소를 직접 입력해도 접근할 수 없습니다. */}
          <Route path="/business-connections" element={<NonBusinessRoute><BusinessPage /></NonBusinessRoute>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/plans" element={<Plans />} />
          {/* BUSINESS 플랜은 주소를 직접 입력해도 내 공간으로 이동할 수 없습니다. */}
          <Route path="/space" element={<NonBusinessRoute><MySpace /></NonBusinessRoute>} />
        </Routes>
        <RegisterGuideFooter />
        {/* 각 페이지에 중복되지 않도록 공통 footer를 한 번만 배치합니다. */}
        <Footer />
      </LandRegisterProvider>
    </Background>
  );
}

export default App;
