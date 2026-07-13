"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  THEME_EVENT,
  resolveTheme,
  toggleTheme,
  type Theme,
} from "@/lib/theme";

export default function ThemeToggle() {
  // Start light to match SSR; sync to the real painted theme after mount.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const sync = () => setTheme(resolveTheme());
    sync();
    // Keep the icon in sync when the theme changes from anywhere (e.g. the
    // 't' keyboard shortcut).
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid min-h-touch min-w-touch place-items-center rounded-full border border-border bg-surface text-hi transition-colors hover:bg-surface-elevated active:animate-pop"
    >
      {isDark ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
