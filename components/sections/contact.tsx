"use client";

import { Mail, MapPin, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { CONTACT } from "@/lib/contact";
import { FadeIn } from "@/components/fade-in";

export default function Contact() {
  return (
    <section id="contacto" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-[.14em] uppercase mb-3"
            style={{ color: "var(--brand-primary)" }}
          >
            Contáctanos
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            ¿Necesitas ayuda ahora?
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-16 rounded-full"
            style={{ background: "var(--brand-primary)" }}
          />
          <p className="mt-5 text-muted-foreground max-w-lg mx-auto">
            Escríbenos por WhatsApp para una respuesta inmediata o completa el formulario de solicitud.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeIn direction="right">
            <div
              className="rounded-2xl border p-8 text-center flex flex-col items-center h-full"
              style={{
                background: "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 5%, var(--card)), var(--card))",
              }}
            >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "color-mix(in srgb, #25D366 12%, transparent)" }}
            >
              <WhatsAppIcon className="w-8 h-8" style={{ color: "#25D366" }} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">WhatsApp</h3>
            <p className="text-2xl font-extrabold mb-2" style={{ color: "var(--brand-primary)" }}>
              {CONTACT.whatsappDisplay}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              La forma más rápida de contactarnos. Respuesta inmediata en horario laboral.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full font-bold text-white px-8"
              style={{ background: "#25D366" }}
            >
              <a href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                Escribir por WhatsApp
              </a>
            </Button>
            </div>
          </FadeIn>

          <FadeIn direction="left" className="h-full">
            <div className="rounded-2xl border bg-card p-8 h-full">
            <h3 className="text-xl font-bold text-foreground mb-6">Información de contacto</h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "color-mix(in srgb, var(--brand-primary) 8%, transparent)" }}
                >
                  <Phone className="w-5 h-5" style={{ color: "var(--brand-primary)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Teléfono / WhatsApp</p>
                  <p className="text-sm text-muted-foreground">{CONTACT.whatsappDisplay}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "color-mix(in srgb, var(--brand-primary) 8%, transparent)" }}
                >
                  <Mail className="w-5 h-5" style={{ color: "var(--brand-primary)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Correo electrónico</p>
                  <a href={`mailto:${CONTACT.email}`} className="text-sm text-muted-foreground hover:underline">
                    {CONTACT.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "color-mix(in srgb, var(--brand-primary) 8%, transparent)" }}
                >
                  <MapPin className="w-5 h-5" style={{ color: "var(--brand-primary)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Ubicación</p>
                  <p className="text-sm text-muted-foreground">{CONTACT.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "color-mix(in srgb, var(--brand-primary) 8%, transparent)" }}
                >
                  <Clock className="w-5 h-5" style={{ color: "var(--brand-primary)" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Horario de atención</p>
                  <p className="text-sm text-muted-foreground">{CONTACT.schedule}</p>
                </div>
              </div>
            </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}