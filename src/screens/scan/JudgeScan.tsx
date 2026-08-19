import { Link } from "react-router-dom";
import { QrCard } from "../../live/QrCard";
import { isPhoneHref, scanHref } from "../../live/urls";
import { usePhoneOrigin } from "../../live/usePhoneOrigin";
import styles from "../live/live.module.css";

export function JudgeScan({ embedded = false }: { embedded?: boolean }) {
  const { origin, via, ready } = usePhoneOrigin();
  const start = origin ? scanHref("", origin) : "";
  const phoneReady = Boolean(start) && isPhoneHref(start);

  return (
    <div className={`${styles.poster} ${embedded ? styles.posterEmbed : ""}`}>
      <p className={styles.kicker}>SoFi It</p>
      <h1 className={styles.posterTitle}>See what’s possible.</h1>
      <p className={styles.posterLead}>
        Financial independence.
        <br />
        Realizing ambitions.
      </p>
      {phoneReady ? (
        <>
          <div className={styles.posterQr}>
            <QrCard key={start} value={start} size={embedded ? 260 : 300} />
          </div>
          <p className={styles.url}>{start}</p>
          <p className={styles.posterHint}>Phone Camera · no Expo Go</p>
          <p className={styles.posterHint}>
            {via === "tunnel"
              ? "Any Wi-Fi. Keep the laptop tunnel open."
              : "Opens this GitHub Pages scan on any phone."}
          </p>
        </>
      ) : (
        <p className={styles.posterLead} style={{ marginTop: 28 }}>
          {!ready
            ? "Getting the public link…"
            : "Waiting for a phone link. On the laptop run npm run demo, or open the GitHub Pages site."}
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
