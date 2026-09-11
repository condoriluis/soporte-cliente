"use client";

import { useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

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
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-testimonial]");
    const gap = 20; // gap-5
    const step = card ? card.offsetWidth + gap : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section id="testimonios" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
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

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Testimonios anteriores"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 rounded-full border bg-card text-foreground shadow-sm transition-colors hover:bg-muted -ml-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Siguientes testimonios"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 rounded-full border bg-card text-foreground shadow-sm transition-colors hover:bg-muted -mr-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={trackRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 pb-4"
          >
            {TESTIMONIALS.map((t) => (
              <article
                key={t.name}
                data-testimonial
                className="shrink-0 snap-start w-[82%] sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] bg-card rounded-2xl border p-6 flex flex-col transition-shadow hover:shadow-lg"
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

                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 mt-6 border-t border-border/50">
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
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}