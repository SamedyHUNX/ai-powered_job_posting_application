"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/30 transition-all duration-200 backdrop-blur-sm border border-white/20"
      aria-label="Toggle theme"
    >
      <span className="text-xl">{theme === "dark" ? "🌞" : "🌙"}</span>
    </button>
  );
};
