import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { handleScanRequest, keysFromEnv } from "./scan-core.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ALLOW = [
  "https://pookie2006.github.io",
  "http://localhost:5180",
  "http://127.0.0.1:5180",
];

function loadDotEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadDotEnv(resolve(root, "scan/.env"));
loadDotEnv(resolve(root, ".env"));

const keys = keysFromEnv();
const port = Number(process.env.PORT || 8787);

function cors(req, res) {
  const origin = req.headers.origin || "";
  if (ALLOW.includes(origin) || origin.endsWith(".github.io")) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", ALLOW[0]);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolveBody(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  cors(req, res);
  const url = new URL(req.url || "/", "http://localhost");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method === "GET" && url.pathname === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true, service: "sofi-scan" }));
    return;
  }
  let body = {};
  if (req.method === "POST") {
    try {
      body = JSON.parse((await readBody(req)) || "{}");
    } catch {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Invalid JSON." }));
      return;
    }
  }
  try {
    const result = await handleScanRequest(req.method || "GET", url.pathname, body, keys);
    if (!result) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Not found." }));
      return;
    }
    res.statusCode = result.status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.data));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Scan API failed.",
      }),
    );
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`SoFi scan API on :${port}`);
});
