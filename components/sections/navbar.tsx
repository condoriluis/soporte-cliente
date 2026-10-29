"use client";

import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { Menu, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { cn } from "@/lib/utils";
import { useSettings } from "@/lib/settings-context";
import { CONTACT } from "@/lib/contact";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Cómo funciona" },
  { href: "#planes", label: "Planes" },
  { href: "#testimonios", label: "Opiniones" },
  { href: "#faq", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const settings = useSettings();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const name = settings.institutionName;
  const showLogo = settings.logoUrl && !logoError;
  const onDark = !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#" className="group flex items-center gap-2.5 no-underline">
          {showLogo ? (
            <img
              src={settings.logoUrl!}
              alt={name}
              className="h-8 w-auto transition-transform group-hover:scale-105"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                onDark
                  ? "bg-white/10 ring-1 ring-white/15"
                  : "bg-brand",
              )}
            >
              <Shield className="h-4 w-4 text-white" />
            </div>
          )}
          <span
            className={cn(
              "font-display text-sm font-semibold tracking-tight transition-colors",
              onDark ? "text-white" : "text-foreground",
            )}
          >
            {name}
          </span>
        </a>

        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                onDark
                  ? "text-white/70 hover:bg-white/10 hover:text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle
            className={
              onDark
                ? "text-white/80 hover:bg-white/10 hover:text-white"
                : undefined
            }
          />
          <Button
            asChild
            size="sm"
            className={cn(
              "h-9 rounded-full px-4 font-semibold",
              onDark
                ? "bg-white text-ink hover:bg-white/90"
                : "bg-brand text-white hover:bg-brand/90",
            )}
          >
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Solicitar ahora
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeToggle
            className={
              onDark
                ? "text-white/80 hover:bg-white/10 hover:text-white"
                : undefined
            }
          />
          <button
            type="button"
            className={cn(
              "rounded-lg p-2 transition-colors",
              onDark
                ? "text-white hover:bg-white/10"
                : "text-foreground hover:bg-muted",
            )}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-border/60 bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 ease-out md:hidden",
          open ? "max-h-96 border-t opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="space-y-1 px-4 pb-4 pt-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Button
            asChild
            className="mt-2 w-full rounded-full bg-brand font-semibold text-white hover:bg-brand/90"
          >
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <WhatsAppIcon className="h-4 w-4" />
              Solicitar ahora
            </a>
          </Button>
        </nav>
      </div>

      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="h-px origin-left bg-brand"
      />
    </header>
  );
}
