import { applyCors } from "./_cors.js";
import { handleScanRequest, keysFromEnv } from "../server/scan-core.mjs";

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  try {
    const result = await handleScanRequest(
      req.method,
      "/api/identify",
      req.body,
      keysFromEnv(),
    );
    if (!result) {
      res.status(404).json({ error: "Not found." });
      return;
    }
    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Identify failed.",
    });
  }
}

export const config = { maxDuration: 30 };
