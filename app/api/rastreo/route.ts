import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticket = searchParams.get("ticket");

  if (!ticket || typeof ticket !== "string") {
    return NextResponse.json(
      { error: "Se requiere un identificador de ticket." },
      { status: 422 }
    );
  }

  try {
    const where = { code: { equals: ticket, mode: "insensitive" as const } };

    const found = await db.ticket.findFirst({
      where,
      include: { eventos: { orderBy: { createdAt: "asc" } } },
    });

    if (!found) {
      return NextResponse.json({ ticket: null, events: [] });
    }

    return NextResponse.json({
      ticket: {
        code: found.code,
        status: found.estado,
        title: found.title,
        updatedAt: found.updatedAt.toISOString(),
      },
      events: found.eventos.map((e) => ({
        evento: e.evento,
        comentario: e.comentario,
        tecnico: e.tecnico,
        fecha: e.createdAt.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo consultar el ticket." },
      { status: 503 }
    );
  }
}
