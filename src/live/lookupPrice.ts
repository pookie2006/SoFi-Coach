import type { CatalogItem } from "../data/liveCatalog";
import { itemById, itemFromCoco } from "../data/liveCatalog";
import { typicalFor } from "../data/typicalPrices";

type Listing = {
  title: string;
  brand: string;
  price: number;
  category: string;
  thumbnail?: string;
};

const categoryForLabel: Record<string, string[]> = {
  laptop: ["laptops", "tablets"],
  "cell phone": ["smartphones"],
  tv: ["tablets", "laptops"],
  keyboard: ["laptops", "mobile-accessories"],
  mouse: ["mobile-accessories"],
  remote: ["mobile-accessories"],
  couch: ["furniture"],
  chair: ["furniture"],
  bed: ["furniture"],
  "dining table": ["furniture"],
  bottle: ["kitchen-accessories", "groceries"],
  cup: ["kitchen-accessories"],
  "wine glass": ["kitchen-accessories"],
  bowl: ["kitchen-accessories"],
  knife: ["kitchen-accessories"],
  fork: ["kitchen-accessories"],
  spoon: ["kitchen-accessories"],
  backpack: ["womens-bags"],
  handbag: ["womens-bags"],
  suitcase: ["womens-bags"],
  motorcycle: ["motorcycle"],
  car: ["vehicle"],
  "sports ball": ["sports-accessories"],
  "tennis racket": ["sports-accessories"],
  "baseball bat": ["sports-accessories"],
  skateboard: ["sports-accessories"],
  snowboard: ["sports-accessories"],
  skis: ["sports-accessories"],
  banana: ["groceries"],
  apple: ["groceries"],
  orange: ["groceries"],
  broccoli: ["groceries"],
  carrot: ["groceries"],
};

let catalogPromise: Promise<Listing[]> | null = null;

function slug(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

function sanePrice(found: number, typicalMid: number) {
  if (!Number.isFinite(found) || found <= 0) return false;
  return found >= typicalMid * 0.12 && found <= typicalMid * 5;
}

async function loadCatalog(): Promise<Listing[]> {
  if (!catalogPromise) {
    catalogPromise = (async () => {
      const response = await fetch("https://dummyjson.com/products?limit=200");
      if (!response.ok) throw new Error("catalog");
      const data = (await response.json()) as {
        products?: Array<{
          title?: string;
          brand?: string;
          price?: number;
          category?: string;
          thumbnail?: string;
        }>;
      };
      return (data.products ?? [])
        .filter((row) => row.title && Number(row.price) > 0)
        .map((row) => ({
          title: row.title as string,
          brand: row.brand || "Market listing",
          price: Number(row.price),
          category: row.category || "",
          thumbnail: row.thumbnail,
        }));
    })().catch(() => []);
  }
  return catalogPromise;
}

function scoreListing(row: Listing, query: string, typicalMid: number, categories: string[]) {
  const title = row.title.toLowerCase();
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  let score = 0;
  if (categories.includes(row.category)) score += 3;
  for (const word of words) {
    if (title.includes(word)) score += 2;
  }
  if (sanePrice(row.price, typicalMid)) {
    score += 1 - Math.min(1, Math.abs(row.price - typicalMid) / typicalMid);
  } else {
    score -= 2;
  }
  return score;
}

function bestListing(
  rows: Listing[],
  query: string,
  typicalMid: number,
  categories: string[],
) {
  const ranked = rows
    .map((row) => ({
      row,
      score: scoreListing(row, query, typicalMid, categories),
    }))
    .filter((entry) => entry.score >= 2 && sanePrice(entry.row.price, typicalMid))
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.row ?? null;
}

function fromListing(
  label: string,
  typicalLabel: string,
  hit: Listing,
  typicalHigh: number,
): CatalogItem {
  const price = Math.round(hit.price);
  return {
    id: slug(label),
    name: hit.title,
    brand: hit.brand,
    price,
    streetHigh: Math.max(price, typicalHigh),
    blurb: `Camera saw a ${typicalLabel.toLowerCase()}. Matched a live catalog listing, then SoFi prices the job.`,
    source: `Listing search · ${hit.brand}`,
    identifiedAs: typicalLabel,
    asOf: new Date().toISOString().slice(0, 10),
    image: hit.thumbnail,
  };
}

/** Name the object, then attach a price from a live listing search or a typical band. */
export async function lookupPrice(label: string): Promise<CatalogItem> {
  const typical = typicalFor(label);
  const hero = itemFromCoco(label);
  const categories = categoryForLabel[label.toLowerCase()] ?? [];
  const started = Date.now();

  try {
    const rows = await loadCatalog();
    const hit = bestListing(rows, typical.query, typical.mid, categories);
    const wait = Math.max(0, 550 - (Date.now() - started));
    if (wait) await new Promise((resolve) => window.setTimeout(resolve, wait));
    if (hit) return fromListing(label, typical.label, hit, typical.high);
  } catch {
    /* fall through */
  }

  if (hero) {
    return {
      ...hero,
      identifiedAs: typical.label,
      blurb: `Identified a ${typical.label.toLowerCase()}. Using the demo street price for this class.`,
      asOf: "typical",
    };
  }

  return {
    id: slug(label),
    name: typical.label,
    brand: "Street typical",
    price: typical.mid,
    streetHigh: typical.high,
    blurb: `Identified a ${typical.label.toLowerCase()}. No listing hit — using a typical street price so SoFi can still write the plan.`,
    source: `Typical street · ${typical.label}`,
    identifiedAs: typical.label,
    asOf: "typical",
  };
}

export async function priceKnownItem(item: CatalogItem): Promise<CatalogItem> {
  if (item.identifiedAs) return lookupPrice(item.identifiedAs);
  const fromId = itemById(item.id);
  if (fromId?.coco?.[0]) return lookupPrice(fromId.coco[0]);
  return lookupPrice(item.name);
}
