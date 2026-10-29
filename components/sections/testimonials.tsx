"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquarePlus,
  Quote,
  ShieldCheck,
  Star,
} from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { SectionHeading } from "@/components/landing/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getTestimoniosPublicos,
  submitTestimonio,
} from "@/lib/actions/testimonio-actions";
import {
  INITIAL_TESTIMONIALS,
  type TestimonioItem,
} from "@/lib/testimonials-data";


const RATING_LABELS: Record<number, string> = {
  1: "Malo (1 estrella)",
  2: "Regular (2 estrellas)",
  3: "Bueno (3 estrellas)",
  4: "Muy bueno (4 estrellas)",
  5: "¡Excelente servicio! (5 estrellas)",
};

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Lista de testimonios (inicializa con los por defecto, luego carga los de la BD)
  const [items, setItems] = useState<TestimonioItem[]>(INITIAL_TESTIMONIALS);

  // Estado del modal de nueva opinión
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const [comentario, setComentario] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Cargar testimonios aprobados de la base de datos
  useEffect(() => {
    let cancelled = false;
    getTestimoniosPublicos()
      .then((data) => {
        if (!cancelled && data && data.length > 0) {
          setItems(data);
        }
      })
      .catch(() => {
        // En caso de error de red, se mantienen los datos iniciales
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-testimonial]");
    const gap = 20;
    const step = card ? card.offsetWidth + gap : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || nombre.trim().length < 2) {
      toast.error("Por favor ingresa tu nombre (mínimo 2 letras).");
      return;
    }
    if (!comentario.trim() || comentario.trim().length < 10) {
      toast.error("El comentario debe tener al menos 10 caracteres.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitTestimonio({
        nombre: nombre.trim(),
        cargo: cargo.trim() || undefined,
        comentario: comentario.trim(),
        calificacion: rating,
        hp: honeypot,
        ts: String(Date.now()),
      });

      if (res.success) {
        toast.success(res.message || "¡Gracias por tu opinión!", {
          description: "Será publicada una vez aprobada por nuestro equipo.",
          duration: 6000,
        });
        setNombre("");
        setCargo("");
        setComentario("");
        setRating(5);
        setModalOpen(false);
      } else {
        toast.error(res.error || "Ocurrió un error al enviar tu opinión.");
      }
    } catch {
      toast.error("No se pudo conectar con el servidor. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
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
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={() => setModalOpen(true)}
                className="gap-2 rounded-full bg-primary font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                <MessageSquarePlus className="h-4 w-4" />
                Dejar mi opinión
              </Button>

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
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="mt-12">
          <div
            ref={trackRef}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
          >
            {items.map((testimonial, idx) => {
              const stars = Math.min(Math.max(testimonial.calificacion, 1), 5);
              const initials = getInitials(testimonial.nombre);

              return (
                <article
                  key={testimonial.id || `${testimonial.nombre}-${idx}`}
                  data-testimonial
                  className="flex w-[84%] shrink-0 snap-start flex-col rounded-2xl border bg-card p-6 transition-colors duration-300 hover:border-primary/30 sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)] shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: stars }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-current text-primary"
                        />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-primary/20" />
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{testimonial.comentario}&rdquo;
                  </p>

                  <div className="mt-6 flex items-center gap-3 border-t border-border/70 pt-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {testimonial.nombre}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {testimonial.cargo || "Cliente"}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </FadeIn>
      </div>

      {/* Modal Dialog para Dejar una Opinión */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Comparte tu opinión
            </DialogTitle>
            <DialogDescription>
              Tu experiencia nos ayuda a seguir mejorando y orienta a otros clientes que necesitan soporte técnico.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Honeypot anti-bot oculto */}
            <input
              type="text"
              name="hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Selector interactivo de estrellas */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                ¿Cómo calificarías nuestro servicio? *
              </Label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isFilled =
                    (hoverRating !== null ? hoverRating : rating) >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="group p-1 transition-transform hover:scale-110 focus:outline-none"
                      aria-label={`Calificar con ${starVal} estrellas`}
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          isFilled
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted-foreground/40 group-hover:text-amber-300"
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-2 text-xs font-medium text-muted-foreground">
                  {RATING_LABELS[hoverRating ?? rating]}
                </span>
              </div>
            </div>

            {/* Nombre completo */}
            <div className="space-y-1.5">
              <Label htmlFor="opinion-nombre" className="text-xs font-semibold">
                Tu nombre o iniciales *
              </Label>
              <Input
                id="opinion-nombre"
                placeholder="Ej. Roberto Vargas"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                maxLength={80}
                required
                className="h-10"
              />
            </div>

            {/* Cargo / Profesión / Tipo de soporte */}
            <div className="space-y-1.5">
              <Label htmlFor="opinion-cargo" className="text-xs font-semibold">
                Cargo, profesión o servicio recibido (opcional)
              </Label>
              <Input
                id="opinion-cargo"
                placeholder="Ej. Mantenimiento Laptop Dell / Negocio local"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                maxLength={100}
                className="h-10"
              />
            </div>

            {/* Comentario */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="opinion-comentario" className="text-xs font-semibold">
                  Tu experiencia / comentario *
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {comentario.length}/600
                </span>
              </div>
              <Textarea
                id="opinion-comentario"
                placeholder="Cuéntanos cómo fue el soporte técnico recibido, la atención, el tiempo de entrega..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={4}
                maxLength={600}
                required
                className="resize-none text-sm"
              />
            </div>

            {/* Aviso de moderación y seguridad */}
            <div className="flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <span>
                Por políticas de calidad y seguridad, todas las opiniones son revisadas y aprobadas por nuestro equipo antes de publicarse en la web.
              </span>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <MessageSquarePlus className="h-4 w-4" />
                    Publicar opinión
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
