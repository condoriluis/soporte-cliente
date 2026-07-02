import { getDashboardStats } from "@/lib/actions/settings-actions";
import { TicketIcon, Monitor, Users, ClipboardList, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react";

const cards = [
  { label: "Tickets", key: "tickets" as const, icon: TicketIcon, color: "text-blue-600 bg-blue-100 dark:bg-blue-500/10" },
  { label: "Abiertos", key: "ticketsAbiertos" as const, icon: AlertCircle, color: "text-amber-600 bg-amber-100 dark:bg-amber-500/10" },
  { label: "En Proceso", key: "ticketsEnProceso" as const, icon: Clock, color: "text-purple-600 bg-purple-100 dark:bg-purple-500/10" },
  { label: "Resueltos", key: "ticketsResueltos" as const, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-500/10" },
  { label: "Equipos", key: "equipos" as const, icon: Monitor, color: "text-sky-600 bg-sky-100 dark:bg-sky-500/10" },
  { label: "Funcionarios", key: "funcionarios" as const, icon: Users, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-500/10" },
  { label: "Diagnósticos", key: "diagnosticos" as const, icon: ClipboardList, color: "text-rose-600 bg-rose-100 dark:bg-rose-500/10" },
  { label: "Técnicos", key: "tecnicos" as const, icon: TrendingUp, color: "text-teal-600 bg-teal-100 dark:bg-teal-500/10" },
];

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Resumen general del sistema de soporte técnico
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ label, key, icon: Icon, color }) => (
          <div key={key} className="rounded-xl border bg-card p-5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {label}
              </span>
              <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats[key]}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold mb-4">Distribución de Tickets</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-500/5">
            <p className="text-2xl font-bold text-amber-600">{stats.ticketsAbiertos}</p>
            <p className="text-xs text-muted-foreground">Abiertos</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-500/5">
            <p className="text-2xl font-bold text-purple-600">{stats.ticketsEnProceso}</p>
            <p className="text-xs text-muted-foreground">En Proceso</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-500/5">
            <p className="text-2xl font-bold text-emerald-600">{stats.ticketsResueltos}</p>
            <p className="text-xs text-muted-foreground">Resueltos</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-500/5">
            <p className="text-2xl font-bold text-slate-600">{stats.tickets - stats.ticketsAbiertos - stats.ticketsEnProceso - stats.ticketsResueltos}</p>
            <p className="text-xs text-muted-foreground">Cerrados</p>
          </div>
        </div>
      </div>
    </div>
  );
}
