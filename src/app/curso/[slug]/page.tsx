import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, ChevronRight, GraduationCap } from "lucide-react";
import { GRADES, TOPICS, getGradeBySlug } from "@/data/topics";

export function generateStaticParams() {
  return GRADES.map((grade) => ({ slug: grade.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/curso/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const grade = getGradeBySlug(slug);
  if (!grade) return {};

  return {
    title: grade.seoTitle,
    description: grade.seoDescription,
  };
}

export default async function GradePage({
  params,
}: PageProps<"/curso/[slug]">) {
  const { slug } = await params;
  const grade = getGradeBySlug(slug);
  if (!grade) notFound();

  const recommended = TOPICS.filter(
    (t) => t.grades.includes(grade.slug) || grade.recommendedTopics.includes(t.slug)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <div className="space-y-4">
        <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-blue-600">
            Inicio
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Cursos</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-slate-900">{grade.name}</span>
        </nav>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${grade.color} px-3.5 py-1 text-xs font-bold text-white`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                {grade.ageRange}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Fichas de Matemáticas para {grade.name}
              </h1>
              <p className="text-base text-slate-600">{grade.description}</p>
            </div>

            <Link
              href="/cuadernos"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              <BookOpen className="h-4 w-4" />
              Crear Cuaderno de Repaso
            </Link>
          </div>
        </div>
      </div>

      <section className="space-y-5">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Fichas recomendadas para {grade.name}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((topic) => (
            <Link
              key={topic.slug}
              href={`/fichas/${topic.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {topic.category}
                </span>
                <h3 className="mt-1 text-lg font-bold text-slate-900 group-hover:text-blue-600">
                  {topic.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{topic.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-blue-600">
                <span>Generar ficha PDF</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Other grades */}
      <section className="border-t border-slate-200 pt-8">
        <h3 className="text-base font-bold text-slate-900">Otros cursos</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {GRADES.filter((g) => g.slug !== grade.slug).map((g) => (
            <Link
              key={g.slug}
              href={`/curso/${g.slug}`}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
            >
              {g.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
