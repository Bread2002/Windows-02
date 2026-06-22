import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import LoginScreen from "./components/LoginScreen";

function LoginFlow() {
  const [screen, setScreen] = useState<"boot" | "login">("boot");
  const navigate = useNavigate();

  function handleLogin() {
    sessionStorage.setItem("win02_authed", "1");
    navigate("/desktop");
  }

  return (
    <>
      {screen === "boot" && (
        <BootScreen onComplete={() => setScreen("login")} />
      )}
      {screen === "login" && <LoginScreen onLogin={handleLogin} />}
    </>
  );
}

function DesktopPage() {
  if (!sessionStorage.getItem("win02_authed")) {
    return <Navigate to="/login" replace />;
  }
  return <Desktop />;
}

export default function App() {
  useEffect(() => {
    const keySound = new Audio("/bios/key.mp3");
    const mouseSound = new Audio("/bios/click.mp3");
    const keyHandler = () => {
      keySound.currentTime = 0;
      keySound.play().catch(() => {});
    };
    const mouseHandler = () => {
      mouseSound.currentTime = 0;
      mouseSound.play().catch(() => {});
    };
    window.addEventListener("keydown", keyHandler);
    window.addEventListener("click", mouseHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("click", mouseHandler);
    };
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginFlow />} />
      <Route path="/desktop" element={<DesktopPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
