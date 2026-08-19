import { useEffect, useState } from "react";
import { judgeTunnelOrigin } from "../data/judgeOrigin";

export type PhoneLinkVia = "tunnel" | "lan" | "pages" | "none";

/** Laptop tunnel if demo is up; otherwise the baked judge tunnel for GitHub Pages. */
export function usePhoneOrigin() {
  const [origin, setOrigin] = useState(judgeTunnelOrigin);
  const [via, setVia] = useState<PhoneLinkVia>("tunnel");
  const [ready, setReady] = useState(true);

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
          }
        })
        .catch(() => {
          if (cancelled) return;
          setOrigin(judgeTunnelOrigin);
          setVia("tunnel");
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
