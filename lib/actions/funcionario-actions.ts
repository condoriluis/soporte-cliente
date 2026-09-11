"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function getFuncionarios(params?: { search?: string }) {
  const where: Prisma.FuncionarioWhereInput = {};
  if (params?.search) {
    where.OR = [
      { nombre: { contains: params.search, mode: "insensitive" } },
      { cargo: { contains: params.search, mode: "insensitive" } },
      { dependencia: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
    ];
  }
  return db.funcionario.findMany({
    where,
    include: { _count: { select: { equipos: true } } },
    orderBy: { nombre: "asc" },
  });
}

export async function getFuncionarioById(id: string) {
  return db.funcionario.findUnique({
    where: { id },
    include: {
      equipos: {
        include: { _count: { select: { diagnosticos: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createFuncionario(data: {
  nombre: string; cargo?: string; dependencia?: string;
  area?: string; tipo?: string; telefono?: string; email?: string;
}) {
  const fc = await db.funcionario.create({ data });
  revalidatePath("/admin/funcionarios");
  return fc;
}

export async function updateFuncionario(id: string, data: Prisma.FuncionarioUpdateInput) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
  const fc = await db.funcionario.update({ where: { id }, data });
  revalidatePath(`/admin/funcionarios/${id}`);
  return fc;
}

export async function deleteFuncionario(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
  await db.funcionario.delete({ where: { id } });
  revalidatePath("/admin/funcionarios");
}
