import Link from "next/link";
import { GRADES, TOPICS } from "@/data/topics";

export default function Footer() {
  return (
    <footer className="print:hidden mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-slate-900">
              Fichas<span className="text-blue-600">Matemáticas</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Generador gratuito e ilimitado de fichas de matemáticas en PDF
              listas para imprimir con solucionario, y modo interactivo para
              practicar en pantalla.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Temas Populares
            </h4>
            <ul className="space-y-2 text-sm">
              {TOPICS.slice(0, 6).map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/fichas/${t.slug}`}
                    className="text-slate-600 transition hover:text-blue-600"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Más Recursos
            </h4>
            <ul className="space-y-2 text-sm">
              {TOPICS.slice(6, 12).map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/fichas/${t.slug}`}
                    className="text-slate-600 transition hover:text-blue-600"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Por Curso Escolar
            </h4>
            <ul className="space-y-2 text-sm">
              {GRADES.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/curso/${g.slug}`}
                    className="text-slate-600 transition hover:text-blue-600"
                  >
                    {g.name} ({g.ageRange})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500">
          <p>
            © 2026 FichasMatemáticas. Material educativo
            gratuito para familias y docentes.
          </p>
          <div className="flex gap-4">
            <Link href="/cuadernos" className="hover:text-blue-600">
              Generador de Cuadernos
            </Link>
            <Link href="/sitemap.xml" className="hover:text-blue-600">
              Mapa del sitio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
