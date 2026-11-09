import { SYNC_INTERVAL_MS } from "./config";
import { readCatalog, writeCatalog } from "./catalog-store";
import { fetchSellerCatalog, sellerApiConfigured } from "./ozon-seller";

const globalState = globalThis as typeof globalThis & {
  __fowyadSync?: boolean;
  __fowyadRunning?: boolean;
};

export async function syncCatalog() {
  if (!sellerApiConfigured() || globalState.__fowyadRunning) return;
  globalState.__fowyadRunning = true;
  const current = await readCatalog();
  const attemptedAt = new Date().toISOString();

  try {
    const seller = await fetchSellerCatalog();
    if (seller.products.length === 0 && current.products.length > 0) {
      throw new Error("Ozon вернул пустой список, предыдущий каталог сохранён");
    }

    await writeCatalog({
      updatedAt: new Date().toISOString(),
      attemptedAt,
      source: "seller-api",
      shop: {
        ...seller.shop,
        rating: seller.shop.rating ?? current.shop.rating,
        reviews: seller.shop.reviews ?? current.shop.reviews,
        url: seller.shop.url || current.shop.url,
        name: seller.shop.name || current.shop.name,
      },
      products: seller.products,
      error: null,
    });
    console.info(`FOWYAD: каталог обновлён, ${seller.products.length} товаров`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось обновить каталог";
    await writeCatalog({ ...current, attemptedAt, error: message });
    console.error(`FOWYAD: ${message}`);
  } finally {
    globalState.__fowyadRunning = false;
  }
}

export function scheduleSync() {
  if (!sellerApiConfigured() || globalState.__fowyadRunning) return;
  void readCatalog().then((catalog) => {
    const last = Date.parse(catalog.attemptedAt || catalog.updatedAt || "");
    if (Number.isFinite(last) && Date.now() - last < SYNC_INTERVAL_MS) return;
    void syncCatalog();
  });
}

export function startSyncLoop() {
  if (globalState.__fowyadSync || process.env.NEXT_PHASE === "phase-production-build") return;
  globalState.__fowyadSync = true;
  setTimeout(() => void syncCatalog(), 8000);
  setInterval(() => void syncCatalog(), SYNC_INTERVAL_MS);
}
