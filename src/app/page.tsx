import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  Gamepad2,
  GraduationCap,
  Layers,
  Sparkles,
} from "lucide-react";
import { GRADES, TOPICS } from "@/data/topics";

export default function HomePage() {
  const categories = Array.from(new Set(TOPICS.map((t) => t.category)));

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-blue-50/80 via-white to-slate-50 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              100% Gratis · Sin registro · Infinitas fichas únicas
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Fichas de Matemáticas en{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PDF Gratis
              </span>{" "}
              y Personalizables
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Olvídate de descargar siempre los mismos cuadernos estáticos.
              Genera fichas únicas al instante adaptadas a cada curso de{" "}
              <strong>Infantil y Primaria</strong>, con{" "}
              <strong>solucionario automático</strong> y{" "}
              <strong>modo interactivo</strong> para practicar en pantalla.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/fichas/sumas-con-llevadas"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
              >
                <Download className="h-5 w-5" />
                Crear Ficha Ahora
              </Link>
              <Link
                href="/fichas/tablas-de-multiplicar"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                Tablas de Multiplicar
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/cuadernos"
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-6 py-3.5 text-base font-bold text-indigo-700 transition hover:bg-indigo-100"
              >
                <BookOpen className="h-5 w-5" />
                Generar Cuaderno PDF
              </Link>
            </div>
          </div>

          {/* Value Props */}
          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Download,
                title: "PDF A4 en 1 clic",
                desc: "Descarga directa y limpia lista para imprimir, sin marcas de agua molestas.",
              },
              {
                icon: CheckCircle2,
                title: "Con Solucionario",
                desc: "Incluye automáticamente la página de respuestas para corregir en segundos.",
              },
              {
                icon: Gamepad2,
                title: "Modo Interactivo",
                desc: "Los niños pueden resolver los ejercicios en tablet o PC con autocorrección.",
              },
              {
                icon: Layers,
                title: "Personalizable 100%",
                desc: "Elige dificultad, número de cifras, letra grande y nombre del alumno.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <item.icon className="h-6 w-6 text-blue-600" />
                <h2 className="mt-3 text-base font-bold text-slate-900">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Grade */}
      <section id="cursos" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
              <GraduationCap className="h-4 w-4" />
              Navegación por nivel
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Fichas de Matemáticas por Curso Escolar
            </h2>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GRADES.map((grade) => (
            <Link
              key={grade.slug}
              href={`/curso/${grade.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div
                className={`inline-flex rounded-lg bg-gradient-to-r ${grade.color} px-2.5 py-1 text-xs font-bold text-white`}
              >
                {grade.ageRange}
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-slate-900 group-hover:text-blue-600">
                {grade.name}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">
                {grade.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600">
                Ver fichas recomendadas <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Topic */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Catálogo Completo de Generadores
          </h2>
          <p className="mt-2 text-slate-600">
            Elige cualquier tema para generar fichas únicas en PDF o practicar
            directamente en pantalla.
          </p>
        </div>

        {categories.map((category) => {
          const items = TOPICS.filter((t) => t.category === category);
          return (
            <div key={category} className="space-y-4">
              <h3 className="border-l-4 border-blue-600 pl-3 text-xl font-extrabold text-slate-900">
                {category}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/fichas/${topic.slug}`}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600">
                          {topic.name}
                        </h4>
                        {topic.badge && (
                          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                            {topic.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {topic.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-blue-600">
                      <span>Generar ficha PDF</span>
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* SEO Content Block */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-extrabold text-slate-900">
            ¿Por qué usar un generador de fichas de matemáticas en lugar de PDFs fijos?
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            <p>
              Cuando un niño necesita reforzar un concepto como las{" "}
              <Link
                href="/fichas/sumas-con-llevadas"
                className="font-semibold text-blue-600 hover:underline"
              >
                sumas con llevadas
              </Link>{" "}
              o las{" "}
              <Link
                href="/fichas/tablas-de-multiplicar"
                className="font-semibold text-blue-600 hover:underline"
              >
                tablas de multiplicar
              </Link>
              , descargar siempre el mismo cuadernillo hace que acabe memorizando
              las hojas en lugar de razonar los cálculos.
            </p>
            <p>
              En <strong>FichasMatemáticas</strong> cada clic genera una hoja
              completamente nueva, adaptada al nivel exacto del alumno (1, 2, 3 o
              4 cifras, con o sin llevadas, letra grande para los más pequeños) e
              incluye su <strong>hoja de respuestas</strong> para ahorrar tiempo a
              familias y docentes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
