import { Route, Routes, Navigate } from "react-router-dom";
import Background from "./pages/Background";
import BusinessSignIn from "./pages/SignIn/BusinessSignIn.jsx";
import Login from "./pages/Login/Login";
import Map from "./pages/Main/Map";
import Land from "./pages/Land/Land";
import DevelopmentNotice from "./components/ui/DevelopmentNotice";
import SignUpSelect from "./components/ui/SignUpSelect";
import NormalSignIn from "./pages/SignIn/normal.jsx";

function App() {
  return (
    <Background>
      <Routes>
        <Route path="/signup" element={<SignUpSelect />} />
        <Route path="/signup/business" element={<BusinessSignIn />} />
        <Route path="/signup/individual" element={<NormalSignIn />} />
        <Route path="/map" element={<Map />} />
        <Route path="/land" element={<Land />} />
        <Route path="/business" element={<DevelopmentNotice />} />
        <Route path="/chat" element={<DevelopmentNotice />} />
        <Route path="/setting" element={<DevelopmentNotice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/map" replace />} />
      </Routes>
    </Background>
  );
}

export default App;
