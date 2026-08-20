import { lookupPrice } from "../live/lookupPrice";
import { matchStill } from "../live/recognize";
import { typicalFor } from "../data/typicalPrices";
import type { ScanResult } from "./types";

/** Name + price a photo in the browser. No laptop, no API keys. */
export async function identifyOnDevice(photoUri: string): Promise<ScanResult> {
  const hit = await matchStill(photoUri);
  if (!hit) {
    throw new Error(
      "Could not name that object on this phone. Try a clearer photo, or pick a job below.",
    );
  }

  const priced = await lookupPrice(hit.label);
  const typical = typicalFor(hit.label);
  const low = Math.max(1, Math.round(priced.price * 0.82));
  const high = Math.max(priced.streetHigh, typical.high);

  return {
    photoUri,
    vision: {
      name: priced.identifiedAs ?? priced.name,
      brand: priced.brand === "Street typical" ? null : priced.brand,
      category: priced.category ?? typical.label,
      details: priced.blurb ? [priced.blurb] : [],
    },
    comps: [
      {
        title: priced.name,
        price: priced.price,
        link: "",
        source: priced.source,
      },
      {
        title: `${priced.name} · street high`,
        price: high,
        link: "",
        source: "Range top",
      },
    ],
    range: {
      low,
      typical: priced.price,
      high,
    },
  };
}
