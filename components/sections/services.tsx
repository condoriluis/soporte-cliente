"use client";

import {
  Monitor, Laptop, Wrench, Thermometer, Zap, HardDrive,
  Settings, Printer, Wifi, KeyRound, MonitorCheck, Home,
  Building2, ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  duration: string;
  popular?: boolean;
}

const SERVICES: Service[] = [
  {
    icon: Monitor,
    title: "Mantenimiento de PC",
    description: "Limpieza interna, cambio de pasta térmica, revisión de componentes y optimización completa.",
    duration: "2-3 horas",
    popular: true,
  },
  {
    icon: Laptop,
    title: "Mantenimiento de laptop",
    description: "Service completo para laptops: limpieza, optimización, revisión de batería y pantalla.",
    duration: "2-4 horas",
    popular: true,
  },
  {
    icon: Wrench,
    title: "Limpieza interna",
    description: "Remoción de polvo, limpieza de ventiladores, ductos de aire y componentes internos.",
    duration: "1-2 horas",
  },
  {
    icon: Thermometer,
    title: "Cambio de pasta térmica",
    description: "Reemplazo de pasta térmica del procesador y GPU para mejorar la disipación de calor.",
    duration: "1 hora",
  },
  {
    icon: Zap,
    title: "Optimización de Windows",
    description: "Limpieza de software innecesario, desactivación de servicios y ajuste del sistema.",
    duration: "1-2 horas",
  },
  {
    icon: HardDrive,
    title: "Liberación de espacio",
    description: "Eliminación de archivos temporales, programas en desuso y liberación de disco duro.",
    duration: "1 hora",
  },
  {
    icon: Settings,
    title: "Instalación de software",
    description: "Instalación y configuración de sistemas operativos, Office, antivirus y applications.",
    duration: "1-3 horas",
  },
  {
    icon: Printer,
    title: "Impresoras",
    description: "Instalación, configuración, limpieza de cabezales y resolución de problemas de impresión.",
    duration: "1-2 horas",
  },
  {
    icon: Wifi,
    title: "Wi-Fi y Redes",
    description: "Configuración de redes, routers, puntos de acceso y resolución de conectividad.",
    duration: "1-2 horas",
  },
  {
    icon: KeyRound,
    title: "Recuperación de acceso",
    description: "Recuperación de contraseñas, cuentas bloqueadas y accesos autorizados perdidos.",
    duration: "30 min - 1 hora",
  },
  {
    icon: MonitorCheck,
    title: "Soporte remoto",
    description: "Asistencia técnica en línea para problemas de software sin necesidad de traslado.",
    duration: "30 min - 1 hora",
    popular: true,
  },
  {
    icon: Home,
    title: "Soporte a domicilio",
    description: "Vamos a tu ubicación para resolver problemas presencialmente. Cubrimos toda la ciudad.",
    duration: "Variable",
  },
  {
    icon: Building2,
    title: "Soporte para negocios",
    description: "Planes de mantenimiento para PyMEs. Múltiples equipos, soporte prioritario y seguimiento.",
    duration: "Según plan",
    popular: true,
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-[.14em] uppercase mb-3"
            style={{ color: "var(--brand-primary)" }}
          >
            Nuestros servicios
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Todo lo que tu equipo necesita
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-16 rounded-full"
            style={{ background: "var(--brand-primary)" }}
          />
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
            Soluciones técnicas completas para computadoras de escritorio, laptops y dispositivos de oficina.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
            >
              {s.popular && (
                <span
                  className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
                  style={{ background: "var(--brand-primary)" }}
                >
                  Popular
                </span>
              )}

              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl mb-4 transition-colors"
                style={{ background: "color-mix(in srgb, var(--brand-primary) 8%, transparent)" }}
              >
                <s.icon
                  className="w-6 h-6"
                  style={{ color: "var(--brand-primary)" }}
                />
              </div>

              <h3 className="font-bold text-foreground mb-1.5">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {s.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground font-medium">
                  Duración: {s.duration}
                </span>
                <a
                  href="#formulario"
                  className="inline-flex items-center gap-1 text-xs font-semibold transition-colors"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Solicitar
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
