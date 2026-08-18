import { scenario } from "../data/scenario";
import styles from "./Diagrams.module.css";

type JobId = (typeof scenario.breadth)[number]["id"];

export function PaymentBars({
  otherLabel,
  sofiLabel,
  otherValue,
  sofiValue,
}: {
  otherLabel: string;
  sofiLabel: string;
  otherValue: number;
  sofiValue: number;
}) {
  const sofiWidth = `${Math.round((sofiValue / otherValue) * 100)}%`;

  return (
    <div className={styles.bars} aria-hidden="true">
      <div className={styles.barRow}>
        <div className={styles.barMeta}>
          <span>Their estimate</span>
          <span>{otherLabel}</span>
        </div>
        <div className={styles.track}>
          <div className={`${styles.fill} ${styles.other}`} style={{ width: "100%" }} />
        </div>
      </div>
      <div className={styles.barRow}>
        <div className={styles.barMeta}>
          <span>SoFi</span>
          <span>{sofiLabel}</span>
        </div>
        <div className={styles.track}>
          <div className={`${styles.fill} ${styles.sofi}`} style={{ width: sofiWidth }} />
        </div>
      </div>
    </div>
  );
}

export function PlanVsDo() {
  return (
    <div className={styles.flow} aria-hidden="true">
      <div className={styles.lane}>
        <span className={styles.who}>Coach</span>
        <span className={styles.step}>Ask</span>
        <span className={styles.step}>Plan</span>
        <span className={styles.stepOff}>Stop</span>
      </div>
      <div className={styles.lane}>
        <span className={styles.who}>SoFi</span>
        <span className={styles.step}>Ask</span>
        <span className={styles.step}>Plan</span>
        <span className={`${styles.step} ${styles.stepOn}`}>Do</span>
      </div>
    </div>
  );
}

export function JobGlyph({
  kind,
  light = false,
}: {
  kind: JobId;
  light?: boolean;
}) {
  return (
    <div className={`${styles.glyph} ${light ? styles.glyphLight : ""}`} aria-hidden="true">
      <JobSvg kind={kind} />
    </div>
  );
}

export function JobMini({ kind }: { kind: JobId }) {
  return (
    <div className={styles.mini} aria-hidden="true">
      <JobSvg kind={kind} size={18} />
    </div>
  );
}

export function HouseDiagram() {
  return (
    <div className={styles.house} aria-hidden="true">
      <svg width="64" height="56" viewBox="0 0 64 56" fill="none">
        <path d="M8 28 32 8l24 20" stroke="currentColor" strokeWidth="3" />
        <path d="M14 26v22h36V26" stroke="currentColor" strokeWidth="3" />
        <rect x="26" y="32" width="12" height="16" fill="var(--sofi-cyan)" />
      </svg>
    </div>
  );
}

function JobSvg({ kind, size = 36 }: { kind: JobId; size?: number }) {
  if (kind === "auto") {
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <path
          d="M6 22h24l-2-8H10l-4 8Z"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <circle cx="12" cy="26" r="3" fill="var(--sofi-cyan)" />
        <circle cx="24" cy="26" r="3" fill="var(--sofi-cyan)" />
        <path d="M12 14h8l2 6" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    );
  }
  if (kind === "invest") {
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <path
          d="M8 26c4-10 6-6 10-12s5 4 10 2"
          stroke="var(--sofi-cyan)"
          strokeWidth="2.4"
        />
        <path d="M8 28h20" stroke="currentColor" strokeWidth="2" />
        <circle cx="26" cy="14" r="3" fill="var(--sofi-cyan)" />
      </svg>
    );
  }
  if (kind === "401k") {
    return (
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <rect x="7" y="10" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2.2" />
        <rect x="15" y="8" width="14" height="18" rx="2" fill="var(--sofi-cyan)" />
        <path d="M18 16h8M18 20h8" stroke="#fff" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <path d="M10 8h12l6 6v14H10V8Z" stroke="currentColor" strokeWidth="2.2" />
      <path d="M22 8v6h6" stroke="currentColor" strokeWidth="2.2" />
      <path d="M14 20h10M14 24h7" stroke="var(--sofi-cyan)" strokeWidth="2" />
    </svg>
  );
}
