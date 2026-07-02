"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { ticketSchema, CATEGORIAS, type TicketFormData } from "@/lib/schemas";
import { createTicket } from "@/lib/actions/ticket-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

export default function NuevoTicketPage() {
  const router = useRouter();

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      categoria: undefined,
      descripcion: "",
      email: "",
      nombre: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: TicketFormData) => {
    try {
      const ticket = await createTicket(data);
      toast.success("Ticket creado exitosamente");
      router.push(`/admin/tickets/${ticket.id}`);
    } catch {
      toast.error("Error al crear el ticket");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nuevo Ticket</h2>
          <p className="text-sm text-muted-foreground">Registrar un nuevo ticket de soporte</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>Nombre del solicitante</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nombre completo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="correo@institucion.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>Título del ticket</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Resumen del problema" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIAS.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>Descripción del problema</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} placeholder="Describa detalladamente el problema..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creando...</>
                ) : (
                  "Crear Ticket"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
