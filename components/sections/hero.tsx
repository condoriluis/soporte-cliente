import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cpu, Headphones } from "lucide-react";

const STATS = [
  { num: "99%",  lbl: "Disponibilidad" },
  { num: "< 4h", lbl: "Tiempo respuesta" },
  { num: "24/5", lbl: "Atención" },
];

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          "linear-gradient(135deg, var(--brand-dark) 0%, #0d2240 60%, #153354 100%)",
      }}
    >
      {/* Decorative circle */}
      <div
        className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
        style={{ background: "rgba(46,125,196,.1)" }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Copy */}
          <div className="flex-1 text-center lg:text-left">
            <Badge
              className="mb-5 gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-widest uppercase"
              style={{
                background: "rgba(255,255,255,.08)",
                borderColor: "rgba(255,255,255,.18)",
                color: "#a8d4f5",
              }}
            >
              <Cpu className="w-3 h-3" />
              Área de Sistemas y Soporte Técnico
            </Badge>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Soporte Técnico{" "}
              <span style={{ color: "var(--brand-light)" }}>Profesional</span>
              <br />
              para la EMPRESA
            </h1>

            <p className="mt-4 text-lg max-w-xl mx-auto lg:mx-0" style={{ color: "rgba(255,255,255,.72)" }}>
              Brindamos asistencia técnica oportuna, eficiente y documentada
              al personal del Ministerio de Desarrollo Productivo y Economía Plural.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="rounded-full font-bold"
                style={{ background: "#fff", color: "var(--brand-dark)" }}
              >
                <a href="#formulario">
                  <Headphones className="w-4 h-4 mr-2" />
                  Solicitar Soporte
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="rounded-full font-semibold"
                style={{
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,.4)",
                  background: "transparent",
                }}
              >
                <a href="#servicios">Conocer más</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-3">
              {STATS.map((s) => (
                <div
                  key={s.lbl}
                  className="rounded-xl px-3 py-4 text-center overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,.07)",
                    border: "1px solid rgba(255,255,255,.12)",
                  }}
                >
                  <p className="text-xl sm:text-2xl font-extrabold" style={{ color: "var(--brand-light)" }}>
                    {s.num}
                  </p>
                  <p className="text-[0.6rem] sm:text-xs uppercase tracking-wide leading-tight mt-1 break-words" style={{ color: "rgba(255,255,255,.6)" }}>
                    {s.lbl}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden lg:flex flex-1 justify-center">
            <Headphones
              strokeWidth={0.6}
              className="w-56 h-56 opacity-20"
              style={{ color: "var(--brand-light)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
