import { z } from "zod";

const sanitize = (val: string) =>
  val
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/\s{3,}/g, "  ");

export const soporteSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(80, "El nombre no puede superar 80 caracteres.")
    .transform(sanitize),

  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio.")
    .email("Ingrese un correo electrónico válido.")
    .max(120)
    .transform((v) => sanitize(v).toLowerCase()),

  categoria: z.enum(
    ["Hardware", "Software", "Red", "Seguridad", "Correo", "Otro"],
    { error: "Seleccione una categoría válida." }
  ),

  pregunta: z
    .string()
    .min(10, "Describa el problema con al menos 10 caracteres.")
    .max(1000, "La descripción no puede superar 1000 caracteres.")
    .transform(sanitize),

  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido."),
});

export type SoporteFormData = z.infer<typeof soporteSchema>;

export const CATEGORIAS = [
  { value: "Hardware", label: "Hardware (equipo, periféricos)" },
  { value: "Software", label: "Software / Aplicaciones" },
  { value: "Red",      label: "Redes y Conectividad" },
  { value: "Seguridad",label: "Seguridad Informática" },
  { value: "Correo",   label: "Correo Electrónico" },
  { value: "Otro",     label: "Otro" },
] as const;
