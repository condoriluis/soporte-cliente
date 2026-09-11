import { z } from "zod";

const sanitize = (val: string) =>
  val
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/\s{3,}/g, "  ");

export const CATEGORIAS = [
  { value: "Hardware", label: "Hardware (equipo, periféricos)" },
  { value: "Software", label: "Software / Aplicaciones" },
  { value: "Red", label: "Redes y Conectividad" },
  { value: "Seguridad", label: "Seguridad Informática" },
  { value: "Correo", label: "Correo Electrónico" },
  { value: "Otro", label: "Otro" },
] as const;

export const SERVICIOS = [
  { value: "Mantenimiento de PC", label: "Mantenimiento de PC" },
  { value: "Mantenimiento de laptop", label: "Mantenimiento de laptop" },
  { value: "Limpieza interna", label: "Limpieza interna" },
  { value: "Cambio de pasta térmica", label: "Cambio de pasta térmica" },
  { value: "Optimización de Windows", label: "Optimización de Windows" },
  { value: "Liberación de espacio", label: "Liberación de espacio" },
  { value: "Instalación de software", label: "Instalación / configuración de software" },
  { value: "Impresoras", label: "Impresoras" },
  { value: "Wi-Fi / redes", label: "Wi-Fi / Redes" },
  { value: "Recuperación de acceso", label: "Recuperación de acceso autorizado" },
  { value: "Soporte remoto", label: "Soporte remoto" },
  { value: "Soporte a domicilio", label: "Soporte a domicilio" },
  { value: "Soporte para negocios", label: "Soporte para pequeños negocios" },
  { value: "Otro", label: "Otro" },
] as const;

export const loginSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const soporteSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(80, "El nombre no puede superar 80 caracteres.")
    .transform(sanitize),
  whatsapp: z
    .string()
    .min(8, "Ingrese un número de WhatsApp válido.")
    .max(20, "El número no puede superar 20 caracteres.")
    .transform(sanitize),
  servicio: z
    .string()
    .min(1, "Seleccione un servicio.")
    .transform(sanitize),
  problema: z
    .string()
    .min(10, "Describa el problema con al menos 10 caracteres.")
    .max(1000, "La descripción no puede superar 1000 caracteres.")
    .transform(sanitize),
  tipoEquipo: z.enum(["PC", "Laptop", "Otro"], {
    error: "Seleccione el tipo de equipo.",
  }),
  zona: z
    .string()
    .min(2, "Ingrese su zona o distrito.")
    .max(100)
    .transform(sanitize),
  modalidad: z.enum(["domicilio", "remoto"], {
    error: "Seleccione una modalidad.",
  }),
  fechaPreferida: z.string().optional(),
  hp: z.string().max(0, "Bot detected"),
  ts: z.string().min(1, "Token inválido"),
});

export type SoporteFormData = z.infer<typeof soporteSchema>;

export const ticketSchema = z.object({
  title: z.string().min(3).max(200),
  categoria: z.enum(CATEGORIAS.map((c) => c.value) as [string, ...string[]]),
  descripcion: z.string().min(10).max(2000).transform(sanitize),
  email: z.string().email().max(120).transform((v) => sanitize(v).toLowerCase()),
  nombre: z.string().min(3).max(80).transform(sanitize),
  tecnicoId: z.string().optional(),
});

export type TicketFormData = z.infer<typeof ticketSchema>;

export const equipoSchema = z.object({
  tipo: z.enum(["SCANNER", "IMPRESORA", "PC", "OTRO"]),
  nombre: z.string().min(3).max(200).transform(sanitize),
  marca: z.string().max(100).transform(sanitize).optional().or(z.literal("")),
  modelo: z.string().max(100).transform(sanitize).optional().or(z.literal("")),
  numeroActivo: z.string().max(50).optional().or(z.literal("")),
  numeroSerie: z.string().max(50).optional().or(z.literal("")),
  funcionarioId: z.string().optional().or(z.literal("")),
});

export type EquipoFormData = z.infer<typeof equipoSchema>;

export const funcionarioSchema = z.object({
  nombre: z.string().min(3).max(200).transform(sanitize),
  cargo: z.string().max(100).transform(sanitize).optional().or(z.literal("")),
  dependencia: z.string().max(200).transform(sanitize).optional().or(z.literal("")),
  area: z.string().max(200).transform(sanitize).optional().or(z.literal("")),
  tipo: z.string().max(50).optional().or(z.literal("")),
  telefono: z.string().max(30).optional().or(z.literal("")),
  email: z.string().email().max(120).optional().or(z.literal("")),
});

export type FuncionarioFormData = z.infer<typeof funcionarioSchema>;

export const diagnosticoSchema = z.object({
  tipo: z.enum(["PREVENTIVO", "CORRECTIVO"]),
  equipoId: z.string().min(1, "Seleccione un equipo"),
  descripcionFc: z.string().max(1000).transform(sanitize).optional().or(z.literal("")),
  diagnostico: z.string().min(10).max(2000).transform(sanitize),
  trabajoRealizado: z.string().max(2000).transform(sanitize).optional().or(z.literal("")),
});

export type DiagnosticoFormData = z.infer<typeof diagnosticoSchema>;
