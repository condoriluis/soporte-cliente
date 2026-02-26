import { Shield, Clock, Mail, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="py-12 text-sm" style={{ background: "var(--brand-dark)", color: "rgba(255,255,255,.65)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="flex items-center gap-2 text-white font-bold mb-3">
              <Shield className="w-4 h-4" />
              EMPRESA
            </p>
            <p className="leading-relaxed">
              Ministerio de Desarrollo Productivo y Economía Plural.
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
              sistemas@empresa.gob.bo
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 opacity-70" />
              La Paz, Bolivia
            </p>
          </div>
        </div>

        <Separator className="my-8 opacity-15" />

        <p className="text-center text-xs">
          &copy; {new Date().getFullYear()} EMPRESA – Área de Sistemas y Soporte.
          Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
