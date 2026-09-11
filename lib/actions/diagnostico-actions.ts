"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

export async function getDiagnosticos(params?: { tipo?: string; equipoId?: string; tecnicoId?: string }) {
  const where: Prisma.DiagnosticoWhereInput = {};
  if (params?.tipo) where.tipo = params.tipo;
  if (params?.equipoId) where.equipoId = params.equipoId;
  if (params?.tecnicoId) where.tecnicoId = params.tecnicoId;

  return db.diagnostico.findMany({
    where,
    include: {
      equipo: { select: { id: true, nombre: true, tipo: true, numeroActivo: true, numeroSerie: true } },
      tecnico: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDiagnosticoById(id: string) {
  return db.diagnostico.findUnique({
    where: { id },
    include: {
      equipo: { include: { funcionario: true } },
      tecnico: { select: { id: true, name: true } },
    },
  });
}

export async function createDiagnostico(data: {
  tipo: string; equipoId: string; descripcionFc?: string;
  diagnostico: string; trabajoRealizado?: string;
}) {
  const session = await auth();
  const last = await db.diagnostico.findFirst({ orderBy: { numeroFicha: "desc" } });
  const nextNumber = (last?.numeroFicha || 0) + 1;

  const diag = await db.diagnostico.create({
    data: {
      ...data,
      numeroFicha: nextNumber,
      tecnicoId: session?.user?.id,
    },
    include: {
      equipo: { include: { funcionario: true } },
      tecnico: { select: { id: true, name: true } },
    },
  });
  revalidatePath("/admin/diagnosticos");
  return diag;
}

export async function deleteDiagnostico(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
  await db.diagnostico.delete({ where: { id } });
  revalidatePath("/admin/diagnosticos");
}

export async function getDiagnosticosStats() {
  const [total, preventivos, correctivos] = await Promise.all([
    db.diagnostico.count(),
    db.diagnostico.count({ where: { tipo: "PREVENTIVO" } }),
    db.diagnostico.count({ where: { tipo: "CORRECTIVO" } }),
  ]);
  return { total, preventivos, correctivos };
}
