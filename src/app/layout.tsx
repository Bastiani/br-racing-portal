import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

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
    default: "Brasil Rally Championship - Portal de Rally Brasileiro",
    template: "%s | Brasil Rally Championship"
  },
  description: "Club voltado para campeonatos de rally, tanto em simuladores como simcade. Acompanhe resultados, rankings de pilotos e rallys online ativos no Brasil Rally Championship.",
  keywords: [
    "rally",
    "brasil",
    "championship",
    "simulador",
    "simcade",
    "corrida",
    "automobilismo",
    "ranking",
    "pilotos",
    "campeonato",
    "motorsport",
    "rally brasil",
    "rally championship"
  ],
  authors: [{ name: "Brasil Rally Championship" }],
  creator: "Brasil Rally Championship",
  publisher: "Brasil Rally Championship",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://brasilrallychampionship.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://brasilrallychampionship.com.br',
    title: 'Brasil Rally Championship - Portal de Rally Brasileiro',
    description: 'Club voltado para campeonatos de rally, tanto em simuladores como simcade. Acompanhe resultados, rankings de pilotos e rallys online ativos.',
    siteName: 'Brasil Rally Championship',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Brasil Rally Championship',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brasil Rally Championship - Portal de Rally Brasileiro',
    description: 'Club voltado para campeonatos de rally, tanto em simuladores como simcade.',
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href="https://brasilrallychampionship.com.br" />
        <meta name="theme-color" content="#ff6b00" />
        <meta name="msapplication-TileColor" content="#ff6b00" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Brasil Rally Championship",
              "url": "https://brasilrallychampionship.com.br",
              "logo": "https://brasilrallychampionship.com.br/logo.png",
              "description": "Club voltado para campeonatos de rally, tanto em simuladores como simcade.",
              "sameAs": [
                "https://www.facebook.com/brasilrallychampionship",
                "https://www.instagram.com/brasilrallychampionship",
                "https://www.youtube.com/brasilrallychampionship"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "Portuguese"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
