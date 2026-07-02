import Link from "next/link";
import { ShieldOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
        <ShieldOff className="w-10 h-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Acceso Denegado</h1>
        <p className="text-muted-foreground max-w-md">
          No tienes permisos suficientes para acceder a esta sección.
          Contacta al administrador del sistema si necesitas acceso.
        </p>
      </div>
      <Button asChild>
        <Link href="/admin">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Dashboard
        </Link>
      </Button>
    </div>
  );
}
