/** Публичный переход: Ozon с фильтром по бренду FOWYAD. */
export const OZON_BRAND_URL =
  process.env.NEXT_PUBLIC_OZON_BRAND_URL?.trim() ||
  "https://www.ozon.ru/search/?text=FOWYAD&from_global=true";

export const SYNC_INTERVAL_MS =
  Math.max(1, Number(process.env.SYNC_INTERVAL_MINUTES || 10)) * 60 * 1000;

export const FACTORY_URL = "http://www.fowyad.com/ru_RU/index.html";

/** Публичный адрес для обращений по персональным данным. Пусто, пока реквизиты не заданы. */
export const LEGAL_CONTACT = process.env.NEXT_PUBLIC_LEGAL_CONTACT?.trim() || "";
