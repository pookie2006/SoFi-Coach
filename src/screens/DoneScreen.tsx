import { useState } from "react";
import { SofiHeader } from "../components/StatusBar";
import { format } from "../data/scenario";
import { useStaticMode } from "../useStaticMode";
import styles from "./sofi.module.css";

export function DoneScreen() {
  const { isStatic, go } = useStaticMode();
  const [watching, setWatching] = useState(true);

  return (
    <div className={styles.screen}>
      <SofiHeader onBack={() => go("/action")} />
      <div className={styles.body}>
        <h1 className={styles.title}>
          SoFi is financing {format.shortStreet()}
        </h1>
        <p className={styles.subtitle}>
          {format.building()} loft. {format.sofiApr()} · {format.sofiMonthly()}.
          We'll originate the {format.loanAmount()} loan.
        </p>
        <p className={styles.line}>
          You don't start over in a mortgage tab. SoFi is doing it.
        </p>
        <div className={styles.toggleRow}>
          <div className={styles.toggleCopy}>
            <span className={styles.toggleLabel}>Keep watching this rate</span>
            <span className={styles.toggleHelp}>
              If a better SoFi rate shows up, we can redo the job.
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={watching}
            aria-label="Keep watching this rate"
            className={`${styles.switch} ${watching ? styles.switchOn : ""}`}
            onClick={() => setWatching((on) => !on)}
          >
            <span className={styles.knob} />
          </button>
        </div>
        <div className={styles.spacer} />
        {isStatic ? null : (
          <button
            type="button"
            className={styles.more}
            onClick={() => go("/breadth")}
          >
            Other jobs
          </button>
        )}
      </div>
    </div>
  );
}
