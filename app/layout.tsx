import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ToastProvider } from "@/components/toast-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GoogleAnalytics } from "@/components/google-analytics";
import { CsrfInitializer } from "@/components/csrf-initializer";

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
  authors: [{ name: 'Mercado Máquina' }],
  creator: 'Mercado Máquina',
  publisher: 'Mercado Máquina',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mercadomaquina.com'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Mercado Máquina',
    title: 'Mercado Máquina - Compra, Venda e Troca de Máquinas Agrícolas',
    description: 'Marketplace de máquinas agrícolas no Sul do Brasil',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Mercado Máquina',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mercado Máquina - Compra, Venda e Troca de Máquinas Agrícolas',
    description: 'Marketplace de máquinas agrícolas no Sul do Brasil',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mercado Máquina',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: '#ffcc00',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <CsrfInitializer />
        <Providers>
          <ToastProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
