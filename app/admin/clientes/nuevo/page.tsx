"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { clienteSchema, TIPOS_CLIENTE, type ClienteFormData } from "@/lib/schemas";
import { createCliente } from "@/lib/actions/cliente-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

export default function NuevoClientePage() {
  const router = useRouter();
  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: { nombre: "", cargo: "", dependencia: "", area: "", telefono: "" },
  });

  const onSubmit = async (data: ClienteFormData) => {
    try {
      await createCliente(data);
      toast.success("Cliente registrado");
      router.push("/admin/clientes");
    } catch { toast.error("Error al registrar"); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
        <div><h2 className="text-2xl font-bold tracking-tight">Nuevo Cliente</h2><p className="text-sm text-muted-foreground">Registrar un nuevo cliente</p></div>
      </div>
      <div className="rounded-xl border bg-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField control={form.control} name="nombre" render={({ field }) => (
              <FormItem><FormLabel>Nombre completo</FormLabel><FormControl><Input {...field} placeholder="Nombre del cliente" /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="cargo" render={({ field }) => (
                <FormItem><FormLabel>Tipo de cliente</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger></FormControl>
                    <SelectContent>{TIPOS_CLIENTE.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="telefono" render={({ field }) => (
                <FormItem><FormLabel>Teléfono / WhatsApp</FormLabel><FormControl><Input {...field} placeholder="Ej. 76259553" /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="dependencia" render={({ field }) => (
                <FormItem><FormLabel>Dirección</FormLabel><FormControl><Input {...field} placeholder="Ej. Av. Juan Pablo II" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="area" render={({ field }) => (
                <FormItem><FormLabel>Zona / Barrio</FormLabel><FormControl><Input {...field} placeholder="Ej. Ciudad Satélite" /></FormControl><FormMessage /></FormItem>
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