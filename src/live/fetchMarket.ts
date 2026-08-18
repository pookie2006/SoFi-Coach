import type { CatalogItem } from "../data/liveCatalog";

type MarketFile = {
  asOf: string;
  items: Record<string, { price: number; streetHigh: number }>;
};

export async function pullMarketPrice(item: CatalogItem) {
  const started = Date.now();
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}market.json`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("market");
    const data = (await response.json()) as MarketFile;
    const row = data.items[item.id];
    const wait = Math.max(0, 700 - (Date.now() - started));
    if (wait) await new Promise((resolve) => window.setTimeout(resolve, wait));
    if (!row) return { ...item, asOf: data.asOf };
    return {
      ...item,
      price: row.price,
      streetHigh: row.streetHigh,
      asOf: data.asOf,
    };
  } catch {
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    return { ...item, asOf: "cached" };
  }
}
