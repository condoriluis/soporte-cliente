"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getFuncionarioById, updateFuncionario, deleteFuncionario } from "@/lib/actions/funcionario-actions";
import { ArrowLeft, Plus, Monitor, Pencil, Trash2, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/app/admin/user-context";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";

interface Funcionario {
  id: string; nombre: string; cargo: string | null; dependencia: string | null;
  area: string | null; tipo: string | null; telefono: string | null; email: string | null;
  equipos: Array<{ id: string; nombre: string; marca: string | null; modelo: string | null; _count: { diagnosticos: number } }>;
}

export default function FuncionarioDetailPage() {
  const user = useUser();
  const isAdmin = user.role === "ADMIN";
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [fc, setFc] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ nombre: "", cargo: "", dependencia: "", area: "", tipo: "", telefono: "", email: "" });

  useEffect(() => {
    getFuncionarioById(id).then((data) => {
      if (!data) return router.push("/admin/funcionarios");
      setFc(data as any);
      setForm({
        nombre: data.nombre, cargo: data.cargo || "", dependencia: data.dependencia || "",
        area: data.area || "", tipo: data.tipo || "", telefono: data.telefono || "", email: data.email || "",
      });
      setLoading(false);
    });
  }, [id, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateFuncionario(id, form);
      toast.success("Funcionario actualizado");
      setEditing(false);
      const data = await getFuncionarioById(id);
      setFc(data as any);
    } catch (e: any) {
      toast.error(e.message || "Error al actualizar");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteFuncionario(id);
      toast.success("Funcionario eliminado");
      router.push("/admin/funcionarios");
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar");
    }
    setDeleting(false);
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground animate-pulse">Cargando...</div>;
  if (!fc) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/funcionarios"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">{fc.nombre}</h2>
        </div>
        {isAdmin && !editing && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditing(true)}>
              <Pencil className="w-4 h-4" /> Editar
            </Button>
            <Button variant="destructive" size="sm" className="gap-2" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="w-4 h-4" /> Eliminar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h3 className="font-semibold">Información del Funcionario</h3>
          {editing ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Nombre</Label>
                <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Cargo</Label>
                <Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value.toUpperCase() })} />
              </div>
              <div className="space-y-1">
                <Label>Dependencia</Label>
                <Input value={form.dependencia} onChange={(e) => setForm({ ...form, dependencia: e.target.value.toUpperCase() })} />
              </div>
              <div className="space-y-1">
                <Label>Área</Label>
                <Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Tipo</Label>
                <Input value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Teléfono</Label>
                <Input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)} className="gap-2">
                  <X className="w-4 h-4" /> Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                 <dt className="text-muted-foreground">Cargo</dt>
                <dd className="font-medium">{fc.cargo || "—"}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                 <dt className="text-muted-foreground">Dependencia</dt>
                <dd>{fc.dependencia || "—"}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                 <dt className="text-muted-foreground">Área</dt>
                <dd>{fc.area || "—"}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                 <dt className="text-muted-foreground">Tipo</dt>
                <dd>{fc.tipo || "—"}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                 <dt className="text-muted-foreground">Teléfono</dt>
                <dd>{fc.telefono || "—"}</dd>
              </div>
              {fc.email && (
                <div className="flex justify-between border-b pb-2">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>{fc.email}</dd>
                </div>
              )}
            </dl>
          )}
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Equipos Asignados</h3>
            <Link
              href={`/admin/equipos/nuevo?funcionarioId=${fc.id}`}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-3 h-3" />               Asignar Equipo
            </Link>
          </div>
          {fc.equipos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin equipos asignados</p>
          ) : (
            <div className="space-y-2">
              {fc.equipos.map((eq) => (
                <Link
                  key={eq.id}
                  href={`/admin/equipos/${eq.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{eq.nombre}</p>
                    <p className="text-xs text-muted-foreground">{eq.marca} {eq.modelo} • {eq._count.diagnosticos} diagnósticos</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Eliminar funcionario"
        description={`¿Estás seguro de eliminar a "${fc.nombre}"? Esta acción no se puede deshacer.`}
        loading={deleting}
      />
    </div>
  );
}
