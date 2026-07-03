"use client";

import { useEffect } from "react";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("")}`;
}

function mixColor(hex: string, pct: number, mixWith: string = "#ffffff") {
  const a = hexToRgb(hex);
  const b = hexToRgb(mixWith);
  return rgbToHex(
    a.r + (b.r - a.r) * pct,
    a.g + (b.g - a.g) * pct,
    a.b + (b.b - a.b) * pct,
  );
}

export default function BrandStyle({
  primaryColor,
  secondaryColor,
}: {
  primaryColor: string;
  secondaryColor: string;
}) {
  useEffect(() => {
    const root = document.documentElement;
    const p = primaryColor;
    const s = secondaryColor;
    const brandLight = mixColor(s, 0.2, "#ffffff");
    const secondaryLight = mixColor(s, 0.85, "#ffffff");
    const darkPrimary = mixColor(p, 0.35, "#8ab4f8");
    const darkSecondary = mixColor(s, 0.8, "#0f172a");
    const darkSecondaryFg = mixColor(s, 0.15, "#ffffff");
    const darkRing = mixColor(s, 0.2, "#8ab4f8");
    const darkSidebarPrimary = mixColor(p, 0.35, "#8ab4f8");

    root.style.setProperty("--brand-primary", p);
    root.style.setProperty("--brand-secondary", s);
    root.style.setProperty("--brand-dark", p);
    root.style.setProperty("--brand-accent", s);
    root.style.setProperty("--brand-light", brandLight);

    root.style.setProperty("--primary", p);
    root.style.setProperty("--primary-foreground", "#ffffff");
    root.style.setProperty("--secondary", secondaryLight);
    root.style.setProperty("--secondary-foreground", s);
    root.style.setProperty("--accent", s);
    root.style.setProperty("--accent-foreground", "#ffffff");
    root.style.setProperty("--ring", s);
    root.style.setProperty("--sidebar-primary", p);
    root.style.setProperty("--sidebar-primary-foreground", "#ffffff");
  }, [primaryColor, secondaryColor]);

  return null;
}
