import { useState } from "react"
import { Route, BrowserRouter, Routes } from "react-router-dom"
import Background from "./pages/Background"
import BusinessSignIn from "./pages/SignIn/BusinessSignIn.jsx"



function App() {

  const [page, setPage] = useState("business1")
  return (
    <BrowserRouter>
      <Background>
        <Routes>
          <Route path="/" element={<BusinessSignIn />} />
        </Routes>
      </Background>
    </BrowserRouter>
  );
}

export default App
