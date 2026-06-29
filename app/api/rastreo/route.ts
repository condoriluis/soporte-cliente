import { NextResponse } from "next/server";

const DASHBOARD_TICKETS_PATH = "/tickets";
const DASHBOARD_EVENTS_PATH = "/ticket_events";
const SELECT_TICKET_FIELDS = "status_ticket,code_ticket,title_ticket,date_updated_ticket";

interface TicketEvent {
  evento: string;
  comentario: string | null;
  tecnico: string | null;
  fecha: string;
}

function getBaseUrl(apiUrl: string): string {
  try {
    const url = new URL(apiUrl);
    return url.origin;
  } catch {
    return apiUrl;
  }
}

async function fetchFromDashboard(url: string, apiKey: string): Promise<Response> {
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
  });
}

async function fetchTicketEvents(baseUrl: string, apiKey: string, codeTicket: string): Promise<TicketEvent[]> {
  try {
    const eventsUrl = `${baseUrl}${DASHBOARD_EVENTS_PATH}?linkTo=code_ticket_event&equalTo=${encodeURIComponent(codeTicket)}&orderBy=date_created_ticket_event&orderMode=asc`;
    const eventsRes = await fetchFromDashboard(eventsUrl, apiKey);

    if (!eventsRes.ok) return [];

    const eventsData = await eventsRes.json();
    if (eventsData?.status !== 200 || !eventsData?.results?.length) return [];

    return eventsData.results.map((e: Record<string, unknown>) => ({
      evento: String(e.evento_ticket_event ?? ""),
      comentario: e.comentario_ticket_event ? String(e.comentario_ticket_event) : null,
      tecnico: e.tecnico_ticket_event ? String(e.tecnico_ticket_event) : null,
      fecha: String(e.date_created_ticket_event ?? ""),
    }));
  } catch {
    return [];
  }
}

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
    const baseUrl = getBaseUrl(apiUrl);
    const isEmail = ticket.includes("@");
    const linkTo = isEmail ? "email_ticket" : "code_ticket";
    const ticketsUrl = `${baseUrl}${DASHBOARD_TICKETS_PATH}?select=${SELECT_TICKET_FIELDS}&linkTo=${linkTo}&equalTo=${encodeURIComponent(ticket)}`;

    const ticketsRes = await fetchFromDashboard(ticketsUrl, apiKey);

    if (!ticketsRes.ok) {
      return NextResponse.json(
        { error: `API respondió con HTTP ${ticketsRes.status}.` },
        { status: 502 }
      );
    }

    const ticketsData = await ticketsRes.json();

    if (ticketsData?.status !== 200 || !ticketsData?.total || ticketsData.total === 0 || !ticketsData?.results?.length) {
      return NextResponse.json({ ticket: null, events: [] });
    }

    const ticketData = ticketsData.results[0] as Record<string, unknown>;
    const codeTicket = String(ticketData.code_ticket ?? "");

    const events = await fetchTicketEvents(baseUrl, apiKey, codeTicket);

    return NextResponse.json({
      ticket: {
        code: codeTicket,
        status: String(ticketData.status_ticket ?? ""),
        title: String(ticketData.title_ticket ?? ""),
        updatedAt: String(ticketData.date_updated_ticket ?? ""),
      },
      events,
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo conectar con el servidor de rastreo." },
      { status: 503 }
    );
  }
}
