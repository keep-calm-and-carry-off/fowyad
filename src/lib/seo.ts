import { AVITO_SHOP_URL, FACTORY_URL, OZON_SHOP_URL, WHOLESALE } from "@/lib/config";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";

const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function storeJsonLd() {
  const address = {
    "@type": "PostalAddress",
    streetAddress: WHOLESALE.street,
    addressLocality: WHOLESALE.city,
    postalCode: WHOLESALE.postalCode,
    addressCountry: "RU",
  };
  const hours = {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: week,
    opens: WHOLESALE.opens,
    closes: WHOLESALE.closes,
  };
  return {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: SITE_NAME,
    legalName: WHOLESALE.legalName,
    taxID: WHOLESALE.inn,
    url: SITE_URL,
    image: absoluteUrl("/logo.png"),
    logo: absoluteUrl("/logo.png"),
    description:
      "Оптика и кузовные детали FOWYAD для Opel и Vauxhall. Розница на Ozon и на Авито. Оптовые поставки в Москве, ежедневно с 8:00 до 19:00.",
    telephone: WHOLESALE.phone,
    email: WHOLESALE.email,
    address,
    openingHoursSpecification: hours,
    areaServed: "RU",
    currenciesAccepted: "RUB",
    brand: { "@type": "Brand", name: SITE_NAME },
    identifier: { "@type": "PropertyValue", name: "ОГРНИП", value: WHOLESALE.ogrnip },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "wholesale",
      telephone: WHOLESALE.phone,
      email: WHOLESALE.email,
      areaServed: "RU",
      availableLanguage: "Russian",
      hoursAvailable: hours,
    },
    sameAs: [OZON_SHOP_URL, AVITO_SHOP_URL, FACTORY_URL],
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
