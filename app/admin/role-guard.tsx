"use client";

import { usePathname } from "next/navigation";
import { hasAccess } from "@/lib/permissions";
import ForbiddenPage from "./forbidden/page";

export function RoleGuard({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const pathname = usePathname();

  if (!hasAccess(pathname, role)) {
    return <ForbiddenPage />;
  }

  return <>{children}</>;
}
