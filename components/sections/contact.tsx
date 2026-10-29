"use client";

import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { CONTACT } from "@/lib/contact";
import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/landing/section-heading";

const INFO = [
  {
    icon: Phone,
    label: "Teléfono / WhatsApp",
    value: CONTACT.whatsappDisplay,
    href: CONTACT.whatsappUrl,
  },
  {
    icon: Mail,
    label: "Correo electrónico",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: CONTACT.location,
  },
  {
    icon: Clock,
    label: "Horario de atención",
    value: CONTACT.schedule,
  },
];

export default function Contact() {
  return (
    <section
      id="contacto"
      className="relative scroll-mt-20 overflow-hidden bg-ink py-20 text-ink-foreground sm:py-24 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade text-white"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-[26rem] w-[26rem] rounded-full bg-brand/25 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <FadeIn>
              <SectionHeading
                index="07"
                kicker="Contacto"
                tone="inverted"
                title="¿Necesitas ayuda ahora?"
                description="Escríbenos por WhatsApp para una respuesta inmediata o completa el formulario de solicitud."
              />
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-[#25D366] px-6 text-base font-semibold text-white hover:bg-[#1fb959]"
                >
                  <a
                    href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Escribir por WhatsApp
                  </a>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/20 bg-white/5 px-5 text-base font-medium text-white hover:bg-white/10 hover:text-white"
                >
                  <a href={`mailto:${CONTACT.email}`}>
                    <Mail className="h-4 w-4" />
                    Enviar correo
                  </a>
                </Button>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-7">
            <FadeIn delay={0.15} direction="left">
              <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
                {INFO.map((item) => (
                  <div key={item.label} className="bg-ink p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-brand-light">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="mt-1 block text-sm font-medium text-white transition-colors hover:text-brand-light"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-medium text-white">
                        {item.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
