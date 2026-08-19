import type { Comp, PriceRange } from "./types";

function median(sorted: number[]) {
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

function percentile(sorted: number[], p: number) {
  if (sorted.length === 1) return sorted[0];
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

/** Drop IQR outliers, then return low / typical / high. */
export function priceRange(comps: Comp[]): PriceRange {
  const prices = comps.map((comp) => comp.price).filter((n) => n > 0);
  if (prices.length === 0) {
    throw new Error("No usable prices in the comparable listings.");
  }
  const sorted = [...prices].sort((a, b) => a - b);
  let kept = sorted;
  if (sorted.length >= 4) {
    const q1 = percentile(sorted, 0.25);
    const q3 = percentile(sorted, 0.75);
    const iqr = q3 - q1;
    const floor = q1 - 1.5 * iqr;
    const ceil = q3 + 1.5 * iqr;
    const trimmed = sorted.filter((n) => n >= floor && n <= ceil);
    if (trimmed.length >= 3) kept = trimmed;
  }
  return {
    low: Math.round(kept[0]),
    typical: Math.round(median(kept)),
    high: Math.round(kept[kept.length - 1]),
  };
}
