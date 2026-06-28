import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const apiUrl = process.env.DASHBOARD_API_URL;
  const apiKey = process.env.DASHBOARD_API_KEY;

  if (!apiUrl || !apiKey) {
    return NextResponse.json(
      { error: "Configuración del servidor incompleta para rastreo." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const ticket = searchParams.get("ticket");

  if (!ticket || typeof ticket !== "string") {
    return NextResponse.json(
      { error: "Datos inválidos. Se requiere un identificador de ticket." },
      { status: 422 }
    );
  }

  try {
    const isEmail = ticket.includes("@");
    const linkTo = isEmail ? "email_ticket" : "code_ticket";
    const selectFields = "status_ticket,code_ticket,title_ticket,date_updated_ticket";
    const fetchUrl = `${apiUrl}?select=${selectFields}&linkTo=${linkTo}&equalTo=${encodeURIComponent(ticket)}`;
    
    const webhookRes = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      }
    });

    if (!webhookRes.ok) {
      return NextResponse.json(
        { error: `API respondió con HTTP ${webhookRes.status}.` },
        { status: 502 }
      );
    }

    const responseText = await webhookRes.text();
    let webhookData = responseText;
    try {
      webhookData = JSON.parse(responseText);
    } catch { }

    return NextResponse.json(webhookData);
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor de rastreo." },
      { status: 503 }
    );
  }
}
