import { promises as fs } from "fs";
import path from "path";
import { OZON_BRAND_URL } from "./config";
import type { CatalogSnapshot, Shop } from "./types";

const FILE = path.join(process.cwd(), "data", "catalog.json");

export const EMPTY_SHOP: Shop = {
  name: "FOWYAD",
  url: OZON_BRAND_URL,
  rating: null,
  reviews: null,
};

function emptySnapshot(): CatalogSnapshot {
  const now = new Date().toISOString();
  return {
    updatedAt: now,
    attemptedAt: now,
    source: "seed",
    shop: EMPTY_SHOP,
    products: [],
    error: null,
  };
}

export async function readCatalog(): Promise<CatalogSnapshot> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const data = JSON.parse(raw) as CatalogSnapshot;
    if (!data || !Array.isArray(data.products) || !data.shop) return emptySnapshot();
    return data;
  } catch {
    return emptySnapshot();
  }
}

export async function writeCatalog(snapshot: CatalogSnapshot) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const temp = `${FILE}.tmp`;
  await fs.writeFile(temp, JSON.stringify(snapshot));
  await fs.rename(temp, FILE);
}
