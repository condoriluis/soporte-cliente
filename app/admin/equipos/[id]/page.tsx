import { notFound } from "next/navigation";
import Link from "next/link";
import { getEquipoById } from "@/lib/actions/equipo-actions";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EquipoDetailClient } from "./equipo-detail-client";

const tipoColors: Record<string, string> = {
  SCANNER: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400",
  IMPRESORA: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400",
  PC: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400",
  OTRO: "bg-muted text-muted-foreground",
};

export default async function EquipoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [equipo, session] = await Promise.all([
    getEquipoById(id),
    auth(),
  ]);
  if (!equipo) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/equipos"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <div className="flex items-center gap-3">
          <Badge className={`text-xs font-medium ${tipoColors[equipo.tipo] || ""}`} variant="outline">{equipo.tipo}</Badge>
          <h2 className="text-2xl font-bold tracking-tight">{equipo.nombre}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h3 className="font-semibold">Información del Equipo</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
               <dt className="text-muted-foreground">Marca</dt>
              <dd className="font-medium">{equipo.marca || "—"}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
               <dt className="text-muted-foreground">Modelo</dt>
              <dd className="font-medium">{equipo.modelo || "—"}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
               <dt className="text-muted-foreground">N° de Activo Fijo</dt>
              <dd className="font-mono">{equipo.numeroActivo || "—"}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
               <dt className="text-muted-foreground">N° de Serie</dt>
              <dd className="font-mono">{equipo.numeroSerie || "—"}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
               <dt className="text-muted-foreground">Registrado</dt>
              <dd>{new Date(equipo.createdAt).toLocaleDateString("es-ES")}</dd>
            </div>
          </dl>
        </div>

        <EquipoDetailClient
          equipoId={equipo.id}
          currentFuncionario={equipo.funcionario ? { id: equipo.funcionario.id, nombre: equipo.funcionario.nombre, cargo: equipo.funcionario.cargo } : null}
          currentUserRole={session?.user?.role}
        />
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Historial de Diagnósticos</h3>
          <Link
            href={`/admin/diagnosticos/nuevo?equipoId=${equipo.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-3 h-3" />
            Nuevo Diagnóstico
          </Link>
        </div>
        {equipo.diagnosticos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin diagnósticos registrados</p>
        ) : (
          <div className="space-y-3">
            {equipo.diagnosticos.map((d) => (
              <div key={d.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Ficha N° {d.numeroFicha} • {d.tipo}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(d.createdAt).toLocaleDateString("es-ES")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{d.diagnostico}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{d.tecnico?.name || "—"}</span>
                  <Link href={`/admin/diagnosticos/${d.id}`} className="text-xs text-primary hover:underline">
                    Ver detalle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
