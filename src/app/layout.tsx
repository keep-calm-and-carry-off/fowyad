import Box from "@mui/material/Box";
import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { CookieConsent } from "@/components/CookieConsent";
import { YandexMetrika } from "@/components/YandexMetrika";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ThemeRegistry } from "@/components/ThemeRegistry";
import { asset } from "@/lib/base-path";
import { OZON_BRAND_URL } from "@/lib/config";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
  preload: false,
  weight: ["400", "500", "700"],
});

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  display: "swap",
  preload: false,
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Фары и кузовные детали FOWYAD для Opel и Vauxhall",
    template: "%s — FOWYAD",
  },
  description:
    "Для Opel есть оптика и кузовные детали FOWYAD: фары, фонари, бамперы и пластик. Купить можно на нескольких площадках, включая Ozon.",
  applicationName: "FOWYAD",
  authors: [{ name: "FOWYAD", url: "http://www.fowyad.com/ru_RU/index.html" }],
  creator: "FOWYAD",
  category: "auto parts",
  alternates: { canonical: "/", languages: { ru: "/" } },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "FOWYAD",
    url: "/",
    title: "Фары и кузовные детали FOWYAD для Opel и Vauxhall",
    description:
      "Для Opel есть оптика и кузовные детали FOWYAD. Купить можно на нескольких площадках, включая Ozon.",
    images: [{ url: "/hero.jpg", width: 1200, height: 630, alt: "FOWYAD — оптика и кузовные детали Opel" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Фары и кузовные детали FOWYAD для Opel и Vauxhall",
    description: "Для Opel есть оптика и кузовные детали FOWYAD. Купить можно на нескольких площадках, включая Ozon.",
    images: ["/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${sans.variable} ${display.variable}`}>
      <head>
        <link rel="preload" as="image" href={asset("/hero-stage.webp")} fetchPriority="high" />
      </head>
      <body>
        <ThemeRegistry>
          <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header shopUrl={OZON_BRAND_URL} />
            <Box sx={{ flex: 1 }}>{children}</Box>
            <Footer shopUrl={OZON_BRAND_URL} />
            <CookieConsent />
            <YandexMetrika />
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
