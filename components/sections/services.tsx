import {
  Monitor, Laptop, Wrench, Thermometer, Zap, HardDrive,
  Settings, Printer, Wifi, KeyRound, MonitorCheck, Home,
  Building2, ArrowUpRight, ArrowRight, Clock, Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getServicios } from "@/lib/actions/servicio-actions";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/fade-in";
import { PreselectLink } from "@/components/preselect-link";

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
  "Impresoras": Printer,
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
  "Impresoras": "Sin papeles atascados ni cabezales secos.",
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
    <section id="servicios" className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--brand-primary) 7%, transparent) 1px, transparent 0)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14 md:mb-20">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[.14em] uppercase mb-3 px-3 py-1 rounded-full text-white" style={{ background: "var(--brand-primary)" }}>
            <Sparkles className="w-3.5 h-3.5" />
            Nuestros servicios
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Todo lo que tu equipo necesita
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Precios claros desde el inicio. El diagnóstico es sin costo y solo
            trabajamos cuando confirmas el presupuesto.
          </p>
        </FadeIn>

        {populares.length > 0 && (
          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {populares.map((s) => {
              const Icon = ICONS[s.nombre] || Settings;
              return (
                <FadeInStaggerItem key={s.nombre}>
                  <PreselectLink
                    nombre={s.nombre}
                    className="group hover:no-underline relative flex flex-col h-full overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                    style={{
                      borderColor: "transparent",
                      background:
                        "linear-gradient(160deg, color-mix(in srgb, var(--brand-primary) 7%, var(--card)) 0%, var(--card) 55%)",
                      boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--brand-primary) 14%, transparent)",
                    }}
                  >
                    <div
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-1"
                      style={{ background: `linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))` }}
                    />
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="w-11 h-11 flex items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))` }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <ArrowUpRight
                        className="w-4 h-4 transition-all duration-300 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
                        style={{ color: "var(--brand-primary)" }}
                      />
                    </div>

                    <h3 className="font-bold text-foreground">{s.nombre}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1.5 mb-5 flex-1">
                      {s.description}
                    </p>

                    <div className="flex items-center justify-between border-t pt-4" style={{ borderColor: "color-mix(in srgb, var(--brand-primary) 12%, transparent)" }}>
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" style={{ color: "var(--brand-primary)" }} />
                        {s.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--brand-primary)" }}>
                        Solicitar
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </PreselectLink>
                </FadeInStaggerItem>
              );
            })}
          </FadeInStagger>
        )}

        <FadeInStagger
          stagger={0.05}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {regulares.map((s) => {
            const Icon = ICONS[s.nombre] || Settings;
            return (
              <FadeInStaggerItem key={s.nombre}>
                <PreselectLink
                  nombre={s.nombre}
                  className="group hover:no-underline flex items-start gap-4 rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-foreground/[0.01]"
                >
                  <div
                    className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg transition-colors duration-300"
                    style={{ background: "color-mix(in srgb, var(--brand-primary) 8%, transparent)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "var(--brand-primary)" }} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">{s.nombre}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                      {s.description}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" style={{ color: "var(--brand-primary)" }} />
                        {s.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--brand-primary)" }}>
                        Solicitar
                        <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </PreselectLink>
              </FadeInStaggerItem>
            );
          })}
        </FadeInStagger>

        <FadeIn className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            ¿No encuentras el servicio?{" "}
            <a href="#formulario" className="font-semibold underline underline-offset-4" style={{ color: "var(--brand-primary)" }}>
              Escríbenos
            </a>{" "}
            y te ayudamos a encontrar la solución.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}