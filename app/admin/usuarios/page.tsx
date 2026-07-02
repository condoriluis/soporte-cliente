"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUsuarios, createUsuario, updateUsuario, resetUsuarioPassword, deleteUsuario } from "@/lib/actions/user-actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Plus, Shield, RotateCcw, Trash2, Loader2, KeyRound, Pencil } from "lucide-react";

interface Usuario {
  id: string; name: string | null; email: string | null; role: string;
  isActive: boolean; failedAttempts: number; lockUntil: string | null;
  createdAt: string; _count: { tickets: number; diagnosticos: number };
}

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [openNew, setOpenNew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Usuario | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "TECNICO" });
  const [resetTarget, setResetTarget] = useState<Usuario | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetting, setResetting] = useState(false);
  const [editTarget, setEditTarget] = useState<Usuario | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "TECNICO" });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getUsuarios().then((data) => { setUsuarios(data as any); setLoading(false); });
  }, []);

  const handleCreate = async () => {
    try {
      await createUsuario(formData);
      toast.success("Usuario creado");
      setOpenNew(false);
      setFormData({ name: "", email: "", password: "", role: "TECNICO" });
      const data = await getUsuarios();
      setUsuarios(data as any);
    } catch (e: any) { toast.error(e.message || "Error"); }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateUsuario(id, { isActive: !isActive });
    toast.success(`Usuario ${isActive ? "desactivado" : "activado"}`);
    const data = await getUsuarios();
    setUsuarios(data as any);
  };

  const handleResetPassword = async () => {
    if (!resetTarget) return;
    if (resetPassword.length < 6) return toast.error("Mínimo 6 caracteres");
    setResetting(true);
    try {
      await resetUsuarioPassword(resetTarget.id, resetPassword);
      toast.success(`Contraseña restablecida para ${resetTarget.email}`);
      setResetTarget(null);
      setResetPassword("");
    } catch (e: any) {
      toast.error(e.message || "Error al restablecer");
    }
    setResetting(false);
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    setEditing(true);
    try {
      await updateUsuario(editTarget.id, { name: editForm.name, role: editForm.role });
      toast.success("Usuario actualizado");
      setEditTarget(null);
      const data = await getUsuarios();
      setUsuarios(data as any);
    } catch (e: any) {
      toast.error(e.message || "Error al actualizar");
    }
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUsuario(deleteTarget.id);
      toast.success("Usuario eliminado");
      setDeleteTarget(null);
      const data = await getUsuarios();
      setUsuarios(data as any);
    } catch (e: any) { toast.error(e.message || "Error"); }
    setDeleting(false);
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground animate-pulse">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usuarios</h2>
          <p className="text-sm text-muted-foreground mt-1">Gestión de usuarios del sistema</p>
        </div>
        <Dialog open={openNew} onOpenChange={setOpenNew}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Nuevo Usuario</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo Usuario</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <Input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <Input placeholder="Contraseña" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="TECNICO">Técnico</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleCreate} className="w-full">Crear Usuario</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Nombre</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Email</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Rol</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Estado</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Tickets</th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-3 text-sm font-medium">{u.name || "—"}</td>
                  <td className="p-3 text-sm text-muted-foreground">{u.email}</td>
                  <td className="p-3">
                    <Badge variant="outline" className={`text-xs ${u.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <button onClick={() => handleToggleActive(u.id, u.isActive)}>
                      <Badge variant="outline" className={`text-xs cursor-pointer ${u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {u.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </button>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{u._count.tickets}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditTarget(u); setEditForm({ name: u.name || "", role: u.role }); }}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                        title="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setResetTarget(u); setResetPassword(""); }}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                        title="Restablecer contraseña"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) { setEditTarget(null); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              Editar Usuario
            </DialogTitle>
            <DialogDescription>
              {editTarget ? `Editando a ${editTarget.email}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
               <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
               <Label htmlFor="edit-role">Rol</Label>
              <Select value={editForm.role} onValueChange={(v) => setEditForm({ ...editForm, role: v })}>
                <SelectTrigger id="edit-role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="TECNICO">Técnico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditTarget(null)}>Cancelar</Button>
              <Button onClick={handleEdit} disabled={editing} className="gap-2">
                {editing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
                {editing ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetTarget} onOpenChange={(o) => { if (!o) { setResetTarget(null); setResetPassword(""); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Restablecer Contraseña
            </DialogTitle>
            <DialogDescription>
              {resetTarget ? `Nueva contraseña para ${resetTarget.email}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
               <Label htmlFor="new-password">Nueva contraseña</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Mín. 6 caracteres"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setResetTarget(null); setResetPassword(""); }}>
                Cancelar
              </Button>
              <Button onClick={handleResetPassword} disabled={resetting || resetPassword.length < 6} className="gap-2">
                {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                {resetting ? "Restableciendo..." : "Restablecer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onConfirm={handleDelete}
        title="Eliminar usuario"
        description={deleteTarget ? `¿Estás seguro de eliminar a "${deleteTarget.name || deleteTarget.email}"? Esta acción no se puede deshacer.` : ""}
        loading={deleting}
      />
    </div>
  );
}
