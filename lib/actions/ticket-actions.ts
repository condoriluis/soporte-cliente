"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getTickets(params?: { estado?: string; tecnicoId?: string; search?: string }) {
  const where: any = {};
  if (params?.estado) where.estado = params.estado;
  if (params?.tecnicoId) where.tecnicoId = params.tecnicoId;
  if (params?.search) {
    where.OR = [
      { code: { contains: params.search, mode: "insensitive" } },
      { title: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
      { nombre: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return db.ticket.findMany({
    where,
    include: {
      tecnico: { select: { id: true, name: true } },
      eventos: { orderBy: { createdAt: "asc" } },
      _count: { select: { eventos: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTicketById(id: string) {
  return db.ticket.findUnique({
    where: { id },
    include: {
      tecnico: { select: { id: true, name: true } },
      eventos: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function createTicket(data: {
  title: string; categoria: string; descripcion: string;
  email: string; nombre: string; tecnicoId?: string;
}) {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let attempt = 0; attempt < 10; attempt++) {
    const suffix = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * 36)]).join("");
    code = `TK-${datePart}-${suffix}`;
    const exists = await db.ticket.findUnique({ where: { code } });
    if (!exists) break;
  }

  const ticket = await db.ticket.create({
    data: {
      code,
      title: data.title,
      categoria: data.categoria,
      descripcion: data.descripcion,
      email: data.email,
      nombre: data.nombre,
      tecnicoId: data.tecnicoId || null,
      eventos: {
        create: { evento: "CREADO", comentario: "Ticket creado", tecnico: data.nombre },
      },
    },
    include: { eventos: true },
  });

  revalidatePath("/admin/tickets");
  return ticket;
}

export async function updateTicketStatus(id: string, estado: string, comentario?: string) {
  const session = await auth();
  const ticket = await db.ticket.update({
    where: { id },
    data: {
      estado,
      eventos: {
        create: {
          evento: estado,
          comentario: comentario || `Estado cambiado a ${estado}`,
          tecnico: session?.user?.name || "Sistema",
        },
      },
    },
    include: { eventos: { orderBy: { createdAt: "asc" } } },
  });
  revalidatePath(`/admin/tickets/${id}`);
  return ticket;
}

export async function assignTicket(id: string, tecnicoId: string) {
  const session = await auth();
  const tecnico = await db.user.findUnique({ where: { id: tecnicoId } });

  const ticket = await db.ticket.update({
    where: { id },
    data: {
      tecnicoId,
      estado: "EN_PROCESO",
      eventos: {
        create: {
          evento: "EN_PROCESO",
          comentario: `Asignado a ${tecnico?.name || "Técnico"}`,
          tecnico: session?.user?.name || "Sistema",
        },
      },
    },
    include: { eventos: { orderBy: { createdAt: "asc" } } },
  });
  revalidatePath(`/admin/tickets/${id}`);
  return ticket;
}

export async function addTicketEvent(ticketId: string, evento: string, comentario: string) {
  const session = await auth();
  const ev = await db.ticketEvento.create({
    data: {
      ticketId,
      evento,
      comentario,
      tecnico: session?.user?.name || "Sistema",
    },
  });
  revalidatePath(`/admin/tickets/${ticketId}`);
  return ev;
}

export async function deleteTicket(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
  await db.ticket.delete({ where: { id } });
  revalidatePath("/admin/tickets");
}

export async function getTicketsStats() {
  const [total, abiertos, enProceso, resueltos, cerrados] = await Promise.all([
    db.ticket.count(),
    db.ticket.count({ where: { estado: "ABIERTO" } }),
    db.ticket.count({ where: { estado: "EN_PROCESO" } }),
    db.ticket.count({ where: { estado: "RESUELTO" } }),
    db.ticket.count({ where: { estado: "CERRADO" } }),
  ]);
  return { total, abiertos, enProceso, resueltos, cerrados };
}

export async function getTecnicos() {
  return db.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true, email: true, _count: { select: { tickets: true } } },
    orderBy: { name: "asc" },
  });
}
