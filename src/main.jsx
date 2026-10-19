import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/legacy/bootstrap.min.css";
import "./styles/legacy/style.css";
import "./styles/main.scss";
import App from "./App.jsx";

const rootElement = document.querySelector("#app");

if (rootElement) {
  createRoot(rootElement).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
