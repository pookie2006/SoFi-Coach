export function liveHref(suffix = "") {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return new URL(`live${suffix}`, `${window.location.origin}${base}`).href;
}

export function objectHref(id: string) {
  const url = new URL(liveHref());
  url.searchParams.set("object", id);
  return url.href;
}
