import { FACTORY_URL, OZON_BRAND_URL } from "@/lib/config";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

export function storeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: `${SITE_NAME} — оптика и кузовные детали для Opel`,
    url: SITE_URL,
    image: absoluteUrl("/logo.png"),
    description:
      "Для Opel есть оптика и кузовные детали FOWYAD. Купить можно на нескольких площадках, включая Ozon.",
    areaServed: "RU",
    currenciesAccepted: "RUB",
    brand: { "@type": "Brand", name: SITE_NAME },
    sameAs: [OZON_BRAND_URL, FACTORY_URL],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "ru",
  };
}

export function faqJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
