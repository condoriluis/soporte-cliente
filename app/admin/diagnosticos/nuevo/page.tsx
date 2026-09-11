"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, ArrowLeft, FileDown } from "lucide-react";
import { diagnosticoSchema, type DiagnosticoFormData } from "@/lib/schemas";
import { createDiagnostico } from "@/lib/actions/diagnostico-actions";
import { getEquipos } from "@/lib/actions/equipo-actions";
import { generateScannerForm } from "@/lib/excel/plantilla-scanner";
import { generateImpresoraForm } from "@/lib/excel/plantilla-impresora";
import { downloadWorkbook } from "@/lib/excel/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

interface EquipoItem {
  id: string; tipo: string; nombre: string; marca: string | null; modelo: string | null;
  numeroActivo: string | null; numeroSerie: string | null;
  funcionario: { nombre: string | null; cargo: string | null; dependencia: string | null; area: string | null; tipo: string | null; telefono: string | null } | null;
}

export default function NuevoDiagnosticoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [equipos, setEquipos] = useState<EquipoItem[]>([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<EquipoItem | null>(null);

  const form = useForm<DiagnosticoFormData>({
    resolver: zodResolver(diagnosticoSchema),
    defaultValues: {
      tipo: undefined,
      equipoId: searchParams.get("equipoId") || "",
      descripcionFc: "",
      diagnostico: "",
      trabajoRealizado: "",
    },
  });

  useEffect(() => {
    getEquipos().then((data) => setEquipos(data as EquipoItem[]));
  }, []);

  useEffect(() => {
    const eqId = form.watch("equipoId");
    const eq = equipos.find((e) => e.id === eqId);
    setEquipoSeleccionado(eq || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("equipoId"), equipos]);

  const onSubmit = async (data: DiagnosticoFormData) => {
    try {
      const diag = await createDiagnostico(data);
      const eq = equipos.find((e) => e.id === data.equipoId);

      if (eq?.tipo === "IMPRESORA" || eq?.tipo === "SCANNER") {
        const wb = eq.tipo === "IMPRESORA"
          ? generateImpresoraForm({
              numeroFicha: diag.numeroFicha || 0,
              fecha: new Date().toLocaleDateString("es-ES"),
              funcionario: {
                nombre: eq.funcionario?.nombre || "",
                cargo: eq.funcionario?.cargo || "",
                dependencia: eq.funcionario?.dependencia || "",
                area: eq.funcionario?.area || "",
                tipo: eq.funcionario?.tipo || "",
                telefono: eq.funcionario?.telefono || "",
              },
              equipo: {
                codigoInventario: eq.numeroActivo || "",
                marca: eq.marca || "",
                modelo: eq.modelo || "",
                numeroSerie: eq.numeroSerie || "",
                tipoEquipo: eq.tipo,
              },
              trabajoRealizado: data.trabajoRealizado || "",
              descripcionFc: data.descripcionFc || "",
              diagnostico: data.diagnostico,
              tecnicoNombre: "",
              responsableNombre: "",
            })
          : generateScannerForm({
              equipos: [{ nombre: eq.nombre, numeroActivo: eq.numeroActivo || "", numeroSerie: eq.numeroSerie || "" }],
              diagnostico: data.diagnostico,
              tecnicoNombre: "",
              responsableNombre: "",
            });

        const fileName = `${eq.tipo}_Ficha_${diag.numeroFicha}.xlsx`;
        downloadWorkbook(wb, fileName);
        toast.success("Diagnóstico guardado y Excel generado");
      } else {
        toast.success("Diagnóstico guardado");
      }

      router.push("/admin/diagnosticos");
    } catch {
      toast.error("Error al guardar el diagnóstico");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Nuevo Diagnóstico</h2>
          <p className="text-sm text-muted-foreground">Registrar diagnóstico técnico y generar ficha Excel</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de diagnóstico</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="PREVENTIVO">Mantenimiento Preventivo</SelectItem>
                        <SelectItem value="CORRECTIVO">Mantenimiento Correctivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="equipoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar equipo" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {equipos.map((eq) => (
                          <SelectItem key={eq.id} value={eq.id}>
                            {eq.nombre} ({eq.tipo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {equipoSeleccionado?.funcionario && (
              <div className="rounded-lg bg-muted/50 p-4 text-sm">
                <p className="font-medium">{equipoSeleccionado.funcionario.nombre}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {equipoSeleccionado.funcionario.cargo} • {equipoSeleccionado.funcionario.dependencia || ""}
                  {equipoSeleccionado.funcionario.area ? ` • ${equipoSeleccionado.funcionario.area}` : ""}
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="descripcionFc"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>Descripción del funcionario</FormLabel>
                   <FormControl><Textarea {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} rows={3} placeholder="Breve descripción del problema según el funcionario..." /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnostico"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>Diagnóstico técnico</FormLabel>
                   <FormControl><Textarea {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} rows={4} placeholder="Diagnóstico elaborado por el personal técnico..." /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trabajoRealizado"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>Trabajo realizado</FormLabel>
                   <FormControl><Textarea {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} rows={3} placeholder="Trabajo realizado (mantenimiento preventivo, reparación, etc.)..." /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="flex-1">
                {form.formState.isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...</>
                ) : (
                  <><FileDown className="w-4 h-4 mr-2" /> Guardar y Generar Excel</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
