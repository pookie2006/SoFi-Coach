import { env } from "./env";
import type { VisionHit } from "../types";

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

async function identifyWithOpenAI(base64: string): Promise<VisionHit> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      response_format: { type: "json_object" },
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
  if (!response.ok) {
    throw new Error(`OpenAI vision failed (${response.status}).`);
  }
  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = payload.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenAI returned an empty vision result.");
  return parseVision(text);
}

async function identifyWithGemini(base64: string): Promise<VisionHit> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.geminiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: PROMPT },
            { inlineData: { mimeType: "image/jpeg", data: base64 } },
          ],
        },
      ],
      generationConfig: { responseMimeType: "application/json" },
    }),
  });
  if (!response.ok) {
    throw new Error(`Gemini vision failed (${response.status}).`);
  }
  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty vision result.");
  return parseVision(text);
}

async function identifyWithOpenRouter(base64: string): Promise<VisionHit> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openRouterKey}`,
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
  if (!response.ok) {
    throw new Error(`OpenRouter vision failed (${response.status}).`);
  }
  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = payload.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenRouter returned an empty vision result.");
  return parseVision(text);
}

async function identifyWithClaude(base64: string): Promise<VisionHit> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.anthropicKey,
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
  if (!response.ok) {
    throw new Error(`Claude vision failed (${response.status}).`);
  }
  const payload = (await response.json()) as {
    content?: Array<{ type?: string; text?: string }>;
  };
  const text = payload.content?.find((part) => part.type === "text")?.text;
  if (!text) throw new Error("Claude returned an empty vision result.");
  return parseVision(text);
}

export async function identifyObject(base64: string): Promise<VisionHit> {
  if (env.anthropicKey) return identifyWithClaude(base64);
  if (env.openRouterKey) return identifyWithOpenRouter(base64);
  if (env.openaiKey) return identifyWithOpenAI(base64);
  if (env.geminiKey) return identifyWithGemini(base64);
  throw new Error("Add EXPO_PUBLIC_ANTHROPIC_API_KEY to identify the photo.");
}

export function searchQuery(hit: VisionHit) {
  return [hit.brand, hit.name].filter(Boolean).join(" ").trim();
}
