import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AccountProvider } from "./contexts/AccountContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <AccountProvider><App /></AccountProvider>
    </BrowserRouter>
);
