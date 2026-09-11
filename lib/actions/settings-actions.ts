"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function updateSystemSettings(data: {
  institutionName?: string; logoUrl?: string;
  primaryColor?: string; secondaryColor?: string;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

  const settings = await db.systemSettings.upsert({
    where: { id: "system-config" },
    update: { ...data, isConfigured: true },
    create: { id: "system-config", ...data, isConfigured: true },
  });
  revalidatePath("/admin/configuracion");
  return settings;
}

export async function getSettings() {
  return db.systemSettings.findUnique({ where: { id: "system-config" } });
}

export async function getDashboardStats() {
  const [tickets, equipos, clientes, diagnosticos, tecnicos, ticketsPorEstado] = await Promise.all([
    db.ticket.count(),
    db.equipo.count(),
    db.cliente.count(),
    db.diagnostico.count(),
    db.user.count({ where: { isActive: true, role: "TECNICO" } }),
    db.ticket.groupBy({ by: ["estado"], _count: true }),
  ]);

  const estadoMap: Record<string, number> = {};
  ticketsPorEstado.forEach((t) => { estadoMap[t.estado] = t._count; });

  return {
    tickets,
    equipos,
    clientes,
    diagnosticos,
    tecnicos,
    ticketsAbiertos: estadoMap["ABIERTO"] || 0,
    ticketsEnProceso: estadoMap["EN_PROCESO"] || 0,
    ticketsResueltos: estadoMap["RESUELTO"] || 0,
  };
}
