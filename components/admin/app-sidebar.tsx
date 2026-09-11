"use client";

import { Home, TicketIcon, Monitor, Users, ClipboardList, FileText, Settings, Shield, ChevronLeft, ChevronRight, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface Settings {
  institutionName: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
}

interface SidebarProps {
  user: { name?: string | null; email?: string | null; role?: string } | null;
  settings: Settings | null;
}

const menuItems = {
  ADMIN: [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/tickets", label: "Tickets", icon: TicketIcon },
    { href: "/admin/equipos", label: "Equipos", icon: Monitor },
    { href: "/admin/clientes", label: "Clientes", icon: Users },
    { href: "/admin/diagnosticos", label: "Diagnósticos", icon: ClipboardList },
    { href: "/admin/reportes", label: "Reportes", icon: FileText },
    { href: "/admin/usuarios", label: "Usuarios", icon: Shield },
    { href: "/admin/configuracion", label: "Configuración", icon: Settings },
  ],
  TECNICO: [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/tickets", label: "Tickets", icon: TicketIcon },
    { href: "/admin/equipos", label: "Equipos", icon: Monitor },
    { href: "/admin/clientes", label: "Clientes", icon: Users },
    { href: "/admin/diagnosticos", label: "Diagnósticos", icon: ClipboardList },
  ],
};

export default function AppSidebar({ user, settings }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const items = menuItems[user?.role === "ADMIN" ? "ADMIN" : "TECNICO"] || menuItems.TECNICO;

  const name = settings?.institutionName || "Soportik";
  const showLogo = settings?.logoUrl && !logoError;

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-3 left-3 z-50 w-9 h-9 rounded-lg bg-background border shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "h-svh border-r bg-sidebar flex flex-col transition-all duration-300 shrink-0",
          // Desktop
          "md:relative md:block",
          collapsed ? "md:w-16" : "md:w-64",
          // Mobile
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-40",
          mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center h-14 border-b shrink-0 px-2">
          {collapsed ? (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setCollapsed(false)}
                className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground transition-colors hover:bg-accent/50 rounded-lg"
                title="Expandir menú"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={closeMobile}
                className="md:hidden flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground transition-colors hover:bg-accent/50 rounded-lg"
                aria-label="Cerrar menú"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex items-center gap-3 min-w-0">
                {showLogo ? (
                  <img
                    src={settings.logoUrl!}
                    alt={name}
                    className="w-8 h-8 rounded-lg object-contain shrink-0"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    <TicketIcon className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <span className="font-bold text-sm truncate">{name}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCollapsed(true)}
                  className="hidden md:flex items-center justify-center w-8 h-8 shrink-0 rounded-lg text-muted-foreground hover:text-foreground transition-colors hover:bg-accent/50"
                  title="Colapsar menú"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={closeMobile}
                  className="md:hidden flex items-center justify-center w-8 h-8 shrink-0 rounded-lg text-muted-foreground hover:text-foreground transition-colors hover:bg-accent/50"
                  aria-label="Cerrar menú"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-2 space-y-2">
          {!collapsed && user && (
            <div className="px-3 py-2">
              <p className="text-xs font-medium truncate">{user.name || "Usuario"}</p>
              <p className="text-xs text-muted-foreground truncate">{user.role === "ADMIN" ? "Administrador" : "Técnico"}</p>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
