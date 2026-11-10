import Box from "@mui/material/Box";
import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { CookieConsent } from "@/components/CookieConsent";
import { YandexMetrika } from "@/components/YandexMetrika";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ThemeRegistry } from "@/components/ThemeRegistry";
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
    "Оптика и кузовные детали FOWYAD для Opel и Vauxhall. Розница на Ozon и на Авито. Оптовые поставки в Москве: Талдомская ул., д. 2Б, ежедневно с 8:00 до 19:00.",
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
      "Оптика и кузовные детали FOWYAD для Opel. Розница на Ozon и на Авито. Оптовые поставки в Москве принимает Евгений.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "FOWYAD — фары и кузовные детали для Opel", type: "image/jpeg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Фары и кузовные детали FOWYAD для Opel и Vauxhall",
    description: "Оптика и кузовные детали FOWYAD для Opel. Розница на Ozon и на Авито. Оптовые поставки в Москве принимает Евгений.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${sans.variable} ${display.variable}`}>
      <body>
        <ThemeRegistry>
          <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
            <Box sx={{ flex: 1 }}>{children}</Box>
            <Footer />
            <CookieConsent />
            <YandexMetrika />
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
