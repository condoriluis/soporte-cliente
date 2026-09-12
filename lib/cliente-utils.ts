import { db } from "@/lib/db";

export function normalizeTelefono(value: string | null | undefined): string {
  const digits = (value || "").replace(/\D/g, "");
  if (digits.startsWith("591") && digits.length > 9) return digits.slice(3);
  return digits;
}

export async function findClienteByTelefono(telefono: string) {
  const digits = normalizeTelefono(telefono);
  if (!digits) return null;

  const candidatos = await db.cliente.findMany({
    where: { telefono: { not: null } },
    select: { id: true, nombre: true, telefono: true },
  });

  return candidatos.find((c) => normalizeTelefono(c.telefono) === digits) || null;
}

export async function findOrCreateCliente(input: {
  nombre: string;
  whatsapp: string;
  zona?: string;
}) {
  const existente = await findClienteByTelefono(input.whatsapp);

  if (existente) {
    const data: Record<string, string> = {};
    if (input.zona) data.area = input.zona;
    if (Object.keys(data).length > 0) {
      return db.cliente.update({ where: { id: existente.id }, data });
    }
    return existente;
  }

  return db.cliente.create({
    data: {
      nombre: input.nombre,
      cargo: "Personal",
      area: input.zona || null,
      telefono: input.whatsapp,
    },
  });
}