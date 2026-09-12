"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2, Send, Lock, User, Phone, Wrench, MessageSquare,
  Monitor, MapPin, Calendar, CheckCircle2, Copy, AlertCircle,
} from "lucide-react";

import { soporteSchema, SERVICIOS, type SoporteFormData } from "@/lib/schemas";
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
import { SERVICIO_PRESELECT_EVENT } from "@/components/preselect-link";

export default function SupportForm() {
  const [generatedTicket, setGeneratedTicket] = useState<string | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const form = useForm<SoporteFormData>({
    resolver: zodResolver(soporteSchema),
    defaultValues: {
      nombre: "",
      whatsapp: "",
      servicio: "",
      problema: "",
      tipoEquipo: undefined,
      zona: "",
      modalidad: undefined,
      fechaPreferida: "",
      hp: "",
      ts: String(Date.now()),
    },
  });

  const { isSubmitting } = form.formState;
  const problemaValue = form.watch("problema") ?? "";

  useEffect(() => {
    form.setValue("ts", String(Date.now()));
    const onFocus = () => form.setValue("ts", String(Date.now()));
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [form]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  useEffect(() => {
    const handler = (e: Event) => {
      const nombre = (e as CustomEvent<{ nombre: string }>).detail?.nombre;
      if (nombre && SERVICIOS.some((s) => s.value === nombre)) {
        form.setValue("servicio", nombre);
        toast.success("Servicio seleccionado", { description: nombre, duration: 3000 });
      }
    };
    window.addEventListener(SERVICIO_PRESELECT_EVENT, handler);
    return () => window.removeEventListener(SERVICIO_PRESELECT_EVENT, handler);
  }, [form]);

  async function onSubmit(data: SoporteFormData) {
    try {
      const res = await fetch("/api/soporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseBody = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(responseBody?.error ?? `HTTP ${res.status}`);
      }

      let ticketCode = "";
      let duplicate = false;

      if (responseBody?.data?.message) {
        const msg = String(responseBody.data.message);
        if (msg.includes("Ya tienes un ticket") || msg.includes("proceso")) {
          duplicate = true;
          const match = msg.match(/(TK-[\d-]+)/);
          if (match) ticketCode = match[1];
        } else {
          const parts = msg.split("\n");
          ticketCode = parts.length > 1 ? parts[parts.length - 1].trim() : msg.trim();
        }
      }

      if (duplicate) {
        setIsDuplicate(true);
        toast.error("Ticket en proceso", {
          description: ticketCode
            ? `Ya tienes el ticket ${ticketCode} abierto.`
            : "Ya tienes un ticket en proceso, espera nuestra respuesta.",
          duration: 8000,
        });
      } else {
        setIsDuplicate(false);
        toast.success("¡Solicitud enviada!", {
          description: ticketCode
            ? `Tu código es: ${ticketCode}. Un técnico se comunicará a la brevedad.`
            : `Tu solicitud fue registrada. Un técnico se comunicará a la brevedad.`,
          duration: 8000,
        });
      }

      if (ticketCode) setGeneratedTicket(ticketCode);

      form.reset({
        nombre: "", whatsapp: "", servicio: "", problema: "",
        tipoEquipo: undefined, zona: "", modalidad: undefined,
        fechaPreferida: "", hp: "", ts: String(Date.now()),
      });
      setCooldown(60);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      toast.error("Error al enviar", { description: message, duration: 7000 });
    }
  }

  return (
    <section id="formulario" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p
            className="text-xs font-bold tracking-[.14em] uppercase mb-3"
            style={{ color: "var(--brand-primary)" }}
          >
            Solicitar servicio
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Cuéntanos tu problema
          </h2>
          <div
            className="mx-auto mt-4 mb-5 h-1 w-16 rounded-full"
            style={{ background: "var(--brand-primary)" }}
          />
          <p className="text-muted-foreground text-sm">
            Completa el formulario y un técnico se pondrá en contacto contigo.
          </p>
        </div>

        <div className="bg-card rounded-2xl border shadow-lg p-6 sm:p-8 md:p-10">
          {generatedTicket ? (
            <div className="text-center space-y-6 py-6 md:py-10">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${isDuplicate ? "bg-amber-500/10" : "bg-emerald-500/10"}`}>
                {isDuplicate ? (
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {isDuplicate ? "Ya tienes un ticket abierto" : "¡Solicitud enviada!"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {isDuplicate
                    ? "Espera a que resolvamos tu solicitud actual."
                    : "Guarda este código para dar seguimiento."}
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-6 border flex flex-col items-center gap-4">
                <code className="text-2xl sm:text-3xl font-mono font-bold text-foreground tracking-wider">
                  {generatedTicket}
                </code>
                <Button
                  variant="outline"
                  className="gap-2 rounded-xl"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedTicket);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                    toast.success("Código copiado");
                  }}
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copiado" : "Copiar código"}
                </Button>
              </div>

              <Button variant="ghost" onClick={() => setGeneratedTicket(null)} className="rounded-xl">
                Enviar otra solicitud
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 font-semibold text-sm">
                          <User className="w-3.5 h-3.5" style={{ color: "var(--brand-primary)" }} />
                          Nombre completo
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ej. Juan Pérez" maxLength={80} autoComplete="name" className="rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 font-semibold text-sm">
                          <Phone className="w-3.5 h-3.5" style={{ color: "var(--brand-primary)" }} />
                          WhatsApp
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ej. 70000000" maxLength={20} autoComplete="tel" className="rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="servicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 font-semibold text-sm">
                        <Wrench className="w-3.5 h-3.5" style={{ color: "var(--brand-primary)" }} />
                        Servicio que necesitas
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Seleccione un servicio..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SERVICIOS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="problema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 font-semibold text-sm">
                        <MessageSquare className="w-3.5 h-3.5" style={{ color: "var(--brand-primary)" }} />
                        Describe tu problema
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Ej: Mi laptop se calienta mucho y se apaga sola..."
                          rows={4}
                          maxLength={1000}
                          className="rounded-xl resize-none"
                        />
                      </FormControl>
                      <div className="text-right text-xs text-muted-foreground">
                        {problemaValue.length} / 1000
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="tipoEquipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 font-semibold text-sm">
                          <Monitor className="w-3.5 h-3.5" style={{ color: "var(--brand-primary)" }} />
                          Tipo de equipo
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Seleccione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PC">PC de escritorio</SelectItem>
                            <SelectItem value="Laptop">Laptop</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="modalidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 font-semibold text-sm">
                          <MapPin className="w-3.5 h-3.5" style={{ color: "var(--brand-primary)" }} />
                          Modalidad
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Seleccione..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="domicilio">A domicilio</SelectItem>
                            <SelectItem value="remoto">Soporte remoto</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="zona"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 font-semibold text-sm">
                          <MapPin className="w-3.5 h-3.5" style={{ color: "var(--brand-primary)" }} />
                          Zona / Distrito
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ej. Zona Sur, Miraflores" maxLength={100} className="rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fechaPreferida"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 font-semibold text-sm">
                          <Calendar className="w-3.5 h-3.5" style={{ color: "var(--brand-primary)" }} />
                          Fecha preferida
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="hidden" aria-hidden="true">
                  <FormField
                    control={form.control}
                    name="hp"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} tabIndex={-1} autoComplete="off" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <input type="hidden" {...form.register("ts")} />

                <Button
                  type="submit"
                  disabled={isSubmitting || cooldown > 0}
                  className="w-full rounded-xl py-6 text-base font-bold text-white transition-all"
                  style={{ background: "var(--brand-primary)" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : cooldown > 0 ? (
                    `Espere ${cooldown}s`
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar solicitud
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  Tus datos están protegidos y no se comparten con terceros.
                </p>
              </form>
            </Form>
          )}
        </div>
      </div>
    </section>
  );
}
