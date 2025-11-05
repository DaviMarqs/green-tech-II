import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  </StrictMode>
);
