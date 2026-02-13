import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Mercado Máquina - Compra, Venda e Troca de Máquinas Agrícolas no Sul",
    template: "%s | Mercado Máquina"
  },
  description: "Marketplace de máquinas agrícolas e de construção no Sul do Brasil. Compre, venda, alugue ou troque tratores, colheitadeiras e implementos com segurança.",
  keywords: [
    "máquinas agrícolas",
    "tratores usados",
    "colheitadeiras",
    "implementos agrícolas",
    "máquinas construção",
    "compra venda tratores",
    "máquinas RS",
    "máquinas SC",
    "máquinas PR",
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Mercado Máquina',
    title: 'Mercado Máquina - Compra, Venda e Troca de Máquinas Agrícolas',
    description: 'Marketplace de máquinas agrícolas no Sul do Brasil',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
