import { useState } from "react"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import Background from "./pages/Background"
import BusinessSignIn from "./pages/SignIn/BusinessSignIn.jsx"
import Login from "./pages/Login/Login";
import Main from "./pages/Main";




function App() {

  const [page, setPage] = useState("business1")
  return (
      <Background>
        <Routes>
          <Route path="/signup" element={<BusinessSignIn />} />
          <Route path="/main" element={<Main />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Background>
  );
}

export default App;
