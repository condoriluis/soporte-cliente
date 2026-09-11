"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Headphones, MessageCircle, ArrowRight, Shield, Clock, Zap } from "lucide-react";

const STATS = [
  { icon: Shield, num: "+500", lbl: "Equipos atendidos" },
  { icon: Clock, num: "< 4h", lbl: "Tiempo de respuesta" },
  { icon: Zap, num: "98%", lbl: "Satisfacción" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "var(--brand-primary)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full opacity-[0.03]"
          style={{ background: "var(--brand-secondary)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <Badge
            className="mb-6 gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wider uppercase"
            style={{
              background: "color-mix(in srgb, var(--brand-primary) 8%, transparent)",
              borderColor: "color-mix(in srgb, var(--brand-primary) 15%, transparent)",
              color: "var(--brand-primary)",
            }}
          >
            <Headphones className="w-3.5 h-3.5" />
            Soporte técnico profesional
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight">
            Tu PC y laptop en{" "}
            <span style={{ color: "var(--brand-primary)" }}>
              mejores manos
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Mantenimiento, limpieza, optimización y asistencia técnica
            para equipos de escritorio y laptops.{" "}
            <span className="font-semibold text-foreground">Rápido, profesional y garantizado.</span>
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full font-bold text-base px-8 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              style={{ background: "var(--brand-primary)" }}
            >
              <a href="https://wa.me/59170000000" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Solicitar por WhatsApp
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full font-semibold text-base px-8 border-2"
              style={{ borderColor: "color-mix(in srgb, var(--brand-primary) 30%, transparent)" }}
            >
              <a href="#formulario">
                Llenar formulario
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {STATS.map((s) => (
              <div key={s.lbl} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2" style={{ background: "color-mix(in srgb, var(--brand-primary) 8%, transparent)" }}>
                  <s.icon className="w-5 h-5" style={{ color: "var(--brand-primary)" }} />
                </div>
                <p className="text-xl sm:text-2xl font-extrabold text-foreground">{s.num}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
