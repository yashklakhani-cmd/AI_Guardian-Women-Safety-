import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import MainScreen from "./components/MainScreen";
import StealthScreen from "./components/StealthScreen";

function getIsNightMode(): boolean {
  const h = new Date().getHours();
  return h >= 20 || h < 6;
}

export default function App() {
  const [isStealthMode, setIsStealthMode] = useState(false);
  const [isNightMode, setIsNightMode] = useState(getIsNightMode);

  // Re-check night mode every minute
  useEffect(() => {
    const id = setInterval(() => setIsNightMode(getIsNightMode()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Apply dark class for night mode
  useEffect(() => {
    if (isNightMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isNightMode]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {isStealthMode ? (
        <StealthScreen onExit={() => setIsStealthMode(false)} />
      ) : (
        <MainScreen
          isNightMode={isNightMode}
          onActivateStealth={() => setIsStealthMode(true)}
        />
      )}
      <Toaster />
    </div>
  );
}
