import { readFileSync, existsSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { resolve } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

function lanOrigin(port: number) {
  for (const addrs of Object.values(networkInterfaces())) {
    for (const addr of addrs ?? []) {
      if (addr.family === "IPv4" && !addr.internal) {
        return `http://${addr.address}:${port}`;
      }
    }
  }
  return "";
}

function publicLink(root: string, port: number) {
  const file = resolve(root, ".sofi-public-origin");
  if (existsSync(file)) {
    const origin = readFileSync(file, "utf8").trim().replace(/\/$/, "");
    if (/^https?:\/\//i.test(origin)) {
      return { origin, via: "tunnel" as const };
    }
  }
  const lan = lanOrigin(port);
  return { origin: lan, via: lan ? ("lan" as const) : ("none" as const) };
}

type VisionHit = {
  name: string;
  brand: string | null;
  category: string;
  details: string[];
};

function parseEnvFile(path: string) {
  if (!existsSync(path)) return {} as Record<string, string>;
  const out: Record<string, string> = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key) out[key] = value;
  }
  return out;
}

function loadKeys(root: string) {
  const expo = parseEnvFile(resolve(root, "scan/.env"));
  const web = parseEnvFile(resolve(root, ".env"));
  return {
    anthropic:
      web.VITE_ANTHROPIC_API_KEY || expo.EXPO_PUBLIC_ANTHROPIC_API_KEY || "",
    openRouter:
      web.VITE_OPENROUTER_API_KEY || expo.EXPO_PUBLIC_OPENROUTER_API_KEY || "",
    openai: web.VITE_OPENAI_API_KEY || expo.EXPO_PUBLIC_OPENAI_API_KEY || "",
    gemini: web.VITE_GEMINI_API_KEY || expo.EXPO_PUBLIC_GEMINI_API_KEY || "",
    serp: web.VITE_SERPAPI_KEY || expo.EXPO_PUBLIC_SERPAPI_KEY || "",
  };
}

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolveBody, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolveBody(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function send(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

const PROMPT = `Identify the main object in this photo for a used-market price search.

Return JSON only, no markdown:
{
  "name": "specific product name a shopper would type",
  "brand": "brand if visible or clearly known, else null",
  "category": "short category",
  "details": ["distinctive visible details"]
}

Be specific. Example: "Black leather Eames lounge chair" not "chair".
If you are unsure of the exact model, still name the most specific plausible object.`;

function parseVision(raw: string): VisionHit {
  const trimmed = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const data = JSON.parse(trimmed) as Partial<VisionHit>;
  const name = (data.name ?? "").trim();
  if (!name) throw new Error("Vision model did not return a name.");
  return {
    name,
    brand: data.brand?.trim() || null,
    category: (data.category ?? "").trim() || "object",
    details: Array.isArray(data.details)
      ? data.details.map((item) => String(item)).filter(Boolean)
      : [],
  };
}

async function identify(base64: string, keys: ReturnType<typeof loadKeys>) {
  if (keys.anthropic) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": keys.anthropic,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: base64,
                },
              },
              { type: "text", text: PROMPT },
            ],
          },
        ],
      }),
    });
    if (!response.ok) throw new Error(`Claude vision failed (${response.status}).`);
    const payload = (await response.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };
    const text = payload.content?.find((part) => part.type === "text")?.text;
    if (!text) throw new Error("Claude returned an empty vision result.");
    return parseVision(text);
  }

  if (keys.openRouter) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${keys.openRouter}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: PROMPT },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${base64}` },
              },
            ],
          },
        ],
      }),
    });
    if (!response.ok) throw new Error(`OpenRouter vision failed (${response.status}).`);
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = payload.choices?.[0]?.message?.content;
    if (!text) throw new Error("OpenRouter returned an empty vision result.");
    return parseVision(text);
  }

  throw new Error("No vision key found in scan/.env.");
}

function dollars(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return null;
}

async function searchComps(query: string, serp: string) {
  const shopping = new URL("https://serpapi.com/search.json");
  shopping.searchParams.set("engine", "google_shopping");
  shopping.searchParams.set("q", query);
  shopping.searchParams.set("api_key", serp);
  const shopRes = await fetch(shopping);
  if (shopRes.ok) {
    const data = (await shopRes.json()) as {
      shopping_results?: Array<{
        title?: string;
        price?: string;
        extracted_price?: number;
        link?: string;
        product_link?: string;
        source?: string;
      }>;
    };
    const comps = [];
    for (const row of data.shopping_results ?? []) {
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
    if (comps.length > 0) return comps;
  }

  const ebay = new URL("https://serpapi.com/search.json");
  ebay.searchParams.set("engine", "ebay");
  ebay.searchParams.set("_nkw", query);
  ebay.searchParams.set("api_key", serp);
  const ebayRes = await fetch(ebay);
  if (!ebayRes.ok) throw new Error(`eBay search failed (${ebayRes.status}).`);
  const data = (await ebayRes.json()) as {
    organic_results?: Array<{
      title?: string;
      link?: string;
      price?: { extracted?: number; raw?: string };
    }>;
  };
  const comps = [];
  for (const row of data.organic_results ?? []) {
    const price = dollars(row.price?.extracted) ?? dollars(row.price?.raw);
    const title = (row.title ?? "").trim();
    const link = row.link ?? "";
    if (!price || !title || !link) continue;
    comps.push({ title, price, link, source: "eBay" });
    if (comps.length >= 8) break;
  }
  if (comps.length === 0) throw new Error(`No comparable listings for “${query}”.`);
  return comps;
}

export function scanApiPlugin(): Plugin {
  return {
    name: "scan-api",
    configureServer(server) {
      const keys = loadKeys(server.config.root);
      server.middlewares.use(async (req, res, next) => {
        // The Expo app lives in /scan, so Vite would serve scan/index.ts
        // instead of the judge website. Send the SPA for those paths.
        if (req.method === "GET" && req.url) {
          const [path, query] = req.url.split("?");
          if (path === "/scan" || path === "/scan/") {
            req.url = query ? `/index.html?${query}` : "/index.html";
          }
        }
        if (req.method === "GET" && req.url?.startsWith("/api/lan")) {
          const port = server.config.server.port ?? 5180;
          send(res, 200, publicLink(server.config.root, port));
          return;
        }
        if (req.method === "GET" && req.url?.startsWith("/api/scan-status")) {
          send(res, 200, {
            vision: Boolean(keys.anthropic || keys.openRouter || keys.openai),
            comps: Boolean(keys.serp),
          });
          return;
        }
        if (req.method === "POST" && req.url === "/api/identify") {
          try {
            const body = JSON.parse(await readBody(req)) as { image?: string };
            if (!body.image) {
              send(res, 400, { error: "Missing image." });
              return;
            }
            send(res, 200, await identify(body.image, keys));
          } catch (error) {
            send(res, 500, {
              error: error instanceof Error ? error.message : "Identify failed.",
            });
          }
          return;
        }
        if (req.method === "POST" && req.url === "/api/comps") {
          try {
            if (!keys.serp) {
              send(res, 500, { error: "Missing SerpAPI key in scan/.env." });
              return;
            }
            const body = JSON.parse(await readBody(req)) as {
              name?: string;
              brand?: string | null;
            };
            const query = [body.brand, body.name].filter(Boolean).join(" ").trim();
            if (!query) {
              send(res, 400, { error: "Missing name." });
              return;
            }
            send(res, 200, { comps: await searchComps(query, keys.serp) });
          } catch (error) {
            send(res, 500, {
              error: error instanceof Error ? error.message : "Comps failed.",
            });
          }
          return;
        }
        next();
      });
    },
  };
}
