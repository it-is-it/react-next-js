import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <button 
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="dark-mode-toggle"
    >
      {isDarkMode ? "☀️" : "🌙"}
    </button>
  );
}
