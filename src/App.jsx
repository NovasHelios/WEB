import { useState } from "react"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import Background from "./pages/Background"
import BusinessSignIn1 from "./pages/SignIn/business1"
import BusinessSignIn2 from "./pages/SignIn/business2.jsx"



function App() {

  const [page, setPage] = useState("business1")
  return (
    <BrowserRouter>
      <Background>
        <Routes>
          <Route path="/" element={<BusinessSignIn1 />} />
          <Route path="/2" element={<BusinessSignIn2 />} />
        </Routes>
      </Background>
    </BrowserRouter>
  );
}

export default App
