"use client";

import { useState, useEffect } from "react";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/utils";
import { useSettings } from "@/lib/settings-context";
import { CONTACT } from "@/lib/contact";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Cómo funciona" },
  { href: "#testimonios", label: "Opiniones" },
  { href: "#faq", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const settings = useSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const name = settings.institutionName;
  const showLogo = settings.logoUrl && !logoError;

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 backdrop-blur-lg",
        scrolled
          ? "bg-background/95 shadow-lg border-b border-border/50"
          : "bg-background/80 shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2.5 no-underline group">
            {showLogo ? (
              <img
                src={settings.logoUrl!}
                alt={name}
                className="h-8 w-auto transition-transform group-hover:scale-105"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: "var(--brand-primary)" }}>
                <Shield className="text-white w-4 h-4" />
              </div>
            )}
            <span className="font-bold text-sm tracking-tight text-foreground">
              {name}
            </span>
          </a>

          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              size="sm"
              className="rounded-full font-semibold text-white"
              style={{ background: "var(--brand-primary)" }}
            >
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="w-4 h-4 mr-2 inline-block align-[-2px]" />
                Solicitar Ahora
              </a>
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-1.5">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menú"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-4 pt-1 border-t border-border/50 bg-background/95 backdrop-blur-lg space-y-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <div className="pt-2">
            <Button
              asChild
              size="sm"
              className="w-full rounded-full font-semibold text-white"
              style={{ background: "var(--brand-primary)" }}
            >
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                <WhatsAppIcon className="w-4 h-4 mr-2 inline-block align-[-2px]" />
                Solicitar Ahora
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
