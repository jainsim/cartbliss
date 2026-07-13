// Shared theme control so the toggle button and the keyboard shortcut ('t')
// stay in sync. Dispatches an event the toggle listens to for its icon.

export type Theme = "light" | "dark";

export const THEME_EVENT = "cartbliss-themechange";
const STORAGE_KEY = "cartbliss-theme";

/** The theme actually painted right now: explicit choice wins, else system. */
export function resolveTheme(): Theme {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode — theme still applies for the session */
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function toggleTheme(): void {
  applyTheme(resolveTheme() === "dark" ? "light" : "dark");
}
