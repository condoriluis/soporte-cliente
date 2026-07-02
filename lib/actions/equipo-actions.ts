"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function getEquipos(params?: { tipo?: string; search?: string; funcionarioId?: string }) {
  const where: any = {};
  if (params?.tipo) where.tipo = params.tipo;
  if (params?.funcionarioId) where.funcionarioId = params.funcionarioId;
  if (params?.search) {
    where.OR = [
      { nombre: { contains: params.search, mode: "insensitive" } },
      { marca: { contains: params.search, mode: "insensitive" } },
      { modelo: { contains: params.search, mode: "insensitive" } },
      { numeroSerie: { contains: params.search, mode: "insensitive" } },
      { numeroActivo: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return db.equipo.findMany({
    where,
    include: {
      funcionario: { select: { id: true, nombre: true, cargo: true } },
      _count: { select: { diagnosticos: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEquipoById(id: string) {
  return db.equipo.findUnique({
    where: { id },
    include: {
      funcionario: true,
      diagnosticos: {
        include: { tecnico: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createEquipo(data: {
  tipo: string; nombre: string; marca?: string; modelo?: string;
  numeroActivo?: string; numeroSerie?: string; funcionarioId?: string;
}) {
  const equipo = await db.equipo.create({
    data: {
      tipo: data.tipo as any,
      nombre: data.nombre,
      marca: data.marca,
      modelo: data.modelo,
      numeroActivo: data.numeroActivo,
      numeroSerie: data.numeroSerie,
      funcionarioId: data.funcionarioId || undefined,
    },
  });
  revalidatePath("/admin/equipos");
  return equipo;
}

export async function updateEquipo(id: string, data: any) {
  const equipo = await db.equipo.update({ where: { id }, data });
  revalidatePath(`/admin/equipos/${id}`);
  return equipo;
}

export async function deleteEquipo(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
  await db.equipo.delete({ where: { id } });
  revalidatePath("/admin/equipos");
}

export async function getEquiposStats() {
  const [total, scanners, impresoras, otros] = await Promise.all([
    db.equipo.count(),
    db.equipo.count({ where: { tipo: "SCANNER" } }),
    db.equipo.count({ where: { tipo: "IMPRESORA" } }),
    db.equipo.count({ where: { NOT: [{ tipo: "SCANNER" }, { tipo: "IMPRESORA" }] } }),
  ]);
  return { total, scanners, impresoras, otros };
}
