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
  doc.text("FICHASMATEMÁTICAS", 36, 16.8, { align: "center" });

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

function drawMathGrid(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  step = 5
) {
  const cols = Math.floor(w / step);
  const rows = Math.floor(h / step);
  const gridW = cols * step;
  const gridH = rows * step;

  doc.setDrawColor(219, 228, 240); // soft slate/blue grid
  doc.setLineWidth(0.2);

  for (let c = 0; c <= cols; c++) {
    const gx = x + c * step;
    doc.line(gx, y, gx, y + gridH);
  }
  for (let r = 0; r <= rows; r++) {
    const gy = y + r * step;
    doc.line(x, gy, x + gridW, gy);
  }

  // Subtle outer border
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(x, y, gridW, gridH);
}

function getGridLayout(config: WorksheetConfig) {
  const isVertical =
    config.layout === "vertical" &&
    (config.kind === "addition" ||
      config.kind === "subtraction" ||
      config.kind === "multiplication" ||
      config.kind === "division");

  if (isVertical && config.kind === "division") {
    // Generous 2-column layout with 4 rows max per page = 8 divisions/page
    return { isVertical, cols: 2, maxPerPage: 8, minCellH: 56 };
  }

  if (isVertical && config.kind === "multiplication" && config.digitsB >= 2) {
    // 2+ digit multiplication needs extra room for partial products
    return { isVertical, cols: 3, maxPerPage: 12, minCellH: 54 };
  }

  if (isVertical) {
    const cols = config.count <= 12 ? 3 : 4;
    return { isVertical, cols, maxPerPage: 24, minCellH: 38 };
  }

  if (config.kind === "olympiad") {
    return { isVertical: false, cols: 1, maxPerPage: 5, minCellH: 43 };
  }

  if (config.kind === "balance") {
    return { isVertical, cols: 2, maxPerPage: 8, minCellH: 54 };
  }

  if (config.kind === "sequence") {
    return { isVertical, cols: 2, maxPerPage: 16, minCellH: 28 };
  }

  if (
    config.kind === "fractions" ||
    config.kind === "roman" ||
    config.kind === "neighbors" ||
    config.kind === "placeValue" ||
    config.kind === "ruleOfThree" ||
    config.kind === "mcmMcd" ||
    config.kind === "combined"
  ) {
    return { isVertical, cols: 2, maxPerPage: 20, minCellH: 26 };
  }

  return { isVertical, cols: 3, maxPerPage: 30, minCellH: 24 };
}

