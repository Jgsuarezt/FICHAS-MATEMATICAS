"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Download, Sparkles } from "lucide-react";
import { TOPICS } from "@/data/topics";
import { generateWorksheet } from "@/lib/generator";
import { exportWorkbookPdf } from "@/lib/pdfExport";
import { DifficultyLevel, WorksheetConfig } from "@/lib/types";

export default function CuadernosPage() {
  const [selectedSlug, setSelectedSlug] = useState<string>(TOPICS[1].slug);
  const [pagesCount, setPagesCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medio");
  const [includeAnswers, setIncludeAnswers] = useState<boolean>(true);
  const [studentName, setStudentName] = useState<string>("");

  const topic = TOPICS.find((t) => t.slug === selectedSlug) ?? TOPICS[0];

  const handleGenerateWorkbook = () => {
    const config: WorksheetConfig = {
      topicSlug: topic.slug,
      title: topic.name,
      studentName,
      showDateLine: true,
      ...topic.defaultConfig,
      difficulty,
      includeAnswers,
    };

    const baseSeed = Date.now() % 100000;
    const pages = Array.from({ length: pagesCount }, (_, idx) =>
      generateWorksheet(config, baseSeed + idx + 1)
    );
    exportWorkbookPdf(pages, config);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700">
          <Sparkles className="h-3.5 w-3.5" />
          Cuadernillos de repaso multipágina
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Generador de Cuadernos de Matemáticas en PDF
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-600">
          Crea al instante un cuaderno completo con 5, 10 o 15 fichas distintas
          listo para imprimir, con su solucionario al final. Ideal para deberes,
          vacaciones o clase.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md sm:p-8 space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Tema del cuaderno
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              {TOPICS.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name} ({t.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Número de páginas (fichas)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPagesCount(n)}
                  className={`rounded-xl border py-2.5 text-sm font-bold transition ${
                    pagesCount === n
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {n} páginas
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Nivel de dificultad
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["facil", "medio", "dificil"] as DifficultyLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`rounded-xl border py-2.5 text-sm font-bold capitalize transition ${
                    difficulty === lvl
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {lvl === "facil" ? "Fácil" : lvl === "medio" ? "Medio" : "Difícil"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Nombre del alumno (opcional)
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Ej. Cuaderno de Lucas"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={includeAnswers}
              onChange={(e) => setIncludeAnswers(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600"
            />
            Incluir {pagesCount} páginas de solucionario al final
          </label>

          <button
            type="button"
            onClick={handleGenerateWorkbook}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Download className="h-5 w-5" />
            Descargar Cuaderno ({pagesCount} págs)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            title: "Siempre actualizado",
            desc: "Sin cuadernos antiguos de años pasados. Cada descarga crea ejercicios nuevos.",
          },
          {
            title: "Ahorro de tinta",
            desc: "Diseño A4 limpio en blanco y negro pensado para impresoras domésticas y escolares.",
          },
          {
            title: "Personalizable",
            desc: "Si quieres ajustar cifras exactas o formato horizontal/vertical, entra en la ficha individual.",
          },
        ].map((box) => (
          <div
            key={box.title}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h2 className="mt-2 font-bold text-slate-900">{box.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{box.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href={`/fichas/${topic.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:underline"
        >
          <BookOpen className="h-4 w-4" />
          Personalizar opciones avanzadas de {topic.name}
        </Link>
      </div>
    </div>
  );
}
