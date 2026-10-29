import { ArrowRight, CalendarCheck, Wrench } from "lucide-react";
import type { ComponentType } from "react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import {
  FadeIn,
  FadeInStagger,
  FadeInStaggerItem,
} from "@/components/fade-in";
import { SectionHeading } from "@/components/landing/section-heading";
import { CONTACT } from "@/lib/contact";

const STEPS: {
  icon: ComponentType<{ className?: string }>;
  n: string;
  title: string;
  desc: string;
}[] = [
  {
    icon: WhatsAppIcon,
    n: "01",
    title: "Solicita",
    desc: "Escríbenos por WhatsApp o llena el formulario con tu problema y datos de contacto.",
  },
  {
    icon: CalendarCheck,
    n: "02",
    title: "Coordinamos",
    desc: "Un técnico se comunica contigo para confirmar detalles, coordinar fecha y modalidad.",
  },
  {
    icon: Wrench,
    n: "03",
    title: "Solucionamos",
    desc: "Realizamos el servicio, te mantenemos informado y confirmamos que todo quede perfecto.",
  },
];

export default function Process() {
  return (
    <section
      id="proceso"
      className="relative scroll-mt-20 overflow-hidden bg-ink py-20 text-ink-foreground sm:py-24 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade text-white"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-brand/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <FadeIn>
            <SectionHeading
              index="02"
              kicker="Cómo funciona"
              tone="inverted"
              title="Tres pasos. Cero fricción."
              description="Un proceso simple, transparente y con seguimiento en cada etapa. Tú siempre sabes qué está pasando con tu equipo."
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Empezar por WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </FadeIn>
        </div>

        <FadeInStagger className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step) => (
            <FadeInStaggerItem key={step.n} className="relative">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs tracking-[0.2em] text-brand-light">
                  {step.n}
                </span>
                <span className="h-px flex-1 bg-white/10" />
                <step.icon className="h-4 w-4 text-white/30" />
              </div>

              <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <step.icon className="h-6 w-6 text-brand-light" />
              </div>

              <h3 className="mt-5 font-display text-xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/55">
                {step.desc}
              </p>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>

        <FadeIn delay={0.1} className="mt-14">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <p className="font-display text-base font-semibold text-white">
                Todo empieza con un mensaje.
              </p>
              <p className="mt-1 text-sm text-white/50">
                Diagnóstico sin costo. Sin compromiso. Sin letras pequeñas.
              </p>
            </div>
            <a
              href="#formulario"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white/90"
            >
              Solicitar soporte
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
