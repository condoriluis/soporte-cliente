import Link from "next/link";
import { getDiagnosticos } from "@/lib/actions/diagnostico-actions";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function DiagnosticosPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; tipo?: string }>;
}) {
  const params = await searchParams;
  const diagnosticos = await getDiagnosticos({ tipo: params.tipo });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Diagnósticos</h2>
          <p className="text-sm text-muted-foreground mt-1">Historial de diagnósticos técnicos</p>
        </div>
        <Link
          href="/admin/diagnosticos/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Nuevo Diagnóstico
        </Link>
      </div>

      <div className="flex gap-1">
        {["", "PREVENTIVO", "CORRECTIVO"].map((tipo) => (
          <a
            key={tipo}
            href={`/admin/diagnosticos?${tipo ? `tipo=${tipo}` : ""}`}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              (params.tipo || "") === tipo
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tipo || "Todos"}
          </a>
        ))}
      </div>

      <div className="rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">N° Ficha</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Tipo</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Equipo</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Diagnóstico</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Técnico</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {diagnosticos.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No hay diagnósticos registrados</td></tr>
              ) : (
                diagnosticos.map((d) => (
                  <tr key={d.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <a href={`/admin/diagnosticos/${d.id}`} className="font-mono text-xs font-semibold text-primary hover:underline">
                        {d.numeroFicha}
                      </a>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className={`text-xs font-medium ${d.tipo === "PREVENTIVO" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"}`}>
                        {d.tipo}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm max-w-xs truncate">{d.equipo?.nombre || "—"}</td>
                    <td className="p-3 text-sm text-muted-foreground max-w-md truncate">{d.diagnostico}</td>
                    <td className="p-3 text-sm text-muted-foreground">{d.tecnico?.name || "—"}</td>
                    <td className="p-3 text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(d.createdAt).toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
