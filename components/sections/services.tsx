import {
  Monitor,
  Laptop,
  Wrench,
  Thermometer,
  Zap,
  HardDrive,
  Settings,
  Printer,
  Wifi,
  KeyRound,
  MonitorCheck,
  Home,
  Building2,
  ArrowRight,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getServicios } from "@/lib/actions/servicio-actions";
import {
  FadeIn,
  FadeInStagger,
  FadeInStaggerItem,
} from "@/components/fade-in";
import { PreselectLink } from "@/components/preselect-link";
import { SectionHeading } from "@/components/landing/section-heading";

interface Service {
  nombre: string;
  description: string;
  duration: string;
  popular: boolean;
}

const ICONS: Record<string, LucideIcon> = {
  "Mantenimiento de PC": Monitor,
  "Mantenimiento de laptop": Laptop,
  "Limpieza interna": Wrench,
  "Cambio de pasta térmica": Thermometer,
  "Optimización de Windows": Zap,
  "Liberación de espacio": HardDrive,
  "Instalación de software": Settings,
  Impresoras: Printer,
  "Wi-Fi / redes": Wifi,
  "Recuperación de acceso": KeyRound,
  "Soporte remoto": MonitorCheck,
  "Soporte a domicilio": Home,
  "Soporte para negocios": Building2,
};

const HIGHLIGHTS: Record<string, string> = {
  "Mantenimiento de PC": "La base de todo equipo que respira.",
  "Mantenimiento de laptop": "Portátiles ágiles y frescas.",
  "Limpieza interna": "Adiós al polvo acumulado.",
  "Cambio de pasta térmica": "Menos calor, más rendimiento.",
  "Optimización de Windows": "Arranque y respuesta inmediatos.",
  "Liberación de espacio": "Disco ordenado, mente tranquila.",
  "Instalación de software": "Todo listo para trabajar.",
  Impresoras: "Sin papeles atascados ni cabezales secos.",
  "Wi-Fi / redes": "Señal estable en toda tu casa u oficina.",
  "Recuperación de acceso": "Volvemos a entrar, sin dramas.",
  "Soporte remoto": "Te ayudamos sin moverte del sofá.",
  "Soporte a domicilio": "Llegamos a tu ubicación.",
  "Soporte para negocios": "Tu oficina siempre operativa.",
};

export default async function Services() {
  const servicios = await getServicios();

  const data: Service[] = servicios
    .filter((s) => s.activo)
    .map((s) => ({
      nombre: s.nombre,
      description: s.descripcion || HIGHLIGHTS[s.nombre] || "",
      duration: s.duracion || "A consultar",
      popular: s.popular,
    }));

  const populares = data.filter((s) => s.popular);
  const regulares = data.filter((s) => !s.popular);

  return (
    <section
      id="servicios"
      className="relative scroll-mt-20 overflow-hidden py-20 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade text-foreground opacity-40"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <FadeIn>
            <SectionHeading
              index="01"
              kicker="Servicios"
              title={
                <>
                  Todo lo que tu equipo necesita,{" "}
                  <span className="text-primary">en un solo lugar.</span>
                </>
              }
              description="Precios claros desde el inicio. El diagnóstico es sin costo y solo trabajamos cuando confirmas el presupuesto."
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <a
              href="#formulario"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Solicitar diagnóstico
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </FadeIn>
        </div>

        {populares.length > 0 && (
          <FadeInStagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {populares.map((service) => {
              const Icon = ICONS[service.nombre] || Settings;
              return (
                <FadeInStaggerItem key={service.nombre}>
                  <PreselectLink
                    nombre={service.nombre}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>

                    <h3 className="mt-5 font-display text-base font-semibold text-foreground">
                      {service.nombre}
                    </h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        {service.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        Solicitar
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </PreselectLink>
                </FadeInStaggerItem>
              );
            })}
          </FadeInStagger>
        )}

        <FadeInStagger
          stagger={0.04}
          className="mt-4 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {regulares.map((service) => {
            const Icon = ICONS[service.nombre] || Settings;
            return (
              <FadeInStaggerItem key={service.nombre}>
                <PreselectLink
                  nombre={service.nombre}
                  className="group flex h-full items-start gap-4 bg-card p-5 transition-colors duration-300 hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium text-foreground">
                        {service.nombre}
                      </h3>
                      <ArrowRight className="h-4 w-4 shrink-0 -translate-x-1 text-transparent transition-all duration-300 group-hover:translate-x-0 group-hover:text-primary" />
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <Clock className="h-3 w-3 text-primary" />
                      {service.duration}
                    </span>
                  </div>
                </PreselectLink>
              </FadeInStaggerItem>
            );
          })}
        </FadeInStagger>

        <FadeIn className="mt-10">
          <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">
              ¿No encuentras el servicio que necesitas? Cuéntanos el problema y
              lo resolvemos.
            </p>
            <a
              href="#formulario"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Escríbenos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
