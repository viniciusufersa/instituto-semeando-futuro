import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { getPublicAssetPath } from "@/lib/get-public-asset-path";
import "./globals.css";

const geist = localFont({
  src: "../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://semeandoofuturo.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Instituto Semeando o Futuro",
    template: "%s | Instituto Semeando o Futuro",
  },
  description:
    "Acolhimento, inclusão e esperança para famílias em situação de vulnerabilidade social no Rio Grande do Norte.",
  alternates: { canonical: getPublicAssetPath("/") },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: getPublicAssetPath("/"),
    siteName: "Instituto Semeando o Futuro",
    title: "Instituto Semeando o Futuro",
    description:
      "Cuidando de vidas e promovendo dignidade em Fernando Pedroza/RN.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instituto Semeando o Futuro",
    description:
      "Acolhimento, inclusão e esperança para famílias no Rio Grande do Norte.",
  },
  manifest: getPublicAssetPath("/manifest.webmanifest"),
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
