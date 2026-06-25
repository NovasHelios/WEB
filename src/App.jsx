import { useState } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Background from "./pages/Background";
import BusinessSignIn from "./pages/SignIn/BusinessSignIn.jsx";
import Login from "./pages/Login/Login";
import Land from "./pages/Land/Land";
import Map from "./pages/Main/Map";
import SignUpSelect from "./components/ui/SignUpSelect";
import NormalSignIn from "./pages/SignIn/normal.jsx";
import Profile from "./pages/Profile/profile.jsx";

function App() {
  return (
    <Background>
      <Routes>
        <Route path="/signup" element={<SignUpSelect />} />
        <Route path="/signup/business" element={<BusinessSignIn />} />
        <Route path="/signup/individual" element={<NormalSignIn />} />
        <Route path="/" element={<Map />} />
        <Route path="/land" element={<Land />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Background>
  );
}

export default App;
