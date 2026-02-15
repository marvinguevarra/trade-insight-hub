import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light" | "high-contrast-dark" | "high-contrast-light";
type TextSize = "small" | "normal" | "large" | "xl";
type ColorVision = "standard" | "protanopia" | "deuteranopia" | "tritanopia";

interface AccessibilityState {
  theme: Theme;
  textSize: TextSize;
  colorVision: ColorVision;
  reduceMotion: boolean;
  enhancedFocus: boolean;
  setTheme: (t: Theme) => void;
  setTextSize: (s: TextSize) => void;
  setColorVision: (c: ColorVision) => void;
  setReduceMotion: (v: boolean) => void;
  setEnhancedFocus: (v: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityState | null>(null);

const textSizeMap: Record<TextSize, string> = {
  small: "text-size-small",
  normal: "text-size-normal",
  large: "text-size-large",
  xl: "text-size-xl",
};

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("a11y-theme") as Theme) || "dark");
  const [textSize, setTextSize] = useState<TextSize>(() => (localStorage.getItem("a11y-text-size") as TextSize) || "normal");
  const [colorVision, setColorVision] = useState<ColorVision>(() => (localStorage.getItem("a11y-color-vision") as ColorVision) || "standard");
  const [reduceMotion, setReduceMotion] = useState(() => localStorage.getItem("a11y-reduce-motion") === "true");
  const [enhancedFocus, setEnhancedFocus] = useState(() => localStorage.getItem("a11y-enhanced-focus") !== "false");

  useEffect(() => {
    localStorage.setItem("a11y-theme", theme);
    const root = document.documentElement;
    root.classList.remove("theme-dark", "theme-light", "theme-hc-dark", "theme-hc-light");
    const cls = { dark: "theme-dark", light: "theme-light", "high-contrast-dark": "theme-hc-dark", "high-contrast-light": "theme-hc-light" };
    root.classList.add(cls[theme]);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("a11y-text-size", textSize);
    const root = document.documentElement;
    Object.values(textSizeMap).forEach((c) => root.classList.remove(c));
    root.classList.add(textSizeMap[textSize]);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem("a11y-color-vision", colorVision);
    const root = document.documentElement;
    root.classList.remove("cv-standard", "cv-protanopia", "cv-deuteranopia", "cv-tritanopia");
    root.classList.add(`cv-${colorVision}`);
  }, [colorVision]);

  useEffect(() => {
    localStorage.setItem("a11y-reduce-motion", String(reduceMotion));
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
  }, [reduceMotion]);

  useEffect(() => {
    localStorage.setItem("a11y-enhanced-focus", String(enhancedFocus));
    document.documentElement.classList.toggle("enhanced-focus", enhancedFocus);
  }, [enhancedFocus]);

  return (
    <AccessibilityContext.Provider value={{ theme, textSize, colorVision, reduceMotion, enhancedFocus, setTheme, setTextSize, setColorVision, setReduceMotion, setEnhancedFocus }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
};
