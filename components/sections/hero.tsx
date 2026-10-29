"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Headphones,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import TrackTicket from "@/components/track-ticket";
import { CONTACT } from "@/lib/contact";
import { FadeIn } from "@/components/fade-in";
import { useSettings } from "@/lib/settings-context";
import { cn } from "@/lib/utils";

const STATS = [
  { label: "Diagnóstico", value: "Sin costo" },
  { label: "Respuesta", value: "< 2 h" },
  { label: "Garantía", value: "30 días" },
];

const CHECKS = [
  "Diagnóstico de hardware",
  "Salud de disco y memoria",
  "Optimización del sistema",
  "Pruebas finales",
];

const PROGRESS = [0, 24, 48, 68, 100];

const BRANDS = [
  "HP",
  "LENOVO",
  "DELL",
  "ASUS",
  "ACER",
  "APPLE",
  "SAMSUNG",
  "TOSHIBA",
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <Image
        src="/img/support.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-[center_25%]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(4,12,26,0.96)_0%,rgba(8,22,44,0.86)_45%,rgba(6,18,40,0.58)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-24 h-[36rem] w-[36rem] rounded-full bg-brand/25 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-24 h-[30rem] w-[30rem] rounded-full bg-brand-secondary/20 blur-[120px]"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-8 lg:pb-28 lg:pt-36 xl:px-8">
        <div className="lg:col-span-7 lg:pr-6">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Soporte técnico · El Alto — La Paz
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <h1 className="mt-6 font-display text-[2.75rem] font-semibold leading-[1.02] tracking-tight text-balance text-white sm:text-6xl lg:text-[4.25rem]">
              Tu equipo vuelve a rendir.{" "}
              <span className="text-brand-light">
                Sin vueltas, sin sorpresas.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/65 sm:text-lg">
              Reparación, mantenimiento y optimización de PC y laptops.
              Diagnóstico sin costo, precio cerrado antes de empezar y
              seguimiento en línea de cada ticket.
            </p>
          </FadeIn>

          <FadeIn delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-white px-6 text-base font-semibold text-ink hover:bg-white/90"
              >
                <a href="#formulario">
                  <Headphones className="h-4 w-4" />
                  Solicitar soporte
                </a>
              </Button>

              <TrackTicket />

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-white/20 bg-white/5 px-5 text-base font-medium text-white hover:bg-white/10 hover:text-white"
              >
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.32}>
            <dl className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-white/10">
              {STATS.map((stat) => (
                <div key={stat.label} className="px-4 py-4 first:pl-0">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-display text-lg font-semibold text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>

        <div className="lg:col-span-5">
          <FadeIn delay={0.2} direction="left">
            <DiagnosticConsole />
          </FadeIn>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-ink/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 sm:block">
            Marcas que atendemos
          </span>
          <div className="marquee mask-fade-x flex-1">
            <div className="marquee-track">
              <div className="flex shrink-0 items-center gap-10 pr-10">
                {BRANDS.map((brand) => (
                  <span
                    key={brand}
                    className="font-display text-sm font-medium tracking-[0.18em] text-white/40"
                  >
                    {brand}
                  </span>
                ))}
              </div>
              <div
                className="flex shrink-0 items-center gap-10 pr-10"
                aria-hidden
              >
                {BRANDS.map((brand) => (
                  <span
                    key={`${brand}-dup`}
                    className="font-display text-sm font-medium tracking-[0.18em] text-white/40"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DiagnosticConsole() {
  const reduce = useReducedMotion();
  const settings = useSettings();
  const [state, setState] = useState({ ticket: 2841, step: 3 });

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setState((prev) =>
        prev.step >= 4
          ? {
              ticket: prev.ticket >= 9999 ? 2841 : prev.ticket + 1,
              step: 0,
            }
          : { ...prev, step: prev.step + 1 },
      );
    }, 2400);
    return () => clearInterval(id);
  }, [reduce]);

  const { ticket } = state;
  const step = reduce ? 3 : state.step;
  const progress = PROGRESS[step];
  const isDone = step >= 4;

  return (
    <div className="relative mx-auto max-w-md lg:ml-auto">
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-brand/30 via-transparent to-brand-secondary/30 blur-2xl"
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
        <div
          aria-hidden
          className="scanline pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-light/70 to-transparent"
        />

        <div className="relative flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
              {settings.institutionName} / DIAGNÓSTICO
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            en línea
          </span>
        </div>

        <div className="relative p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Ticket activo
              </p>
              <p className="mt-1 font-mono text-xl font-semibold text-white">
                TK-{ticket}
              </p>
            </div>
            <span
              className={cn(
                "rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-wider",
                isDone
                  ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                  : "border-amber-300/25 bg-amber-300/10 text-amber-200",
              )}
            >
              {isDone ? "finalizado" : "en proceso"}
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between font-mono text-[10px] text-white/40">
              <span>progreso</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: reduce ? "68%" : 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full rounded-full bg-gradient-to-r from-brand-secondary to-emerald-400"
              />
            </div>
          </div>

          <ul className="mt-5 space-y-2.5">
            {CHECKS.map((label, index) => {
              const done = index < step;
              const current = index === step;
              return (
                <motion.li
                  key={label}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.5 + index * 0.14,
                    duration: 0.4,
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-2.5",
                    current
                      ? "border-amber-300/20 bg-amber-300/[0.04]"
                      : "border-white/5 bg-white/[0.02]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full",
                      done
                        ? "bg-emerald-400/15 text-emerald-300"
                        : current
                          ? "bg-amber-300/10 text-amber-200"
                          : "bg-white/5 text-white/30",
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Clock className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <span className="text-xs text-white/75">{label}</span>
                  <span className="ml-auto font-mono text-[10px] text-white/35">
                    {done ? "OK" : current ? "en curso" : "—"}
                  </span>
                </motion.li>
              );
            })}
          </ul>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <div className="flex items-center gap-2 text-[11px] text-white/60">
              <Wrench className="h-3.5 w-3.5 text-brand-light" />
              Técnico asignado
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand text-[9px] font-bold text-white ring-2 ring-[#0b1220]">
                  LR
                </span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-secondary text-[9px] font-bold text-white ring-2 ring-[#0b1220]">
                  JM
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-white/30" />
            </div>
          </div>
        </div>
      </div>

      <div className="animate-float absolute -bottom-5 -left-4 hidden items-center gap-2 rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 shadow-xl sm:flex">
        <Clock className="h-4 w-4 text-brand-light" />
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-white/40">
            Respuesta media
          </p>
          <p className="font-mono text-xs font-semibold text-white">
            1 h 45 min
          </p>
        </div>
      </div>

    </div>
  );
}
