import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ToastProvider } from "@/components/toast-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GoogleAnalytics } from "@/components/google-analytics";
import { CsrfInitializer } from "@/components/csrf-initializer";
import { LocalBusinessSchema } from "@/components/local-business-schema";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "BaitaBriq - Máquinas Agrícolas Usadas RS, SC, PR | Tratores e Colheitadeiras",
    template: "%s | BaitaBriq - Máquinas Agrícolas"
  },
  description: "Marketplace líder de máquinas agrícolas usadas no Sul do Brasil. Tratores John Deere, Case IH, colheitadeiras e implementos em RS, SC e PR. Compre, venda ou troque com segurança e financiamento disponível.",
  keywords: [
    "máquinas agrícolas usadas",
    "tratores usados RS SC PR",
    "colheitadeiras usadas sul",
    "John Deere usado",
    "Case IH usado",
    "New Holland usado",
    "implementos agrícolas usados",
    "marketplace máquinas sul",
    "tratores usados Pelotas",
    "máquinas agrícolas Porto Alegre",
    "colheitadeiras usadas Chapecó",
    "implementos Cascavel",
  ],
  authors: [{ name: 'BaitaBriq' }],
  creator: 'BaitaBriq',
  publisher: 'BaitaBriq',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://baitabriq.com.br'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'BaitaBriq',
    title: 'BaitaBriq - Compra, Venda e Troca de Máquinas Agrícolas',
    description: 'Marketplace de máquinas agrícolas no Sul do Brasil',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'BaitaBriq',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BaitaBriq - Compra, Venda e Troca de Máquinas Agrícolas',
    description: 'Marketplace de máquinas agrícolas no Sul do Brasil',
    images: ['/logo.jpeg'],
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
    title: 'BaitaBriq',
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
        <link rel="icon" href="/logo-sem-fundo.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/logo-sem-fundo.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo-sem-fundo.png" />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <CsrfInitializer />
        <LocalBusinessSchema />
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
