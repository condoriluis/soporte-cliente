"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";

export async function getUsuarios() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
  return db.user.findMany({
    select: {
      id: true, name: true, email: true, role: true, isActive: true,
      failedAttempts: true, lockUntil: true, createdAt: true,
      _count: { select: { tickets: true, diagnosticos: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createUsuario(data: { name: string; email: string; password: string; role: string }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
  const existing = await db.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("El correo ya está registrado");

  const hashed = await bcrypt.hash(data.password, 10);
  const user = await db.user.create({
    data: { name: data.name, email: data.email, password: hashed, role: data.role as any },
  });
  revalidatePath("/admin/usuarios");
  return user;
}

export async function updateUsuario(id: string, data: { name?: string; role?: string; isActive?: boolean }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
  const user = await db.user.update({ where: { id }, data: { ...data, role: data.role as any } });
  revalidatePath("/admin/usuarios");
  return user;
}

export async function resetUsuarioPassword(id: string, newPassword: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
  const hashed = await bcrypt.hash(newPassword, 10);
  const user = await db.user.update({
    where: { id },
    data: { password: hashed, failedAttempts: 0, lockUntil: null },
  });
  revalidatePath("/admin/usuarios");
  return user;
}

export async function deleteUsuario(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");
  if (session?.user?.id === id) throw new Error("No puedes eliminarte a ti mismo");
  await db.user.delete({ where: { id } });
  revalidatePath("/admin/usuarios");
}
