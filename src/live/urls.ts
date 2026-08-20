function siteBase(origin = window.location.origin) {
  const clean = origin.replace(/\/$/, "");
  let host = "";
  try {
    host = new URL(clean).hostname;
  } catch {
    host = "";
  }
  const pages = host.endsWith("github.io");
  const base = pages
    ? import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`
    : "/";
  return `${clean}${base}`;
}

export function liveHref(suffix = "", origin = window.location.origin) {
  const tail = suffix.replace(/^\//, "");
  return new URL(tail ? `live/${tail}` : "live", siteBase(origin)).href;
}

export function scanHref(suffix = "", origin = window.location.origin) {
  const tail = suffix.replace(/^\//, "");
  return new URL(tail ? `scan/${tail}` : "scan", siteBase(origin)).href;
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
