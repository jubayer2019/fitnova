import { createContext, useContext, useEffect, useState } from "react";
import { lsGet, lsSet } from "../utils/helpers.js";

const ThemeContext = createContext(null);
const KEY = "fitnova:theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => lsGet(KEY, "light"));

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    lsSet(KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
};
