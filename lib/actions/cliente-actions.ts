"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function getClientes(params?: { search?: string }) {
  const where: Prisma.ClienteWhereInput = {};
  if (params?.search) {
    where.OR = [
      { nombre: { contains: params.search, mode: "insensitive" } },
      { cargo: { contains: params.search, mode: "insensitive" } },
      { dependencia: { contains: params.search, mode: "insensitive" } },
      { telefono: { contains: params.search, mode: "insensitive" } },
    ];
  }
  return db.cliente.findMany({
    where,
    include: { _count: { select: { equipos: true, tickets: true } } },
    orderBy: { nombre: "asc" },
  });
}

export async function getClienteById(id: string) {
  return db.cliente.findUnique({
    where: { id },
    include: {
      equipos: {
        include: { _count: { select: { diagnosticos: true } } },
        orderBy: { createdAt: "desc" },
      },
      tickets: {
        select: { id: true, code: true, title: true, estado: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });
}

export async function createCliente(data: {
  nombre: string; cargo?: string; dependencia?: string;
  area?: string; telefono?: string;
}) {
  const cl = await db.cliente.create({ data });
  revalidatePath("/admin/clientes");
  return cl;
}

export async function updateCliente(id: string, data: Prisma.ClienteUpdateInput) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
  const cl = await db.cliente.update({ where: { id }, data });
  revalidatePath(`/admin/clientes/${id}`);
  return cl;
}

export async function deleteCliente(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
  await db.cliente.delete({ where: { id } });
  revalidatePath("/admin/clientes");
}