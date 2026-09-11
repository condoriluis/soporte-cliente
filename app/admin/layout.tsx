import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import AppSidebar from "@/components/admin/app-sidebar";
import ThemeToggle from "@/components/admin/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { RoleGuard } from "./role-guard";
import { UserProvider } from "./user-context";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, settings] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    }),
    db.systemSettings.findUnique({ where: { id: "system-config" } }),
  ]);

  if (!user || !user.isActive) redirect("/login?error=AccountDeactivated");

  const institutionName = settings?.institutionName || "SoportePro";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      storageKey="admin-theme"
    >
      <div className="flex h-svh overflow-hidden">
        <AppSidebar user={user} settings={settings} />
        <main className="flex-1 overflow-y-auto bg-muted/40">
          <header className="sticky top-0 z-10 h-14 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-6">
            <h1 className="text-sm font-semibold text-muted-foreground">
              {institutionName}
              <span className="font-normal text-xs ml-2 text-muted-foreground/60">
                {user.role === "ADMIN" ? "• Administrador" : "• Técnico"}
              </span>
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <span className="text-xs text-muted-foreground hidden sm:block">
                {user.name}
              </span>
            </div>
          </header>
          <div className="p-4 md:p-6 lg:p-8">
            <RoleGuard role={user.role}>
              <UserProvider user={{ id: user.id, name: user.name, email: user.email, role: user.role }}>
                {children}
              </UserProvider>
            </RoleGuard>
          </div>
        </main>
        <Toaster richColors position="top-right" />
      </div>
    </ThemeProvider>
  );
}