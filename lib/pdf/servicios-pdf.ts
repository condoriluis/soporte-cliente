import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface ServicioPdfItem {
  nombre: string;
  descripcion: string | null;
  duracion: string | null;
  precioBs: number;
  popular: boolean;
}

export interface ServiciosPdfParams {
  servicios: ServicioPdfItem[];
  institutionName: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  cambioUsd: number;
}

function rgba(hex: string, alpha = 1): [number, number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
    alpha,
  ];
}

async function resolveLogo(logoUrl: string | null): Promise<string | null> {
  if (!logoUrl) return null;
  if (logoUrl.startsWith("data:image/") || logoUrl.startsWith("data:image/svg")) return logoUrl;
  try {
    const res = await fetch(logoUrl, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!blob.type.startsWith("image/") || blob.type === "image/svg+xml") return null;
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("read error"));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function downloadServiciosPdf(params: ServiciosPdfParams) {
  const { servicios, institutionName } = params;
  const [r, g, b] = rgba(params.primaryColor);
  const [rAccent, gAccent, bAccent] = rgba(params.secondaryColor);
  const logo = await resolveLogo(params.logoUrl);
  const tasa = params.cambioUsd > 0 ? params.cambioUsd : 6.97;
  const validos = servicios.filter((s) => s.precioBs > 0);
  const totalBs = validos.reduce((acc, s) => acc + s.precioBs, 0);
  const nombre = institutionName || "Soportik";

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  });
  doc.setProperties({ title: `Lista de precios — ${nombre}`, creator: nombre });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = 48;

  doc.setFillColor(r, g, b);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setFillColor(rAccent, gAccent, bAccent);
  doc.rect(0, 40, pageWidth, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(nombre, margin, 26);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Servicio Técnico Especializado", margin, 34, { charSpace: 0.2 });

  doc.setTextColor(120, 130, 150);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("LISTA DE PRECIOS", pageWidth - margin, 24, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(220, 225, 235);
  doc.text(
    new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" }),
    pageWidth - margin,
    32,
    { align: "right" }
  );

  if (logo && logo !== "data:image/svg+xml") {
    try {
      doc.addImage(logo, margin, 48, 40, 40);
      y += 44;
    } catch {
      // logo no incrustable (formato no soportado) — se omite
    }
  }

  y += 8;

  doc.setTextColor(30, 40, 55);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Tarifario de Servicios", margin, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(110, 120, 135);
  const introText = doc.splitTextToSize(
    `Incluye diagnóstico técnico previo y garantía en el trabajo realizado. Los precios en dólares ($us) se calculan al tipo de cambio configurado (1 USD = ${tasa.toFixed(2)} Bs).`,
    pageWidth - margin * 2
  );
  doc.text(introText, margin, y);
  y += introText.length * 10.5 + 14;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["N°", "SERVICIO", "DURACIÓN", "PRECIO (Bs)", "PRECIO ($us)"]],
    body: validos.map((s, i) => [
      String(i + 1),
      {
        content: s.nombre + (s.popular ? "  [POPULAR]" : ""),
        styles: {
          fontStyle: s.popular ? "bold" : "normal",
          textColor: s.popular ? [r, g, b] : [30, 40, 55] as [number, number, number],
        },
      },
      { content: s.duracion || "—", styles: { halign: "center" } },
      { content: `Bs ${s.precioBs.toFixed(2)}`, styles: { halign: "right", fontStyle: "bold" } },
      { content: `$us ${(s.precioBs / tasa).toFixed(2)}`, styles: { halign: "right" } },
    ]),
    foot: [
      [
        { content: "TOTAL", colSpan: 3, styles: { halign: "right", fontStyle: "bold" } },
        { content: `Bs ${totalBs.toFixed(2)}`, styles: { halign: "right", fontStyle: "bold" } },
        { content: `$us ${(totalBs / tasa).toFixed(2)}`, styles: { halign: "right", fontStyle: "bold" } },
      ],
    ],
    headStyles: {
      fillColor: [r, g, b],
      textColor: 255,
      fontSize: 8.5,
      fontStyle: "bold",
      halign: "left",
    },
    footStyles: {
      fillColor: [Math.min(255, r + 40), Math.min(255, g + 40), Math.min(255, b + 40)],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [55, 65, 80],
      cellPadding: { top: 5, bottom: 5, left: 5, right: 5 },
    },
    alternateRowStyles: { fillColor: [247, 249, 252] },
    columnStyles: {
      0: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 75, halign: "center" },
      3: { cellWidth: 80, halign: "right" },
      4: { cellWidth: 80, halign: "right" },
    },
    styles: { cellPadding: { top: 5, bottom: 5, left: 5, right: 5 } },
  });

  const endY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 22;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(140, 148, 160);
  doc.text(
    doc.splitTextToSize(
      "Nota: El diagnóstico del equipo es sin costo. La cotización final se realiza después de evaluar el equipo y puede variar según repuestos o complejidad del trabajo.",
      pageWidth - margin * 2
    ),
    margin,
    endY
  );

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(160, 168, 178);
    doc.text("Precios de referencia… El costo final se confirma con el diagnóstico previo.", margin, pageHeight - 24);
    doc.text(`Página ${i} de ${pages}`, pageWidth - margin, pageHeight - 24, { align: "right" });
  }

  doc.save(`servicios-precios-${new Date().toISOString().slice(0, 10)}.pdf`);
}