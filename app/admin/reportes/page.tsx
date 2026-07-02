"use client";

import { useState } from "react";
import { getTickets } from "@/lib/actions/ticket-actions";
import { getEquipos } from "@/lib/actions/equipo-actions";
import { generateTicketReport } from "@/lib/excel/reporte-tickets";
import { generateEquipoReport } from "@/lib/excel/reporte-equipos";
import { downloadWorkbook } from "@/lib/excel/utils";
import { Button } from "@/components/ui/button";
import { FileText, Monitor, TicketIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ReportesPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExportTickets = async () => {
    setLoading("tickets");
    try {
      const tickets = await getTickets();
      const wb = generateTicketReport({
        tickets,
        period: new Date().toLocaleDateString("es-ES"),
      });
      downloadWorkbook(wb, `Reporte_Tickets_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success("Reporte de tickets generado");
    } catch { toast.error("Error al generar reporte"); }
    setLoading(null);
  };

  const handleExportEquipos = async () => {
    setLoading("equipos");
    try {
      const equipos = await getEquipos();
      const wb = generateEquipoReport({ equipos });
      downloadWorkbook(wb, `Inventario_Equipos_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success("Inventario de equipos generado");
    } catch { toast.error("Error al generar reporte"); }
    setLoading(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reportes</h2>
        <p className="text-sm text-muted-foreground mt-1">Generar reportes y exportar a Excel</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10">
              <TicketIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold">Reporte de Tickets</h3>
              <p className="text-xs text-muted-foreground">Listado completo de tickets con estados y técnicos asignados</p>
            </div>
          </div>
          <Button onClick={handleExportTickets} disabled={loading === "tickets"} className="w-full gap-2">
            {loading === "tickets" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {loading === "tickets" ? "Generando..." : "Exportar Tickets a Excel"}
          </Button>
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10">
              <Monitor className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold">Inventario de Equipos</h3>
              <p className="text-xs text-muted-foreground">Listado completo de equipos con asignación y datos técnicos</p>
            </div>
          </div>
          <Button onClick={handleExportEquipos} disabled={loading === "equipos"} className="w-full gap-2">
            {loading === "equipos" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {loading === "equipos" ? "Generando..." : "Exportar Equipos a Excel"}
          </Button>
        </div>
      </div>
    </div>
  );
}
