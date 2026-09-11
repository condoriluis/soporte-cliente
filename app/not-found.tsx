"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [fromAdmin, setFromAdmin] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setFromAdmin(
      document.referrer.includes("/admin") || window.location.pathname.startsWith("/admin")
    );
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  return (
    <div className="min-h-svh flex flex-col items-center justify-center text-center space-y-6 p-8">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
        <FileQuestion className="w-10 h-10 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="text-xl font-semibold">Página no encontrada</p>
        <p className="text-muted-foreground max-w-md">
          La página que buscas no existe o ha sido movida.
          Verifica la URL o vuelve al inicio.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href={fromAdmin ? "/admin" : "/"}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {fromAdmin ? "Volver al Panel" : "Ir al Inicio"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
