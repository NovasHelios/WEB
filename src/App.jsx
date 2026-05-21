import { useState } from "react"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import Background from "./pages/Background"
import BusinessSignIn from "./pages/SignIn/BusinessSignIn.jsx"
import Login from "./pages/Login/Login";
import Main from "./pages/Main";




function App() {

  const [page, setPage] = useState("business1")
  return (
    <BrowserRouter>
      <Background>
        <Routes>
          <Route path="/" element={<BusinessSignIn />} />
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Background>
    </BrowserRouter>
  );
}

export default App;
