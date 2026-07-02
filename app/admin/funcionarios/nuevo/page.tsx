"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { funcionarioSchema, type FuncionarioFormData } from "@/lib/schemas";
import { createFuncionario } from "@/lib/actions/funcionario-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

const TIPOS = [
  { value: "Funcionario de Planta", label: "Funcionario de Planta" },
  { value: "Funcionario Eventual", label: "Funcionario Eventual" },
  { value: "Consultor de Línea", label: "Consultor de Línea" },
  { value: "Consultor por Producto", label: "Consultor por Producto" },
];

export default function NuevoFuncionarioPage() {
  const router = useRouter();
  const form = useForm<FuncionarioFormData>({
    resolver: zodResolver(funcionarioSchema),
    defaultValues: { nombre: "", cargo: "", dependencia: "", area: "", tipo: "", telefono: "", email: "" },
  });

  const onSubmit = async (data: FuncionarioFormData) => {
    try {
      await createFuncionario(data);
      toast.success("Funcionario registrado");
      router.push("/admin/funcionarios");
    } catch { toast.error("Error al registrar"); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
        <div><h2 className="text-2xl font-bold tracking-tight">Nuevo Funcionario</h2><p className="text-sm text-muted-foreground">Registrar un nuevo funcionario</p></div>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField control={form.control} name="nombre" render={({ field }) => (
              <FormItem><FormLabel>Nombre completo</FormLabel><FormControl><Input {...field} placeholder="Nombre del funcionario" /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="cargo" render={({ field }) => (
                <FormItem><FormLabel>Cargo</FormLabel><FormControl><Input {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} placeholder="Ej. Habilitado" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="tipo" render={({ field }) => (
                <FormItem><FormLabel>Tipo de funcionario</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                    <SelectContent>{TIPOS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="dependencia" render={({ field }) => (
                <FormItem><FormLabel>Dependencia laboral</FormLabel><FormControl><Input {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} placeholder="Ej. UNIDAD DE RRHH" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="area" render={({ field }) => (
                <FormItem><FormLabel>Dirección / Unidad / Área</FormLabel><FormControl><Input {...field} placeholder="Ej. MDPyEP" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="telefono" render={({ field }) => (
                <FormItem><FormLabel>Teléfono / Extensión</FormLabel><FormControl><Input {...field} placeholder="353" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Correo electrónico</FormLabel><FormControl><Input {...field} type="email" placeholder="correo@institucion.com" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="flex-1">
                {form.formState.isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</> : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
