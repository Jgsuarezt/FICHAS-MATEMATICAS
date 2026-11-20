import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fichas de Matemáticas Gratis en PDF | Generador + Solucionario",
    template: "%s | FichasMatemáticas",
  },
  description:
    "Genera y descarga gratis fichas de matemáticas en PDF listas para imprimir con solucionario: sumas, restas, tablas de multiplicar, divisiones, fracciones y más.",
  keywords: [
    "fichas de matematicas",
    "ejercicios de matematicas primaria pdf",
    "tablas de multiplicar imprimir",
    "sumas con llevadas pdf",
    "restas con llevadas",
    "divisiones primaria",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "FichasMatemáticas",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
