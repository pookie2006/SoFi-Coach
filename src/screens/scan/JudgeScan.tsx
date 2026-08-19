import { Link } from "react-router-dom";
import { judgeScanHref } from "../../data/judgeOrigin";
import { QrCard } from "../../live/QrCard";
import styles from "../live/live.module.css";

export function JudgeScan({ embedded = false }: { embedded?: boolean }) {
  return (
    <div className={`${styles.poster} ${embedded ? styles.posterEmbed : ""}`}>
      <p className={styles.kicker}>SoFi It</p>
      <h1 className={styles.posterTitle}>See what’s possible.</h1>
      <p className={styles.posterLead}>
        Financial independence.
        <br />
        Realizing ambitions.
      </p>
      <div className={styles.posterQr}>
        <QrCard key={judgeScanHref} value={judgeScanHref} size={embedded ? 260 : 300} />
      </div>
      <p className={styles.url}>{judgeScanHref}</p>
      <p className={styles.posterHint}>Phone Camera · no Expo Go</p>
      <p className={styles.posterHint}>
        Any Wi-Fi. Keep npm run demo running on the laptop.
      </p>
      {embedded ? null : (
        <p className={styles.posterHint} style={{ marginTop: 28 }}>
          <Link className={styles.link} to="/">
            Back to the reel
          </Link>
        </p>
      )}
    </div>
  );
}
