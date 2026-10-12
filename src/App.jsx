import { Route, Routes } from "react-router-dom";
import Background from "./pages/Background";
import Footer from "./components/layout/Footer";
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
import {
  LandRegister,
  LandRegisterComplete,
  LandRegisterCondition,
  LandRegisterConfirm,
  LandRegisterDetail,
  LandRegisterPhotos,
  LandFavorites,
} from "./pages/Land";
function App() {
  return (
    <Background>
      <LandRegisterProvider>
        <Routes>
          <Route path="/signup" element={<Signin_2 />} />
          <Route path="/" element={<Map />} />
          <Route path="/land" element={<MySpace />} />
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
          <Route path="/business-connections" element={<BusinessPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/space" element={<MySpace />} />
        </Routes>
        {/* 각 페이지에 중복되지 않도록 공통 footer를 한 번만 배치합니다. */}
        <Footer />
      </LandRegisterProvider>
    </Background>
  );
}

export default App;
