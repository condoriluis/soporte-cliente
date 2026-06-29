"use client";

import { cn } from "@/lib/utils";

interface TicketEvent {
  evento: string;
  comentario: string | null;
  tecnico: string | null;
  fecha: string;
}

interface TicketTimelineProps {
  events: TicketEvent[];
}

const EVENT_COLORS: Record<string, string> = {
  creado: "bg-amber-500",
  abierto: "bg-amber-500",
  en_proceso: "bg-blue-500",
  esperando_cliente: "bg-purple-500",
  resuelto: "bg-emerald-500",
  cerrado: "bg-slate-500",
};

function getEventColor(evento: string): string {
  return EVENT_COLORS[evento.toLowerCase()] ?? "bg-primary";
}

function formatLabel(evento: string): string {
  return evento
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TicketTimeline({ events }: TicketTimelineProps) {
  if (!events || events.length === 0) return null;

  return (
    <div className="mt-6 pt-4 border-t">
      <h4 className="font-semibold text-sm mb-5 text-foreground">
        Historial del ticket
      </h4>
      <div className="relative">
        {events.map((event, i) => (
          <div key={i} className="relative flex gap-4 pb-7 last:pb-0">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-3 h-3 rounded-full ring-[3px] ring-background z-10 shrink-0",
                  getEventColor(event.evento)
                )}
              />
              {i < events.length - 1 && (
                <div className="w-px flex-1 bg-border mt-0.5" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-foreground">
                  {formatLabel(event.evento)}
                </span>
                <span className="text-[11px] text-muted-foreground shrink-0 whitespace-nowrap">
                  {formatDate(event.fecha)}
                </span>
              </div>
              {event.tecnico && (
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <span className="text-muted-foreground/60">—</span>
                  {event.tecnico}
                </p>
              )}
              {event.comentario && (
                <p className="text-xs text-muted-foreground/70 mt-0.5 leading-relaxed">
                  {event.comentario}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
