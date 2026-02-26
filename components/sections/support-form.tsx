"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Send, Lock, User, Mail, Tag, MessageSquare, Calendar } from "lucide-react";

import { soporteSchema, CATEGORIAS, type SoporteFormData } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function getTodayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function SupportForm() {
  const form = useForm<SoporteFormData>({
    resolver: zodResolver(soporteSchema),
    defaultValues: {
      nombre:    "",
      email:     "",
      categoria: undefined,
      pregunta:  "",
      fecha:     getTodayISO(),
    },
  });

  const { isSubmitting, isSubmitSuccessful } = form.formState;
  const preguntaValue = form.watch("pregunta") ?? "";

  // Refresh date on each render / focus
  useEffect(() => {
    form.setValue("fecha", getTodayISO());
  }, [form]);

  async function onSubmit(data: SoporteFormData) {
    try {
      const res = await fetch("/api/soporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }

      toast.success("¡Solicitud enviada!", {
        description: `Su solicitud fue registrada el ${data.fecha}. Un técnico se comunicará a la brevedad.`,
        duration: 6000,
      });

      form.reset({ nombre: "", email: "", categoria: undefined, pregunta: "", fecha: getTodayISO() });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      toast.error("Error al enviar la solicitud", {
        description: message.includes("conectar")
          ? "Verifique que el servidor n8n esté iniciado y el workflow esté activo."
          : message,
        duration: 7000,
      });
    }
  }

  return (
    <section id="formulario" className="py-20" style={{ background: "var(--background)" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p
            className="text-xs font-bold tracking-[.14em] uppercase mb-2"
            style={{ color: "var(--brand-accent)" }}
          >
            Asistencia Directa
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Solicitar Soporte Técnico
          </h2>
          <div className="mx-auto mt-4 mb-5 h-1 w-12 rounded-full" style={{ background: "var(--brand-accent)" }} />
          <p className="text-muted-foreground text-sm">
            Complete el formulario y nuestro equipo le responderá a la brevedad posible.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border shadow-lg p-8 md:p-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">

              {/* Nombre */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
                      <User className="w-4 h-4" style={{ color: "var(--brand-accent)" }} />
                      Nombre completo
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ej. Juan Pérez López"
                        maxLength={80}
                        autoComplete="name"
                        className="rounded-xl border-border focus-visible:ring-2"
                        style={{ "--tw-ring-color": "var(--brand-accent)" } as React.CSSProperties}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
                      <Mail className="w-4 h-4" style={{ color: "var(--brand-accent)" }} />
                      Correo electrónico institucional
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="usuario@empresa.gob.bo"
                        maxLength={120}
                        autoComplete="email"
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categoría */}
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
                      <Tag className="w-4 h-4" style={{ color: "var(--brand-accent)" }} />
                      Categoría del problema
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Seleccione una categoría…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIAS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pregunta */}
              <FormField
                control={form.control}
                name="pregunta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
                      <MessageSquare className="w-4 h-4" style={{ color: "var(--brand-accent)" }} />
                      Descripción del problema o consulta
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describa detalladamente su problema o consulta técnica…"
                        rows={5}
                        maxLength={1000}
                        className="rounded-xl resize-none"
                      />
                    </FormControl>
                    <div className="text-right text-xs text-muted-foreground mt-1">
                      {preguntaValue.length} / 1000
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha (readonly) */}
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 font-semibold text-sm text-foreground">
                      <Calendar className="w-4 h-4" style={{ color: "var(--brand-accent)" }} />
                      Fecha de solicitud
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        tabIndex={-1}
                        className="rounded-xl bg-muted cursor-default text-muted-foreground"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      La fecha se registra automáticamente.
                    </p>
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl py-6 text-base font-bold text-white transition-all"
                style={{ background: "var(--brand-accent)" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Solicitud de Soporte
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-2">
                <Lock className="w-3 h-3" />
                Sus datos están protegidos conforme a la normativa institucional de seguridad de la información.
              </p>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
