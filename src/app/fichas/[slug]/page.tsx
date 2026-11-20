import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CheckCircle2, Lightbulb, HelpCircle } from "lucide-react";
import WorksheetStudio from "@/components/WorksheetStudio";
import { GRADES, TOPICS, getTopicBySlug } from "@/data/topics";

export function generateStaticParams() {
  return TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/fichas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};

  return {
    title: topic.seoTitle,
    description: topic.seoDescription,
    openGraph: {
      title: topic.seoTitle,
      description: topic.seoDescription,
      type: "article",
    },
  };
}

export default async function TopicPage({
  params,
}: PageProps<"/fichas/[slug]">) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const relatedTopics = TOPICS.filter(
    (t) => t.slug !== topic.slug && t.category === topic.category
  ).slice(0, 3);

  const gradeBadges = GRADES.filter((g) => topic.grades.includes(g.slug));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: topic.pedagogicalGuide.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumbs & Title */}
      <div className="print:hidden space-y-3">
        <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-blue-600">
            Inicio
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{topic.category}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-slate-900">{topic.name}</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {topic.name} en PDF Gratis
            </h1>
            <p className="mt-2 max-w-3xl text-base text-slate-600">
              {topic.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {gradeBadges.map((g) => (
              <Link
                key={g.slug}
                href={`/curso/${g.slug}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Studio Above the Fold */}
      <WorksheetStudio topic={topic} />

      {/* Pedagogical SEO Guide */}
      <section className="print:hidden grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Guía didáctica: Cómo enseñar {topic.shortName.toLowerCase()}
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              {topic.pedagogicalGuide.intro}
            </p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Pasos recomendados para practicar
            </h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-600">
              {topic.pedagogicalGuide.howToTeach.map((step, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Consejos para padres y docentes
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
              {topic.pedagogicalGuide.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              Preguntas frecuentes
            </h3>
            <div className="mt-4 space-y-4">
              {topic.pedagogicalGuide.faqs.map((faq, i) => (
                <div key={i} className="rounded-xl bg-slate-50 p-4">
                  <h4 className="font-bold text-slate-900">{faq.q}</h4>
                  <p className="mt-1 text-sm text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Related Topics */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900">
              Fichas relacionadas
            </h3>
            <div className="mt-4 space-y-3">
              {relatedTopics.map((rt) => (
                <Link
                  key={rt.slug}
                  href={`/fichas/${rt.slug}`}
                  className="block rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition hover:border-blue-300 hover:bg-blue-50/40"
                >
                  <div className="font-bold text-slate-900">{rt.name}</div>
                  <div className="mt-1 line-clamp-2 text-xs text-slate-600">
                    {rt.description}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-sm">
            <h3 className="text-lg font-extrabold">
              ¿Necesitas un cuaderno de repaso?
            </h3>
            <p className="mt-2 text-sm text-blue-100">
              Genera un PDF de 5, 10 o 15 páginas diferentes con su solucionario
              completo en un solo clic.
            </p>
            <Link
              href="/cuadernos"
              className="mt-4 inline-block rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Ir al Generador de Cuadernos
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
