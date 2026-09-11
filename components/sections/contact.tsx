"use client";

import { MessageCircle, Mail, MapPin, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/settings-context";

export default function Contact() {
  const settings = useSettings();

  return (
    <section id="contacto" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="rounded-2xl border p-8 text-center flex flex-col items-center"
            style={{
              background: "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 5%, var(--card)), var(--card))",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "color-mix(in srgb, #25D366 12%, transparent)" }}
            >
              <MessageCircle className="w-8 h-8" style={{ color: "#25D366" }} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">WhatsApp</h3>
            <p className="text-sm text-muted-foreground mb-6">
              La forma más rápida de contactarnos. Respuesta inmediata en horario laboral.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full font-bold text-white px-8"
              style={{ background: "#25D366" }}
            >
              <a href="https://wa.me/59170000000" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Escribir por WhatsApp
              </a>
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-8">
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
                  <p className="text-sm text-muted-foreground">+591 70000000</p>
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
                  <p className="text-sm text-muted-foreground">soporte@{settings.institutionName.toLowerCase().replace(/\s+/g, "")}.com</p>
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
                  <p className="text-sm text-muted-foreground">La Paz, Bolivia</p>
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
                  <p className="text-sm text-muted-foreground">Lunes a Viernes: 8:30 – 17:00</p>
                  <p className="text-xs text-muted-foreground">Urgencias fuera de horario por WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
