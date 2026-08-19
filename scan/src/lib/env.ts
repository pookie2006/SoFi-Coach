export const env = {
  openaiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? "",
  geminiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "",
  openRouterKey: process.env.EXPO_PUBLIC_OPENROUTER_API_KEY ?? "",
  anthropicKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? "",
  serpApiKey: process.env.EXPO_PUBLIC_SERPAPI_KEY ?? "",
};

export function missingKeys() {
  const missing: string[] = [];
  if (
    !env.openaiKey &&
    !env.geminiKey &&
    !env.openRouterKey &&
    !env.anthropicKey
  ) {
    missing.push(
      "EXPO_PUBLIC_ANTHROPIC_API_KEY or EXPO_PUBLIC_OPENROUTER_API_KEY",
    );
  }
  if (!env.serpApiKey) missing.push("EXPO_PUBLIC_SERPAPI_KEY");
  return missing;
}
