"use client";

import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "María González",
    role: "Gerente Administrativa",
    text: "Mi laptop estaba funcionando muy lento. En menos de 3 horas la dejaron como nueva. Excelente servicio y muy profesional. Totalmente recomendado.",
    rating: 5,
    initials: "MG",
  },
  {
    name: "Carlos Mendoza",
    role: "Contador Público",
    text: "Contraté el servicio de mantenimiento para 3 PCs de la oficina. Llegaron a tiempo, dejaron todo funcionando perfecto y el precio fue muy razonable.",
    rating: 5,
    initials: "CM",
  },
  {
    name: "Ana Lucía Torrez",
    role: "Diseñadora Gráfica",
    text: "Tenía un problema con mi impresora que no podía resolver. Llamé por WhatsApp y al día siguiente ya estaba funcionando. Muy buena atención.",
    rating: 5,
    initials: "AT",
  },
  {
    name: "Roberto Vargas",
    role: "Emprendedor",
    text: "Como dueño de un café necesitaba soporte técnico confiable. Ahora tienen mi mantenimiento mensual y mis equipos siempre funcionan bien.",
    rating: 5,
    initials: "RV",
  },
  {
    name: "Laura Jiménez",
    role: "Abogada",
    text: "Excelente experiencia. Mi laptop tenía virus y pensaba que había perdido mis archivos. Recuperaron todo y la dejaron funcionando perfectamente.",
    rating: 5,
    initials: "LJ",
  },
  {
    name: "Diego Flores",
    role: "Ingeniero Civil",
    text: "El soporte remoto fue rápido y efectivo. Resolvieron mi problema de conectividad en 40 minutos sin necesidad de ir a la oficina. Muy práctico.",
    rating: 5,
    initials: "DF",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonios" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p
            className="text-xs font-bold tracking-[.14em] uppercase mb-3"
            style={{ color: "var(--brand-primary)" }}
          >
            Opiniones de clientes
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Lo que dicen nuestros clientes
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-16 rounded-full"
            style={{ background: "var(--brand-primary)" }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-card rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-current"
                    style={{ color: "var(--brand-primary)" }}
                  />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: "var(--brand-primary)" }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
