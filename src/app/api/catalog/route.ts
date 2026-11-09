import { readCatalog } from "@/lib/catalog-store";
import { scheduleSync } from "@/lib/sync";

export const dynamic = "force-dynamic";

export async function GET() {
  scheduleSync();
  const catalog = await readCatalog();
  return Response.json(catalog, {
    headers: { "Cache-Control": "no-store" },
  });
}
