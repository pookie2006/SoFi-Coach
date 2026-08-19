export type CatalogItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  streetHigh: number;
  coco?: string[];
  blurb: string;
  source: string;
  identifiedAs?: string;
  asOf?: string;
  image?: string;
};

export const liveCatalog: CatalogItem[] = [
  {
    id: "macbook",
    name: "MacBook Pro 14\"",
    brand: "Apple",
    price: 1_999,
    streetHigh: 2_199,
    coco: ["laptop"],
    blurb: "M4 · 16GB · 512GB. Fits a personal loan without draining cash.",
    source: "Street snapshot · Apple / major retailers",
  },
  {
    id: "iphone",
    name: "iPhone 16 Pro",
    brand: "Apple",
    price: 999,
    streetHigh: 1_099,
    coco: ["cell phone"],
    blurb: "You have the cash. SoFi can still finance it so the buffer stays.",
    source: "Street snapshot · Apple / major retailers",
  },
  {
    id: "bike",
    name: "City commuter bike",
    brand: "Specialized",
    price: 749,
    streetHigh: 890,
    coco: ["bicycle"],
    blurb: "A cash or loan call. Leftover cash can go to work in the brokerage.",
    source: "Street snapshot · specialty retail",
  },
  {
    id: "airpods",
    name: "AirPods Pro",
    brand: "Apple",
    price: 249,
    streetHigh: 279,
    coco: [],
    blurb: "Small enough to pay cash. SoFi can invest what you don’t spend.",
    source: "Street snapshot · Apple / major retailers",
  },
];

export function itemById(id: string | null | undefined) {
  return liveCatalog.find((item) => item.id === id) ?? null;
}

export function itemFromCoco(label: string) {
  const normalized = label.toLowerCase();
  return liveCatalog.find((item) => item.coco?.includes(normalized)) ?? null;
}
