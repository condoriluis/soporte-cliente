"use client";

import { useState } from "react";
import { Search, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import TicketTimeline from "@/components/ticket-timeline";

const STATUS_COLORS: Record<string, string> = {
  abierto: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  en_proceso: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  esperando_cliente:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
  resuelto:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  cerrado: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400",
};

function getStatusColor(status: string): string {
  return STATUS_COLORS[status.toLowerCase()] ?? "bg-primary/10 text-primary";
}

function formatLabel(status: string): string {
  return status
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

interface TicketData {
  code: string;
  status: string;
  title: string;
  updatedAt: string;
}

interface TicketEvent {
  evento: string;
  comentario: string | null;
  tecnico: string | null;
  fecha: string;
}

interface TrackResult {
  ticket: TicketData | null;
  events: TicketEvent[];
}

export default function TrackTicket() {
  const [open, setOpen] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | { notFound: true } | null>(
    null
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const query = ticketId.trim();
    if (!query) {
      toast.error("Por favor ingresa un identificador");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `/api/rastreo?ticket=${encodeURIComponent(query)}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error("No se pudo consultar el ticket");
      }

      const data = await response.json();

      if (data?.ticket) {
        setResult({ ticket: data.ticket, events: data.events ?? [] });
        toast.success("Ticket encontrado");
      } else {
        setResult({ notFound: true });
        toast.error("No se encontraron resultados para este ticket");
      }
    } catch {
      setResult({ notFound: true });
      toast.error("Error al consultar el ticket. Inténtalo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setTicketId("");
    setResult(null);
  };

  const ticketResult =
    result && "ticket" in result ? (result as TrackResult) : null;
  const activeTicket = ticketResult?.ticket;

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) resetState();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full font-semibold"
          style={{
            color: "#fff",
            border: "1px solid rgba(255,255,255,.4)",
            background: "rgba(0,0,0,.2)",
          }}
        >
          <Search className="w-4 h-4 mr-2" />
          Rastrear Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Rastrear Ticket</DialogTitle>
          <DialogDescription>
            Ingresa tu número de ticket o correo institucional para consultar el
            estado actual.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSearch} className="flex gap-2 mt-4">
          <Input
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="Ej. TK-1234 o correo@empresa.com"
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !ticketId.trim()}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </form>

        {activeTicket && (
          <div className="mt-6">
            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <h4 className="font-semibold text-sm border-b pb-2 flex items-center justify-between">
                <span>Detalles del Ticket</span>
                <span
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full font-medium tracking-wide",
                    getStatusColor(activeTicket.status)
                  )}
                >
                  {formatLabel(activeTicket.status)}
                </span>
              </h4>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-muted-foreground">Número:</div>
                <div className="font-medium">{activeTicket.code}</div>

                <div className="text-muted-foreground">Asunto:</div>
                <div className="font-medium truncate">
                  {activeTicket.title}
                </div>

                <div className="text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  Última act.:
                </div>
                <div className="font-medium">
                  {formatDate(activeTicket.updatedAt)}
                </div>
              </div>
            </div>

            {ticketResult && <TicketTimeline events={ticketResult.events} />}
          </div>
        )}

        {!activeTicket && result && "notFound" in result && (
          <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center space-y-2">
            <p className="text-sm font-semibold text-destructive">
              No se encontraron resultados
            </p>
            <p className="text-xs text-muted-foreground">
              Verifica el número ingresado e intenta nuevamente.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
