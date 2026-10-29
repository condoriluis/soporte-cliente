"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;

  const options = [
    { key: "light", icon: Sun, label: "Claro" },
    { key: "dark", icon: Moon, label: "Oscuro" },
    { key: "system", icon: Monitor, label: "Sistema" },
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
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted",
        className,
      )}
    >
      <CurrentIcon className="h-4 w-4" />
    </button>
  );
}
