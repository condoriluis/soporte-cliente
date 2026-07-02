"use client";

import { Shield, Clock, Mail, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { getSettings } from "@/lib/actions/settings-actions";

export default function Footer() {
  const [name, setName] = useState("SoportePro");

  useEffect(() => {
    getSettings().then((s) => {
      if (s?.institutionName) setName(s.institutionName);
    });
  }, []);

  return (
    <footer className="py-12 text-sm" style={{ background: "var(--brand-dark)", color: "rgba(255,255,255,.65)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="flex items-center gap-2 text-white font-bold mb-3">
              <Shield className="w-4 h-4" />
              {name}
            </p>
            <p className="leading-relaxed">
              Soporte Técnico Institucional.
              <br />
              Área de Sistemas y Soporte Técnico.
            </p>
          </div>

          {/* Horario */}
          <div>
            <p className="flex items-center gap-2 text-white font-bold mb-3">
              <Clock className="w-4 h-4" />
              Horario de Atención
            </p>
            <p className="mb-1">Lunes a Viernes: 08:30 – 17:00</p>
            <p>Urgencias fuera de horario: por correo institucional.</p>
          </div>

          {/* Contacto */}
          <div>
            <p className="flex items-center gap-2 text-white font-bold mb-3">
              <Mail className="w-4 h-4" />
              Contacto
            </p>
            <p className="flex items-center gap-2 mb-1">
              <Mail className="w-3.5 h-3.5 opacity-70" />
              chatbot.botflow@gmail.com
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 opacity-70" />
              La Paz, Bolivia
            </p>
          </div>
        </div>

        <Separator className="my-8 opacity-15" />

        <p className="text-center text-xs">
          &copy; {new Date().getFullYear()} {name} &ndash; &Aacute;rea de Sistemas y Soporte.
          Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
