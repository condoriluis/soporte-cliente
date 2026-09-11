"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateEquipo, deleteEquipo } from "@/lib/actions/equipo-actions";
import { getFuncionarios } from "@/lib/actions/funcionario-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Search, X, Trash2, UserCheck } from "lucide-react";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";

interface FuncionarioOption {
  id: string; nombre: string; cargo: string | null; dependencia: string | null;
}

interface Props {
  equipoId: string;
  currentFuncionario: { id: string; nombre: string; cargo: string | null } | null;
  currentUserRole?: string;
}

export function EquipoDetailClient({ equipoId, currentFuncionario, currentUserRole }: Props) {
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState<FuncionarioOption[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState(currentFuncionario?.id || "");
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    getFuncionarios().then((data) => setFuncionarios(data as FuncionarioOption[]));
  }, []);

  const filtered = search
    ? funcionarios.filter(f =>
        f.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (f.cargo && f.cargo.toLowerCase().includes(search.toLowerCase()))
      )
    : funcionarios;

  const selectedFuncionario = funcionarios.find(f => f.id === selectedFuncionarioId);

  const handleAssign = async (funcionarioId: string) => {
    setAssigning(true);
    try {
      await updateEquipo(equipoId, { funcionarioId: funcionarioId || null });
      setSelectedFuncionarioId(funcionarioId);
      toast.success("Funcionario asignado");
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
          <h3 className="font-semibold">Funcionario Asignado</h3>
          {assigning && <span className="text-xs text-muted-foreground animate-pulse">Asignando...</span>}
        </div>
        {selectedFuncionario ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{selectedFuncionario.nombre}</p>
              {selectedFuncionario.cargo && (
                <p className="text-xs text-muted-foreground">{selectedFuncionario.cargo}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Sin funcionario asignado</p>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <UserCheck className="w-4 h-4" />
              {selectedFuncionario ? "Cambiar funcionario" : "Asignar funcionario"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Buscar funcionario..."
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
                Sin funcionario
              </button>
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2 text-center">Sin resultados</p>
              ) : (
                filtered.map((f) => (
                  <button
                    key={f.id}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between gap-2 hover:bg-accent ${
                      f.id === selectedFuncionarioId ? "bg-accent" : ""
                    }`}
                    onClick={() => handleAssign(f.id)}
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{f.nombre}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {f.cargo || "—"}
                      </p>
                    </div>
                    {f.id === selectedFuncionarioId && (
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
