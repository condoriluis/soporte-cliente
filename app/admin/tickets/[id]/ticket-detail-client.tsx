"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateTicketStatus, assignTicket, addTicketEvent, deleteTicket } from "@/lib/actions/ticket-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { MessageSquare, UserCheck, Trash2, Clock } from "lucide-react";

const statusOptions = [
  { value: "ABIERTO", label: "Abierto" },
  { value: "EN_PROCESO", label: "En Proceso" },
  { value: "ESPERANDO_CLIENTE", label: "Esperando Cliente" },
  { value: "RESUELTO", label: "Resuelto" },
  { value: "CERRADO", label: "Cerrado" },
];

const eventColors: Record<string, string> = {
  CREADO: "bg-amber-500",
  ABIERTO: "bg-amber-500",
  EN_PROCESO: "bg-blue-500",
  ESPERANDO_CLIENTE: "bg-purple-500",
  RESUELTO: "bg-emerald-500",
  CERRADO: "bg-slate-500",
};

interface TicketData {
  id: string; code: string; title: string; categoria: string; estado: string;
  descripcion: string; email: string | null; nombre: string | null; tecnicoId: string | null;
  createdAt: string | Date; updatedAt: string | Date;
  tecnico: { id: string; name: string | null } | null;
  eventos: Array<{ id: string; evento: string; comentario: string | null; tecnico: string | null; createdAt: string | Date }>;
}

interface Props {
  ticket: TicketData;
  tecnicos: Array<{ id: string; name: string | null }>;
  currentUserRole?: string;
}

export function TicketDetailClient({ ticket, tecnicos, currentUserRole }: Props) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(ticket.estado);
  const [selectedTecnico, setSelectedTecnico] = useState(ticket.tecnicoId || "");
  const [comentario, setComentario] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = async () => {
    setIsSubmitting(true);
    try {
      await updateTicketStatus(ticket.id, selectedStatus, comentario);
      toast.success("Estado actualizado");
      setComentario("");
      router.refresh();
    } catch {
      toast.error("Error al actualizar");
    }
    setIsSubmitting(false);
  };

  const handleAssign = async () => {
    if (!selectedTecnico) return;
    setIsSubmitting(true);
    try {
      await assignTicket(ticket.id, selectedTecnico);
      toast.success("Ticket asignado");
      router.refresh();
    } catch {
      toast.error("Error al asignar");
    }
    setIsSubmitting(false);
  };

  const handleAddEvent = async () => {
    if (!comentario.trim()) return;
    setIsSubmitting(true);
    try {
      await addTicketEvent(ticket.id, "COMENTARIO", comentario);
      toast.success("Comentario agregado");
      setComentario("");
      router.refresh();
    } catch {
      toast.error("Error al agregar comentario");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTicket(ticket.id);
      toast.success("Ticket eliminado");
      router.push("/admin/tickets");
    } catch {
      toast.error("Error al eliminar");
    }
    setDeleting(false);
    setShowDelete(false);
  };

  const formatDate = (d: string | Date) =>
    new Date(d).toLocaleDateString("es-ES", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-3">Descripción</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.descripcion}</p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-4">Historial del Ticket</h3>
          <div className="relative">
            {ticket.eventos.map((ev, i: number) => (
              <div key={ev.id} className="relative flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ring-[3px] ring-background z-10 shrink-0 ${eventColors[ev.evento] || "bg-primary"}`} />
                  {i < ticket.eventos.length - 1 && <div className="w-px flex-1 bg-border mt-0.5" />}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium">{ev.evento.replace(/_/g, " ")}</span>
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {formatDate(ev.createdAt)}
                    </span>
                  </div>
                  {ev.tecnico && (
                    <p className="text-xs text-muted-foreground mt-0.5">— {ev.tecnico}</p>
                  )}
                  {ev.comentario && (
                    <p className="text-xs text-muted-foreground/70 mt-0.5">{ev.comentario}</p>
                  )}
                </div>
              </div>
            ))}
            {ticket.eventos.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin eventos registrados</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-3">Agregar Comentario</h3>
          <div className="space-y-3">
            <Textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe un comentario..."
              rows={3}
            />
            <Button onClick={handleAddEvent} disabled={!comentario.trim() || isSubmitting} size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Agregar Comentario
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h3 className="font-semibold">Acciones</h3>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Cambiar Estado</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleStatusChange} disabled={selectedStatus === ticket.estado || isSubmitting} size="sm" className="w-full">
              <Clock className="w-4 h-4 mr-2" />
              Actualizar Estado
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Asignar Técnico</label>
            <Select value={selectedTecnico} onValueChange={setSelectedTecnico}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar técnico" />
              </SelectTrigger>
              <SelectContent>
                {tecnicos.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAssign} disabled={!selectedTecnico || selectedTecnico === ticket.tecnicoId || isSubmitting} size="sm" className="w-full">
              <UserCheck className="w-4 h-4 mr-2" />
              Asignar
            </Button>
          </div>

          {currentUserRole === "ADMIN" && (
            <Button onClick={() => setShowDelete(true)} variant="destructive" size="sm" className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar Ticket
            </Button>
          )}
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-3">Detalles</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
               <dt className="text-muted-foreground">Código</dt>
              <dd className="font-mono">{ticket.code}</dd>
            </div>
            <div className="flex justify-between">
               <dt className="text-muted-foreground">Categoría</dt>
              <dd>{ticket.categoria}</dd>
            </div>
            <div className="flex justify-between">
               <dt className="text-muted-foreground">Solicitante</dt>
              <dd>{ticket.nombre}</dd>
            </div>
            <div className="flex justify-between">
               <dt className="text-muted-foreground">Email</dt>
              <dd className="text-xs">{ticket.email}</dd>
            </div>
            <div className="flex justify-between">
               <dt className="text-muted-foreground">Técnico</dt>
              <dd>{ticket.tecnico?.name || "Sin asignar"}</dd>
            </div>
            <div className="flex justify-between">
               <dt className="text-muted-foreground">Creado</dt>
              <dd>{new Date(ticket.createdAt).toLocaleDateString("es-ES")}</dd>
            </div>
            <div className="flex justify-between">
               <dt className="text-muted-foreground">Actualizado</dt>
              <dd>{new Date(ticket.updatedAt).toLocaleDateString("es-ES")}</dd>
            </div>
          </dl>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
        title="Eliminar ticket"
        description={`¿Estás seguro de eliminar el ticket "${ticket.code}"? Esta acción no se puede deshacer.`}
        loading={deleting}
      />
    </div>
  );
}
