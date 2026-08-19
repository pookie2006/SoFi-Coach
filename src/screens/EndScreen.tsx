import { CtaButton, StatusBar } from "../components/StatusBar";
import { usePlaybackLock, useStaticMode } from "../useStaticMode";
import styles from "./DemoScreen.module.css";

export function EndScreen() {
  const { isStatic, go } = useStaticMode();
  const locked = usePlaybackLock();

  return (
    <div className={styles.card}>
      <StatusBar variant="light" />
      <div style={{ flex: 1 }} />
      <p className={styles.cardKicker}>
        <span className={styles.sofiMark}>SoFi</span> It
      </p>
      <div className={styles.cardRule} />
      <h1 className={styles.cardTitle}>
        Scan It
        <br />
        &amp; SoFi It
      </h1>
      <p className={styles.cardLead}>See what’s possible.</p>
      <p className={styles.cardBody}>
        Financial independence.
        <br />
        Realizing ambitions.
      </p>
      <div style={{ flex: 1 }} />
      {locked || isStatic ? null : (
        <div style={{ padding: "0 28px" }}>
          <CtaButton onClick={() => go("/")}>Watch again</CtaButton>
        </div>
      )}
    </div>
  );
}
