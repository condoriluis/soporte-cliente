"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getClienteById, updateCliente, deleteCliente } from "@/lib/actions/cliente-actions";
import { TIPOS_CLIENTE } from "@/lib/schemas";
import { ArrowLeft, Plus, Monitor, Pencil, Trash2, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUser } from "@/app/admin/user-context";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";

interface Cliente {
  id: string; nombre: string; cargo: string | null; dependencia: string | null;
  area: string | null; telefono: string | null;
  equipos: Array<{ id: string; nombre: string; marca: string | null; modelo: string | null; _count: { diagnosticos: number } }>;
}

export default function ClienteDetailPage() {
  const user = useUser();
  const isAdmin = user.role === "ADMIN";
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [cl, setCl] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ nombre: "", cargo: "", dependencia: "", area: "", telefono: "" });

  useEffect(() => {
    getClienteById(id).then((data) => {
      if (!data) return router.push("/admin/clientes");
      setCl(data as Cliente);
      setForm({
        nombre: data.nombre, cargo: data.cargo || "", dependencia: data.dependencia || "",
        area: data.area || "", telefono: data.telefono || "",
      });
      setLoading(false);
    });
  }, [id, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCliente(id, form);
      toast.success("Cliente actualizado");
      setEditing(false);
      const data = await getClienteById(id);
      setCl(data as Cliente);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al actualizar");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCliente(id);
      toast.success("Cliente eliminado");
      router.push("/admin/clientes");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al eliminar");
    }
    setDeleting(false);
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground animate-pulse">Cargando...</div>;
  if (!cl) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/clientes"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">{cl.nombre}</h2>
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
          <h3 className="font-semibold">Información del Cliente</h3>
          {editing ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Nombre</Label>
                <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Tipo de cliente</Label>
                <Select value={form.cargo} onValueChange={(v) => setForm({ ...form, cargo: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>{TIPOS_CLIENTE.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Dirección</Label>
                <Input value={form.dependencia} onChange={(e) => setForm({ ...form, dependencia: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Zona / Barrio</Label>
                <Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Teléfono / WhatsApp</Label>
                <Input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
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
                <dt className="text-muted-foreground">Tipo de cliente</dt>
                <dd className="font-medium">{cl.cargo || "—"}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-muted-foreground">Dirección</dt>
                <dd>{cl.dependencia || "—"}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-muted-foreground">Zona / Barrio</dt>
                <dd>{cl.area || "—"}</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-muted-foreground">Teléfono / WhatsApp</dt>
                <dd>{cl.telefono || "—"}</dd>
              </div>
            </dl>
          )}
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Equipos Registrados</h3>
            <Link
              href={`/admin/equipos/nuevo?clienteId=${cl.id}`}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-3 h-3" />               Asignar Equipo
            </Link>
          </div>
          {cl.equipos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin equipos registrados</p>
          ) : (
            <div className="space-y-2">
              {cl.equipos.map((eq) => (
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
        title="Eliminar cliente"
        description={`¿Estás seguro de eliminar a "${cl.nombre}"? Esta acción no se puede deshacer.`}
        loading={deleting}
      />
    </div>
  );
}