import { jsPDF } from "jspdf";
import { GeneratedExercise, WorksheetConfig } from "@/lib/types";

function drawHeader(
  doc: jsPDF,
  title: string,
  config: WorksheetConfig,
  pageLabel?: string
) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Brand pill
  doc.setFillColor(37, 99, 235); // blue-600
  doc.roundedRect(14, 12, 44, 7, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("FICHASMATES.ES", 36, 16.8, { align: "center" });

  if (pageLabel) {
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(pageLabel, pageWidth - 14, 16.5, { align: "right" });
  }

  // Title
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text(title, 14, 27);

  // Student info line
  if (config.showDateLine) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    const nameText = config.studentName
      ? `Nombre: ${config.studentName}`
      : "Nombre: _______________________________";
    doc.text(nameText, 14, 34);
    doc.text("Fecha: ____ / ____ / ______", pageWidth - 14, 34, {
      align: "right",
    });
  }

  // Divider
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(14, 38, pageWidth - 14, 38);
}

function drawFooter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Generado gratis en FichasMatemáticas — Material educativo imprimible",
    pageWidth / 2,
    pageHeight - 9,
    { align: "center" }
  );
}

function drawExercisesOnPage(
  doc: jsPDF,
  exercises: GeneratedExercise[],
  config: WorksheetConfig,
  showAnswers: boolean
) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 14;
  const usableW = pageWidth - marginX * 2;
  const startY = 48;
  const bottomY = 276;

  const isVertical =
    config.layout === "vertical" &&
    (config.kind === "addition" ||
      config.kind === "subtraction" ||
      config.kind === "multiplication" ||
      config.kind === "division");

  const cols =
    config.kind === "sequence"
      ? 2
      : isVertical
      ? config.count <= 12
        ? 3
        : 4
      : config.kind === "fractions" || config.kind === "roman"
      ? 2
      : 3;

  const rows = Math.ceil(exercises.length / cols);
  const cellW = usableW / cols;
  const cellH = Math.min(46, (bottomY - startY) / Math.max(rows, 1));
  const baseFont = config.fontSize === "grande" ? 15 : 13;

  exercises.forEach((ex, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = marginX + col * cellW;
    const y = startY + row * cellH;

    // Exercise number badge
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`${ex.id})`, x + 2, y + 4);

    doc.setTextColor(15, 23, 42);
    doc.setFont("courier", "bold");
    doc.setFontSize(baseFont);

    if (isVertical && ex.kind === "division") {
      // Draw Spanish division box: Dividend | Divisor
      const cx = x + 12;
      const cy = y + 12;
      const aStr = String(ex.a ?? "");
      const bStr = String(ex.b ?? "");
      doc.text(aStr, cx, cy);
      const aWidth = doc.getTextWidth(aStr);
      const boxX = cx + aWidth + 3;
      doc.setDrawColor(51, 65, 85);
      doc.setLineWidth(0.45);
      doc.line(boxX, cy - 5, boxX, cy + 2);
      doc.line(boxX, cy + 2, boxX + Math.max(12, doc.getTextWidth(bStr) + 4), cy + 2);
      doc.text(bStr, boxX + 2, cy);

      if (showAnswers) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(22, 163, 74);
        doc.text(`C: ${ex.answer}`, boxX + 2, cy + 7.5);
      }
    } else if (isVertical) {
      const rightX = x + cellW - 10;
      const aStr = String(ex.a ?? "");
      const bStr = String(ex.b ?? "");
      doc.text(aStr, rightX, y + 10, { align: "right" });
      doc.text(`${ex.operator ?? "+"} ${bStr}`, rightX, y + 17, {
        align: "right",
      });
      doc.setDrawColor(30, 41, 59);
      doc.setLineWidth(0.5);
      const lineLen = Math.max(doc.getTextWidth(aStr), doc.getTextWidth(bStr) + 8) + 4;
      doc.line(rightX - lineLen, y + 19.5, rightX, y + 19.5);

      if (showAnswers) {
        doc.setTextColor(22, 163, 74);
        doc.text(ex.answer, rightX, y + 26, { align: "right" });
      }
    } else if (ex.kind === "fractions" && ex.fracA && ex.fracB) {
      const fx = x + 12;
      const fy = y + 9;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      // Frac A
      doc.text(String(ex.fracA.num), fx + 4, fy, { align: "center" });
      doc.line(fx, fy + 1.5, fx + 8, fy + 1.5);
      doc.text(String(ex.fracA.den), fx + 4, fy + 6.5, { align: "center" });

      // Operator
      doc.text(ex.operator ?? "+", fx + 13, fy + 3, { align: "center" });

      // Frac B
      const bx = fx + 18;
      doc.text(String(ex.fracB.num), bx + 4, fy, { align: "center" });
      doc.line(bx, fy + 1.5, bx + 8, fy + 1.5);
      doc.text(String(ex.fracB.den), bx + 4, fy + 6.5, { align: "center" });

      doc.text("=", bx + 13, fy + 3, { align: "center" });

      if (showAnswers) {
        doc.setTextColor(22, 163, 74);
        doc.text(ex.answer, bx + 20, fy + 3);
      } else {
        doc.setDrawColor(148, 163, 184);
        doc.line(bx + 18, fy + 3.5, bx + 32, fy + 3.5);
      }
    } else if (ex.kind === "comparison") {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(baseFont);
      const cx = x + 11;
      const cy = y + 12;
      const aStr = String(ex.a ?? "");
      doc.text(aStr, cx, cy);
      const boxX = cx + doc.getTextWidth(aStr) + 3;
      doc.setDrawColor(100, 116, 139);
      doc.roundedRect(boxX, cy - 5.5, 8, 7.5, 1, 1);
      if (showAnswers) {
        doc.setTextColor(22, 163, 74);
        doc.text(ex.answer, boxX + 4, cy, { align: "center" });
        doc.setTextColor(15, 23, 42);
      }
      doc.text(String(ex.b ?? ""), boxX + 11, cy);
    } else if (ex.kind === "sequence" && ex.sequence) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11.5);
      const seqStr = ex.sequence
        .map((n) => (n === null ? "____" : String(n)))
        .join(" ,  ");
      doc.text(seqStr, x + 10, y + 11);
      if (showAnswers) {
        doc.setFontSize(10);
        doc.setTextColor(22, 163, 74);
        doc.text(`Sol: ${ex.answer}`, x + 10, y + 18);
      }
    } else if (ex.kind === "roman") {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12.5);
      doc.text(ex.romanPrompt ?? "", x + 11, y + 12);
      if (showAnswers) {
        doc.setTextColor(22, 163, 74);
        doc.text(ex.answer, x + 11 + doc.getTextWidth(ex.romanPrompt ?? "") + 3, y + 12);
      } else {
        doc.setDrawColor(148, 163, 184);
        const px = x + 11 + doc.getTextWidth(ex.romanPrompt ?? "") + 3;
        doc.line(px, y + 12.5, px + 22, y + 12.5);
      }
    } else {
      // Horizontal standard / mental
      doc.setFont("helvetica", "bold");
      doc.setFontSize(baseFont - 1);
      const prompt = `${ex.a} ${ex.operator} ${ex.b} =`;
      doc.text(prompt, x + 10, y + 12);
      if (showAnswers) {
        doc.setTextColor(22, 163, 74);
        doc.text(ex.answer, x + 10 + doc.getTextWidth(prompt) + 3, y + 12);
      } else {
        doc.setDrawColor(148, 163, 184);
        const px = x + 10 + doc.getTextWidth(prompt) + 2;
        doc.line(px, y + 12.5, px + 16, y + 12.5);
      }
    }
  });
}

