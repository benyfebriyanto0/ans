import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "CV Arsindo Niaga Sejahtera",
    template: "%s | CV Arsindo Niaga Sejahtera",
  },
  description:
    "CV Arsindo Niaga Sejahtera: perdagangan suku cadang mesin & peralatan industri, jasa reparasi mesin, perdagangan oli & pelumas, serta rental mobil di Bandar Lampung.",
  applicationName: "Arsindo Niaga Sejahtera",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0f2347",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/plus-jakarta-sans-latin-wght.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/archivo-latin-standard.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