function chunkExercises(
  exercises: GeneratedExercise[],
  maxPerPage: number
): GeneratedExercise[][] {
  const chunks: GeneratedExercise[][] = [];
  for (let i = 0; i < exercises.length; i += maxPerPage) {
    chunks.push(exercises.slice(i, i + maxPerPage));
  }
  return chunks;
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
  const startY = 46;
  const bottomY = 276;

  const { isVertical, cols, minCellH } = getGridLayout(config);
  const rows = Math.ceil(exercises.length / cols);
  const cellW = usableW / cols;
  const cellH = Math.max(minCellH, Math.min(60, (bottomY - startY) / Math.max(rows, 1)));
  const baseFont = config.fontSize === "grande" ? 15 : 13;
  const useGrid = Boolean(config.showGrid);

  exercises.forEach((ex, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = marginX + col * cellW;
    const y = startY + row * cellH;

    // Exercise number badge (aligned on the same row as division/first line)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    const badgeY = isVertical && ex.kind === "division" ? y + 7.5 : y + 5;
    doc.text(`${ex.id})`, x + 1.5, badgeY);

    if (useGrid && ex.kind !== "balance" && ex.kind !== "olympiad") {
      if (isVertical && ex.kind === "division") {
        drawMathGrid(doc, x + 9, y + 2, cellW - 15, cellH - 7, 5);
      } else if (isVertical) {
        drawMathGrid(doc, x + 9, y + 2, cellW - 15, cellH - 6, 5);
      } else {
        drawMathGrid(doc, x + 9, y + 14, cellW - 15, Math.max(15, cellH - 18), 5);
      }
    }

    doc.setTextColor(15, 23, 42);
    doc.setFont("courier", "bold");
    doc.setFontSize(baseFont);

    if (isVertical && ex.kind === "division") {
      // Draw Spanish division box on the exact same row as the badge, with spacing
      const cx = x + 13;
      const cy = y + 7.5;
      const aStr = String(ex.a ?? "");
      const bStr = String(ex.b ?? "");
      doc.text(aStr, cx, cy);
      const aWidth = doc.getTextWidth(aStr);
      const boxX = cx + aWidth + 3.5;
      const boxW = Math.max(14, doc.getTextWidth(bStr) + 6);
      doc.setDrawColor(30, 41, 59);
      doc.setLineWidth(0.5);
      doc.line(boxX, cy - 4.5, boxX, cy + 2);
      doc.line(boxX, cy + 2, boxX + boxW, cy + 2);
      doc.text(bStr, boxX + 2.5, cy);

      if (showAnswers) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(22, 163, 74);
        doc.text(`C: ${ex.answer}`, boxX + 2, cy + 8);
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
      const lineLen =
        Math.max(doc.getTextWidth(aStr), doc.getTextWidth(bStr) + 8) + 4;
      doc.line(rightX - lineLen, y + 19.5, rightX, y + 19.5);

      if (showAnswers) {
        doc.setTextColor(22, 163, 74);
        doc.text(ex.answer, rightX, y + 26, { align: "right" });
      }
    } else if (ex.kind === "fractions" && ex.fracA && ex.fracB) {
      const fx = x + 12;
      const fy = y + 7;
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
      const cy = y + 10;
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
      doc.text(seqStr, x + 10, y + 10);
      if (showAnswers) {
        doc.setFontSize(10);
        doc.setTextColor(22, 163, 74);
        doc.text(`Sol: ${ex.answer}`, x + 10, y + 17);
      }
    } else if (ex.kind === "roman") {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12.5);
      doc.text(ex.romanPrompt ?? "", x + 11, y + 10);
      if (showAnswers) {
        doc.setTextColor(22, 163, 74);
        doc.text(
          ex.answer,
          x + 11 + doc.getTextWidth(ex.romanPrompt ?? "") + 3,
          y + 10
        );
      } else {
        doc.setDrawColor(148, 163, 184);
        const px = x + 11 + doc.getTextWidth(ex.romanPrompt ?? "") + 3;
        doc.line(px, y + 10.5, px + 22, y + 10.5);
      }
    } else if (ex.promptText) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11.5);
      doc.text(ex.promptText, x + 10, y + 10);
      if (showAnswers) {
        doc.setFontSize(10);
        doc.setTextColor(22, 163, 74);
        const promptW = doc.getTextWidth(ex.promptText);
        if (ex.kind === "neighbors" || ex.kind === "placeValue" || ex.kind === "ruleOfThree") {
          doc.text(`Sol: ${ex.answer}`, x + 10, y + 17);
        } else {
          doc.text(ex.answer, x + 10 + promptW + 3, y + 10);
        }
      } else if (
        ex.kind === "decimals" ||
        ex.kind === "mcmMcd" ||
        ex.kind === "combined"
      ) {
        doc.setDrawColor(148, 163, 184);
        const px = x + 10 + doc.getTextWidth(ex.promptText) + 2;
        doc.line(px, y + 10.5, px + 18, y + 10.5);
      }
    } else if (ex.kind === "balance" && ex.balance) {
      const { leftX, leftConst, rightX, rightConst } = ex.balance;
      const centerX = x + cellW / 2;
      const beamY = y + 23;

      // Helper to draw weights on a pan
      const drawPan = (panCenterX: number, xCount: number, cVal: number) => {
        // Pan base line
        doc.setDrawColor(51, 65, 85);
        doc.setLineWidth(0.6);
        doc.line(panCenterX - 18, beamY, panCenterX + 18, beamY);
        doc.line(panCenterX, beamY, panCenterX, beamY + 4);

        const items: { label: string; isX: boolean }[] = [];
        for (let k = 0; k < xCount; k++) items.push({ label: "x", isX: true });
        if (cVal > 0) items.push({ label: String(cVal), isX: false });

        const boxW = 7.5;
        const gap = 1.5;
        const totalW = items.length * boxW + (items.length - 1) * gap;
        let curX = panCenterX - totalW / 2;

        items.forEach((item) => {
          if (item.isX) {
            doc.setFillColor(219, 234, 254); // blue-100
            doc.setDrawColor(37, 99, 235); // blue-600
          } else {
            doc.setFillColor(241, 245, 249); // slate-100
            doc.setDrawColor(71, 85, 105); // slate-600
          }
          doc.setLineWidth(0.4);
          doc.roundedRect(curX, beamY - 9, boxW, 8.5, 1, 1, "FD");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(item.isX ? 29 : 15, item.isX ? 78 : 23, item.isX ? 216 : 42);
          doc.text(item.label, curX + boxW / 2, beamY - 3.3, { align: "center" });
          curX += boxW + gap;
        });
      };

      // Beam & Fulcrum
      const leftPanX = centerX - 24;
      const rightPanX = centerX + 24;
      doc.setDrawColor(51, 65, 85);
      doc.setLineWidth(0.7);
      doc.line(leftPanX, beamY + 4, rightPanX, beamY + 4);
      doc.setFillColor(100, 116, 139);
      doc.triangle(
        centerX,
        beamY + 4,
        centerX - 4.5,
        beamY + 12,
        centerX + 4.5,
        beamY + 12,
        "FD"
      );

      drawPan(leftPanX, leftX, leftConst);
      drawPan(rightPanX, rightX, rightConst);

      // Answer line
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      const ansY = beamY + 21;
      doc.text("x =", centerX - 8, ansY);
      if (showAnswers) {
        doc.setTextColor(22, 163, 74);
        doc.text(ex.answer, centerX + 1, ansY);
      } else {
        doc.setDrawColor(148, 163, 184);
        doc.line(centerX, ansY + 0.5, centerX + 14, ansY + 0.5);
      }
    } else if (ex.kind === "olympiad" && ex.olympiad) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      const wrapped = doc.splitTextToSize(ex.olympiad.question, cellW - 14);
      doc.text(wrapped, x + 10, y + 5.5);

      const optsY = y + 5.5 + wrapped.length * 4.8 + 3;
      const optStep = (cellW - 14) / 5;
      ex.olympiad.options.forEach((opt, idx) => {
        const isCorrect = opt.label === ex.olympiad?.correctLabel;
        if (showAnswers && isCorrect) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(22, 163, 74);
        } else {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(51, 65, 85);
        }
        doc.setFontSize(10);
        doc.text(`${opt.label}) ${opt.value}`, x + 10 + idx * optStep, optsY);
      });

      if (showAnswers) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(22, 163, 74);
        doc.text(`Respuesta: ${ex.answer}`, x + 10, optsY + 6);
      }
    } else {
      // Horizontal standard / mental
      doc.setFont("helvetica", "bold");
      doc.setFontSize(baseFont - 1);
      const prompt = `${ex.a} ${ex.operator} ${ex.b} =`;
      doc.text(prompt, x + 10, y + 10);
      if (showAnswers) {
        doc.setTextColor(22, 163, 74);
        doc.text(ex.answer, x + 10 + doc.getTextWidth(prompt) + 3, y + 10);
      } else {
        doc.setDrawColor(148, 163, 184);
        const px = x + 10 + doc.getTextWidth(prompt) + 2;
        doc.line(px, y + 10.5, px + 16, y + 10.5);
      }
    }
  });
}

