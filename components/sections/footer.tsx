"use client";

import { Shield, Mail, MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/lib/settings-context";

const SERVICES = [
  "Mantenimiento de PC",
  "Mantenimiento de laptop",
  "Limpieza interna",
  "Optimización de Windows",
  "Soporte remoto",
  "Soporte a domicilio",
];

export default function Footer() {
  const settings = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-background" />
              </div>
              <span className="text-white font-bold text-sm">{settings.institutionName}</span>
            </div>
            <p className="text-sm leading-relaxed">
              Soporte técnico profesional para computadoras y laptops. Mantenimiento, reparación y asistencia técnica especializada.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Servicios</h4>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s}>
                  <a href="#servicios" className="text-sm hover:text-white transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li><a href="#servicios" className="text-sm hover:text-white transition-colors">Servicios</a></li>
              <li><a href="#proceso" className="text-sm hover:text-white transition-colors">Cómo funciona</a></li>
              <li><a href="#testimonios" className="text-sm hover:text-white transition-colors">Opiniones</a></li>
              <li><a href="#faq" className="text-sm hover:text-white transition-colors">Preguntas frecuentes</a></li>
              <li><a href="#formulario" className="text-sm hover:text-white transition-colors">Solicitar servicio</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contacto</h4>
            <div className="space-y-3">
              <a
                href="https://wa.me/59170000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#25D366" }} />
                WhatsApp
              </a>
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0 opacity-60" />
                +591 70000000
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0 opacity-60" />
                soporte@{settings.institutionName.toLowerCase().replace(/\s+/g, "")}.com
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 opacity-60" />
                La Paz, Bolivia
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Clock className="w-4 h-4 flex-shrink-0 opacity-60" />
                Lun - Vie: 8:30 – 17:00
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <p className="text-center text-xs">
          &copy; {year} {settings.institutionName}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
