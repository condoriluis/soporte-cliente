import { CalendarCheck, Wrench } from "lucide-react";
import type { ComponentType } from "react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/fade-in";

const STEPS: { icon: ComponentType<{ className?: string }>; n: number; title: string; desc: string }[] = [
  {
    icon: WhatsAppIcon,
    n: 1,
    title: "Solicita",
    desc: "Escríbenos por WhatsApp o llena el formulario con tu problema y datos de contacto.",
  },
  {
    icon: CalendarCheck,
    n: 2,
    title: "Coordinamos",
    desc: "Un técnico se comunica contigo para confirmar detalles, coordinar fecha y modalidad.",
  },
  {
    icon: Wrench,
    n: 3,
    title: "Solucionamos",
    desc: "Realizamos el servicio, te mantenemos informado y confirmamos que todo quede perfecto.",
  },
];

export default function Process() {
  return (
    <section id="proceso" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-[.14em] uppercase mb-3"
            style={{ color: "var(--brand-primary)" }}
          >
            ¿Cómo funciona?
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Tres pasos simples
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-16 rounded-full"
            style={{ background: "var(--brand-primary)" }}
          />
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {STEPS.map((step, i) => (
            <FadeInStaggerItem key={step.n} className="relative text-center">
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
              )}

              <div
                className="relative mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, var(--brand-primary), color-mix(in srgb, var(--brand-secondary) 80%, var(--brand-primary)))`,
                }}
              >
                <step.icon className="w-9 h-9 text-white" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold text-foreground">
                  {step.n}
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </FadeInStaggerItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
