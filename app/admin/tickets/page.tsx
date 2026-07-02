"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getTickets, deleteTicket } from "@/lib/actions/ticket-actions";
import { Plus, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/app/admin/user-context";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  ABIERTO: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  EN_PROCESO: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  ESPERANDO_CLIENTE: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
  RESUELTO: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  CERRADO: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400",
};

interface Ticket {
  id: string; code: string; title: string; categoria: string;
  estado: string; createdAt: string;
  tecnico: { id: string; name: string } | null;
}

export default function TicketsPage() {
  const user = useUser();
  const isAdmin = user.role === "ADMIN";
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [estado, setEstado] = useState(searchParams.get("estado") || "");
  const [deleteTarget, setDeleteTarget] = useState<Ticket | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async (s?: string, e?: string) => {
    setLoading(true);
    const data = await getTickets({ search: s || undefined, estado: e || undefined });
    setTickets(data as any);
    setLoading(false);
  };

  useEffect(() => { fetchData(search || undefined, estado || undefined); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTicket(deleteTarget.id);
      toast.success("Ticket eliminado");
      setDeleteTarget(null);
      fetchData(search || undefined, estado || undefined);
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar");
    }
    setDeleting(false);
  };

  const updateFilter = (newEstado: string) => {
    setEstado(newEstado);
    const params = new URLSearchParams();
    if (newEstado) params.set("estado", newEstado);
    if (search) params.set("search", search);
    router.push(`/admin/tickets?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tickets</h2>
          <p className="text-sm text-muted-foreground mt-1">Gestiona los tickets de soporte técnico</p>
        </div>
        <Link
          href="/admin/tickets/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Nuevo Ticket
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tickets..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchData(e.target.value || undefined, estado || undefined);
            }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-1">
          {["", "ABIERTO", "EN_PROCESO", "RESUELTO", "CERRADO"].map((e) => (
            <button
              key={e}
              onClick={() => updateFilter(e)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                (estado || "") === e
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {e || "Todos"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Código</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Título</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Categoría</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Estado</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Técnico</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Fecha</th>
                {isAdmin && <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={isAdmin ? 7 : 6} className="p-8 text-center text-muted-foreground animate-pulse">Cargando...</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={isAdmin ? 7 : 6} className="p-8 text-center text-muted-foreground">No hay tickets registrados</td></tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <Link href={`/admin/tickets/${ticket.id}`} className="font-mono text-xs font-semibold text-primary hover:underline">
                        {ticket.code}
                      </Link>
                    </td>
                    <td className="p-3 text-sm max-w-xs truncate">{ticket.title}</td>
                    <td className="p-3">
                      <span className="text-xs text-muted-foreground">{ticket.categoria}</span>
                    </td>
                    <td className="p-3">
                      <Badge className={`text-xs font-medium ${statusColors[ticket.estado] || ""}`} variant="outline">
                        {ticket.estado.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{ticket.tecnico?.name || "—"}</td>
                    <td className="p-3 text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(ticket.createdAt).toLocaleDateString("es-ES")}
                    </td>
                    {isAdmin && (
                      <td className="p-3">
                        <button
                          onClick={() => setDeleteTarget(ticket)}
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
        title="Eliminar ticket"
        description={deleteTarget ? `¿Estás seguro de eliminar el ticket "${deleteTarget.code}"? Esta acción no se puede deshacer.` : ""}
        loading={deleting}
      />
    </div>
  );
}
