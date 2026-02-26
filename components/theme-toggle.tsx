"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const options = [
    { key: "light",  icon: Sun,     label: "Claro"    },
    { key: "dark",   icon: Moon,    label: "Oscuro"   },
    { key: "system", icon: Monitor, label: "Sistema"  },
  ] as const;

  const current = options.find((o) => o.key === theme) ?? options[2];
  const CurrentIcon = current.icon;

  function cycle() {
    const idx = options.findIndex((o) => o.key === theme);
    const next = options[(idx + 1) % options.length];
    setTheme(next.key);
  }

  return (
    <button
      onClick={cycle}
      aria-label={`Cambiar tema (actual: ${current.label})`}
      title={`Tema: ${current.label}`}
      className="relative flex items-center justify-center w-9 h-9 rounded-full transition-colors"
      style={{
        background: "rgba(255,255,255,.1)",
        color: "#fff",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.2)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.1)")
      }
    >
      <CurrentIcon className="w-4 h-4" />
    </button>
  );
}
