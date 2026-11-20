import Link from "next/link";
import { Calculator, BookOpen, GraduationCap } from "lucide-react";

export default function Navbar() {
  return (
    <header className="print:hidden sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
            <Calculator className="h-5 w-5" />
          </span>
          <div>
            <span className="block text-lg font-extrabold tracking-tight text-slate-900">
              Fichas<span className="text-blue-600">Matemáticas</span>
            </span>
            <span className="block text-[11px] font-medium text-slate-500">
              Generador gratis de fichas PDF
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/fichas/sumas-con-llevadas"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            Sumas y Restas
          </Link>
          <Link
            href="/fichas/tablas-de-multiplicar"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            Tablas
          </Link>
          <Link
            href="/fichas/divisiones-una-cifra"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            Divisiones
          </Link>
          <Link
            href="/fichas/suma-de-fracciones"
            className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            Fracciones
          </Link>
          <Link
            href="/#cursos"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <GraduationCap className="h-4 w-4" />
            Por Curso
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/cuadernos"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Cuadernos PDF</span>
            <span className="sm:hidden">Cuadernos</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
