function siteBase(origin = window.location.origin) {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${origin}${base}`;
}

export function liveHref(suffix = "", origin = window.location.origin) {
  const tail = suffix.replace(/^\//, "");
  return new URL(tail ? `live/${tail}/` : "live/", siteBase(origin)).href;
}

export function scanHref(suffix = "", origin = window.location.origin) {
  const tail = suffix.replace(/^\//, "");
  return new URL(tail ? `scan/${tail}/` : "scan/", siteBase(origin)).href;
}

export function objectHref(id: string, origin = window.location.origin) {
  const url = new URL(liveHref("", origin));
  url.searchParams.set("object", id);
  return url.href;
}

export function isLoopbackHost(hostname = window.location.hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

export function isPhoneHref(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && !isLoopbackHost(parsed.hostname);
  } catch {
    return false;
  }
}
