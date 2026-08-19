# SoFi It Scan (V1)

One loop: take a photo → name the object → search comps → show a price range.

No history. No accounts. The camera screen is only a shutter.

## Judges (no Expo Go)

Judges must use a normal website. Phone Camera cannot open Expo `exp://` codes.

1. Keys in `scan/.env` (copy `.env.example`).
2. From the repo root:

   ```bash
   npm run demo
   ```

   This starts the site on port 5180 and a public HTTPS tunnel. Judges can be on **any Wi-Fi**. Do not use a LAN / localhost QR — venue networks often block phone-to-laptop traffic.

3. Laptop opens the printed poster URL (`…/scan/host`). Judges scan that QR with the **Phone Camera** app.
4. They land on `/scan`, tap the shutter, and the phone camera opens in the browser.

Keep `npm run demo` running. GitHub Pages cannot run the vision proxy.

## Expo (optional, local only)

```bash
cd scan
npx expo start
```

This needs Expo Go on the phone. Do not give judges that QR.

## Keys

| Key | Used for |
|---|---|
| `EXPO_PUBLIC_ANTHROPIC_API_KEY` | Claude vision (console API key, not a claude.ai chat token) |
| `EXPO_PUBLIC_OPENROUTER_API_KEY` | Vision via OpenRouter (no AI Studio) |
| `EXPO_PUBLIC_OPENAI_API_KEY` | GPT-4o vision |
| `EXPO_PUBLIC_GEMINI_API_KEY` | Direct Gemini, needs [AI Studio](https://aistudio.google.com/api-keys) |
| `EXPO_PUBLIC_SERPAPI_KEY` | Google Shopping, then eBay |

If you cannot open AI Studio (school/work Google, region), skip Gemini. Get an OpenRouter key at [openrouter.ai/keys](https://openrouter.ai/keys) or an OpenAI key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys). SerpAPI is still required for prices: [serpapi.com](https://serpapi.com). Restart `npm run dev` after editing `.env`.

The website path keeps keys on the laptop (`/api/identify`, `/api/comps`). Do not commit `.env`.
