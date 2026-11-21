"use client";

import React, { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  FileText,
  Gamepad2,
  Printer,
  RefreshCw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { generateWorksheet } from "@/lib/generator";
import { exportWorkbookPdf, exportWorksheetPdf } from "@/lib/pdfExport";
import {
  DifficultyLevel,
  GeneratedExercise,
  TopicDefinition,
  WorksheetConfig,
} from "@/lib/types";

interface WorksheetStudioProps {
  topic: TopicDefinition;
}

function BalanceScaleSvg({
  balance,
}: {
  balance: { leftX: number; leftConst: number; rightX: number; rightConst: number };
}) {
  const renderPanItems = (
    panCenterX: number,
    xCount: number,
    cVal: number
  ) => {
    const items: { label: string; isX: boolean }[] = [];
    for (let k = 0; k < xCount; k++) items.push({ label: "x", isX: true });
    if (cVal > 0) items.push({ label: String(cVal), isX: false });

    const boxW = 28;
    const gap = 4;
    const totalW = items.length * boxW + Math.max(0, items.length - 1) * gap;
    const startX = panCenterX - totalW / 2;

    return items.map((item, idx) => {
      const rx = startX + idx * (boxW + gap);
      return (
        <g key={idx}>
          <rect
            x={rx}
            y={18}
            width={boxW}
            height={28}
            rx={5}
            fill={item.isX ? "#dbeafe" : "#f1f5f9"}
            stroke={item.isX ? "#2563eb" : "#475569"}
            strokeWidth={1.8}
          />
          <text
            x={rx + boxW / 2}
            y={37}
            textAnchor="middle"
            fontSize={14}
            fontWeight="bold"
            fontFamily="monospace"
            fill={item.isX ? "#1d4ed8" : "#0f172a"}
          >
            {item.label}
          </text>
        </g>
      );
    });
  };

  return (
    <svg
      viewBox="0 0 280 96"
      className="w-full max-w-[280px] select-none"
      role="img"
      aria-label="Balanza en equilibrio"
    >
      {/* Left pan */}
      <line x1={26} y1={50} x2={114} y2={50} stroke="#334155" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={70} y1={50} x2={70} y2={62} stroke="#334155" strokeWidth={2.5} />
      {renderPanItems(70, balance.leftX, balance.leftConst)}

      {/* Right pan */}
      <line x1={166} y1={50} x2={254} y2={50} stroke="#334155" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={210} y1={50} x2={210} y2={62} stroke="#334155" strokeWidth={2.5} />
      {renderPanItems(210, balance.rightX, balance.rightConst)}

      {/* Beam */}
      <line x1={70} y1={62} x2={210} y2={62} stroke="#334155" strokeWidth={3} strokeLinecap="round" />

      {/* Fulcrum */}
      <polygon points="140,62 126,88 154,88" fill="#64748b" />
      <line x1={116} y1={88} x2={164} y2={88} stroke="#475569" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

function OlympiadDiagramSvg({
  diagram,
}: {
  diagram: NonNullable<GeneratedExercise["olympiad"]>["diagram"];
}) {
  if (!diagram) return null;

  if (diagram.type === "rectTriangle") {
    return (
      <svg viewBox="0 0 240 110" className="mx-auto w-56 select-none" role="img" aria-label="Rectángulo con región sombreada">
        <rect x={30} y={24} width={170} height={68} fill="#ffffff" stroke="#0f172a" strokeWidth={2} />
        <polygon points="30,92 145,24 200,92" fill="#94a3b8" fillOpacity={0.55} stroke="#0f172a" strokeWidth={1.8} />
        <text x={115} y={16} textAnchor="middle" fontSize={13} fontWeight="bold" fill="#0f172a">
          {diagram.width}
        </text>
        <text x={16} y={62} textAnchor="middle" fontSize={13} fontWeight="bold" fill="#0f172a">
          {diagram.height}
        </text>
      </svg>
    );
  }

  if (diagram.type === "squareSemicircles") {
    return (
      <svg viewBox="0 0 180 140" className="mx-auto w-44 select-none" role="img" aria-label="Cuadrado ABCD con semicírculos">
        <defs>
          <clipPath id="sqClip">
            <rect x={40} y={22} width={96} height={96} />
          </clipPath>
        </defs>
        <rect x={40} y={22} width={96} height={96} fill="#ffffff" stroke="#0f172a" strokeWidth={2} />
        {/* Semicircle on top AB (shaded) + semicircle on left AD (white/shaded pattern) */}
        <path
          d="M 40 22 A 48 48 0 0 0 136 22 Z"
          fill="#94a3b8"
          fillOpacity={0.55}
          stroke="#0f172a"
          strokeWidth={1.6}
          clipPath="url(#sqClip)"
        />
        <path
          d="M 40 22 A 48 48 0 0 1 40 118 Z"
          fill="#94a3b8"
          fillOpacity={0.55}
          stroke="#0f172a"
          strokeWidth={1.6}
          clipPath="url(#sqClip)"
        />
        <line x1={40} y1={22} x2={136} y2={118} stroke="#0f172a" strokeWidth={1.2} strokeDasharray="4 3" />
        <text x={30} y={20} fontSize={12} fontWeight="bold" fill="#0f172a">A</text>
        <text x={140} y={20} fontSize={12} fontWeight="bold" fill="#0f172a">B</text>
        <text x={140} y={128} fontSize={12} fontWeight="bold" fill="#0f172a">C</text>
        <text x={30} y={128} fontSize={12} fontWeight="bold" fill="#0f172a">D</text>
        <text x={88} y={134} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#2563eb">
          L = {diagram.side}
        </text>
      </svg>
    );
  }

  if (diagram.type === "segment") {
    const pX = 30 + (180 / diagram.denom);
    return (
      <svg viewBox="0 0 240 65" className="mx-auto w-60 select-none" role="img" aria-label="Segmento AB con punto P">
        <line x1={30} y1={28} x2={210} y2={28} stroke="#0f172a" strokeWidth={2.5} />
        <circle cx={30} cy={28} r={3.5} fill="#0f172a" />
        <circle cx={pX} cy={28} r={3.5} fill="#2563eb" />
        <circle cx={210} cy={28} r={3.5} fill="#0f172a" />
        <text x={30} y={16} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#0f172a">A</text>
        <text x={pX} y={16} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#2563eb">P</text>
        <text x={210} y={16} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#0f172a">B</text>
        <path d="M 30 38 L 30 44 L 210 44 L 210 38" fill="none" stroke="#64748b" strokeWidth={1.5} />
        <text x={120} y={58} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#475569">
          {diagram.total} cm
        </text>
      </svg>
    );
  }

  if (diagram.type === "tiledRoom") {
    const cell = Math.min(18, Math.floor(160 / diagram.cols));
    const w = diagram.cols * cell;
    const h = diagram.rows * cell;
    const ox = (220 - w) / 2;
    const oy = 10;
    return (
      <svg viewBox={`0 0 220 ${h + 24}`} className="mx-auto w-56 select-none" role="img" aria-label="Cuarto con baldosas">
        {Array.from({ length: diagram.rows }).map((_, r) =>
          Array.from({ length: diagram.cols }).map((__, c) => {
            const isBorder =
              r === 0 || r === diagram.rows - 1 || c === 0 || c === diagram.cols - 1;
            return (
              <rect
                key={`${r}-${c}`}
                x={ox + c * cell}
                y={oy + r * cell}
                width={cell}
                height={cell}
                fill={isBorder ? "#cbd5e1" : "#ffffff"}
                stroke="#334155"
                strokeWidth={1.2}
              />
            );
          })
        )}
      </svg>
    );
  }

  return null;
}

function CubeStackSvg({ grid }: { grid: number[][] }) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const maxH = Math.max(...grid.flat(), 1);
  const isLarge = rows >= 4 || cols >= 4 || maxH >= 5;
  const dx = isLarge ? 14 : 18;
  const dy = isLarge ? 8 : 10;
  const dz = isLarge ? 15 : 20;
  const baseY = isLarge ? 96 : 88;

  const cubes: { x: number; y: number; key: string }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const h = grid[r][c];
      for (let z = 0; z < h; z++) {
        const isoX = (c - r) * dx + 115;
        const isoY = (c + r) * dy - z * dz + baseY;
        cubes.push({ x: isoX, y: isoY, key: `${r}-${c}-${z}` });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 230 155"
      className="mx-auto w-56 select-none"
      role="img"
      aria-label="Pila de cubos en 3D"
    >
      {cubes.map(({ x, y, key }) => (
        <g key={key}>
          {/* Top face */}
          <polygon
            points={`${x},${y - dz} ${x + dx},${y - dz + dy} ${x},${y - dz + 2 * dy} ${x - dx},${y - dz + dy}`}
            fill="#dbeafe"
            stroke="#1e3a8a"
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
          {/* Left face */}
          <polygon
            points={`${x - dx},${y - dz + dy} ${x},${y - dz + 2 * dy} ${x},${y + 2 * dy} ${x - dx},${y + dy}`}
            fill="#93c5fd"
            stroke="#1e3a8a"
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
          {/* Right face */}
          <polygon
            points={`${x},${y - dz + 2 * dy} ${x + dx},${y - dz + dy} ${x + dx},${y + dy} ${x},${y + 2 * dy}`}
            fill="#60a5fa"
            stroke="#1e3a8a"
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
        </g>
      ))}
    </svg>
  );
}

function TriangleCountSvg({
  figure,
}: {
  figure: NonNullable<GeneratedExercise["triangleFigure"]>;
}) {
  if (figure.type === "diagonals") {
    return (
      <svg
        viewBox="0 0 180 130"
        className="mx-auto w-44 select-none"
        role="img"
        aria-label="Figura geométrica para contar triángulos"
      >
        <rect
          x={35}
          y={15}
          width={110}
          height={100}
          fill="#f8fafc"
          stroke="#0f172a"
          strokeWidth={2}
        />
        <line x1={35} y1={15} x2={145} y2={115} stroke="#0f172a" strokeWidth={1.8} />
        <line x1={145} y1={15} x2={35} y2={115} stroke="#0f172a" strokeWidth={1.8} />
        {figure.mode === "cross" && (
          <>
            <line x1={90} y1={15} x2={90} y2={115} stroke="#2563eb" strokeWidth={1.6} />
            <line x1={35} y1={65} x2={145} y2={65} stroke="#2563eb" strokeWidth={1.6} />
          </>
        )}
      </svg>
    );
  }

  // Fan from apex (110, 14) to base (20..200, 114)
  const apexX = 110;
  const apexY = 14;
  const baseLeft = 20;
  const baseRight = 200;
  const baseY = 114;

  return (
    <svg
      viewBox="0 0 220 130"
      className="mx-auto w-52 select-none"
      role="img"
      aria-label="Triángulo dividido para conteo"
    >
      <polygon
        points={`${apexX},${apexY} ${baseRight},${baseY} ${baseLeft},${baseY}`}
        fill="#f8fafc"
        stroke="#0f172a"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* Sector rays */}
      {Array.from({ length: figure.sectors - 1 }).map((_, idx) => {
        const bx = baseLeft + ((baseRight - baseLeft) * (idx + 1)) / figure.sectors;
        return (
          <line
            key={`ray-${idx}`}
            x1={apexX}
            y1={apexY}
            x2={bx}
            y2={baseY}
            stroke="#0f172a"
            strokeWidth={1.6}
          />
        );
      })}
      {/* Horizontal levels */}
      {Array.from({ length: figure.levels - 1 }).map((_, idx) => {
        const t = (idx + 1) / figure.levels;
        const y = apexY + (baseY - apexY) * t;
        const lx = apexX + (baseLeft - apexX) * t;
        const rx = apexX + (baseRight - apexX) * t;
        return (
          <line
            key={`lvl-${idx}`}
            x1={lx}
            y1={y}
            x2={rx}
            y2={y}
            stroke="#2563eb"
            strokeWidth={1.6}
          />
        );
      })}
    </svg>
  );
}

export default function WorksheetStudio({ topic }: WorksheetStudioProps) {
  const [config, setConfig] = useState<WorksheetConfig>(() => ({
    topicSlug: topic.slug,
    title: topic.name,
    studentName: "",
    showDateLine: true,
    showGrid: topic.defaultConfig.kind === "division",
    ...topic.defaultConfig,
  }));

  const [seed, setSeed] = useState<number>(1);
  const [mode, setMode] = useState<"preview" | "interactive">("preview");
  const [showAnswersOnScreen, setShowAnswersOnScreen] = useState<boolean>(false);

  // Interactive mode state
  const [userInputs, setUserInputs] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<boolean>(false);

  const exercises: GeneratedExercise[] = useMemo(() => {
    return generateWorksheet(config, seed);
  }, [config, seed]);

  const regenerate = () => {
    setSeed((s) => s + 1);
    setUserInputs({});
    setChecked(false);
  };

  const updateConfig = <K extends keyof WorksheetConfig>(
    key: K,
    value: WorksheetConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setUserInputs({});
    setChecked(false);
  };

  const handleDownloadPdf = () => {
    exportWorksheetPdf(exercises, config);
  };

  const handleDownloadWorkbook = () => {
    const pages = Array.from({ length: 5 }, (_, idx) =>
      generateWorksheet(config, seed * 100 + idx + 1)
    );
    exportWorkbookPdf(pages, config);
  };

  const handlePrint = () => {
    window.print();
  };

  const normalizeAnswer = (val: string) =>
    val.trim().toLowerCase().replace(/\s+/g, "");

  const isExerciseCorrect = (ex: GeneratedExercise) => {
    const raw = userInputs[ex.id] ?? "";
    if (!raw.trim()) return false;
    if (ex.kind === "olympiad" && ex.olympiad) {
      return raw.trim().toUpperCase() === ex.olympiad.correctLabel;
    }
    if (ex.kind === "division") {
      // Accept just the quotient if user enters quotient, or full "Q (R r)"
      const quotientOnly = ex.answer.split(" ")[0];
      return (
        normalizeAnswer(raw) === normalizeAnswer(ex.answer) ||
        normalizeAnswer(raw) === normalizeAnswer(quotientOnly)
      );
    }
    return normalizeAnswer(raw) === normalizeAnswer(ex.answer);
  };

  const score = useMemo(() => {
    if (!checked) return 0;
    return exercises.filter(isExerciseCorrect).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, exercises, userInputs]);

  const isVertical =
    config.layout === "vertical" &&
    (config.kind === "addition" ||
      config.kind === "subtraction" ||
      config.kind === "multiplication" ||
      config.kind === "division");

  const showDigitsControls =
    config.kind === "addition" ||
    config.kind === "subtraction" ||
    (config.kind === "multiplication" && config.tableNumber === undefined) ||
    config.kind === "division" ||
    config.kind === "comparison";

  return (
    <section className="space-y-6">
      {/* Control Panel (hidden when printing) */}
      <div className="print:hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Configurador de Ficha
              </h2>
              <p className="text-xs text-slate-500">
                Personaliza al instante y descarga en PDF o practica en pantalla
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                mode === "preview"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="h-4 w-4" />
              Vista Previa A4
            </button>
            <button
              type="button"
              onClick={() => setMode("interactive")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                mode === "interactive"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Gamepad2 className="h-4 w-4" />
              Modo Interactivo
            </button>
          </div>
        </div>

        {/* Options Grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Difficulty */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Dificultad
            </label>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {(["facil", "medio", "dificil", "avanzado"] as DifficultyLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => updateConfig("difficulty", lvl)}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold capitalize transition ${
                    config.difficulty === lvl
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {lvl === "facil"
                    ? "Fácil"
                    : lvl === "medio"
                    ? "Medio"
                    : lvl === "dificil"
                    ? "Difícil"
                    : "Avanzado"}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Nº de ejercicios
            </label>
            <select
              value={config.count}
              onChange={(e) => updateConfig("count", Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              {[12, 16, 20, 24, 30].map((n) => (
                <option key={n} value={n}>
                  {n} ejercicios
                </option>
              ))}
            </select>
          </div>

          {/* Table selector */}
          {topic.supportsTableSelector && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tabla a practicar
              </label>
              <select
                value={config.tableNumber ?? 0}
                onChange={(e) => updateConfig("tableNumber", Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                <option value={0}>Todas mezcladas (1 al 12)</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((t) => (
                  <option key={t} value={t}>
                    Tabla del {t}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Digits A & B */}
          {showDigitsControls && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Cifras
              </label>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Cifras del primer número"
                  value={config.digitsA}
                  onChange={(e) => updateConfig("digitsA", Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-800"
                >
                  {[1, 2, 3, 4].map((d) => (
                    <option key={d} value={d}>
                      {d} {d === 1 ? "cifra" : "cifras"}
                    </option>
                  ))}
                </select>
                {config.kind !== "comparison" && (
                  <>
                    <span className="text-xs font-bold text-slate-400">y</span>
                    <select
                      aria-label="Cifras del segundo número"
                      value={config.digitsB}
                      onChange={(e) => updateConfig("digitsB", Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-800"
                    >
                      {[1, 2, 3].map((d) => (
                        <option key={d} value={d}>
                          {d} {d === 1 ? "cifra" : "cifras"}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Carry toggle */}
          {topic.supportsCarryToggle && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Llevadas
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => updateConfig("carry", false)}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                    !config.carry
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  Sin llevar
                </button>
                <button
                  type="button"
                  onClick={() => updateConfig("carry", true)}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                    config.carry
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  Con llevadas
                </button>
              </div>
            </div>
          )}

          {/* Layout toggle */}
          {topic.supportsLayoutToggle && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Formato
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => updateConfig("layout", "vertical")}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                    config.layout === "vertical"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  Vertical
                </button>
                <button
                  type="button"
                  onClick={() => updateConfig("layout", "horizontal")}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                    config.layout === "horizontal"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  Horizontal
                </button>
              </div>
            </div>
          )}

          {/* Font size */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tamaño letra
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => updateConfig("fontSize", "normal")}
                className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                  config.fontSize === "normal"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => updateConfig("fontSize", "grande")}
                className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                  config.fontSize === "grande"
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                Grande
              </button>
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Nombre alumno (opcional)
            </label>
            <input
              type="text"
              value={config.studentName}
              onChange={(e) => updateConfig("studentName", e.target.value)}
              placeholder="Ej. Sofía García"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={config.includeAnswers}
              onChange={(e) => updateConfig("includeAnswers", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Incluir página de soluciones (Solucionario) en el PDF
          </label>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={regenerate}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Nuevos ejercicios
            </button>

            {mode === "preview" && (
              <button
                type="button"
                onClick={() => setShowAnswersOnScreen((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {showAnswersOnScreen ? (
                  <>
                    <EyeOff className="h-4 w-4" /> Ocultar soluciones
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" /> Ver soluciones
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </button>

            <button
              type="button"
              onClick={handleDownloadWorkbook}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              <BookOpen className="h-4 w-4" />
              Cuaderno 5 págs
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Descargar PDF Gratis
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: A4 Worksheet Preview */}
      {mode === "preview" && (
        <div className="mx-auto max-w-[820px] rounded-2xl border border-slate-200 bg-white p-8 shadow-md print:border-0 print:p-0 print:shadow-none sm:p-12">
          {/* Sheet Header */}
          <div className="border-b-2 border-slate-200 pb-4">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-bold tracking-wider text-white">
                FICHASMATEMÁTICAS
              </span>
              <span className="text-xs font-medium text-slate-400">
                Ficha imprimible A4
              </span>
            </div>
            <h3 className="mt-3 text-2xl font-extrabold text-slate-900">
              {config.title}
            </h3>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
              <span>
                Nombre:{" "}
                {config.studentName ? (
                  <strong className="text-slate-900">{config.studentName}</strong>
                ) : (
                  "____________________________________"
                )}
              </span>
              <span>Fecha: ____ / ____ / ______</span>
            </div>
          </div>

          {/* Sheet Exercises Grid */}
          <div
            className={`mt-8 grid gap-x-6 gap-y-8 ${
              config.kind === "olympiad"
                ? "grid-cols-1"
                : isVertical && config.kind === "division"
                ? "grid-cols-1 sm:grid-cols-2"
                : config.kind === "balance" ||
                  config.kind === "cubeCount" ||
                  config.kind === "triangleCount" ||
                  config.kind === "sequence" ||
                  config.kind === "fractions" ||
                  config.kind === "roman" ||
                  config.kind === "neighbors" ||
                  config.kind === "placeValue" ||
                  config.kind === "ruleOfThree" ||
                  config.kind === "mcmMcd" ||
                  config.kind === "combined"
                ? "grid-cols-1 sm:grid-cols-2"
                : isVertical
                ? config.count <= 12
                  ? "grid-cols-2 sm:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-3"
            }`}
          >
            {exercises.map((ex) => {
              const gridBgClass =
                config.showGrid &&
                ex.kind !== "balance" &&
                ex.kind !== "olympiad" &&
                ex.kind !== "cubeCount" &&
                ex.kind !== "triangleCount"
                  ? "rounded-lg border border-slate-200 bg-[linear-gradient(to_right,#dbe4f0_1px,transparent_1px),linear-gradient(to_bottom,#dbe4f0_1px,transparent_1px)] bg-[size:20px_20px] p-3"
                  : "";
              const divisionSpaceClass =
                isVertical && ex.kind === "division" ? "min-h-[165px]" : "";
              const verticalSpaceClass =
                isVertical && ex.kind === "multiplication" && config.digitsB >= 2
                  ? "min-h-[140px]"
                  : "";

              if (isVertical && ex.kind === "division") {
                return (
                  <div key={ex.id} className="flex items-start gap-3">
                    <span className="pt-1 text-sm font-bold text-slate-400">
                      {ex.id})
                    </span>
                    <div
                      className={`flex-1 flex flex-col ${gridBgClass} ${divisionSpaceClass}`}
                    >
                      <div
                        className={`flex items-start font-mono font-bold text-slate-900 ${
                          config.fontSize === "grande" ? "text-2xl" : "text-xl"
                        }`}
                      >
                        <span className="pr-3 tracking-wide">{ex.a}</span>
                        <div className="border-b-2 border-l-2 border-slate-800 px-3 pb-0.5">
                          {ex.b}
                        </div>
                      </div>
                      {showAnswersOnScreen && (
                        <div className="mt-2 text-xs font-bold text-emerald-600">
                          Cociente: {ex.answer}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
              <div
                key={ex.id}
                className={`relative flex flex-col ${gridBgClass} ${verticalSpaceClass}`}
              >
                <span className="mb-1 text-xs font-bold text-slate-400">
                  {ex.id})
                </span>

                {isVertical ? (
                  <div
                    className={`inline-flex w-28 flex-col items-end font-mono font-bold text-slate-900 ${
                      config.fontSize === "grande" ? "text-2xl" : "text-xl"
                    }`}
                  >
                    <div>{ex.a}</div>
                    <div className="flex w-full justify-between border-b-2 border-slate-800 pb-1">
                      <span>{ex.operator}</span>
                      <span>{ex.b}</span>
                    </div>
                    {showAnswersOnScreen ? (
                      <div className="pt-1 text-emerald-600">{ex.answer}</div>
                    ) : (
                      <div className="h-7" />
                    )}
                  </div>
                ) : ex.kind === "fractions" && ex.fracA && ex.fracB ? (
                  <div className="flex items-center gap-3 font-bold text-slate-900">
                    <div className="flex flex-col items-center leading-tight">
                      <span className="border-b-2 border-slate-800 px-1.5">
                        {ex.fracA.num}
                      </span>
                      <span>{ex.fracA.den}</span>
                    </div>
                    <span className="text-lg">{ex.operator}</span>
                    <div className="flex flex-col items-center leading-tight">
                      <span className="border-b-2 border-slate-800 px-1.5">
                        {ex.fracB.num}
                      </span>
                      <span>{ex.fracB.den}</span>
                    </div>
                    <span className="text-lg">=</span>
                    {showAnswersOnScreen ? (
                      <span className="text-lg text-emerald-600">{ex.answer}</span>
                    ) : (
                      <span className="inline-block w-14 border-b-2 border-slate-300" />
                    )}
                  </div>
                ) : ex.kind === "comparison" ? (
                  <div
                    className={`flex items-center gap-2.5 font-bold text-slate-900 ${
                      config.fontSize === "grande" ? "text-2xl" : "text-lg"
                    }`}
                  >
                    <span>{ex.a}</span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border-2 border-slate-400 text-emerald-600">
                      {showAnswersOnScreen ? ex.answer : ""}
                    </span>
                    <span>{ex.b}</span>
                  </div>
                ) : ex.kind === "sequence" && ex.sequence ? (
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-base font-bold text-slate-900">
                      {ex.sequence.map((val, idx) => (
                        <React.Fragment key={idx}>
                          {val === null ? (
                            <span className="inline-block w-10 border-b-2 border-slate-400 text-center text-emerald-600">
                              {showAnswersOnScreen ? "?" : "\u00A0"}
                            </span>
                          ) : (
                            <span>{val}</span>
                          )}
                          {idx < ex.sequence!.length - 1 && (
                            <span className="text-slate-400">,</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    {showAnswersOnScreen && (
                      <div className="text-xs font-bold text-emerald-600">
                        Sol: {ex.answer}
                      </div>
                    )}
                  </div>
                ) : ex.kind === "roman" ? (
                  <div
                    className={`flex items-center gap-2 font-bold text-slate-900 ${
                      config.fontSize === "grande" ? "text-xl" : "text-base"
                    }`}
                  >
                    <span>{ex.romanPrompt}</span>
                    {showAnswersOnScreen ? (
                      <span className="text-emerald-600">{ex.answer}</span>
                    ) : (
                      <span className="inline-block w-20 border-b-2 border-slate-300" />
                    )}
                  </div>
                ) : ex.promptText ? (
                  <div
                    className={`flex flex-wrap items-center gap-2 font-mono font-bold text-slate-900 ${
                      config.fontSize === "grande" ? "text-xl" : "text-base"
                    }`}
                  >
                    <span>{ex.promptText}</span>
                    {showAnswersOnScreen ? (
                      <span className="text-emerald-600">{ex.answer}</span>
                    ) : (
                      (ex.kind === "decimals" ||
                        ex.kind === "mcmMcd" ||
                        ex.kind === "combined") && (
                        <span className="inline-block w-16 border-b-2 border-slate-300" />
                      )
                    )}
                  </div>
                ) : ex.kind === "balance" && ex.balance ? (
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                    <BalanceScaleSvg balance={ex.balance} />
                    <div className="flex items-center gap-2 font-mono text-base font-bold text-slate-900">
                      <span>x =</span>
                      {showAnswersOnScreen ? (
                        <span className="text-emerald-600">{ex.answer}</span>
                      ) : (
                        <span className="inline-block w-14 border-b-2 border-slate-400" />
                      )}
                    </div>
                  </div>
                ) : ex.kind === "cubeCount" && ex.cubeGrid ? (
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                    <CubeStackSvg grid={ex.cubeGrid} />
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <span>Total cubos:</span>
                      {showAnswersOnScreen ? (
                        <span className="text-base text-emerald-600">{ex.answer}</span>
                      ) : (
                        <span className="inline-block w-14 border-b-2 border-slate-400" />
                      )}
                    </div>
                  </div>
                ) : ex.kind === "triangleCount" && ex.triangleFigure ? (
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                    <TriangleCountSvg figure={ex.triangleFigure} />
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <span>Total triángulos:</span>
                      {showAnswersOnScreen ? (
                        <span className="text-base text-emerald-600">{ex.answer}</span>
                      ) : (
                        <span className="inline-block w-14 border-b-2 border-slate-400" />
                      )}
                    </div>
                  </div>
                ) : ex.kind === "olympiad" && ex.olympiad ? (
                  <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                    <p
                      className={`font-medium leading-relaxed text-slate-900 ${
                        config.fontSize === "grande" ? "text-lg" : "text-base"
                      }`}
                    >
                      {ex.olympiad.question}
                    </p>
                    {ex.olympiad.diagram && (
                      <div className="py-1">
                        <OlympiadDiagramSvg diagram={ex.olympiad.diagram} />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                      {ex.olympiad.options.map((opt) => {
                        const isCorrect =
                          showAnswersOnScreen &&
                          opt.label === ex.olympiad?.correctLabel;
                        return (
                          <div
                            key={opt.label}
                            className={`rounded-lg border px-2.5 py-1.5 text-sm font-bold ${
                              isCorrect
                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                : "border-slate-200 bg-white text-slate-700"
                            }`}
                          >
                            {opt.label}) {opt.value}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex items-center gap-2 font-mono font-bold text-slate-900 ${
                      config.fontSize === "grande" ? "text-xl" : "text-lg"
                    }`}
                  >
                    <span>
                      {ex.a} {ex.operator} {ex.b} =
                    </span>
                    {showAnswersOnScreen ? (
                      <span className="text-emerald-600">{ex.answer}</span>
                    ) : (
                      <span className="inline-block w-14 border-b-2 border-slate-300" />
                    )}
                  </div>
                )}
              </div>
              );
            })}
          </div>

          <div className="mt-10 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
            Generado gratis en FichasMatemáticas · Imprime o descarga en PDF
          </div>
        </div>
      )}

      {/* Mode 2: Interactive Screen Practice */}
      {mode === "interactive" && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Modo Interactivo: {config.title}
              </h3>
              <p className="text-sm text-slate-500">
                Escribe tus respuestas y pulsa &ldquo;Corregir ficha&rdquo; para ver tu puntuación.
              </p>
            </div>
            {checked && (
              <div className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                Puntuación: {score} / {exercises.length} (
                {Math.round((score / exercises.length) * 100)}%)
              </div>
            )}
          </div>

          <div
            className={`mt-6 grid grid-cols-1 gap-4 ${
              config.kind === "olympiad"
                ? "grid-cols-1"
                : config.kind === "balance" ||
                  config.kind === "cubeCount" ||
                  config.kind === "triangleCount"
                ? "sm:grid-cols-2"
                : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {exercises.map((ex) => {
              const correct = checked ? isExerciseCorrect(ex) : null;
              return (
                <div
                  key={ex.id}
                  className={`rounded-xl border p-4 transition ${
                    checked
                      ? correct
                        ? "border-emerald-300 bg-emerald-50/40"
                        : "border-rose-300 bg-rose-50/40"
                      : "border-slate-200 bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      Problema {ex.id}
                    </span>
                    {checked &&
                      (correct ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-500" />
                      ))}
                  </div>

                  {ex.kind === "balance" && ex.balance && (
                    <div className="mt-2 flex justify-center">
                      <BalanceScaleSvg balance={ex.balance} />
                    </div>
                  )}

                  {ex.kind === "cubeCount" && ex.cubeGrid && (
                    <div className="mt-2 flex justify-center">
                      <CubeStackSvg grid={ex.cubeGrid} />
                    </div>
                  )}

                  {ex.kind === "triangleCount" && ex.triangleFigure && (
                    <div className="mt-2 flex justify-center">
                      <TriangleCountSvg figure={ex.triangleFigure} />
                    </div>
                  )}

                  {ex.kind === "olympiad" && ex.olympiad ? (
                    <div className="mt-2 space-y-3">
                      <p className="text-sm font-medium leading-relaxed text-slate-900 sm:text-base">
                        {ex.olympiad.question}
                      </p>
                      {ex.olympiad.diagram && (
                        <div className="py-1">
                          <OlympiadDiagramSvg diagram={ex.olympiad.diagram} />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                        {ex.olympiad.options.map((opt) => {
                          const selected = userInputs[ex.id] === opt.label;
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() =>
                                setUserInputs((prev) => ({
                                  ...prev,
                                  [ex.id]: opt.label,
                                }))
                              }
                              className={`rounded-lg border px-3 py-2 text-left text-sm font-bold transition ${
                                selected
                                  ? "border-blue-600 bg-blue-600 text-white"
                                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {opt.label}) {opt.value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="font-mono text-base font-bold text-slate-900">
                      {ex.kind === "balance"
                        ? "x ="
                        : ex.kind === "cubeCount"
                        ? "Total cubos:"
                        : ex.kind === "triangleCount"
                        ? "Total triángulos:"
                        : ex.kind === "fractions" && ex.fracA && ex.fracB
                        ? `${ex.fracA.num}/${ex.fracA.den} ${ex.operator} ${ex.fracB.num}/${ex.fracB.den} =`
                        : ex.kind === "comparison"
                        ? `${ex.a} [ ? ] ${ex.b}`
                        : ex.kind === "sequence" && ex.sequence
                        ? ex.sequence.map((n) => (n === null ? "?" : n)).join(", ")
                        : ex.kind === "roman"
                        ? ex.romanPrompt
                        : ex.promptText
                        ? ex.promptText
                        : `${ex.a} ${ex.operator} ${ex.b} =`}
                    </div>

                    {ex.kind === "comparison" ? (
                      <div className="flex gap-1">
                        {["<", "=", ">"].map((sym) => (
                          <button
                            key={sym}
                            type="button"
                            onClick={() =>
                              setUserInputs((prev) => ({ ...prev, [ex.id]: sym }))
                            }
                            className={`h-9 w-9 rounded-lg border font-bold transition ${
                              userInputs[ex.id] === sym
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {sym}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={userInputs[ex.id] ?? ""}
                        onChange={(e) =>
                          setUserInputs((prev) => ({
                            ...prev,
                            [ex.id]: e.target.value,
                          }))
                        }
                        placeholder={
                          ex.kind === "sequence"
                            ? "ej. 12, 16"
                            : ex.kind === "fractions"
                            ? "ej. 3/4"
                            : "Respuesta"
                        }
                        className="w-28 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-right font-mono text-base font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                      />
                    )}
                  </div>
                  )}

                  {checked && !correct && (
                    <div className="mt-2 text-xs font-semibold text-rose-600">
                      Solución correcta: {ex.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setUserInputs({});
                setChecked(false);
              }}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Limpiar respuestas
            </button>
            <button
              type="button"
              onClick={() => setChecked(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Corregir ficha
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
