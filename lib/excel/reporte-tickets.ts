import { createStyles, createWorkbook, type CellValue, type Range } from "./utils";

interface TicketRow {
  code: string;
  title: string;
  categoria: string | null;
  estado: string;
  tecnico?: { name: string | null } | null;
  createdAt: string | Date;
}

export function generateTicketReport(data: {
  tickets: TicketRow[];
  period: string;
  institutionName?: string;
  primaryColor?: string;
}) {
  const s = createStyles(data.primaryColor || "#1a3a5c");
  const inst = (data.institutionName || "Soportik").toUpperCase();
  const ws_data: CellValue[][] = [];
  const merges: Range[] = [];
  const totalCols = 7;

  ws_data.push([{ v: `${inst}`, s: s.headerMain }]);
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } });
  ws_data.push([{ v: `REPORTE DE TICKETS - ${data.period}`, s: { ...s.headerSub, font: { ...s.headerSub.font, bold: true } } }]);
  merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } });
  ws_data.push([]);

  ws_data.push([
    { v: "N°", s: s.tableHeader },
    { v: "CÓDIGO", s: s.tableHeader },
    { v: "TÍTULO", s: s.tableHeader },
    { v: "CATEGORÍA", s: s.tableHeader },
    { v: "ESTADO", s: s.tableHeader },
    { v: "TÉCNICO", s: s.tableHeader },
    { v: "FECHA", s: s.tableHeader },
  ]);

  data.tickets.forEach((t, i) => {
    ws_data.push([
      { v: i + 1, s: s.cell },
      { v: t.code, s: s.cellLeft },
      { v: t.title, s: s.cellLeft },
      { v: t.categoria ?? "", s: s.cell },
      { v: t.estado, s: s.cellBold },
      { v: t.tecnico?.name || "—", s: s.cell },
      { v: new Date(t.createdAt).toLocaleDateString("es-ES"), s: s.cell },
    ]);
  });

  ws_data.push([]);
  const abiertos = data.tickets.filter((t) => t.estado === "ABIERTO").length;
  const enProceso = data.tickets.filter((t) => t.estado === "EN_PROCESO").length;
  const resueltos = data.tickets.filter((t) => t.estado === "RESUELTO").length;
  const cerrados = data.tickets.filter((t) => t.estado === "CERRADO").length;

  ws_data.push([{
    v: `TOTAL: ${data.tickets.length} | ABIERTOS: ${abiertos} | EN PROCESO: ${enProceso} | RESUELTOS: ${resueltos} | CERRADOS: ${cerrados}`,
    s: { font: { bold: true, sz: 10 }, alignment: { horizontal: "left" } },
  }]);
  merges.push({ s: { r: ws_data.length - 1, c: 0 }, e: { r: ws_data.length - 1, c: totalCols - 1 } });

  const cols = [
    { wch: 5 }, { wch: 20 }, { wch: 35 }, { wch: 12 },
    { wch: 14 }, { wch: 22 }, { wch: 14 },
  ];

  return createWorkbook("Tickets", ws_data, merges, cols);
}