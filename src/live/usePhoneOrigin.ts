import { useEffect, useState } from "react";
import { isLoopbackHost } from "./urls";

export type PhoneLinkVia = "tunnel" | "lan" | "pages" | "none";

function publicPage() {
  if (typeof window === "undefined") return { origin: "", via: "none" as const };
  if (window.location.protocol === "https:" && !isLoopbackHost()) {
    return { origin: window.location.origin, via: "pages" as const };
  }
  return { origin: "", via: "none" as const };
}

/** Prefer a live tunnel; on GitHub Pages use this public https origin. */
export function usePhoneOrigin() {
  const fallback = publicPage();
  const [origin, setOrigin] = useState(fallback.origin);
  const [via, setVia] = useState<PhoneLinkVia>(fallback.via);
  const [ready, setReady] = useState(Boolean(fallback.origin));

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      void fetch("/api/lan")
        .then((response) => {
          if (!response.ok) throw new Error("offline");
          return response.json() as Promise<{ origin?: string; via?: PhoneLinkVia }>;
        })
        .then((data) => {
          if (cancelled) return;
          if (data.via === "tunnel" && data.origin) {
            setOrigin(data.origin);
            setVia("tunnel");
            return;
          }
          const page = publicPage();
          if (page.origin) {
            setOrigin(page.origin);
            setVia("pages");
          } else if (data.origin) {
            setOrigin(data.origin);
            setVia(data.via ?? "lan");
          }
        })
        .catch(() => {
          const page = publicPage();
          if (page.origin) {
            setOrigin(page.origin);
            setVia("pages");
          }
        })
        .finally(() => {
          if (!cancelled) setReady(true);
        });
    };

    load();
    const id = window.setInterval(load, 2000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return { origin, via, ready };
}
