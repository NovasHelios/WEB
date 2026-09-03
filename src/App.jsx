import { Route, Routes } from "react-router-dom";
import Background from "./pages/Background";
import Login from "./pages/Login/Login";
import Signin_2 from "./pages/SignIn/Signin_2.jsx";
import Map from "./pages/Main/Map";
import MySpace from "./pages/MySpace";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat/ChatComingSoon";
import BusinessConnections from "./pages/BusinessConnections";
import Settings from "./pages/Settings";
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/business-connections" element={<BusinessConnections />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/space" element={<MySpace />} />
        </Routes>
      </LandRegisterProvider>
    </Background>
  );
}

export default App;
