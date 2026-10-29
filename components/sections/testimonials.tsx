"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/landing/section-heading";

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
    const gap = 20;
    const step = card ? card.offsetWidth + gap : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section
      id="testimonios"
      className="scroll-mt-20 bg-muted/40 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <FadeIn>
            <SectionHeading
              index="04"
              kicker="Opiniones"
              title="Lo que dicen nuestros clientes."
              description="Personas y negocios que ya dejaron sus equipos en nuestras manos."
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="Testimonios anteriores"
                className="flex h-10 w-10 items-center justify-center rounded-full border bg-card text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="Siguientes testimonios"
                className="flex h-10 w-10 items-center justify-center rounded-full border bg-card text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="mt-12">
          <div
            ref={trackRef}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
          >
            {TESTIMONIALS.map((testimonial) => (
              <article
                key={testimonial.name}
                data-testimonial
                className="flex w-[84%] shrink-0 snap-start flex-col rounded-2xl border bg-card p-6 transition-colors duration-300 hover:border-primary/30 sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-current text-primary"
                      />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-primary/20" />
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-border/70 pt-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