export function exportWorksheetPdf(
  exercises: GeneratedExercise[],
  config: WorksheetConfig
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  drawHeader(doc, config.title, config, "Ficha de ejercicios");
  drawExercisesOnPage(doc, exercises, config, false);
  drawFooter(doc);

  if (config.includeAnswers) {
    doc.addPage();
    drawHeader(doc, `${config.title} — Solucionario`, config, "Hoja de respuestas");
    drawExercisesOnPage(doc, exercises, config, true);
    drawFooter(doc);
  }

  const safeSlug = config.topicSlug.replace(/[^a-z0-9-]/gi, "-");
  doc.save(`ficha-${safeSlug}.pdf`);
}

export function exportWorkbookPdf(
  pages: GeneratedExercise[][],
  config: WorksheetConfig
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  pages.forEach((exercises, idx) => {
    if (idx > 0) doc.addPage();
    drawHeader(
      doc,
      `${config.title} (Página ${idx + 1})`,
      config,
      `Cuaderno · ${idx + 1}/${pages.length}`
    );
    drawExercisesOnPage(doc, exercises, config, false);
    drawFooter(doc);
  });

  if (config.includeAnswers) {
    pages.forEach((exercises, idx) => {
      doc.addPage();
      drawHeader(
        doc,
        `Solucionario — ${config.title} (Página ${idx + 1})`,
        config,
        `Respuestas · ${idx + 1}/${pages.length}`
      );
      drawExercisesOnPage(doc, exercises, config, true);
      drawFooter(doc);
    });
  }

  const safeSlug = config.topicSlug.replace(/[^a-z0-9-]/gi, "-");
  doc.save(`cuaderno-${safeSlug}-${pages.length}-fichas.pdf`);
}
