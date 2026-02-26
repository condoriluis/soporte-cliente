"use client";

import { useState, useEffect } from "react";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#servicios",  label: "Servicios" },
  { href: "#proceso",    label: "Proceso"   },
  { href: "#formulario", label: "Soporte"   },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 transition-shadow duration-300",
        scrolled ? "shadow-lg" : "shadow-md"
      )}
      style={{ background: "var(--brand-dark)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <a href="#" className="flex items-center gap-2 no-underline">
            <Shield className="text-white w-6 h-6" />
            <span className="text-white font-bold text-sm tracking-wide">
              EMPRESA{" "}
              <span className="font-normal" style={{ color: "#a8d4f5" }}>
                | Sistemas y Soporte
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={{ color: "rgba(255,255,255,.82)" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "#fff")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "rgba(255,255,255,.82)")
                }
              >
                {l.label}
              </a>
            ))}

            {/* Theme toggle */}
            <div className="ml-2">
              <ThemeToggle />
            </div>

            <Button
              asChild
              size="sm"
              className="ml-2 rounded-full text-white"
              style={{ background: "var(--brand-accent)" }}
            >
              <a href="#formulario">Solicitar Soporte</a>
            </Button>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="text-white p-2"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menú"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-1"
          style={{ background: "var(--brand-dark)" }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 rounded-md text-sm"
              style={{ color: "rgba(255,255,255,.82)" }}
            >
              {l.label}
            </a>
          ))}
          <Button
            asChild
            size="sm"
            className="mt-2 rounded-full text-white"
            style={{ background: "var(--brand-accent)" }}
          >
            <a href="#formulario" onClick={() => setOpen(false)}>
              Solicitar Soporte
            </a>
          </Button>
        </div>
      )}
    </nav>
  );
}
