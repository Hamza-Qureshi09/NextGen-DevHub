import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setResolvedTheme, setTheme, Theme } from "@/store/slices/theme-slice";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { theme, resolvedTheme } = useAppSelector((state) => state.theme);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem("theme", theme);

    // Determine the resolved theme
    let newResolvedTheme: "light" | "dark" = "light";

    if (theme === "system") {
      newResolvedTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
    } else {
      newResolvedTheme = theme;
    }

    dispatch(setResolvedTheme(newResolvedTheme));

    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newResolvedTheme);
  }, [theme, dispatch]);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        const newResolvedTheme = mediaQuery.matches ? "dark" : "light";
        dispatch(setResolvedTheme(newResolvedTheme));

        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(newResolvedTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, dispatch]);
  return <>{children}</>;
}
