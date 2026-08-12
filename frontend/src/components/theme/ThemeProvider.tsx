"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const THEME_KEY = "ablespace-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export default function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  // IMPORTANT:
  // Server and first client render must use the same value.
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Read saved theme only after hydration.
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);

    const initialTheme: Theme =
      savedTheme === "dark" ? "dark" : "light";

    setThemeState(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);

    window.dispatchEvent(
      new CustomEvent("ablespace-theme-changed", {
        detail: theme,
      })
    );
  }, [theme, mounted]);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) =>
      current === "light" ? "dark" : "light"
    );
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}