const ADMIN_ONLY_ROUTES = [
  "/admin/usuarios",
  "/admin/configuracion",
];

const TECNICO_ROUTES = [
  "/admin",
  "/admin/tickets",
  "/admin/equipos",
  "/admin/funcionarios",
  "/admin/diagnosticos",
  "/admin/reportes",
];

export function getRequiredRole(pathname: string): "ADMIN" | "TECNICO" | null {
  if (ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    return "ADMIN";
  }
  if (TECNICO_ROUTES.some((route) => pathname.startsWith(route))) {
    return "TECNICO";
  }
  return null;
}

export function hasAccess(pathname: string, role?: string): boolean {
  if (!role) return false;
  if (role === "ADMIN") return true;
  const required = getRequiredRole(pathname);
  if (!required) return false;
  if (required === "ADMIN" && role !== "ADMIN") return false;
  return true;
}
