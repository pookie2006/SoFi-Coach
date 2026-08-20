import type { Comp, VisionHit } from "./types";

/** Claude + SerpAPI (Google Shopping, then eBay). Empty in `npm run demo` so Vite uses scan/.env. */
const HOSTED_SCAN_API = "https://temporary-speedy-violet-mc84bbs.vercel.app";

const fromEnv = (import.meta.env.VITE_SCAN_API as string | undefined)?.replace(/\/$/, "") ?? "";
const apiBase = fromEnv || (import.meta.env.PROD ? HOSTED_SCAN_API : "");

function apiUrl(path: string) {
  return `${apiBase}${path}`;
}

async function readError(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as { error?: string };
    if (payload.error) return payload.error;
  } catch {
    // Keep the fallback.
  }
  return fallback;
}

export async function scanStatus() {
  const response = await fetch(apiUrl("/api/scan-status"));
  if (!response.ok) {
    throw new Error(
      "Scan is using this phone. SoFi can still name the object and write a plan.",
    );
  }
  return (await response.json()) as { vision: boolean; comps: boolean };
}

export async function identifyPhoto(image: string): Promise<VisionHit> {
  const response = await fetch(apiUrl("/api/identify"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image }),
  });
  if (!response.ok) {
    throw new Error(await readError(response, "Could not name the object."));
  }
  return (await response.json()) as VisionHit;
}

export async function searchComps(vision: VisionHit): Promise<Comp[]> {
  const response = await fetch(apiUrl("/api/comps"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: vision.name, brand: vision.brand }),
  });
  if (!response.ok) {
    throw new Error(await readError(response, "Could not find comparable listings."));
  }
  const payload = (await response.json()) as { comps?: Comp[] };
  return payload.comps ?? [];
}
