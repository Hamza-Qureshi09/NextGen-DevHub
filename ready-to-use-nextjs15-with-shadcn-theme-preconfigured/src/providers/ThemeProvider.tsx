import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setResolvedTheme, setTheme, Theme } from "@/store/slices/theme-slice";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { theme, resolvedTheme } = useAppSelector((state) => state.theme);

  // Load saved theme from localStorage on initial mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
      dispatch(setTheme(savedTheme));
    }
  }, []);

  // Save theme, resolve it, and apply class when theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme);

    let newResolvedTheme: "light" | "dark";
    if (theme === "system") {
      newResolvedTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
    } else {
      newResolvedTheme = theme;
    }

    dispatch(setResolvedTheme(newResolvedTheme));

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newResolvedTheme);
  }, [theme]);

  // Add system preference listener only when theme is 'system'
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const newResolvedTheme = mediaQuery.matches ? "dark" : "light";
      dispatch(setResolvedTheme(newResolvedTheme));

      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newResolvedTheme);
    };

    mediaQuery.addEventListener("change", handleChange);

    // Cleanup: automatically removes listener when theme changes away from 'system'
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);
  return <>{children}</>;
}
