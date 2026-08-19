import { spawn } from "node:child_process";
import { existsSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const originFile = resolve(root, ".sofi-public-origin");
const PORT = 5180;
const local = `http://127.0.0.1:${PORT}`;

function clearOrigin() {
  if (existsSync(originFile)) unlinkSync(originFile);
}

async function isUp() {
  try {
    const response = await fetch(`${local}/api/scan-status`);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForVite() {
  for (let i = 0; i < 60; i += 1) {
    if (await isUp()) return true;
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  return false;
}

function startVite() {
  return spawn("npm", ["run", "dev", "--", "--host"], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
}

function startTunnel() {
  return spawn(
    "npx",
    [
      "--yes",
      "cloudflared",
      "tunnel",
      "--url",
      local,
      "--protocol",
      "http2",
      "--no-autoupdate",
    ],
    {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
}

function publish(origin) {
  writeFileSync(originFile, origin, "utf8");
  console.log("");
  console.log("Judges can use any Wi-Fi.");
  console.log(`  Poster: ${origin}/scan/host`);
  console.log(`  Phone:  ${origin}/scan`);
  console.log("Leave this terminal open. Refresh the poster if the QR still says localhost.");
  console.log("");
}

async function main() {
  clearOrigin();
  let vite = null;
  if (await isUp()) {
    console.log(`Using the Vite server already on ${PORT}.`);
  } else {
    console.log("Starting Vite…");
    vite = startVite();
    if (!(await waitForVite())) {
      console.error(`Vite did not come up on ${local}.`);
      process.exit(1);
    }
  }

  console.log("Opening a public HTTPS tunnel (works on any Wi-Fi)…");
  const tunnel = startTunnel();
  let published = "";

  const onChunk = (buf) => {
    const text = String(buf);
    process.stderr.write(text);
    const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
    if (match && match[0] !== published) {
      published = match[0];
      publish(published);
    }
  };
  tunnel.stdout.on("data", onChunk);
  tunnel.stderr.on("data", onChunk);

  const shutdown = () => {
    clearOrigin();
    tunnel.kill("SIGTERM");
    if (vite) vite.kill("SIGTERM");
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  tunnel.on("exit", (code) => {
    clearOrigin();
    if (!published) {
      console.error(
        "Could not open a public tunnel. Check internet on the laptop, then run npm run demo again.",
      );
    }
    if (vite) vite.kill("SIGTERM");
    process.exit(code ?? 1);
  });
}

await main();
