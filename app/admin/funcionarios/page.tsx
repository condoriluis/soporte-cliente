"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFuncionarios, deleteFuncionario } from "@/lib/actions/funcionario-actions";
import { Plus, Search, Trash2, Pencil, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser } from "@/app/admin/user-context";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";

interface Funcionario {
  id: string; nombre: string; cargo: string | null;
  dependencia: string | null; telefono: string | null;
  _count: { equipos: number };
}

export default function FuncionariosPage() {
  const user = useUser();
  const isAdmin = user.role === "ADMIN";
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Funcionario | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async (s?: string) => {
    setLoading(true);
    const data = await getFuncionarios({ search: s || undefined });
    setFuncionarios(data as any);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteFuncionario(deleteTarget.id);
      toast.success("Funcionario eliminado");
      setDeleteTarget(null);
      fetchData(search || undefined);
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar");
    }
    setDeleting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Funcionarios</h2>
          <p className="text-sm text-muted-foreground mt-1">Registro de funcionarios de la institución</p>
        </div>
        <Link
          href="/admin/funcionarios/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Nuevo Funcionario
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          name="search"
          placeholder="Buscar funcionarios..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            fetchData(e.target.value || undefined);
          }}
          className="pl-10"
        />
      </div>

      <div className="rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Nombre</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Cargo</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Dependencia</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Teléfono</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Equipos</th>
                {isAdmin && <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={isAdmin ? 6 : 5} className="p-8 text-center text-muted-foreground animate-pulse">Cargando...</td></tr>
              ) : funcionarios.length === 0 ? (
                <tr><td colSpan={isAdmin ? 6 : 5} className="p-8 text-center text-muted-foreground">No hay funcionarios registrados</td></tr>
              ) : (
                funcionarios.map((f) => (
                  <tr key={f.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-3 text-sm">
                      <Link href={`/admin/funcionarios/${f.id}`} className="font-medium text-primary hover:underline">{f.nombre}</Link>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{f.cargo || "—"}</td>
                    <td className="p-3 text-sm text-muted-foreground">{f.dependencia || "—"}</td>
                    <td className="p-3 text-sm text-muted-foreground">{f.telefono || "—"}</td>
                    <td className="p-3 text-sm text-muted-foreground">{f._count.equipos}</td>
                    {isAdmin && (
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Link
                            href={`/admin/funcionarios/${f.id}`}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                            title="Editar"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(f)}
                            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
        title="Eliminar funcionario"
        description={deleteTarget ? `¿Estás seguro de eliminar a "${deleteTarget.nombre}"? Esta acción no se puede deshacer.` : ""}
        loading={deleting}
      />
    </div>
  );
}
