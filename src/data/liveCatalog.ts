import { barcelona, studentStatement } from "./ambition";
import { scenario } from "./scenario";

export type PurchaseKind =
  | "retail"
  | "home"
  | "homeImprovement"
  | "tuition"
  | "studentRefi"
  | "debt";

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
  category?: string;
  purchaseKind?: PurchaseKind;
};

export const objectCatalog: CatalogItem[] = [
  {
    id: "macbook",
    name: "MacBook Pro 14\"",
    brand: "Apple",
    price: 1_999,
    streetHigh: 2_199,
    coco: ["laptop"],
    blurb: "M4 · 16GB · 512GB. Under the personal-loan floor — Pay in 4 or the card.",
    source: "Street snapshot · Apple / major retailers",
  },
  {
    id: "iphone",
    name: "iPhone 16 Pro",
    brand: "Apple",
    price: 999,
    streetHigh: 1_099,
    coco: ["cell phone"],
    blurb: "Cash clears it. Pay in 4 or the card keeps the checking buffer.",
    source: "Street snapshot · Apple / major retailers",
  },
  {
    id: "bike",
    name: "City commuter bike",
    brand: "Specialized",
    price: 749,
    streetHigh: 890,
    coco: ["bicycle"],
    blurb: "A cash, Pay in 4, or card call. Leftover cash can go to the brokerage.",
    source: "Street snapshot · specialty retail",
  },
  {
    id: "airpods",
    name: "AirPods Pro",
    brand: "Apple",
    price: 249,
    streetHigh: 279,
    coco: [],
    blurb: "Small enough to debit checking. Pay in 4 or the card if you want the buffer.",
    source: "Street snapshot · Apple / major retailers",
  },
];

export const jobCatalog: CatalogItem[] = [
  {
    id: "loft",
    name: `${scenario.listing.address} loft`,
    brand: scenario.listing.building,
    price: scenario.listing.price,
    streetHigh: scenario.listing.price,
    blurb: `${scenario.listing.building} · ${scenario.listing.neighborhood}.`,
    source: "Zillow share",
    purchaseKind: "home",
  },
  {
    id: "barcelona",
    name: barcelona.program,
    brand: barcelona.school,
    price: barcelona.sticker,
    streetHigh: barcelona.sticker,
    blurb: `${barcelona.school} aid is already in. SoFi covers the gap and the deposit.`,
    source: "Study abroad packet",
    purchaseKind: "tuition",
  },
  {
    id: "statement",
    name: "Student loan statement",
    brand: "Servicer statement",
    price: studentStatement.balance,
    streetHigh: studentStatement.balance,
    blurb: "SoFi refinances the remaining balance.",
    source: "Student loan statement",
    purchaseKind: "studentRefi",
  },
];

export const liveCatalog: CatalogItem[] = [...objectCatalog, ...jobCatalog];

export function itemById(id: string | null | undefined) {
  return liveCatalog.find((item) => item.id === id) ?? null;
}

export function isShowroomJob(item: CatalogItem) {
  return (
    item.purchaseKind === "home" ||
    item.purchaseKind === "tuition" ||
    item.purchaseKind === "studentRefi"
  );
}

export function itemFromCoco(label: string) {
  const normalized = label.toLowerCase();
  return objectCatalog.find((item) => item.coco?.includes(normalized)) ?? null;
}
