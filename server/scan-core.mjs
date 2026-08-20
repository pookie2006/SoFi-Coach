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

export function keysFromEnv(env = process.env) {
  return {
    anthropic:
      env.ANTHROPIC_API_KEY ||
      env.EXPO_PUBLIC_ANTHROPIC_API_KEY ||
      env.VITE_ANTHROPIC_API_KEY ||
      "",
    openRouter:
      env.OPENROUTER_API_KEY ||
      env.EXPO_PUBLIC_OPENROUTER_API_KEY ||
      env.VITE_OPENROUTER_API_KEY ||
      "",
    openai:
      env.OPENAI_API_KEY ||
      env.EXPO_PUBLIC_OPENAI_API_KEY ||
      env.VITE_OPENAI_API_KEY ||
      "",
    serp:
      env.SERPAPI_KEY ||
      env.EXPO_PUBLIC_SERPAPI_KEY ||
      env.VITE_SERPAPI_KEY ||
      "",
  };
}

export function statusFromKeys(keys) {
  return {
    vision: Boolean(keys.anthropic || keys.openRouter || keys.openai),
    comps: Boolean(keys.serp),
  };
}

function parseVision(raw) {
  const trimmed = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const data = JSON.parse(trimmed);
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

export async function identify(base64, keys) {
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
    const payload = await response.json();
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
    const payload = await response.json();
    const text = payload.choices?.[0]?.message?.content;
    if (!text) throw new Error("OpenRouter returned an empty vision result.");
    return parseVision(text);
  }

  throw new Error("No vision key is configured on the scan API.");
}

function dollars(value) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return null;
}

export async function searchComps(query, serp) {
  const shopping = new URL("https://serpapi.com/search.json");
  shopping.searchParams.set("engine", "google_shopping");
  shopping.searchParams.set("q", query);
  shopping.searchParams.set("api_key", serp);
  const shopRes = await fetch(shopping);
  if (shopRes.ok) {
    const data = await shopRes.json();
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
  const data = await ebayRes.json();
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

export async function handleScanRequest(method, path, body, keys) {
  if (method === "GET" && path.startsWith("/api/scan-status")) {
    return { status: 200, data: statusFromKeys(keys) };
  }
  if (method === "POST" && path === "/api/identify") {
    if (!body?.image) return { status: 400, data: { error: "Missing image." } };
    return { status: 200, data: await identify(body.image, keys) };
  }
  if (method === "POST" && path === "/api/comps") {
    if (!keys.serp) return { status: 500, data: { error: "Missing SerpAPI key." } };
    const query = [body?.brand, body?.name].filter(Boolean).join(" ").trim();
    if (!query) return { status: 400, data: { error: "Missing name." } };
    return { status: 200, data: { comps: await searchComps(query, keys.serp) } };
  }
  return null;
}
