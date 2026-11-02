import React from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";
import "../assets/styles/index.css";
import { App } from "./App";
import { PortalProvider } from "rain-ui";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PortalProvider position="bottom-center" appearance="solid">
      <App />
    </PortalProvider>
  </React.StrictMode>
);
