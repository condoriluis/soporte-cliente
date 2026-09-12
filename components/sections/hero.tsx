"use client";

import { Button } from "@/components/ui/button";
import {
  Headphones, ClipboardCheck, FileCheck, ShieldCheck, Radar,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import TrackTicket from "@/components/track-ticket";
import { CONTACT } from "@/lib/contact";
import { FadeIn } from "@/components/fade-in";

const TRUST = [
  { icon: ClipboardCheck, label: "Diagnóstico sin costo" },
  { icon: FileCheck, label: "Cotización clara" },
  { icon: ShieldCheck, label: "Garantía del servicio" },
  { icon: Radar, label: "Seguimiento en línea" },
];

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: "url('/img/support.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center 25%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay para legibilidad */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, rgba(4,12,26,.95) 0%, rgba(8,22,44,.84) 45%, rgba(6,18,40,.55) 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-36">
        <div className="max-w-3xl">
          <FadeIn duration={0.6}>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight">
              Servicio técnico de PC y laptops,{" "}
              <span style={{ color: "var(--brand-light)" }}>
                rápido y garantizado
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.12} duration={0.6}>
            <p
              className="mt-6 text-lg sm:text-xl max-w-2xl leading-relaxed"
              style={{ color: "rgba(255,255,255,.78)" }}
            >
              Reparamos, mantenemos y optimizamos equipos de escritorio y
              laptops en nuestro taller o a domicilio. El diagnóstico es sin
              costo y te decimos el precio exacto antes de empezar.
            </p>
          </FadeIn>

          <FadeIn delay={0.24} duration={0.6}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full font-bold text-base px-8 shadow-xl shadow-black/20"
              style={{ background: "#fff", color: "var(--brand-dark)" }}
            >
              <a href="#formulario">
                <Headphones className="w-5 h-5 mr-2" />
                Solicitar soporte
              </a>
            </Button>

            <TrackTicket />

            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-full font-semibold text-base px-6"
              style={{ color: "#fff" }}
            >
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                WhatsApp
              </a>
            </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.36} duration={0.6}>
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {TRUST.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-3"
                style={{
                  background: "rgba(255,255,255,.07)",
                  border: "1px solid rgba(255,255,255,.14)",
                }}
              >
                <t.icon className="w-4.5 h-4.5 shrink-0" style={{ color: "var(--brand-light)" }} />
                <span className="text-xs font-semibold text-white/85 leading-tight">
                  {t.label}
                </span>
              </div>
            ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}