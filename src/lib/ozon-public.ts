import { OZON_BRAND_URL } from "./config";
import type { Product, Shop } from "./types";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

type PublicResult = { shop: Shop; products: Product[] };

export async function fetchPublicCatalog(): Promise<PublicResult> {
  const { chromium } = await import("playwright-core");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });

  try {
    const page = await browser.newPage({
      userAgent: USER_AGENT,
      locale: "ru-RU",
      viewport: { width: 1440, height: 900 },
    });
    const response = await page.goto(OZON_BRAND_URL, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    const title = await page.title();
    const url = page.url();
    if (
      (response && response.status() >= 400) ||
      /antibot|captcha|доступ ограничен/i.test(title) ||
      url.includes("/challenge")
    ) {
      throw new Error("Ozon не отдал витрину без проверки браузера");
    }

    const result = await page.evaluate(async () => {
      function digits(value: unknown) {
        if (!value) return null;
        const numbers = String(value).replace(/\D/g, "");
        return numbers ? Number(numbers) : null;
      }

      function readItem(item: Record<string, unknown>) {
        let title = "";
        let price: number | null = null;
        let oldPrice: number | null = null;
        let rating: number | null = null;
        let reviews: number | null = null;
        const states = Array.isArray(item.mainState) ? item.mainState : [];
        for (const state of states) {
          const row = state as Record<string, unknown>;
          if (row.type === "textDS" && row.id === "name") {
            const text = row.textDS as { text?: string } | undefined;
            title = String(text?.text || "").replace(/\s+/g, " ").trim();
          }
          if (row.type === "priceV2") {
            const priceBlock = row.priceV2 as { price?: Array<{ text?: string; textStyle?: string }> } | undefined;
            for (const part of priceBlock?.price || []) {
              const value = digits(part.text);
              const style = String(part.textStyle || "");
              if (style === "PRICE") price = value;
              else if (style.includes("OLD") || style.includes("ORIGINAL")) oldPrice = value;
              else if (price == null) price = value;
            }
          }
          if (row.type === "labelListV2") {
            const list = row.labelListV2 as { items?: Array<{ text?: { text?: string } }> } | undefined;
            for (const entry of list?.items || []) {
              const label = entry.text?.text || "";
              if (/^\d+[.,]\d+$/.test(label)) rating = Number(label.replace(",", "."));
              if (label.includes("отзыв")) reviews = digits(label);
            }
          }
        }
        const tile = item.tileImage as { items?: Array<{ image?: { link?: string } }> } | undefined;
        const images = (tile?.items || [])
          .map((entry) => entry.image?.link || "")
          .filter((link) => link.startsWith("http"))
          .slice(0, 4);
        const action = item.action as { link?: string } | undefined;
        const path = String(action?.link || "").split("?")[0];
        return {
          sku: String(item.sku || item.id || ""),
          title,
          price,
          oldPrice,
          rating,
          reviews,
          image: images[0] || "",
          images,
          url: path ? `https://www.ozon.ru${path}` : "",
          inStock: true,
        };
      }

      const seen = new Set<string>();
      const products: Array<ReturnType<typeof readItem>> = [];

      async function consume(path: string) {
        const response = await fetch(
          `/api/composer-api.bx/page/json/v2?url=${encodeURIComponent(path)}`,
          { credentials: "include" },
        );
        if (!response.ok) return { fresh: 0, next: "" };
        const data = (await response.json()) as { widgetStates?: Record<string, string> };
        const states = data.widgetStates || {};
        let fresh = 0;
        for (const key of Object.keys(states)) {
          if (!key.startsWith("tileGrid")) continue;
          const widget = JSON.parse(states[key]) as { items?: Array<Record<string, unknown>> };
          for (const item of widget.items || []) {
            const product = readItem(item);
            if (!product.sku || !product.title || seen.has(product.sku)) continue;
            seen.add(product.sku);
            products.push(product);
            fresh += 1;
          }
        }
        const paginatorKey = Object.keys(states).find((key) => key.startsWith("infiniteVirtualPaginator"));
        const paginator = paginatorKey
          ? (JSON.parse(states[paginatorKey]) as { nextPage?: string })
          : null;
        return { fresh, next: paginator?.nextPage && paginator.nextPage !== path ? paginator.nextPage : "" };
      }

      for (let page = 1; page <= 45; page += 1) {
        const step = await consume(`/search/?text=FOWYAD&from_global=true&page=${page}`);
        if (step.fresh === 0) break;
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      return products;
    });

    const products = result.filter((product) => /fowyad/i.test(product.title));
    if (!products.length) {
      throw new Error("Выдача Ozon открылась, но карточек FOWYAD в ней не было");
    }
    return {
      shop: { name: "FOWYAD", url: OZON_BRAND_URL, rating: null, reviews: null },
      products,
    };
  } finally {
    await browser.close();
  }
}
