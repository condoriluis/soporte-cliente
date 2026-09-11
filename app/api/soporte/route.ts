import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { soporteSchema } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";

const TS_MAX_AGE = 30 * 60 * 1000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido." }, { status: 400 });
  }

  const parsed = soporteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos.", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // Honeypot — campo oculto que los bots rellenan
  if (parsed.data.hp) {
    return NextResponse.json({
      success: true,
      data: { message: `Ticket generado con éxito.\nTK-DUMMY-0000` },
    });
  }

  // Time token — máximo 30 minutos
  const ts = parseInt(parsed.data.ts, 10);
  if (isNaN(ts) || Date.now() - ts > TS_MAX_AGE) {
    return NextResponse.json(
      { error: "Sesión expirada. Recargue la página e intente de nuevo." },
      { status: 429 }
    );
  }

  // Rate limiting por IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";

  const allowed = await checkRateLimit(ip, "support-form");
  if (!allowed) {
    return NextResponse.json(
      { error: "Ha superado el límite de solicitudes. Intente más tarde." },
      { status: 429 }
    );
  }

  try {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let attempt = 0; attempt < 10; attempt++) {
      const suffix = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * 36)]).join("");
      code = `TK-${datePart}-${suffix}`;
      const exists = await db.ticket.findUnique({ where: { code } });
      if (!exists) break;
    }

    const d = parsed.data;
    const descripcion = [
      `Servicio: ${d.servicio}`,
      `Equipo: ${d.tipoEquipo}`,
      `Modalidad: ${d.modalidad === "remoto" ? "Soporte remoto" : "A domicilio"}`,
      d.zona ? `Zona: ${d.zona}` : "",
      d.fechaPreferida ? `Fecha preferida: ${d.fechaPreferida}` : "",
      "",
      d.problema,
    ]
      .filter(Boolean)
      .join("\n");

    const ticket = await db.ticket.create({
      data: {
        code,
        title: `${d.servicio} — ${d.nombre}`,
        categoria: d.servicio,
        descripcion,
        nombre: d.nombre,
        eventos: {
          create: {
            evento: "CREADO",
            comentario: `Solicitud de ${d.servicio}. Equipo: ${d.tipoEquipo} (${d.modalidad}). Contacto WhatsApp: ${d.whatsapp}`,
            tecnico: d.nombre,
          },
        },
      },
      include: { eventos: true },
    });

    const webhookUrl = process.env.WEBHOOK_URL;
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (webhookUrl && webhookSecret) {
      try {
        const payload = {
          event: "new_support_ticket",
          contact_name: d.nombre,
          contact_phone: d.whatsapp,
          contact_subject: `Soporte Técnico: ${d.servicio}`,
          contact_message: descripcion,
          localId: ticket.id,
          localCode: ticket.code,
          timestamp: new Date().toISOString(),
        };

        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Secret": webhookSecret,
          },
          body: JSON.stringify(payload),
        }).catch(() => {});
      } catch {}
    }

    return NextResponse.json({
      success: true,
      data: {
        message: `Ticket generado con éxito.\n${ticket.code}`,
      },
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "No se pudo crear el ticket." },
      { status: 503 }
    );
  }
}