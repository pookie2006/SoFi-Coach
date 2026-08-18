export const sofi = {
  navy: "#201747",
  navyInk: "#1F1646",
  cyan: "#00A2C7",
  cyanPressed: "#00819D",
  paper: "#FFFFFF",
  mist: "#E5E1E6",
  ink: "#212121",
  inkMuted: "#5C5868",
  hairline: "rgba(32, 23, 71, 0.12)",
} as const;

export const ios = {
  bg: "#F2F2F7",
  grouped: "#FFFFFF",
  label: "#000000",
  secondaryLabel: "rgba(60, 60, 67, 0.60)",
  tertiaryLabel: "rgba(60, 60, 67, 0.30)",
  separator: "rgba(60, 60, 67, 0.29)",
  blue: "#007AFF",
  fill: "rgba(120, 120, 128, 0.16)",
  shareSheet: "rgba(242, 242, 247, 0.94)",
} as const;

export const type = {
  iosFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", sans-serif',
  sofiFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
} as const;

export const viewport = {
  width: 393,
  height: 852,
} as const;

export const cssVariables: Record<string, string> = {
  "--sofi-navy": sofi.navy,
  "--sofi-navy-ink": sofi.navyInk,
  "--sofi-cyan": sofi.cyan,
  "--sofi-cyan-pressed": sofi.cyanPressed,
  "--sofi-paper": sofi.paper,
  "--sofi-mist": sofi.mist,
  "--sofi-ink": sofi.ink,
  "--sofi-ink-muted": sofi.inkMuted,
  "--sofi-hairline": sofi.hairline,
  "--ios-bg": ios.bg,
  "--ios-grouped": ios.grouped,
  "--ios-label": ios.label,
  "--ios-secondary": ios.secondaryLabel,
  "--ios-tertiary": ios.tertiaryLabel,
  "--ios-separator": ios.separator,
  "--ios-blue": ios.blue,
  "--ios-fill": ios.fill,
  "--ios-share": ios.shareSheet,
  "--ios-family": type.iosFamily,
  "--sofi-family": type.sofiFamily,
  "--phone-w": `${viewport.width}px`,
  "--phone-h": `${viewport.height}px`,
};
