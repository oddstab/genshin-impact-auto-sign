import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Popup";
import "./index.css";
import "../assets/tailwind.css";
ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
