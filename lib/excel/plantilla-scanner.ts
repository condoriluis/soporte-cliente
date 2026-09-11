import { createStyles, createWorkbook, type CellValue, type Range } from "./utils";

export function generateScannerForm(data: {
  equipos: { nombre: string; numeroActivo: string; numeroSerie: string }[];
  diagnostico: string;
  tecnicoNombre: string;
  responsableNombre: string;
  institutionName?: string;
  primaryColor?: string;
}) {
  const s = createStyles(data.primaryColor || "#1a3a5c");
  const inst = (data.institutionName || "Soportik").toUpperCase();
  const ws_data: CellValue[][] = [];
  const merges: Range[] = [];
  const totalCols = 5;

  ws_data.push([{ v: `${inst}`, s: s.headerMain }]);
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } });

  ws_data.push([{ v: "FORMULARIO DE SOLICITUD DE MANTENIMIENTO PREVENTIVO DE SCANERS", s: s.headerSub }]);
  merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } });

  ws_data.push([]);

  ws_data.push([{ v: "1. INFORMACIÓN GENERAL DE EQUIPOS:", s: s.sectionTitle }]);
  merges.push({ s: { r: 3, c: 0 }, e: { r: 3, c: totalCols - 1 } });

  ws_data.push([
    { v: "NOMBRES DE EQUIPO, MARCA Y MODELO", s: s.tableHeader },
    { v: "NÚMERO DE ACTIVO", s: s.tableHeader },
    { v: "", s: s.tableHeader },
    { v: "NÚMERO DE SERIE", s: s.tableHeader },
    { v: "", s: s.tableHeader },
  ]);

  data.equipos.forEach((eq, i) => {
    ws_data.push([
      { v: `${i + 1}. ${eq.nombre.toUpperCase()}`, s: s.cellLeft },
      { v: eq.numeroActivo || "—", s: s.cell },
      { v: "", s: s.cell },
      { v: (eq.numeroSerie || "—").toUpperCase(), s: s.cell },
      { v: "", s: s.cell },
    ]);
  });

  ws_data.push([]);
  ws_data.push([{ v: "DIAGNÓSTICO ELABORADO POR EL PERSONAL TÉCNICO:", s: s.sectionTitle }]);
  merges.push({ s: { r: ws_data.length - 1, c: 0 }, e: { r: ws_data.length - 1, c: totalCols - 1 } });

  ws_data.push([{ v: data.diagnostico.toUpperCase(), s: s.bodyText }]);
  const diagRow = ws_data.length - 1;
  merges.push({ s: { r: diagRow, c: 0 }, e: { r: diagRow, c: totalCols - 1 } });

  ws_data.push([
    { v: "Se concluyó el diagnóstico y se procedió a entregar el equipo al cliente.", s: s.bodyText },
  ]);
  const noteRow = ws_data.length - 1;
  merges.push({ s: { r: noteRow, c: 0 }, e: { r: noteRow, c: totalCols - 1 } });

  ws_data.push([]);
  ws_data.push([]);

  const sigRow = ws_data.length;
  ws_data.push([
    { v: "", s: s.cell },
    { v: "", s: s.cell },
    { v: "", s: s.cell },
    { v: "", s: s.cell },
    { v: "", s: s.cell },
  ]);
  ws_data.push([
    { v: "", s: s.cell },
    { v: data.tecnicoNombre, s: s.signature },
    { v: "", s: s.signature },
    { v: data.responsableNombre, s: s.signature },
    { v: "", s: s.signature },
  ]);
  ws_data.push([
    { v: "", s: s.cell },
    { v: "TÉCNICO DE SOPORTE", s: s.metaLabel },
    { v: "", s: s.metaLabel },
    { v: "CLIENTE", s: s.metaLabel },
    { v: "", s: s.metaLabel },
  ]);

  merges.push(
    { s: { r: sigRow, c: 1 }, e: { r: sigRow, c: 2 } },
    { s: { r: sigRow, c: 3 }, e: { r: sigRow, c: 4 } },
    { s: { r: sigRow + 1, c: 1 }, e: { r: sigRow + 1, c: 2 } },
    { s: { r: sigRow + 1, c: 3 }, e: { r: sigRow + 1, c: 4 } },
    { s: { r: sigRow + 2, c: 1 }, e: { r: sigRow + 2, c: 2 } },
    { s: { r: sigRow + 2, c: 3 }, e: { r: sigRow + 2, c: 4 } },
  );

  const cols = [
    { wch: 42 }, { wch: 18 }, { wch: 4 }, { wch: 18 }, { wch: 4 },
  ];

  return createWorkbook("Scanner", ws_data, merges, cols);
}