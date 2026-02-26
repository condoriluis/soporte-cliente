import { NextResponse } from "next/server";
import { soporteSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Configuración del servidor incompleta: falta WEBHOOK_URL." },
      { status: 500 }
    );
  }

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

  try {
    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!webhookRes.ok) {
      return NextResponse.json(
        { error: `Webhook respondió con HTTP ${webhookRes.status}.` },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor de webhooks." },
      { status: 503 }
    );
  }
}
