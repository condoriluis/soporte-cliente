"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Search, X } from "lucide-react";
import { equipoSchema, type EquipoFormData } from "@/lib/schemas";
import { createEquipo } from "@/lib/actions/equipo-actions";
import { getFuncionarios } from "@/lib/actions/funcionario-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const TIPOS = [
  { value: "SCANNER", label: "Scanner" },
  { value: "IMPRESORA", label: "Impresora" },
  { value: "PC", label: "PC / Equipo" },
  { value: "OTRO", label: "Otro" },
];

interface FuncionarioOption {
  id: string; nombre: string; cargo: string | null; dependencia: string | null;
}

export default function NuevoEquipoPage() {
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState<FuncionarioOption[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const form = useForm<EquipoFormData>({
    resolver: zodResolver(equipoSchema),
    defaultValues: { tipo: undefined, nombre: "", marca: "", modelo: "", numeroActivo: "", numeroSerie: "", funcionarioId: "" },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedId = form.watch("funcionarioId");
  const selected = funcionarios.find(f => f.id === selectedId);

  useEffect(() => {
    getFuncionarios().then((data) => setFuncionarios(data as FuncionarioOption[]));
  }, []);

  const filtered = search
    ? funcionarios.filter(f =>
        f.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (f.cargo && f.cargo.toLowerCase().includes(search.toLowerCase())) ||
        (f.dependencia && f.dependencia.toLowerCase().includes(search.toLowerCase()))
      )
    : funcionarios;

  const onSubmit = async (data: EquipoFormData) => {
    try {
      await createEquipo(data);
      toast.success("Equipo registrado");
      router.push("/admin/equipos");
    } catch { toast.error("Error al registrar"); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nuevo Equipo</h2>
          <p className="text-sm text-muted-foreground">Registrar un equipo en el inventario</p>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField control={form.control} name="tipo" render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de equipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger></FormControl>
                  <SelectContent>{TIPOS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="nombre" render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del equipo</FormLabel>
                <FormControl><Input {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} placeholder="Ej. ESCANER HP SCANJET N6350" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="marca" render={({ field }) => (
                <FormItem><FormLabel>Marca</FormLabel><FormControl><Input {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} placeholder="HP" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="modelo" render={({ field }) => (
                <FormItem><FormLabel>Modelo</FormLabel><FormControl><Input {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} placeholder="LJ ENTERPRISE M506" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="numeroActivo" render={({ field }) => (
                                 <FormItem><FormLabel>N° de Activo Fijo</FormLabel><FormControl><Input {...field} placeholder="15090066" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="numeroSerie" render={({ field }) => (
                                 <FormItem><FormLabel>N° de Serie</FormLabel><FormControl><Input {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} placeholder="CN4B4EE05V" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="funcionarioId" render={({ field }) => (
              <FormItem>
                <FormLabel>Funcionario asignado</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between font-normal"
                      >
                        {selected ? (
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="truncate">{selected.nombre}</span>
                            {selected.cargo && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                                {selected.cargo}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Buscar funcionario...</span>
                        )}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <div className="flex items-center border-b px-3">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <input
                        className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Buscar por nombre, cargo..."
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
                      {filtered.length === 0 ? (
                        <p className="text-sm text-muted-foreground p-2 text-center">Sin resultados</p>
                      ) : (
                        filtered.map((f) => (
                          <button
                            key={f.id}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between gap-2 hover:bg-accent ${
                              f.id === selectedId ? "bg-accent" : ""
                            }`}
                            onClick={() => {
                              field.onChange(f.id);
                              setOpen(false);
                              setSearch("");
                            }}
                          >
                            <div className="min-w-0">
                              <p className="font-medium truncate">{f.nombre}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {[f.cargo, f.dependencia].filter(Boolean).join(" · ") || "—"}
                              </p>
                            </div>
                            {f.id === selectedId && (
                              <Badge variant="outline" className="text-[10px] shrink-0">Seleccionado</Badge>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="flex-1">
                {form.formState.isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</> : "Guardar Equipo"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
