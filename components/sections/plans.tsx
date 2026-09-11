"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { CONTACT } from "@/lib/contact";

interface PlanFeature {
  text: string;
}

interface Plan {
  name: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Básico",
    description: "Para cuando necesitas una solución rápida y puntual.",
    features: [
      { text: "Diagnóstico del problema" },
      { text: "Limpieza interna básica" },
      { text: "Optimización de sistema" },
      { text: "Un solo equipo" },
      { text: "Soporte por 7 días" },
    ],
  },
  {
    name: "Completo",
    description: "El más elegido. Cuidado integral para tu equipo.",
    popular: true,
    features: [
      { text: "Todo lo del plan Básico" },
      { text: "Cambio de pasta térmica" },
      { text: "Instalación de software" },
      { text: "Configuración de red" },
      { text: "Soporte por 30 días" },
      { text: "Seguimiento incluido" },
    ],
  },
  {
    name: "Empresa",
    description: "Mantenimiento continuo para tu negocio.",
    features: [
      { text: "Todo lo del plan Completo" },
      { text: "Múltiples equipos" },
      { text: "Soporte prioritario 24/5" },
      { text: "Mantenimiento mensual" },
      { text: "Reporte de estado" },
      { text: "Soporte remoto ilimitado" },
    ],
  },
];

export default function Plans() {
  return (
    <section id="planes" className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-[.14em] uppercase mb-3"
            style={{ color: "var(--brand-primary)" }}
          >
            Planes de servicio
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Elige el que necesitas
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-16 rounded-full"
            style={{ background: "var(--brand-primary)" }}
          />
          <p className="mt-5 text-muted-foreground max-w-lg mx-auto">
            Si no estás seguro, contáctanos y te ayudamos a elegir el servicio ideal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                plan.popular
                  ? "border-transparent shadow-lg"
                  : "bg-card"
              }`}
              style={
                plan.popular
                  ? {
                      borderColor: "var(--brand-primary)",
                      background: "color-mix(in srgb, var(--brand-primary) 3%, var(--card))",
                    }
                  : undefined
              }
            >
              {plan.popular && (
                <span
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full text-white"
                  style={{ background: "var(--brand-primary)" }}
                >
                  Más elegido
                </span>
              )}

              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5 text-sm">
                    <div
                      className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "color-mix(in srgb, var(--brand-primary) 10%, transparent)" }}
                    >
                      <Check className="w-3 h-3" style={{ color: "var(--brand-primary)" }} />
                    </div>
                    <span className="text-foreground">{f.text}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.popular ? "default" : "outline"}
                className="w-full rounded-xl font-semibold"
                style={
                  plan.popular
                    ? { background: "var(--brand-primary)", color: "#fff" }
                    : undefined
                }
              >
                <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="w-4 h-4 mr-2" />
                  Cotizar ahora
                </a>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          ¿Necesitas algo diferente?{" "}
          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-4"
            style={{ color: "var(--brand-primary)" }}
          >
            Solicita una cotización personalizada
          </a>
        </p>
      </div>
    </section>
  );
}
