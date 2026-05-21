import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Main from "./pages/Main/Main";
import NormalSignIn from "./pages/SignIn/normal";
import BusinessSignIn1 from "./pages/SignIn/business1";
import BusinessSignIn2 from "./pages/SignIn/business2";
import VerificationCodeModal from "./components/ui/VerificationCodeModal";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<NormalSignIn />} />
      <Route path="/signup/business" element={<BusinessSignIn1 />} />
      <Route path="/signup/business/2" element={<BusinessSignIn2 />} />
      <Route path="/admin" element={<VerificationCodeModal />} />
    </Routes>
  );
}

export default App;
