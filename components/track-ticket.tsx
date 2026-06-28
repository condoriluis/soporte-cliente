"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
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

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "abierto":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
    case "en_proceso":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
    case "esperando_cliente":
      return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400";
    case "resuelto":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "cerrado":
      return "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400";
    default:
      return "bg-primary/10 text-primary";
  }
};

const formatStatus = (status: string) => {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function TrackTicket() {
  const [open, setOpen] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim()) {
      toast.error("Por favor ingresa un identificador");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {

      const response = await fetch(`/api/rastreo?ticket=${encodeURIComponent(ticketId)}`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error("No se pudo consultar el ticket");
      }

      const data = await response.json();

      if (data && data.status === 200 && data.total > 0 && data.results?.length > 0) {
        const ticketData = data.results[0];
        setResult({
          estado: ticketData.status_ticket,
          numero_ticket: ticketData.code_ticket,
          tecnico: "Equipo de Soporte", 
          fecha: new Date(ticketData.date_updated_ticket).toLocaleDateString(),
          mensaje: ticketData.title_ticket
        });
        toast.success("Ticket encontrado");
      } else {
        setResult({ notFound: true });
        toast.error("No se encontraron resultados para este ticket");
      }
    } catch (error) {
      console.error(error);
      setResult({ notFound: true });
      toast.error("Error al consultar el ticket. Inténtalo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) { setTicketId(""); setResult(null); } }}>
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rastrear Ticket</DialogTitle>
          <DialogDescription>
            Ingresa tu número de ticket o correo institucional para consultar el estado actual.
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
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </form>

        {result && !result.notFound && (
          <div className="mt-6 rounded-lg border bg-muted/30 p-4 space-y-3">
            <h4 className="font-semibold text-sm border-b pb-2 flex items-center justify-between">
              <span>Detalles del Ticket</span>
              <span className={cn(
                "text-xs px-2.5 py-1 rounded-full font-medium tracking-wide",
                getStatusColor(result.estado || "")
              )}>
                {result.estado ? formatStatus(result.estado) : "En proceso"}
              </span>
            </h4>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div className="text-muted-foreground">Número:</div>
              <div className="font-medium">{result.numero_ticket || result.ticket || ticketId}</div>

              <div className="text-muted-foreground">Técnico:</div>
              <div className="font-medium">{result.tecnico || "No asignado"}</div>

              <div className="text-muted-foreground">Última act.:</div>
              <div className="font-medium">{result.fecha || new Date().toLocaleDateString()}</div>
            </div>
            {result.mensaje && (
              <div className="pt-2 text-sm text-muted-foreground border-t mt-2">
                {result.mensaje}
              </div>
            )}
          </div>
        )}

        {result?.notFound && (
          <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center space-y-2">
            <p className="text-sm font-semibold text-destructive">No se encontraron resultados</p>
            <p className="text-xs text-muted-foreground">Verifica el número ingresado e intenta nuevamente.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
