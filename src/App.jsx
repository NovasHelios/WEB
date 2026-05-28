import { useState } from "react"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import Background from "./pages/Background"
import BusinessSignIn from "./pages/SignIn/BusinessSignIn.jsx"
import Login from "./pages/Login/Login";
import Main from "./pages/Main";
import SignUpSelect from "./components/ui/SignUpSelect";
import NormalSignIn from "./pages/SignIn/normal.jsx";

function App() {
  return (
      <Background>
        <Routes>
          <Route path="/signup" element={<SignUpSelect />} />
          <Route path="/signup/business" element={<BusinessSignIn />} />
          <Route path="/signup/individual" element={<NormalSignIn />} />
          <Route path="/main" element={<Main />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Background>
  );
}

export default App;