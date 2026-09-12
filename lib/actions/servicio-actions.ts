"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getServicios() {
  return db.servicio.findMany({ orderBy: { orden: "asc" } });
}

export async function getTipoCambioUsd() {
  const settings = await db.systemSettings.findUnique({ where: { id: "system-config" } });
  return settings?.cambioUsd ?? 6.97;
}

export async function createServicio(data: {
  nombre: string; descripcion?: string; duracion?: string;
  precioBs: number; popular?: boolean; activo?: boolean; orden?: number;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

  const servicio = await db.servicio.create({ data });
  revalidatePath("/admin/servicios");
  return servicio;
}

export async function updateServicio(id: string, data: {
  nombre?: string; descripcion?: string | null; duracion?: string | null;
  precioBs?: number; popular?: boolean; activo?: boolean; orden?: number;
}) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

  const servicio = await db.servicio.update({ where: { id }, data });
  revalidatePath("/admin/servicios");
  return servicio;
}

export async function deleteServicio(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

  await db.servicio.delete({ where: { id } });
  revalidatePath("/admin/servicios");
}