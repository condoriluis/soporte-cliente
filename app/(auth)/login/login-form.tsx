"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Shield, Loader2, AlertCircle, Mail, Lock } from "lucide-react";
import { loginSchema, type LoginValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginForm({ institutionName, logoUrl }: { institutionName: string; logoUrl: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [logoError, setLogoError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "AccountDeactivated") {
      setError("Tu cuenta ha sido desactivada.");
    } else if (err?.startsWith("LOCKED_")) {
      const mins = err.split("_")[1];
      setError(`Cuenta bloqueada. Intenta de nuevo en ${mins} minuto(s).`);
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginValues) => {
    setError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error === "LOCKED") {
      setError("Cuenta bloqueada. Intenta de nuevo en 15 minutos.");
      return;
    }

    if (result?.error === "CredentialsSignin") {
      setError("Credenciales inválidas.");
      toast.error("Credenciales inválidas");
      return;
    }

    if (result?.ok) {
      toast.success("Inicio de sesión exitoso");
      router.push("/admin");
      router.refresh();
    }
  };

  const showLogo = logoUrl && !logoError;

  return (
    <div className="min-h-svh flex items-stretch">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/90 via-primary to-primary/60 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-md text-primary-foreground space-y-6">
          {showLogo && (
            <div className="mx-auto w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <img src={logoUrl!} alt={institutionName} className="w-12 h-12 object-contain" />
            </div>
          )}
          {!showLogo && (
            <div className="mx-auto w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <Shield className="w-10 h-10" />
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight">{institutionName}</h1>
          <p className="text-base text-white/80 leading-relaxed">
            Sistema de gestión de soporte técnico.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-muted/50">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden mx-auto lg:mx-0 w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              {showLogo ? (
                <img src={logoUrl!} alt={institutionName} className="w-7 h-7 object-contain" onError={() => setLogoError(true)} />
              ) : (
                <Shield className="w-6 h-6 text-primary-foreground" />
              )}
            </div>
            <h2 className="text-xl font-semibold tracking-tight">Iniciar Sesión</h2>
            <p className="text-sm text-muted-foreground">
              Ingresa tus credenciales de acceso
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive animate-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@institucion.com"
                  autoComplete="email"
                  autoFocus
                  className="pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pl-10 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-11 text-sm font-semibold" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground/60">
              &copy; {new Date().getFullYear()} {institutionName}. Todos los derechos reservados.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
