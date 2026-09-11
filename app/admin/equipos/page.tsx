"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getEquipos, deleteEquipo } from "@/lib/actions/equipo-actions";
import { Plus, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/app/admin/user-context";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";

const tipoColors: Record<string, string> = {
  SCANNER: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400",
  IMPRESORA: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400",
  PC: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400",
  OTRO: "bg-muted text-muted-foreground",
};

interface Equipo {
  id: string; tipo: string; nombre: string; marca: string | null;
  modelo: string | null; numeroActivo: string | null; numeroSerie: string | null;
  cliente: { id: string; nombre: string } | null;
  _count: { diagnosticos: number };
}

export default function EquiposPage() {
  const user = useUser();
  const isAdmin = user.role === "ADMIN";
  const searchParams = useSearchParams();
  const router = useRouter();

  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [tipo, setTipo] = useState(searchParams.get("tipo") || "");
  const [deleteTarget, setDeleteTarget] = useState<Equipo | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async (s?: string, t?: string) => {
    setLoading(true);
    const data = await getEquipos({ search: s || undefined, tipo: t || undefined });
    setEquipos(data as Equipo[]);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { fetchData(search || undefined, tipo || undefined); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteEquipo(deleteTarget.id);
      toast.success("Equipo eliminado");
      setDeleteTarget(null);
      fetchData(search || undefined, tipo || undefined);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al eliminar");
    }
    setDeleting(false);
  };

  const updateFilter = (newTipo: string) => {
    setTipo(newTipo);
    const params = new URLSearchParams();
    if (newTipo) params.set("tipo", newTipo);
    if (search) params.set("search", search);
    router.push(`/admin/equipos?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Equipos</h2>
          <p className="text-sm text-muted-foreground mt-1">Inventario de equipos registrados</p>
        </div>
        <Link
          href="/admin/equipos/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Nuevo Equipo
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar equipos..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchData(e.target.value || undefined, tipo || undefined);
            }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-1">
          {["", "SCANNER", "IMPRESORA", "PC", "OTRO"].map((t) => (
            <button
              key={t}
              onClick={() => updateFilter(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                (tipo || "") === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t || "Todos"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Tipo</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Nombre</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Marca</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Modelo</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">N° Activo</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">N° Serie</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Cliente</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Diag.</th>
                {isAdmin && <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={isAdmin ? 9 : 8} className="p-8 text-center text-muted-foreground animate-pulse">Cargando...</td></tr>
              ) : equipos.length === 0 ? (
                <tr><td colSpan={isAdmin ? 9 : 8} className="p-8 text-center text-muted-foreground">No hay equipos registrados</td></tr>
              ) : (
                equipos.map((eq) => (
                  <tr key={eq.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <Badge className={`text-xs font-medium ${tipoColors[eq.tipo] || ""}`} variant="outline">
                        {eq.tipo}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">
                      <Link href={`/admin/equipos/${eq.id}`} className="font-medium text-primary hover:underline">
                        {eq.nombre}
                      </Link>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{eq.marca || "—"}</td>
                    <td className="p-3 text-sm text-muted-foreground">{eq.modelo || "—"}</td>
                    <td className="p-3 text-sm text-muted-foreground">{eq.numeroActivo || "—"}</td>
                    <td className="p-3 text-sm text-muted-foreground font-mono">{eq.numeroSerie || "—"}</td>
                    <td className="p-3 text-sm text-muted-foreground">{eq.cliente?.nombre || "—"}</td>
                    <td className="p-3 text-sm text-muted-foreground">{eq._count.diagnosticos}</td>
                    {isAdmin && (
                      <td className="p-3">
                        <button
                          onClick={() => setDeleteTarget(eq)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        onConfirm={handleDelete}
        title="Eliminar equipo"
        description={deleteTarget ? `¿Estás seguro de eliminar "${deleteTarget.nombre}"? Esta acción no se puede deshacer.` : ""}
        loading={deleting}
      />
    </div>
  );
}
