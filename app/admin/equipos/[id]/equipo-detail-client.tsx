"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateEquipo, deleteEquipo } from "@/lib/actions/equipo-actions";
import { getClientes } from "@/lib/actions/cliente-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Search, X, Trash2, UserCheck } from "lucide-react";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";

interface ClienteOption {
  id: string; nombre: string; cargo: string | null; dependencia: string | null;
}

interface Props {
  equipoId: string;
  currentCliente: { id: string; nombre: string; cargo: string | null } | null;
  currentUserRole?: string;
}

export function EquipoDetailClient({ equipoId, currentCliente, currentUserRole }: Props) {
  const router = useRouter();
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState(currentCliente?.id || "");
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    getClientes().then((data) => setClientes(data as ClienteOption[]));
  }, []);

  const filtered = search
    ? clientes.filter(c =>
        c.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (c.cargo && c.cargo.toLowerCase().includes(search.toLowerCase()))
      )
    : clientes;

  const selectedCliente = clientes.find(c => c.id === selectedClienteId);

  const handleAssign = async (clienteId: string) => {
    setAssigning(true);
    try {
      await updateEquipo(equipoId, { clienteId: clienteId || null });
      setSelectedClienteId(clienteId);
      toast.success("Cliente asignado");
      router.refresh();
    } catch {
      toast.error("Error al asignar");
    }
    setAssigning(false);
    setOpen(false);
    setSearch("");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEquipo(equipoId);
      toast.success("Equipo eliminado");
      router.push("/admin/equipos");
    } catch {
      toast.error("Error al eliminar");
    }
    setDeleting(false);
    setShowDelete(false);
  };

  return (
    <>
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Cliente Asociado</h3>
          {assigning && <span className="text-xs text-muted-foreground animate-pulse">Asignando...</span>}
        </div>
        {selectedCliente ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{selectedCliente.nombre}</p>
              {selectedCliente.cargo && (
                <p className="text-xs text-muted-foreground">{selectedCliente.cargo}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Sin cliente asociado</p>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <UserCheck className="w-4 h-4" />
              {selectedCliente ? "Cambiar cliente" : "Asignar cliente"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Buscar cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="max-h-60 overflow-y-auto p-1">
              <button
                className="w-full text-left px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent"
                onClick={() => handleAssign("")}
              >
                Sin cliente
              </button>
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2 text-center">Sin resultados</p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between gap-2 hover:bg-accent ${
                      c.id === selectedClienteId ? "bg-accent" : ""
                    }`}
                    onClick={() => handleAssign(c.id)}
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{c.nombre}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {c.cargo || "—"}
                      </p>
                    </div>
                    {c.id === selectedClienteId && (
                      <Badge variant="outline" className="text-[10px] shrink-0">Actual</Badge>
                    )}
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {currentUserRole === "ADMIN" && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold mb-3 text-destructive">Zona de Peligro</h3>
          <p className="text-xs text-muted-foreground mb-3">Eliminar este equipo del inventario. Esta acción no se puede deshacer.</p>
          <Button onClick={() => setShowDelete(true)} variant="destructive" size="sm" className="w-full gap-2">
            <Trash2 className="w-4 h-4" />
            Eliminar Equipo
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
        title="Eliminar equipo"
        description="¿Estás seguro de eliminar este equipo? Se eliminarán también todos los diagnósticos asociados. Esta acción no se puede deshacer."
        loading={deleting}
      />
    </>
  );
}