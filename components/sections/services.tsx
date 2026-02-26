import { Card, CardContent } from "@/components/ui/card";
import {
  Monitor,
  Code2,
  Wifi,
  ShieldCheck,
  CloudUpload,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

const SERVICES: Service[] = [
  {
    icon: Monitor,
    title: "Soporte de Hardware",
    description:
      "Diagnóstico, mantenimiento preventivo y correctivo de equipos de cómputo, impresoras y periféricos.",
  },
  {
    icon: Code2,
    title: "Soporte de Software",
    description:
      "Instalación, configuración y resolución de problemas en sistemas operativos y aplicaciones institucionales.",
  },
  {
    icon: Wifi,
    title: "Redes y Conectividad",
    description:
      "Gestión de la red institucional, puntos de acceso, VPN y diagnóstico de fallas de conectividad.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad Informática",
    description:
      "Protección de datos, gestión de antivirus, control de accesos y políticas de seguridad institucional.",
  },
  {
    icon: CloudUpload,
    title: "Respaldo y Recuperación",
    description:
      "Backup automatizado de información crítica y planes de recuperación ante desastres tecnológicos.",
  },
  {
    icon: Users,
    title: "Capacitación y Mesa de Ayuda",
    description:
      "Orientación al usuario final, talleres de herramientas institucionales y atención centralizada de incidencias.",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-background py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-[.14em] uppercase mb-2"
            style={{ color: "var(--brand-accent)" }}
          >
            ¿Qué ofrecemos?
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Nuestros Servicios de Soporte
          </h2>
          <div
            className="mx-auto mt-4 mb-5 h-1 w-12 rounded-full"
            style={{ background: "var(--brand-accent)" }}
          />
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            El Área de Sistemas y Soporte garantiza la continuidad tecnológica
            de todos los procesos institucionales de la EMPRESA.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="group border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default"
            >
              <CardContent className="p-8">
                <div
                  className="w-14 h-14 flex items-center justify-center rounded-2xl mb-5 transition-colors"
                  style={{ background: "#e8f1fb" }}
                >
                  <Icon
                    className="w-7 h-7 transition-colors"
                    style={{ color: "var(--brand-accent)" }}
                  />
                </div>
                <h3 className="font-bold text-base mb-2 text-foreground">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
