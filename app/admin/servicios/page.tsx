"use client";

import { useState, useEffect, useCallback } from "react";
import { getServicios, createServicio, updateServicio, deleteServicio, getTipoCambioUsd } from "@/lib/actions/servicio-actions";
import { getSettings } from "@/lib/actions/settings-actions";
import { downloadServiciosPdf } from "@/lib/pdf/servicios-pdf";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useUser } from "@/app/admin/user-context";
import { Plus, Pencil, Trash2, Loader2, Download, Star } from "lucide-react";

interface Servicio {
  id: string; nombre: string; descripcion: string | null; duracion: string | null;
  precioBs: number; popular: boolean; activo: boolean; orden: number;
}

const EMPTY_FORM = {
  nombre: "", descripcion: "", duracion: "", precioBs: "",
  popular: false,
};

export default function ServiciosPage() {
  const user = useUser();
  const isAdmin = user.role === "ADMIN";

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasa, setTasa] = useState(6.97);
  const [brand, setBrand] = useState({ institutionName: "Soportik", logoUrl: "", primaryColor: "#1a3a5c", secondaryColor: "#2e7dc4" });

  const [openNew, setOpenNew] = useState(false);
  const [editTarget, setEditTarget] = useState<Servicio | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Servicio | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchData = useCallback(async () => {
    const [data, cambio] = await Promise.all([getServicios(), getTipoCambioUsd()]);
    setServicios(data as Servicio[]);
    setTasa(cambio);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [data, cambio, settings] = await Promise.all([
        getServicios(),
        getTipoCambioUsd(),
        getSettings(),
      ]);
      if (cancelled) return;
      setServicios(data as Servicio[]);
      setTasa(cambio);
      if (settings) {
        setBrand({
          institutionName: settings.institutionName || "Soportik",
          logoUrl: settings.logoUrl || "",
          primaryColor: settings.primaryColor || "#1a3a5c",
          secondaryColor: settings.secondaryColor || "#2e7dc4",
        });
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const usd = (bs: number) => (tasa > 0 ? bs / tasa : 0);

  const openNewForm = () => {
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setOpenNew(true);
  };

  const openEditForm = (s: Servicio) => {
    setEditTarget(s);
    setForm({
      nombre: s.nombre,
      descripcion: s.descripcion || "",
      duracion: s.duracion || "",
      precioBs: String(s.precioBs),
      popular: s.popular,
    });
    setOpenNew(true);
  };

  const handleSave = async () => {
    if (!form.nombre.trim() || !form.precioBs) {
      toast.error("Complete el nombre y el precio");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || undefined,
        duracion: form.duracion.trim() || undefined,
        precioBs: parseFloat(form.precioBs),
        popular: form.popular,
      };
      if (editTarget) {
        await updateServicio(editTarget.id, payload);
        toast.success("Servicio actualizado");
      } else {
        await createServicio({ ...payload, orden: servicios.length });
        toast.success("Servicio creado");
      }
      setOpenNew(false);
      await fetchData();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al guardar");
    }
    setSaving(false);
  };

  const handleToggleActivo = async (s: Servicio) => {
    try {
      await updateServicio(s.id, { activo: !s.activo });
      await fetchData();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteServicio(deleteTarget.id);
      toast.success("Servicio eliminado");
      setDeleteTarget(null);
      await fetchData();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al eliminar");
    }
    setDeleting(false);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadServiciosPdf({
        servicios: servicios.filter((s) => s.activo).map((s) => ({
          nombre: s.nombre, descripcion: s.descripcion, duracion: s.duracion,
          precioBs: s.precioBs, popular: s.popular,
        })),
        institutionName: brand.institutionName,
        logoUrl: brand.logoUrl,
        primaryColor: brand.primaryColor,
        secondaryColor: brand.secondaryColor,
        cambioUsd: tasa,
      });
      toast.success("PDF generado");
    } catch {
      toast.error("No se pudo generar el PDF");
    }
    setExporting(false);
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground animate-pulse">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Servicios y Precios</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tarifario dinámico de los servicios — el precio en dólares se calcula con el tipo de cambio de Configuración (1 USD = {tasa.toFixed(2)} Bs)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport} disabled={exporting || servicios.filter((s) => s.activo).length === 0}>
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Exportar PDF
          </Button>
          {isAdmin && (
            <Button className="gap-2" onClick={openNewForm}>
              <Plus className="w-4 h-4" /> Nuevo Servicio
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Servicio</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Duración</th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">Precio (Bs)</th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">Precio ($us)</th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase">Popular</th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase">Activo</th>
                {isAdmin && <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {servicios.length === 0 ? (
                <tr><td colSpan={isAdmin ? 7 : 6} className="p-8 text-center text-muted-foreground">No hay servicios registrados</td></tr>
              ) : (
                servicios.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{s.nombre}</span>
                        {s.popular && (
                          <Badge variant="outline" className="gap-1 text-amber-600 dark:text-amber-400">
                            <Star className="w-3 h-3 fill-current" /> Popular
                          </Badge>
                        )}
                      </div>
                      {s.descripcion && <p className="text-xs text-muted-foreground mt-0.5 max-w-md truncate">{s.descripcion}</p>}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground whitespace-nowrap">{s.duracion || "—"}</td>
                    <td className="p-3 text-right text-sm font-semibold whitespace-nowrap">Bs {s.precioBs.toFixed(2)}</td>
                    <td className="p-3 text-right text-sm text-muted-foreground whitespace-nowrap">$us {usd(s.precioBs).toFixed(2)}</td>
                    <td className="p-3 text-center">{s.popular ? <Star className="w-4 h-4 mx-auto text-amber-500 fill-current" /> : <span className="text-muted-foreground">—</span>}</td>
                    <td className="p-3 text-center">
                      <Switch
                        checked={s.activo}
                        disabled={!isAdmin}
                        onCheckedChange={() => handleToggleActivo(s)}
                        aria-label={`Activar ${s.nombre}`}
                      />
                    </td>
                    {isAdmin && (
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditForm(s)}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                            title="Editar"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(s)}
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

      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre del servicio</Label>
              <Input
                placeholder="Ej. Mantenimiento de PC"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea
                rows={2}
                placeholder="Breve descripción del servicio"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Duración estimada</Label>
                <Input
                  placeholder="Ej. 2-3 horas"
                  value={form.duracion}
                  onChange={(e) => setForm({ ...form, duracion: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Precio (Bs)</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="Ej. 80"
                  value={form.precioBs}
                  onChange={(e) => setForm({ ...form, precioBs: e.target.value })}
                />
                {form.precioBs && !isNaN(parseFloat(form.precioBs)) && (
                  <p className="text-xs text-muted-foreground">
                    Equivalente: $us {usd(parseFloat(form.precioBs)).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            <label className="flex items-center justify-between rounded-lg border p-3 cursor-pointer">
              <div>
                <p className="text-sm font-medium">Marcar como popular</p>
                <p className="text-xs text-muted-foreground">Se resalta en el tarifario y PDF</p>
              </div>
              <Switch checked={form.popular} onCheckedChange={(v) => setForm({ ...form, popular: v })} />
            </label>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setOpenNew(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</> : (editTarget ? "Guardar cambios" : "Crear Servicio")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        onConfirm={handleDelete}
        title="Eliminar servicio"
        description={deleteTarget ? `¿Estás seguro de eliminar "${deleteTarget.nombre}"? Esta acción no se puede deshacer.` : ""}
        loading={deleting}
      />
    </div>
  );
}