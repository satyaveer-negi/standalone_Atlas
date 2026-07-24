import { createContext, useContext, useEffect, useMemo, useState } from "react";

/* ============================
   THEME CONFIG (UI + SYSTEM 🔥)
============================ */
const THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "emerald", label: "Emerald" },
  { value: "crimson", label: "Crimson" },
  { value: "sky", label: "Sky Blue" },
  { value: "violet", label: "Violet" },
  { value: "ocean", label: "Ocean Blue" },
  { value: "carbon", label: "Carbon Dark" },
  { value: "rose", label: "Rose" },
  { value: "sunset", label: "Sunset" },
  { value: "cyber", label: "Cyber Neon" },
  { value: "system", label: "System" },
] as const;

/* ============================
   TYPES
============================ */
type ThemeMode = (typeof THEMES)[number]["value"];
type AppliedTheme = Exclude<ThemeMode, "system">;

interface ThemeContextValue {
  theme: ThemeMode;
  appliedTheme: AppliedTheme;
  setTheme: (theme: ThemeMode) => void;
  themes: typeof THEMES;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "erp-theme";

/* ============================
   SYSTEM THEME
============================ */
const getSystemTheme = (): AppliedTheme => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

/* ============================
   PROVIDER
============================ */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";

    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (THEMES.some((t) => t.value === saved)) {
      return saved as ThemeMode;
    }

    return "system";
  });

  const [systemTheme, setSystemTheme] = useState<AppliedTheme>(getSystemTheme);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const listener = () => {
      setSystemTheme(media.matches ? "dark" : "light");
    };

    listener();
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  /* ============================
     APPLY THEME
  ============================ */
  const appliedTheme: AppliedTheme =
    theme === "system" ? systemTheme : (theme as AppliedTheme);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.dataset.theme = appliedTheme;
    document.documentElement.style.colorScheme = appliedTheme;

    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [appliedTheme, theme]);

  /* ============================
     CONTEXT VALUE
  ============================ */
  const value = useMemo(
    () => ({
      theme,
      appliedTheme,
      setTheme: setThemeState,
      themes: THEMES,
    }),
    [theme, appliedTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/* ============================
   HOOK
============================ */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
