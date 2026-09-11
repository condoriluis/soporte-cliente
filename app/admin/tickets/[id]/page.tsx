import { notFound } from "next/navigation";
import { getTicketById } from "@/lib/actions/ticket-actions";
import { getTecnicos } from "@/lib/actions/ticket-actions";
import { auth } from "@/lib/auth";
import { TicketDetailClient } from "./ticket-detail-client";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  ABIERTO: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  EN_PROCESO: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  ESPERANDO_CLIENTE: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
  RESUELTO: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  CERRADO: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400",
};

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [ticket, tecnicos, session] = await Promise.all([
    getTicketById(id),
    getTecnicos(),
    auth(),
  ]);

  if (!ticket) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-xs text-muted-foreground">{ticket.code}</span>
            <Badge className={`text-xs font-medium ${statusColors[ticket.estado] || ""}`} variant="outline">
              {ticket.estado.replace(/_/g, " ")}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{ticket.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {ticket.categoria} • {ticket.nombre} • {ticket.email}
          </p>
        </div>
      </div>

      <TicketDetailClient
        ticket={ticket}
        tecnicos={tecnicos}
        currentUserRole={session?.user?.role}
      />
    </div>
  );
}
