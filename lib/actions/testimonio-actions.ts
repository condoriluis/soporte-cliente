"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";
import { testimonioSchema, type TestimonioFormData } from "@/lib/schemas";

import { INITIAL_TESTIMONIALS } from "@/lib/testimonials-data";

const TS_MAX_AGE = 30 * 60 * 1000;

export async function getTestimoniosPublicos() {
  const count = await db.testimonio.count();
  if (count === 0) {
    // Si la tabla está vacía, sembramos los iniciales aprobados
    await db.testimonio.createMany({
      data: INITIAL_TESTIMONIALS,
    });
  }

  return db.testimonio.findMany({
    where: {
      aprobado: true,
      activo: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAllTestimoniosAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("No autorizado");
  }

  const count = await db.testimonio.count();
  if (count === 0) {
    await db.testimonio.createMany({
      data: INITIAL_TESTIMONIALS,
    });
  }

  return db.testimonio.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function submitTestimonio(data: TestimonioFormData) {
  const parsed = testimonioSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: "Por favor revisa los datos ingresados.",
      details: parsed.error.flatten(),
    };
  }

  // Honeypot check
  if (parsed.data.hp && parsed.data.hp.length > 0) {
    return {
      success: true,
      message: "¡Gracias por tu opinión! Será revisada por nuestro equipo antes de publicarse.",
    };
  }

  // Token timestamp check
  const ts = parseInt(parsed.data.ts, 10);
  if (isNaN(ts) || Date.now() - ts > TS_MAX_AGE) {
    return {
      success: false,
      error: "La sesión del formulario expiró. Por favor recarga e intenta de nuevo.",
    };
  }

  // Rate limiting por IP
  try {
    const headerList = await headers();
    const ip =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headerList.get("x-real-ip") ??
      "127.0.0.1";

    const allowed = await checkRateLimit(ip, "testimonio-form");
    if (!allowed) {
      return {
        success: false,
        error: "Has alcanzado el límite de envíos de opiniones por hoy. Intenta más tarde.",
      };
    }
  } catch {
    // Continuar si no se pudo leer headers
  }

  // Guardar en BD — SIEMPRE aprobado: false
  await db.testimonio.create({
    data: {
      nombre: parsed.data.nombre,
      cargo: parsed.data.cargo || null,
      comentario: parsed.data.comentario,
      calificacion: parsed.data.calificacion,
      aprobado: false, // Requiere aprobación del admin
      activo: true,
    },
  });

  revalidatePath("/admin/testimonios");
  revalidatePath("/");

  return {
    success: true,
    message: "¡Muchas gracias! Tu opinión ha sido enviada con éxito y será publicada una vez aprobada por nuestro equipo.",
  };
}

export async function toggleAprobarTestimonio(id: string, aprobado: boolean) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

  const testimonio = await db.testimonio.update({
    where: { id },
    data: { aprobado },
  });

  revalidatePath("/admin/testimonios");
  revalidatePath("/");
  return testimonio;
}

export async function toggleActivoTestimonio(id: string, activo: boolean) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

  const testimonio = await db.testimonio.update({
    where: { id },
    data: { activo },
  });

  revalidatePath("/admin/testimonios");
  revalidatePath("/");
  return testimonio;
}

export async function eliminarTestimonio(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("No autorizado");

  await db.testimonio.delete({
    where: { id },
  });

  revalidatePath("/admin/testimonios");
  revalidatePath("/");
  return { success: true };
}
