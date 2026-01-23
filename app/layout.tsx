import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"

// 1. AGREGA 'display: "swap"' A LAS FUENTES
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // <--- CRÍTICO: Esto evita que la fuente bloquee la vista
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // <--- CRÍTICO AQUÍ TAMBIÉN
});

export const metadata: Metadata = {
  title: "Guardería La Chueca - Consulta de Pagos",
  description: "Consulta el estado de tus pagos en la guardería La Chueca",
  icons: { icon: "/image.webp" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. ELIMINA EL <head> MANUAL SI YA USASTE <Image priority /> 
         Si en tu LoginPage ya pusiste <Image priority ... />, 
         Next.js inyecta este link automáticamente. Tenerlo dos veces
         confunde al navegador y gasta recursos.
      */}
      {/* <head>
        <link rel="preload" as="image" href="/rio-parana.webp" />
      </head> */}

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
