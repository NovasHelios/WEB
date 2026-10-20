// 라우트별 화면을 필요한 시점에만 불러오기 위한 React 기능입니다.
import { lazy, Suspense } from "react";
// BUSINESS 플랜의 내 공간 직접 접근을 차단하기 위한 라우터 기능입니다.
import { Navigate, Route, Routes } from "react-router-dom";
import Background from "./pages/Background";
import Footer from "./components/layout/Footer";
// 새로고침 후 공통 계정 정보가 준비될 때까지 전역 로딩 애니메이션을 표시합니다.
import PageLoading from "./components/ui/PageLoading/PageLoading";
import RegisterGuideFooter from "./pages/Land/shared/RegisterGuideFooter";
import { LandRegisterProvider } from "./contexts/LandRegisterContext";
// 현재 로그인한 사용자의 플랜을 공통 계정 상태에서 확인합니다.
import { useAccount } from "./contexts/AccountContext";

// 현재 경로에 필요한 페이지 코드만 내려받아 초기 번들 크기와 실행 비용을 줄입니다.
const Login = lazy(() => import("./pages/Login/Login"));
const OAuthCallback = lazy(() => import("./pages/Login/OAuthCallback"));
const Signin_2 = lazy(() => import("./pages/SignIn/Signin_2.jsx"));
const Map = lazy(() => import("./pages/Main/Map"));
const MySpace = lazy(() => import("./pages/MySpace"));
const Profile = lazy(() => import("./pages/Profile"));
const Chat = lazy(() => import("./pages/Chat"));
const BusinessPage = lazy(() => import("./pages/BusinessPage/BusinessPage"));
const Settings = lazy(() => import("./pages/Settings"));
const Plans = lazy(() => import("./pages/Plans"));
const BusinessProfile = lazy(() => import("./pages/BusinessProfile/BusinessProfile"));
const LandRegister = lazy(() => import("./pages/Land/LandRegister"));
const LandRegisterConfirm = lazy(() => import("./pages/Land/LandRegisterConfirm"));
const LandRegisterDetail = lazy(() => import("./pages/Land/LandRegisterDetail"));
const LandRegisterPhotos = lazy(() => import("./pages/Land/LandRegisterPhotos"));
const LandRegisterCondition = lazy(() => import("./pages/Land/LandRegisterCondition"));
const LandRegisterComplete = lazy(() => import("./pages/Land/LandRegisterComplete"));
const LandFavorites = lazy(() => import("./pages/Land/LandFavorites"));

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
  // 앱을 다시 불러올 때 계정 확인이 끝났는지 공통 상태에서 확인합니다.
  const { isAccountLoading } = useAccount();

  return (
    // 새로고침 직후 계정 확인 중에는 전체 화면 중앙에 공통 로더를 표시합니다.
    <PageLoading isLoading={isAccountLoading} fullScreen>
      <Background>
        <LandRegisterProvider>
          {/* 페이지 청크를 내려받는 동안 기존 공통 로딩 애니메이션을 표시합니다. */}
          <Suspense fallback={<PageLoading isLoading fullScreen />}>
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
          </Suspense>
          <RegisterGuideFooter />
          {/* 각 페이지에 중복되지 않도록 공통 footer를 한 번만 배치합니다. */}
          <Footer />
        </LandRegisterProvider>
      </Background>
    </PageLoading>
  );
}

export default App;
