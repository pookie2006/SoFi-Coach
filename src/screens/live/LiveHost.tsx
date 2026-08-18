import { Link } from "react-router-dom";
import { liveCatalog } from "../../data/liveCatalog";
import { QrCard } from "../../live/QrCard";
import { liveHref, objectHref } from "../../live/urls";
import styles from "./live.module.css";

export function LiveHost() {
  const start = liveHref();

  return (
    <div className={styles.host}>
      <div className={styles.hostInner}>
        <p className={styles.kicker}>SoFi It · Judge room</p>
        <h1 className={styles.title}>Scan the code. Then scan an object.</h1>
        <p className={styles.lead}>
          Judges land in a mock SoFi account, point the camera at a MacBook (or
          pick one), then approve or reject each line of the plan. SoFi runs
          what they keep.
        </p>
        <div className={styles.qrWrap}>
          <QrCard value={start} size={240} />
        </div>
        <p className={styles.url}>{start}</p>
        <p className={styles.lead}>
          Same Wi-Fi if this is localhost. On GitHub Pages the QR is public.
          Camera needs HTTPS (or localhost).
        </p>
        <p className={styles.kicker} style={{ marginTop: 32 }}>
          Backup object codes
        </p>
        <div className={styles.grid}>
          {liveCatalog.map((item) => (
            <div key={item.id} className={styles.miniQr}>
              <QrCard value={objectHref(item.id)} size={140} label={item.name} />
            </div>
          ))}
        </div>
        <p className={styles.lead} style={{ marginTop: 28 }}>
          <Link className={styles.link} to="/live">
            Open the judge flow on this device
          </Link>
          {" · "}
          <Link className={styles.link} to="/">
            Back to the reel
          </Link>
        </p>
      </div>
    </div>
  );
}