export function exportWorksheetPdf(
  exercises: GeneratedExercise[],
  config: WorksheetConfig
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { maxPerPage } = getGridLayout(config);
  const chunks = chunkExercises(exercises, maxPerPage);

  chunks.forEach((chunk, idx) => {
    if (idx > 0) doc.addPage();
    drawHeader(
      doc,
      config.title,
      config,
      chunks.length > 1
        ? `Ficha de ejercicios (${idx + 1}/${chunks.length})`
        : "Ficha de ejercicios"
    );
    drawExercisesOnPage(doc, chunk, config, false);
    drawFooter(doc);
  });

  if (config.includeAnswers) {
    chunks.forEach((chunk, idx) => {
      doc.addPage();
      drawHeader(
        doc,
        `${config.title} — Solucionario`,
        config,
        chunks.length > 1
          ? `Hoja de respuestas (${idx + 1}/${chunks.length})`
          : "Hoja de respuestas"
      );
      drawExercisesOnPage(doc, chunk, config, true);
      drawFooter(doc);
    });
  }

  const safeSlug = config.topicSlug.replace(/[^a-z0-9-]/gi, "-");
  doc.save(`ficha-${safeSlug}.pdf`);
}

export function exportWorkbookPdf(
  pages: GeneratedExercise[][],
  config: WorksheetConfig
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const { maxPerPage } = getGridLayout(config);
  const allChunks = pages.flatMap((page) => chunkExercises(page, maxPerPage));

  allChunks.forEach((chunk, idx) => {
    if (idx > 0) doc.addPage();
    drawHeader(
      doc,
      `${config.title} (Página ${idx + 1})`,
      config,
      `Cuaderno · ${idx + 1}/${allChunks.length}`
    );
    drawExercisesOnPage(doc, chunk, config, false);
    drawFooter(doc);
  });

  if (config.includeAnswers) {
    allChunks.forEach((chunk, idx) => {
      doc.addPage();
      drawHeader(
        doc,
        `Solucionario — ${config.title} (Página ${idx + 1})`,
        config,
        `Respuestas · ${idx + 1}/${allChunks.length}`
      );
      drawExercisesOnPage(doc, chunk, config, true);
      drawFooter(doc);
    });
  }

  const safeSlug = config.topicSlug.replace(/[^a-z0-9-]/gi, "-");
  doc.save(`cuaderno-${safeSlug}-${pages.length}-fichas.pdf`);
}
