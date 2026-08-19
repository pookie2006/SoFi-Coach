import { useEffect, useState } from "react";

export type PhoneLinkVia = "tunnel" | "lan" | "none";

/** Prefer the public tunnel so judges work on any Wi-Fi. */
export function usePhoneOrigin() {
  const [origin, setOrigin] = useState(window.location.origin);
  const [via, setVia] = useState<PhoneLinkVia>("none");

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/lan")
      .then((response) => {
        if (!response.ok) throw new Error("offline");
        return response.json() as Promise<{ origin?: string; via?: PhoneLinkVia }>;
      })
      .then((data) => {
        if (cancelled) return;
        if (data.origin) setOrigin(data.origin);
        if (data.via) setVia(data.via);
      })
      .catch(() => {
        // Keep the page origin; the poster will warn.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { origin, via };
}
