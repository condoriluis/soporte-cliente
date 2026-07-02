import { createStyles, createWorkbook } from "./utils";

export function generateEquipoReport(data: {
  equipos: any[];
  institutionName?: string;
  primaryColor?: string;
}) {
  const s = createStyles(data.primaryColor || "#1a3a5c");
  const inst = (data.institutionName || "SoportePro").toUpperCase();
  const ws_data: any[][] = [];
  const merges: any[] = [];
  const totalCols = 8;

  ws_data.push([{ v: `${inst}`, s: s.headerMain }]);
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } });
  ws_data.push([{ v: "INVENTARIO DE EQUIPOS", s: { ...s.headerSub, font: { ...s.headerSub.font, bold: true } } }]);
  merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } });
  ws_data.push([]);

  ws_data.push([
    { v: "N°", s: s.tableHeader },
    { v: "TIPO", s: s.tableHeader },
    { v: "NOMBRE", s: s.tableHeader },
    { v: "MARCA", s: s.tableHeader },
    { v: "MODELO", s: s.tableHeader },
    { v: "N° ACTIVO", s: s.tableHeader },
    { v: "N° SERIE", s: s.tableHeader },
    { v: "FUNCIONARIO", s: s.tableHeader },
  ]);

  data.equipos.forEach((eq, i) => {
    ws_data.push([
      { v: i + 1, s: s.cell },
      { v: eq.tipo, s: s.cell },
      { v: eq.nombre, s: s.cellLeft },
      { v: eq.marca || "—", s: s.cell },
      { v: eq.modelo || "—", s: s.cell },
      { v: eq.numeroActivo || "—", s: s.cell },
      { v: eq.numeroSerie || "—", s: s.cell },
      { v: eq.funcionario?.nombre || "—", s: s.cellLeft },
    ]);
  });

  ws_data.push([]);
  ws_data.push([{
    v: `TOTAL DE EQUIPOS: ${data.equipos.length} | SCANNERS: ${data.equipos.filter((e: any) => e.tipo === "SCANNER").length} | IMPRESORAS: ${data.equipos.filter((e: any) => e.tipo === "IMPRESORA").length} | OTROS: ${data.equipos.filter((e: any) => e.tipo !== "SCANNER" && e.tipo !== "IMPRESORA").length}`,
    s: { font: { bold: true, sz: 10 }, alignment: { horizontal: "left" } },
  }]);
  merges.push({ s: { r: ws_data.length - 1, c: 0 }, e: { r: ws_data.length - 1, c: totalCols - 1 } });

  const cols = [
    { wch: 5 }, { wch: 12 }, { wch: 35 }, { wch: 14 },
    { wch: 20 }, { wch: 14 }, { wch: 16 }, { wch: 28 },
  ];

  return createWorkbook("Equipos", ws_data, merges, cols);
}
