import XLSX from "xlsx-js-style";
import type { CellStyle, ColInfo, Range, RowInfo, WorkBook } from "xlsx-js-style";

export type { ColInfo, Range, RowInfo, WorkBook } from "xlsx-js-style";

export type CellValue = { v: string | number | boolean | Date; s?: CellStyle } | null;

export const cleanColor = (hex: string) => (hex || "#1a3a5c").replace("#", "").toUpperCase();

export const numberToSpanish = (n: number): string => {
  if (n === 0) return "CERO";
  const ones = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
  const tens = ["", "DIEZ", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
  const teens = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];

  if (n === 100) return "CIEN";
  const w = Math.floor(n);
  if (w < 10) return ones[w];
  if (w < 20) return teens[w - 10];
  const t = Math.floor(w / 10);
  const o = w % 10;
  if (t === 2 && o > 0) return "VEINTI" + ones[o];
  return tens[t] + (o > 0 ? " Y " + ones[o] : "");
};

export function createStyles(primary: string): Record<string, CellStyle> {
  const p = cleanColor(primary);
  return {
    headerMain: {
      font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: p } },
      alignment: { horizontal: "center", vertical: "center" },
    },
    headerSub: {
      font: { sz: 9, italic: true, color: { rgb: "333333" } },
      alignment: { horizontal: "center", vertical: "center" },
    },
    sectionTitle: {
      font: { bold: true, sz: 10, color: { rgb: p } },
      alignment: { horizontal: "left", vertical: "center" },
    },
    metaLabel: {
      font: { bold: true, sz: 8, color: { rgb: "555555" } },
      alignment: { horizontal: "left", vertical: "top" },
    },
    metaValue: {
      font: { bold: true, sz: 10 },
      alignment: { horizontal: "left", vertical: "bottom" },
      border: { bottom: { style: "thin", color: { rgb: "999999" } } },
    },
    metaValueCenter: {
      font: { bold: true, sz: 10 },
      alignment: { horizontal: "center", vertical: "bottom" },
      border: { bottom: { style: "thin", color: { rgb: "999999" } } },
    },
    tableHeader: {
      font: { bold: true, sz: 9, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: p } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "CCCCCC" } },
        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
        left: { style: "thin", color: { rgb: "CCCCCC" } },
        right: { style: "thin", color: { rgb: "CCCCCC" } },
      },
    },
    cell: {
      font: { sz: 9 },
      alignment: { vertical: "center", horizontal: "center" },
      border: { top: { style: "thin", color: { rgb: "CCCCCC" } }, bottom: { style: "thin", color: { rgb: "CCCCCC" } }, left: { style: "thin", color: { rgb: "CCCCCC" } }, right: { style: "thin", color: { rgb: "CCCCCC" } } },
    },
    cellLeft: {
      font: { sz: 9 },
      alignment: { vertical: "center", horizontal: "left" },
      border: { top: { style: "thin", color: { rgb: "CCCCCC" } }, bottom: { style: "thin", color: { rgb: "CCCCCC" } }, left: { style: "thin", color: { rgb: "CCCCCC" } }, right: { style: "thin", color: { rgb: "CCCCCC" } } },
    },
    cellBold: {
      font: { bold: true, sz: 9 },
      alignment: { vertical: "center", horizontal: "center" },
      border: { top: { style: "thin", color: { rgb: "CCCCCC" } }, bottom: { style: "thin", color: { rgb: "CCCCCC" } }, left: { style: "thin", color: { rgb: "CCCCCC" } }, right: { style: "thin", color: { rgb: "CCCCCC" } } },
    },
    signature: {
      font: { bold: true, sz: 9 },
      alignment: { horizontal: "center", vertical: "top" },
      border: { top: { style: "medium", color: { rgb: p } } },
    },
    bodyText: {
      font: { sz: 10 },
      alignment: { horizontal: "left", vertical: "top", wrapText: true },
    },
    checkBox: {
      font: { sz: 12, bold: true },
      alignment: { horizontal: "center", vertical: "center" },
    },
  };
}

export function createWorkbook(sheetName: string, ws_data: CellValue[][], merges: Range[], cols: ColInfo[], rows?: RowInfo[]) {
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  ws["!merges"] = merges;
  ws["!cols"] = cols;
  if (rows) ws["!rows"] = rows;
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return wb;
}

export function downloadWorkbook(wb: WorkBook, fileName: string) {
  XLSX.writeFile(wb, fileName);
}