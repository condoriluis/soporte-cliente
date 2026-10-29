"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getAllTestimoniosAdmin,
  toggleAprobarTestimonio,
  toggleActivoTestimonio,
  eliminarTestimonio,
} from "@/lib/actions/testimonio-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useUser } from "@/app/admin/user-context";
import {
  Check,
  Clock,
  Eye,
  EyeOff,
  Filter,
  Loader2,
  MessageSquareQuote,
  Quote,
  RotateCcw,
  Search,
  ShieldAlert,
  Star,
  Trash2,
} from "lucide-react";

interface Testimonio {
  id: string;
  nombre: string;
  cargo: string | null;
  comentario: string;
  calificacion: number;
  aprobado: boolean;
  activo: boolean;
  createdAt: string | Date;
}

export default function TestimoniosPage() {
  const user = useUser();
  const isAdmin = user.role === "ADMIN";

  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"todos" | "pendientes" | "aprobados">("todos");
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  // Modal para eliminar
  const [deleteTarget, setDeleteTarget] = useState<Testimonio | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await getAllTestimoniosAdmin();
      setTestimonios(data as Testimonio[]);
    } catch {
      toast.error("No se pudieron cargar los testimonios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Manejar aprobación rápida
  const handleAprobar = async (id: string, nuevoEstado: boolean) => {
    setActionId(id);
    try {
      await toggleAprobarTestimonio(id, nuevoEstado);
      toast.success(
        nuevoEstado
          ? "Testimonio aprobado. Ahora es visible en la página pública."
          : "Testimonio desaprobado. Ya no se mostrará públicamente."
      );
      setTestimonios((prev) =>
        prev.map((t) => (t.id === id ? { ...t, aprobado: nuevoEstado } : t))
      );
    } catch {
      toast.error("Error al actualizar el estado de aprobación.");
    } finally {
      setActionId(null);
    }
  };

  // Manejar activo/pausado
  const handleToggleActivo = async (id: string, nuevoEstado: boolean) => {
    setActionId(id);
    try {
      await toggleActivoTestimonio(id, nuevoEstado);
      toast.success(nuevoEstado ? "Testimonio activado." : "Testimonio pausado.");
      setTestimonios((prev) =>
        prev.map((t) => (t.id === id ? { ...t, activo: nuevoEstado } : t))
      );
    } catch {
      toast.error("Error al actualizar la visibilidad.");
    } finally {
      setActionId(null);
    }
  };

  // Confirmar eliminación
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await eliminarTestimonio(deleteTarget.id);
      toast.success("Testimonio eliminado correctamente.");
      setTestimonios((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      toast.error("Error al eliminar testimonio.");
    } finally {
      setDeleting(false);
    }
  };

  // Métricas
  const total = testimonios.length;
  const pendientes = useMemo(() => testimonios.filter((t) => !t.aprobado), [testimonios]);
  const aprobados = useMemo(() => testimonios.filter((t) => t.aprobado), [testimonios]);
  const promedioEstrellas = useMemo(() => {
    if (aprobados.length === 0) return 5;
    const sum = aprobados.reduce((acc, t) => acc + t.calificacion, 0);
    return (sum / aprobados.length).toFixed(1);
  }, [aprobados]);

  // Lista filtrada
  const filtered = useMemo(() => {
    return testimonios.filter((t) => {
      if (filterTab === "pendientes" && t.aprobado) return false;
      if (filterTab === "aprobados" && !t.aprobado) return false;

      if (search.trim()) {
        const query = search.toLowerCase();
        const matchNombre = t.nombre.toLowerCase().includes(query);
        const matchCargo = (t.cargo || "").toLowerCase().includes(query);
        const matchComentario = t.comentario.toLowerCase().includes(query);
        if (!matchNombre && !matchCargo && !matchComentario) return false;
      }

      return true;
    });
  }, [testimonios, filterTab, search]);

  if (!isAdmin) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3 text-center">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Acceso Restringido</h2>
        <p className="text-sm text-muted-foreground">
          Solo los administradores pueden gestionar y aprobar opiniones de clientes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Testimonios de Clientes
            </h1>
            {pendientes.length > 0 && (
              <Badge className="bg-amber-500 text-white hover:bg-amber-600">
                {pendientes.length} por revisar
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Revisa, aprueba o modera las opiniones dejadas por los usuarios antes de que aparezcan en el sitio web público.
          </p>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Opiniones
            </span>
            <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{total}</span>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-500/5 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Pendientes de Aprobación
            </span>
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {pendientes.length}
            </span>
            <span className="text-xs text-muted-foreground">requieren acción</span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-500/5 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Aprobados y Visibles
            </span>
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {aprobados.length}
            </span>
            <span className="text-xs text-muted-foreground">en la landing page</span>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Calificación Promedio
            </span>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{promedioEstrellas}</span>
            <span className="text-xs text-muted-foreground">de 5 estrellas</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border bg-muted/40 p-1 text-sm">
          <button
            type="button"
            onClick={() => setFilterTab("todos")}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              filterTab === "todos"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Todos ({total})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("pendientes")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors ${
              filterTab === "pendientes"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pendientes ({pendientes.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("aprobados")}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              filterTab === "aprobados"
                ? "bg-card text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Aprobados ({aprobados.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente o texto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Lista de Testimonios */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 p-8 text-center">
          <MessageSquareQuote className="h-10 w-10 text-muted-foreground/60 mb-2" />
          <p className="font-medium text-foreground">No se encontraron testimonios</p>
          <p className="text-sm text-muted-foreground mt-1">
            {filterTab === "pendientes"
              ? "No tienes opiniones pendientes de revisión. ¡Excelente!"
              : "No hay registros que coincidan con los filtros aplicados."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((item) => {
            const isProcessing = actionId === item.id;
            const initials = item.nombre
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase();

            const dateStr = new Date(item.createdAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between rounded-xl border bg-card p-5 transition-all shadow-sm ${
                  !item.aprobado
                    ? "border-amber-300 dark:border-amber-800/80 bg-amber-500/5"
                    : "hover:border-primary/40"
                }`}
              >
                {/* Cabecera de la Tarjeta */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">
                        {initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm leading-tight">
                          {item.nombre}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.cargo || "Cliente particular"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {item.aprobado ? (
                        <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                          Aprobado
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500 text-white font-medium border-transparent">
                          Pendiente
                        </Badge>
                      )}
                      <span className="text-[11px] text-muted-foreground">{dateStr}</span>
                    </div>
                  </div>

                  {/* Estrellas */}
                  <div className="mt-3 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < item.calificacion
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 text-xs font-medium text-muted-foreground">
                      {item.calificacion} / 5
                    </span>
                  </div>

                  {/* Texto de la opinión */}
                  <div className="mt-3 relative">
                    <Quote className="absolute -top-1 -left-1 h-5 w-5 text-muted/40 -z-0 pointer-events-none" />
                    <p className="text-sm leading-relaxed text-foreground/90 italic pl-3 border-l-2 border-primary/20">
                      &ldquo;{item.comentario}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Acciones del Administrador */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3.5">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {item.activo ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Eye className="h-3.5 w-3.5" /> Visible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <EyeOff className="h-3.5 w-3.5" /> Oculto
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Botón de aprobación / desaprobación */}
                    {!item.aprobado ? (
                      <Button
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => handleAprobar(item.id, true)}
                        className="h-8 gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        Aprobar y Publicar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isProcessing}
                        onClick={() => handleAprobar(item.id, false)}
                        className="h-8 gap-1.5 text-amber-600 hover:text-amber-700 dark:text-amber-400"
                        title="Desaprobar para que vuelva a estado pendiente"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3.5 w-3.5" />
                        )}
                        Desaprobar
                      </Button>
                    )}

                    {/* Botón de eliminar */}
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isProcessing}
                      onClick={() => setDeleteTarget(item)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      title="Eliminar opinión"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="¿Eliminar testimonio?"
        description={`¿Estás seguro de que deseas eliminar permanentemente la opinión de "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar permanentemente"
        variant="destructive"
        loading={deleting}
      />
    </div>
  );
}
