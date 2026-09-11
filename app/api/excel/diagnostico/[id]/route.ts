import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateScannerForm } from "@/lib/excel/plantilla-scanner";
import { generateImpresoraForm } from "@/lib/excel/plantilla-impresora";
import XLSX from "xlsx-js-style";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const diag = await db.diagnostico.findUnique({
    where: { id },
    include: {
      equipo: { include: { cliente: true } },
      tecnico: { select: { name: true } },
    },
  });

  if (!diag) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const settings = await db.systemSettings.findFirst();

  const wb = diag.equipo.tipo === "IMPRESORA"
    ? generateImpresoraForm({
        numeroFicha: diag.numeroFicha || 0,
        fecha: new Date(diag.createdAt).toLocaleDateString("es-ES"),
        cliente: {
          nombre: diag.equipo.cliente?.nombre || "",
          cargo: diag.equipo.cliente?.cargo || "",
          dependencia: diag.equipo.cliente?.dependencia || "",
          area: diag.equipo.cliente?.area || "",
          telefono: diag.equipo.cliente?.telefono || "",
        },
        equipo: {
          codigoInventario: diag.equipo.numeroActivo || "",
          marca: diag.equipo.marca || "",
          modelo: diag.equipo.modelo || "",
          numeroSerie: diag.equipo.numeroSerie || "",
          tipoEquipo: diag.equipo.tipo,
        },
        trabajoRealizado: diag.trabajoRealizado || "",
        descripcionFc: diag.descripcionFc || "",
        diagnostico: diag.diagnostico,
        tecnicoNombre: diag.tecnico?.name || "",
        responsableNombre: "",
        institutionName: settings?.institutionName || undefined,
        primaryColor: settings?.primaryColor || undefined,
      })
    : generateScannerForm({
        equipos: [{
          nombre: diag.equipo.nombre,
          numeroActivo: diag.equipo.numeroActivo || "",
          numeroSerie: diag.equipo.numeroSerie || "",
        }],
        diagnostico: diag.diagnostico,
        tecnicoNombre: diag.tecnico?.name || "",
        responsableNombre: "",
        institutionName: settings?.institutionName || undefined,
        primaryColor: settings?.primaryColor || undefined,
      });

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  const fileName = `${diag.equipo.tipo}_Ficha_${diag.numeroFicha || diag.id}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
