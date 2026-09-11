import { createStyles, createWorkbook, type CellValue, type Range } from "./utils";

export function generateImpresoraForm(data: {
  numeroFicha: number;
  fecha: string;
  cliente: {
    nombre: string; cargo: string; dependencia: string;
    area: string; telefono: string;
  };
  equipo: {
    codigoInventario: string; marca: string; modelo: string;
    numeroSerie: string; tipoEquipo: string;
  };
  trabajoRealizado: string;
  descripcionFc: string;
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

  const fechaRow: CellValue[] = [
    { v: "FICHA DE DIAGNÓSTICO TÉCNICO", s: s.headerSub },
  ];
  for (let i = 1; i < 3; i++) fechaRow.push(null);
  fechaRow.push({ v: "FECHA", s: s.metaLabel });
  fechaRow.push({ v: data.fecha, s: s.metaValueCenter });
  const rowIdx = ws_data.length;
  ws_data.push(fechaRow);
  merges.push({ s: { r: rowIdx, c: 0 }, e: { r: rowIdx, c: 2 } });

  ws_data.push([
    null, null, null,
    { v: "N° DE FICHA", s: s.metaLabel },
    { v: data.numeroFicha.toString(), s: s.metaValueCenter },
  ]);

  ws_data.push([]);
  ws_data.push([{ v: "1. INFORMACIÓN DEL CLIENTE:", s: s.sectionTitle }]);
  merges.push({ s: { r: ws_data.length - 1, c: 0 }, e: { r: ws_data.length - 1, c: totalCols - 1 } });

  ws_data.push([
    { v: "NOMBRE DEL CLIENTE:", s: s.metaLabel },
    { v: data.cliente.nombre, s: s.metaValue },
    null,
    { v: "TIPO DE CLIENTE:", s: s.metaLabel },
    { v: data.cliente.cargo?.toUpperCase() || "PERSONAL", s: s.metaValue },
  ]);

  ws_data.push([
    { v: "DIRECCIÓN:", s: s.metaLabel },
    { v: data.cliente.dependencia?.toUpperCase(), s: s.metaValue },
    null,
    { v: "ZONA / BARRIO:", s: s.metaLabel },
    { v: data.cliente.area, s: s.metaValue },
  ]);

  ws_data.push([
    { v: "TELÉFONO / WHATSAPP:", s: s.metaLabel },
    { v: data.cliente.telefono || "—", s: s.metaValue },
  ]);

  ws_data.push([]);
  ws_data.push([{ v: "2. INFORMACIÓN GENERAL DEL EQUIPO:", s: s.sectionTitle }]);
  merges.push({ s: { r: ws_data.length - 1, c: 0 }, e: { r: ws_data.length - 1, c: totalCols - 1 } });

  ws_data.push([
    { v: "CÓDIGO DEL INVENTARIO:", s: s.metaLabel },
    { v: data.equipo.codigoInventario || "—", s: s.metaValue },
    null,
    { v: "MARCA:", s: s.metaLabel },
    { v: (data.equipo.marca || "—").toUpperCase(), s: s.metaValue },
  ]);

  ws_data.push([
    { v: "MODELO:", s: s.metaLabel },
    { v: (data.equipo.modelo || "—").toUpperCase(), s: s.metaValue },
    null,
    { v: "N° DE SERIE:", s: s.metaLabel },
    { v: (data.equipo.numeroSerie || "—").toUpperCase(), s: s.metaValue },
  ]);

  ws_data.push([]);
  ws_data.push([
    { v: "DISPOSITIVO CON DESPERFECTOS:", s: s.metaLabel },
    { v: data.equipo.tipoEquipo || "IMPRESORA", s: s.checkBox },
    null,
    { v: "TRABAJO REALIZADO:", s: s.metaLabel },
    { v: (data.trabajoRealizado || "").toUpperCase(), s: s.bodyText },
  ]);

  ws_data.push([]);
  ws_data.push([{ v: "BREVE DESCRIPCIÓN DEL CLIENTE:", s: s.sectionTitle }]);
  merges.push({ s: { r: ws_data.length - 1, c: 0 }, e: { r: ws_data.length - 1, c: totalCols - 1 } });
  ws_data.push([{ v: (data.descripcionFc || "—").toUpperCase(), s: s.bodyText }]);
  const descRow = ws_data.length - 1;
  merges.push({ s: { r: descRow, c: 0 }, e: { r: descRow, c: totalCols - 1 } });

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
    { v: "", s: s.cell }, { v: "", s: s.cell }, { v: "", s: s.cell },
    { v: "", s: s.cell }, { v: "", s: s.cell },
  ]);
  ws_data.push([
    { v: "", s: s.cell },
    { v: data.tecnicoNombre, s: s.signature }, { v: "", s: s.signature },
    { v: data.responsableNombre, s: s.signature }, { v: "", s: s.signature },
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
    { wch: 28 }, { wch: 24 }, { wch: 3 }, { wch: 22 }, { wch: 24 },
  ];

  return createWorkbook("Diagnóstico", ws_data, merges, cols);
}