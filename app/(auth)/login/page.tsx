import { Suspense } from "react";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import LoginForm from "./login-form";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await db.systemSettings.findUnique({ where: { id: "system-config" } });
  const name = settings?.institutionName || "SoportePro";
  return {
    title: `Iniciar Sesión | ${name}`,
    description: `Acceso al panel de administración de ${name}.`,
  };
}

export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.id) redirect("/admin");

  const settings = await db.systemSettings.findUnique({ where: { id: "system-config" } });
  const name = settings?.institutionName || "SoportePro";
  const logoUrl: string | null = settings?.logoUrl ?? null;

  return (
    <Suspense fallback={
      <div className="min-h-svh flex items-center justify-center bg-muted">
        <div className="text-muted-foreground animate-pulse">Cargando...</div>
      </div>
    }>
      <LoginForm institutionName={name} logoUrl={logoUrl} />
    </Suspense>
  );
}
