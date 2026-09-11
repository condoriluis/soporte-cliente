import { notFound } from "next/navigation";
import Link from "next/link";
import { getDiagnosticoById } from "@/lib/actions/diagnostico-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown } from "lucide-react";

export default async function DiagnosticoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const diag = await getDiagnosticoById(id);
  if (!diag) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/diagnosticos"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-muted-foreground">Ficha N° {diag.numeroFicha}</span>
              <Badge variant="outline" className={`text-xs font-medium ${diag.tipo === "PREVENTIVO" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {diag.tipo}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{diag.equipo.nombre}</h2>
          </div>
        </div>
        <Button asChild className="gap-2">
          <Link href={`/api/excel/diagnostico/${id}`}>
            <FileDown className="w-4 h-4" />
            Descargar Excel
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h3 className="font-semibold">Información del Equipo</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
               <dt className="text-muted-foreground">Nombre</dt>
              <dd className="font-medium">{diag.equipo.nombre}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
               <dt className="text-muted-foreground">Marca</dt>
              <dd>{diag.equipo.marca || "—"}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
               <dt className="text-muted-foreground">Modelo</dt>
              <dd>{diag.equipo.modelo || "—"}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
               <dt className="text-muted-foreground">N° Activo</dt>
              <dd className="font-mono">{diag.equipo.numeroActivo || "—"}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
               <dt className="text-muted-foreground">N° Serie</dt>
              <dd className="font-mono">{diag.equipo.numeroSerie || "—"}</dd>
            </div>
            {diag.equipo.cliente && (
              <>
                <div className="flex justify-between border-b pb-2">
                   <dt className="text-muted-foreground">Cliente</dt>
                  <dd className="font-medium">{diag.equipo.cliente.nombre}</dd>
                </div>
                <div className="flex justify-between border-b pb-2">
                   <dt className="text-muted-foreground">Tipo de cliente</dt>
                  <dd>{diag.equipo.cliente.cargo || "—"}</dd>
                </div>
              </>
            )}
          </dl>
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h3 className="font-semibold">Detalles del Diagnóstico</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
               <dt className="text-muted-foreground">Técnico</dt>
              <dd>{diag.tecnico?.name || "—"}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
               <dt className="text-muted-foreground">Fecha</dt>
              <dd>{new Date(diag.createdAt).toLocaleDateString("es-ES")}</dd>
            </div>
          </dl>
        </div>
      </div>

      {diag.descripcionFc && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-3">BREVE DESCRIPCIÓN DEL CLIENTE</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{diag.descripcionFc}</p>
        </div>
      )}

      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold mb-3">Diagnóstico Técnico</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{diag.diagnostico}</p>
      </div>

      {diag.trabajoRealizado && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-3">Trabajo Realizado</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{diag.trabajoRealizado}</p>
        </div>
      )}
    </div>
  );
}
