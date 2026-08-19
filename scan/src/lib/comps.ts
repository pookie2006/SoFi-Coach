import { env } from "./env";
import type { Comp, VisionHit } from "../types";
import { searchQuery } from "./vision";

type ShoppingRow = {
  title?: string;
  price?: string;
  extracted_price?: number;
  link?: string;
  product_link?: string;
  source?: string;
};

type EbayRow = {
  title?: string;
  link?: string;
  price?: { extracted?: number; raw?: string };
  source?: string;
};

function dollars(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return null;
}

function fromShopping(rows: ShoppingRow[]): Comp[] {
  const comps: Comp[] = [];
  for (const row of rows) {
    const price = dollars(row.extracted_price) ?? dollars(row.price);
    const link = row.product_link || row.link || "";
    const title = (row.title ?? "").trim();
    if (!price || !title || !link) continue;
    comps.push({
      title,
      price,
      link,
      source: row.source?.trim() || "Google Shopping",
    });
    if (comps.length >= 8) break;
  }
  return comps;
}

function fromEbay(rows: EbayRow[]): Comp[] {
  const comps: Comp[] = [];
  for (const row of rows) {
    const price = dollars(row.price?.extracted) ?? dollars(row.price?.raw);
    const title = (row.title ?? "").trim();
    const link = row.link ?? "";
    if (!price || !title || !link) continue;
    comps.push({
      title,
      price,
      link,
      source: row.source?.trim() || "eBay",
    });
    if (comps.length >= 8) break;
  }
  return comps;
}

async function serpSearch(engine: string, query: string) {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", engine);
  url.searchParams.set("q", query);
  url.searchParams.set("api_key", env.serpApiKey);
  if (engine === "ebay") url.searchParams.set("_nkw", query);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${engine} search failed (${response.status}).`);
  }
  return response.json() as Promise<Record<string, unknown>>;
}

export async function searchComps(hit: VisionHit): Promise<Comp[]> {
  if (!env.serpApiKey) {
    throw new Error("Add EXPO_PUBLIC_SERPAPI_KEY to search Google Shopping / eBay.");
  }
  const query = searchQuery(hit);
  try {
    const data = await serpSearch("google_shopping", query);
    const rows = (data.shopping_results as ShoppingRow[] | undefined) ?? [];
    const comps = fromShopping(rows);
    if (comps.length > 0) return comps;
  } catch {
    /* try eBay */
  }
  const ebay = await serpSearch("ebay", query);
  const rows =
    (ebay.organic_results as EbayRow[] | undefined) ??
    (ebay.shopping_results as EbayRow[] | undefined) ??
    [];
  const comps = fromEbay(rows);
  if (comps.length === 0) {
    throw new Error(`No comparable listings for “${query}”.`);
  }
  return comps;
}
