"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Loader2,
  Lock,
  MapPin,
  MessageSquare,
  Monitor,
  Phone,
  Send,
  ShieldCheck,
  User,
  Wrench,
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
import { SectionHeading } from "@/components/landing/section-heading";
import { cn } from "@/lib/utils";

const ASSURANCES = [
  {
    icon: ShieldCheck,
    title: "Diagnóstico sin costo",
    desc: "Revisamos tu equipo y te decimos el precio exacto antes de empezar.",
  },
  {
    icon: Clock,
    title: "Respuesta en menos de 2 horas",
    desc: "En horario de atención, de lunes a viernes.",
  },
  {
    icon: Lock,
    title: "Datos protegidos",
    desc: "Tu información solo se usa para contactarte y dar seguimiento.",
  },
];

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
        toast.success("Servicio seleccionado", {
          description: nombre,
          duration: 3000,
        });
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
          ticketCode =
            parts.length > 1 ? parts[parts.length - 1].trim() : msg.trim();
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
      });
      setCooldown(60);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      toast.error("Error al enviar", { description: message, duration: 7000 });
    }
  }

  return (
    <section
      id="formulario"
      className="relative scroll-mt-20 overflow-hidden bg-muted/40 py-20 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade text-foreground opacity-30"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <SectionHeading
                index="06"
                kicker="Solicitar servicio"
                title="Cuéntanos qué pasa. Nosotros nos encargamos."
                description="Completa el formulario y un técnico se pondrá en contacto contigo para coordinar el servicio."
              />

              <ul className="mt-8 space-y-5">
                {ASSURANCES.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border bg-card p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Tiempo de respuesta
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-foreground">
                  Menos de 2 horas
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Para urgencias, escríbenos directo por WhatsApp.
                </p>
                <a
                  href="#contacto"
                  className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  Ver canales de contacto
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border bg-card p-6 shadow-elevated sm:p-8">
              {generatedTicket ? (
                <div className="flex flex-col items-center gap-6 py-6 text-center md:py-10">
                  <div
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-full",
                      isDuplicate ? "bg-amber-500/10" : "bg-emerald-500/10",
                    )}
                  >
                    {isDuplicate ? (
                      <AlertCircle className="h-8 w-8 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-semibold text-foreground">
                      {isDuplicate
                        ? "Ya tienes un ticket abierto"
                        : "¡Solicitud enviada!"}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {isDuplicate
                        ? "Espera a que resolvamos tu solicitud actual."
                        : "Guarda este código para dar seguimiento."}
                    </p>
                  </div>

                  <div className="w-full rounded-xl border bg-muted/40 p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Tu código de seguimiento
                    </p>
                    <code className="mt-2 block font-mono text-2xl font-bold tracking-wider text-foreground sm:text-3xl">
                      {generatedTicket}
                    </code>
                    <Button
                      variant="outline"
                      className="mt-4 gap-2 rounded-lg"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedTicket);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                        toast.success("Código copiado");
                      }}
                    >
                      {copied ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? "Copiado" : "Copiar código"}
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => setGeneratedTicket(null)}
                    className="rounded-lg"
                  >
                    Enviar otra solicitud
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    noValidate
                    className="space-y-8"
                  >
                    <fieldset className="space-y-5">
                      <legend className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        01 / Datos de contacto
                      </legend>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="nombre"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-sm font-semibold">
                                <User className="h-3.5 w-3.5 text-primary" />
                                Nombre completo
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Ej. Juan Pérez"
                                  maxLength={80}
                                  autoComplete="name"
                                  className="h-11 rounded-lg"
                                />
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
                              <FormLabel className="flex items-center gap-1.5 text-sm font-semibold">
                                <Phone className="h-3.5 w-3.5 text-primary" />
                                WhatsApp
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Ej. 70000000"
                                  maxLength={20}
                                  autoComplete="tel"
                                  className="h-11 rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </fieldset>

                    <div className="h-px bg-border" />

                    <fieldset className="space-y-5">
                      <legend className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        02 / Detalles del servicio
                      </legend>

                      <FormField
                        control={form.control}
                        name="servicio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5 text-sm font-semibold">
                              <Wrench className="h-3.5 w-3.5 text-primary" />
                              Servicio que necesitas
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 rounded-lg">
                                  <SelectValue placeholder="Seleccione un servicio..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SERVICIOS.map((s) => (
                                  <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                  </SelectItem>
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
                            <FormLabel className="flex items-center gap-1.5 text-sm font-semibold">
                              <MessageSquare className="h-3.5 w-3.5 text-primary" />
                              Describe tu problema
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Ej: Mi laptop se calienta mucho y se apaga sola..."
                                rows={4}
                                maxLength={1000}
                                className="resize-none rounded-lg"
                              />
                            </FormControl>
                            <div className="text-right font-mono text-[10px] text-muted-foreground">
                              {problemaValue.length} / 1000
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </fieldset>

                    <div className="h-px bg-border" />

                    <fieldset className="space-y-5">
                      <legend className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        03 / Equipo y modalidad
                      </legend>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="tipoEquipo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-sm font-semibold">
                                <Monitor className="h-3.5 w-3.5 text-primary" />
                                Tipo de equipo
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11 rounded-lg">
                                    <SelectValue placeholder="Seleccione..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="PC">
                                    PC de escritorio
                                  </SelectItem>
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
                              <FormLabel className="flex items-center gap-1.5 text-sm font-semibold">
                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                Modalidad
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11 rounded-lg">
                                    <SelectValue placeholder="Seleccione..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="domicilio">
                                    A domicilio
                                  </SelectItem>
                                  <SelectItem value="remoto">
                                    Soporte remoto
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="zona"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1.5 text-sm font-semibold">
                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                Zona / Distrito
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Ej. Zona Sur, Miraflores"
                                  maxLength={100}
                                  className="h-11 rounded-lg"
                                />
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
                              <FormLabel className="flex items-center gap-1.5 text-sm font-semibold">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                Fecha preferida
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="date"
                                  className="h-11 rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </fieldset>

                    <div className="hidden" aria-hidden="true">
                      <FormField
                        control={form.control}
                        name="hp"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                tabIndex={-1}
                                autoComplete="off"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <input type="hidden" {...form.register("ts")} />

                    <Button
                      type="submit"
                      disabled={isSubmitting || cooldown > 0}
                      className="h-12 w-full rounded-lg bg-brand text-base font-semibold text-white transition-all hover:bg-brand/90"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : cooldown > 0 ? (
                        `Espere ${cooldown}s`
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Enviar solicitud
                        </>
                      )}
                    </Button>

                    <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Tus datos están protegidos y no se comparten con terceros.
                    </p>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
