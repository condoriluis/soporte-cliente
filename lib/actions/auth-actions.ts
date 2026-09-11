import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, image: true, isActive: true },
  });
  return user;
}

export async function getSystemSettings() {
  const settings = await db.systemSettings.findUnique({
    where: { id: "system-config" },
  });
  return settings;
}

export async function registerUser(data: { name: string; email: string; password: string }) {
  const existing = await db.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("El correo ya está registrado");

  const userCount = await db.user.count();
  const role = userCount === 0 ? "ADMIN" : "TECNICO";

  const hashedPassword = await bcrypt.hash(data.password, 10);
  return db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role,
    },
    select: { id: true, name: true, email: true, role: true },
  });
}
