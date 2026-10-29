"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { CONTACT } from "@/lib/contact";
import {
  FadeIn,
  FadeInStagger,
  FadeInStaggerItem,
} from "@/components/fade-in";
import { SectionHeading } from "@/components/landing/section-heading";
import { cn } from "@/lib/utils";

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
    <section id="planes" className="scroll-mt-20 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <FadeIn>
            <SectionHeading
              index="03"
              kicker="Planes"
              title="Elige el nivel de cuidado."
              description="Si no estás seguro, contáctanos y te ayudamos a elegir el servicio ideal para tu equipo."
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
              Sin costos ocultos
              <br />
              Pago al finalizar
            </p>
          </FadeIn>
        </div>

        <FadeInStagger className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
          {PLANS.map((plan) => (
            <FadeInStaggerItem key={plan.name}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-7 transition-all duration-300",
                  plan.popular
                    ? "border-white/10 bg-ink text-white shadow-elevated md:-my-2"
                    : "bg-card hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated",
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-7 rounded-full bg-brand px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
                    Recomendado
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <h3
                    className={cn(
                      "font-display text-xl font-semibold",
                      plan.popular ? "text-white" : "text-foreground",
                    )}
                  >
                    {plan.name}
                  </h3>
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-wider",
                      plan.popular ? "text-white/40" : "text-muted-foreground",
                    )}
                  >
                    {plan.popular ? "más elegido" : "plan"}
                  </span>
                </div>

                <p
                  className={cn(
                    "mt-1.5 text-sm leading-relaxed",
                    plan.popular ? "text-white/55" : "text-muted-foreground",
                  )}
                >
                  {plan.description}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          plan.popular
                            ? "bg-white/10 text-brand-light"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span
                        className={
                          plan.popular ? "text-white/80" : "text-foreground"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={cn(
                    "mt-7 h-11 w-full rounded-xl font-semibold",
                    plan.popular
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
                    Cotizar ahora
                  </a>
                </Button>
              </div>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>

        <FadeIn>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿Necesitas algo diferente?{" "}
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Solicita una cotización personalizada
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
