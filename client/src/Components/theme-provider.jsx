import { createContext, useContext, useEffect, useState } from "react";

const Theme = {
  DARK: "dark",
  LIGHT: "light",
  SYSTEM: "system"
};

const ThemeProviderContext = createContext();

export function ThemeProvider({ children, defaultTheme = Theme.SYSTEM, storageKey = "vite-ui-theme", ...props }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(storageKey) || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(Theme.LIGHT, Theme.DARK);

    if (theme === Theme.SYSTEM) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? Theme.DARK
        : Theme.LIGHT;

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
