"use client";

import { Clock, Mail, MapPin, Phone, Shield } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { useSettings } from "@/lib/settings-context";
import { CONTACT } from "@/lib/contact";

const SERVICES = [
  "Mantenimiento de PC",
  "Mantenimiento de laptop",
  "Limpieza interna",
  "Optimización de Windows",
  "Soporte remoto",
  "Soporte a domicilio",
];

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Cómo funciona" },
  { href: "#planes", label: "Planes" },
  { href: "#testimonios", label: "Opiniones" },
  { href: "#faq", label: "Preguntas frecuentes" },
  { href: "#formulario", label: "Solicitar servicio" },
];

export default function Footer() {
  const settings = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#070c14] text-white/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-sm font-semibold text-white">
                {settings.institutionName}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Soporte técnico profesional para computadoras y laptops.
              Mantenimiento, reparación y asistencia especializada.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                {CONTACT.schedule}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Servicios
            </h4>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((service) => (
                <li key={service}>
                  <a
                    href="#servicios"
                    className="text-sm transition-colors hover:text-white"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Enlaces
            </h4>
            <ul className="mt-4 space-y-2.5">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Contacto
            </h4>
            <div className="mt-4 space-y-3">
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm transition-colors hover:text-white"
              >
                <WhatsAppIcon
                  className="h-4 w-4 shrink-0"
                  style={{ color: "#25D366" }}
                />
                WhatsApp
              </a>
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="h-4 w-4 shrink-0 opacity-50" />
                {CONTACT.whatsappDisplay}
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="h-4 w-4 shrink-0 opacity-50" />
                {CONTACT.email}
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <MapPin className="h-4 w-4 shrink-0 opacity-50" />
                {CONTACT.location}
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Clock className="h-4 w-4 shrink-0 opacity-50" />
                {CONTACT.schedule}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs sm:flex-row sm:px-6 lg:px-8">
          <p>
            &copy; {year} {settings.institutionName}. Todos los derechos
            reservados.
          </p>
          <p className="font-mono uppercase tracking-[0.18em] text-white/30">
            Soporte técnico · El Alto — La Paz
          </p>
        </div>
      </div>
    </footer>
  );
}
