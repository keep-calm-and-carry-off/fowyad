/** Витрина для каталога: выдача Ozon по бренду FOWYAD. */
export const OZON_BRAND_URL =
  process.env.NEXT_PUBLIC_OZON_BRAND_URL?.trim() ||
  "https://www.ozon.ru/search/?text=FOWYAD&from_global=true";

/** Розничный магазин FOWYAD на Ozon — «Франс Авто». */
export const OZON_SHOP_URL = "https://www.ozon.ru/seller/frans-avto/";

/** Розничная витрина той же линейки на Авито. */
export const AVITO_SHOP_URL = "https://www.avito.ru/brands/i2568559";

/** Оптовый контакт. Розничные заказы идут через Ozon и Авито. */
export const WHOLESALE = {
  person: "Евгений",
  phone: "+79037943161",
  phoneLabel: "+7 903 794-31-61",
  email: "5175568@mail.ru",
  inn: "774395432978",
  ogrnip: "322774600573902",
  legalName: "ИП Бухонина Екатерина Игоревна",
  street: "Талдомская ул., д. 2Б",
  city: "Москва",
  postalCode: "125412",
  hoursLabel: "ежедневно с 8:00 до 19:00",
  opens: "08:00",
  closes: "19:00",
} as const;

export const SYNC_INTERVAL_MS =
  Math.max(1, Number(process.env.SYNC_INTERVAL_MINUTES || 10)) * 60 * 1000;

export const FACTORY_URL = "http://www.fowyad.com/ru_RU/index.html";

/** Публичный адрес для обращений по персональным данным. */
export const LEGAL_CONTACT = process.env.NEXT_PUBLIC_LEGAL_CONTACT?.trim() || WHOLESALE.email;

/** Счётчик Яндекс Метрики. Подключается только после согласия «Принять». */
export const METRIKA_ID = 114151564;
