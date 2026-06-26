import { NextResponse } from "next/server";
import { soporteSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const webhookUrl = process.env.WEBHOOK_URL;
  const webhookSecret = process.env.WEBHOOK_SECRET;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Configuración del servidor incompleta: falta WEBHOOK_URL." },
      { status: 500 }
    );
  }

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Configuración del servidor incompleta: falta WEBHOOK_SECRET." },
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

    const payload = {
      event: "new_support_ticket",
      contact_name: parsed.data.nombre,
      contact_email: parsed.data.email,
      contact_subject: `Soporte Técnico: ${parsed.data.categoria}`,
      contact_message: parsed.data.pregunta,
      timestamp: new Date().toISOString()
    };

    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Webhook-Secret": webhookSecret },
      body: JSON.stringify(payload),
    });

    if (!webhookRes.ok) {
      return NextResponse.json(
        { error: `Webhook respondió con HTTP ${webhookRes.status}.` },
        { status: 502 }
      );
    }

    const responseText = await webhookRes.text();
    let webhookData = responseText;
    try {
      webhookData = JSON.parse(responseText);
    } catch {}

    return NextResponse.json({ success: true, data: webhookData });
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor de webhooks." },
      { status: 503 }
    );
  }
}
