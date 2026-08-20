import { applyCors } from "./_cors.js";
import { keysFromEnv, statusFromKeys } from "../server/scan-core.mjs";

export default function handler(req, res) {
  if (applyCors(req, res)) return;
  res.status(200).json(statusFromKeys(keysFromEnv()));
}
