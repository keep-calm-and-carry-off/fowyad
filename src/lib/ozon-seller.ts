import { OZON_BRAND_URL } from "./config";
import type { Product, Shop } from "./types";

const API = "https://api-seller.ozon.ru";

type Json = Record<string, unknown>;

function asRecord(value: unknown): Json {
  return value && typeof value === "object" ? (value as Json) : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function money(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Number(value.replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed);
}

function imageList(value: unknown) {
  if (typeof value === "string" && value.startsWith("http")) return [value];
  return asArray(value).filter((item): item is string => typeof item === "string" && item.startsWith("http"));
}

async function ozonPost(pathname: string, body: Json) {
  const clientId = process.env.OZON_CLIENT_ID;
  const apiKey = process.env.OZON_API_KEY;
  if (!clientId || !apiKey) throw new Error("Не заданы OZON_CLIENT_ID и OZON_API_KEY");

  const response = await fetch(`${API}${pathname}`, {
    method: "POST",
    headers: {
      "Client-Id": clientId,
      "Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as Json;
  if (!response.ok) {
    const message = text(payload.message) || text(payload.error) || response.statusText;
    throw new Error(`Ozon Seller API ${response.status}: ${message}`);
  }
  return payload;
}

export function sellerApiConfigured() {
  return Boolean(process.env.OZON_CLIENT_ID && process.env.OZON_API_KEY);
}

export async function fetchSellerCatalog(): Promise<{ shop: Shop; products: Product[] }> {
  const ids: Array<{ productId: string; offerId: string }> = [];
  let lastId = "";

  for (let page = 0; page < 40; page += 1) {
    const payload = await ozonPost("/v3/product/list", {
      filter: { visibility: "ALL" },
      last_id: lastId,
      limit: 1000,
    });
    const result = asRecord(payload.result ?? payload);
    const items = asArray(result.items);
    for (const item of items) {
      const row = asRecord(item);
      const productId = String(row.product_id ?? "");
      if (!productId) continue;
      ids.push({ productId, offerId: text(row.offer_id) });
    }
    const next = text(result.last_id);
    if (!next || next === lastId || items.length === 0) break;
    lastId = next;
  }

  const details = new Map<string, Json>();
  for (let index = 0; index < ids.length; index += 100) {
    const batch = ids.slice(index, index + 100).map((item) => item.productId);
    const payload = await ozonPost("/v3/product/info/list", { product_id: batch });
    const result = asRecord(payload.result ?? payload);
    for (const item of asArray(result.items ?? payload.items)) {
      const row = asRecord(item);
      const id = String(row.id ?? row.product_id ?? "");
      if (id) details.set(id, row);
    }
  }

  const prices = new Map<string, { price: number | null; oldPrice: number | null }>();
  let cursor = "";
  for (let page = 0; page < 40; page += 1) {
    const payload = await ozonPost("/v5/product/info/prices", {
      filter: { visibility: "ALL" },
      cursor,
      limit: 1000,
    });
    const result = asRecord(payload.result ?? payload);
    const items = asArray(result.items ?? payload.items);
    for (const item of items) {
      const row = asRecord(item);
      const id = String(row.product_id ?? "");
      const price = asRecord(row.price);
      const current =
        money(price.marketing_seller_price) ??
        money(price.price) ??
        money(row.price);
      const previous = money(price.old_price) ?? money(row.old_price);
      if (id) {
        prices.set(id, {
          price: current,
          oldPrice: previous && current && previous > current ? previous : null,
        });
      }
    }
    const next = text(result.cursor ?? payload.cursor);
    if (!next || next === cursor || items.length === 0) break;
    cursor = next;
  }

  const products: Product[] = [];
  const seen = new Set<string>();

  for (const listed of ids) {
    const item = details.get(listed.productId);
    if (!item) continue;
    if (item.is_archived === true || item.is_autoarchived === true) continue;
    const statuses = asRecord(item.statuses);
    if (statuses.is_created === false) continue;

    const sources = asArray(item.sources).map(asRecord);
    const skuValue =
      sources.find((source) => source.source === "sds")?.sku ??
      sources[0]?.sku ??
      item.sku;
    const sku = skuValue ? String(skuValue) : listed.productId;
    if (seen.has(sku)) continue;
    seen.add(sku);

    const images = [
      ...imageList(item.primary_image),
      ...imageList(item.images),
      ...imageList(item.color_image),
    ].filter((image, index, all) => all.indexOf(image) === index);

    const priceInfo = prices.get(listed.productId);
    const stocks = asRecord(item.stocks);
    const stockRows = asArray(stocks.stocks).map(asRecord);
    const available = stockRows.some((row) => {
      const present = Number(row.present ?? 0);
      const reserved = Number(row.reserved ?? 0);
      return present - reserved > 0;
    });

    const title = text(item.name) || listed.offerId || `Товар ${sku}`;
    products.push({
      sku,
      title,
      price: priceInfo?.price ?? money(item.price) ?? money(item.marketing_price),
      oldPrice: priceInfo?.oldPrice ?? null,
      rating: null,
      reviews: null,
      image: images[0] ?? "",
      images: images.slice(0, 4),
      url: `https://www.ozon.ru/product/${sku}/`,
      inStock: stocks.has_stock === true || available,
    });
  }

  return {
    shop: {
      name: "FOWYAD",
      url: OZON_BRAND_URL,
      rating: null,
      reviews: null,
    },
    products,
  };
}
