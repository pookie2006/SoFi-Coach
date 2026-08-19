import { Link } from "react-router-dom";
import { QrCard } from "../../live/QrCard";
import { isLoopbackHost, scanHref } from "../../live/urls";
import { usePhoneOrigin } from "../../live/usePhoneOrigin";
import styles from "../live/live.module.css";

export function JudgeScan({ embedded = false }: { embedded?: boolean }) {
  const { origin, via } = usePhoneOrigin();
  const start = scanHref("", origin);
  const stillLocal = isLoopbackHost(new URL(start).hostname);

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
        <QrCard value={start} size={embedded ? 260 : 300} />
      </div>
      <p className={styles.posterHint}>Phone Camera · no Expo Go</p>
      {via === "tunnel" ? (
        <p className={styles.posterHint}>Any Wi-Fi. Keep the laptop tunnel open.</p>
      ) : stillLocal ? (
        <p className={styles.posterHint}>
          Run <code>npm run demo</code>, then refresh — this QR is still localhost.
        </p>
      ) : (
        <p className={styles.posterHint}>
          Same-Wi-Fi only. Run <code>npm run demo</code> for a public link.
        </p>
      )}
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
