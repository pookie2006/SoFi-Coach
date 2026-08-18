import type { ReactNode } from "react";
import styles from "./StatusBar.module.css";

type StatusBarProps = {
  variant?: "light" | "dark";
};

export function StatusBar({ variant = "light" }: StatusBarProps) {
  return (
    <div
      className={`${styles.bar} ${variant === "light" ? styles.light : styles.dark}`}
    >
      <span className={styles.time}>9:41</span>
      <span className={styles.icons} aria-hidden="true">
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </span>
    </div>
  );
}

type SofiHeaderProps = {
  onBack?: () => void;
  title?: string;
};

export function SofiHeader({ onBack, title = "SoFi It" }: SofiHeaderProps) {
  return (
    <header
      style={{
        background: "var(--sofi-navy)",
        color: "#fff",
      }}
    >
      <StatusBar variant="light" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "72px 1fr 72px",
          alignItems: "center",
          height: 44,
          padding: "0 8px 6px",
        }}
      >
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            style={{
              border: 0,
              background: "none",
              color: "#fff",
              fontSize: 28,
              lineHeight: 1,
              padding: "0 10px",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            ‹
          </button>
        ) : (
          <span />
        )}
        <span
          style={{
            textAlign: "center",
            fontFamily: "var(--sofi-family)",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.2px",
          }}
        >
          {title}
        </span>
        <span />
      </div>
    </header>
  );
}

function SignalIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx="0.6" />
      <rect x="5" y="5" width="3" height="7" rx="0.6" />
      <rect x="10" y="2" width="3" height="10" rx="0.6" />
      <rect x="15" y="0" width="3" height="12" rx="0.6" opacity="0.35" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <path
        d="M1 4.2C3.6 1.8 6.3 0.8 8 0.8C9.7 0.8 12.4 1.8 15 4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3.4 6.6C4.9 5.2 6.5 4.5 8 4.5C9.5 4.5 11.1 5.2 12.6 6.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8" cy="10.2" r="1.4" fill="currentColor" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="27" height="12" viewBox="0 0 27 12">
      <rect
        x="0.6"
        y="1"
        width="22"
        height="10"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        opacity="0.45"
      />
      <rect x="2.2" y="2.6" width="18" height="6.8" rx="1.2" fill="currentColor" />
      <rect x="23.6" y="3.8" width="2.2" height="4.4" rx="0.7" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

export function CtaButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        height: 50,
        border: 0,
        borderRadius: 18,
        background: "var(--sofi-cyan)",
        color: "#fff",
        fontFamily: "var(--sofi-family)",
        fontSize: 17,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
