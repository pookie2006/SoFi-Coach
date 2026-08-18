import type { CSSProperties, ReactNode } from "react";
import { cssVariables } from "../theme/tokens";
import styles from "./DeviceFrame.module.css";

type DeviceFrameProps = {
  children: ReactNode;
  caption?: string | null;
  variant?: "page" | "item";
};

export function DeviceFrame({
  children,
  caption,
  variant = "page",
}: DeviceFrameProps) {
  return (
    <div
      className={variant === "page" ? styles.page : styles.item}
      style={cssVariables as CSSProperties}
    >
      <div className={styles.phone}>
        <div className={styles.screen}>
          {children}
          <div className={styles.island} />
          <div className={styles.home} />
        </div>
      </div>
      {caption ? <p className={styles.caption}>{caption}</p> : null}
    </div>
  );
}
