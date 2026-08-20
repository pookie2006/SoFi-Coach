import { Link } from "react-router-dom";
import { jobCatalog, objectCatalog } from "../../data/liveCatalog";
import { QrCard } from "../../live/QrCard";
import { objectHref, scanHref } from "../../live/urls";
import { usePhoneOrigin } from "../../live/usePhoneOrigin";
import styles from "./live.module.css";

export function LiveHost() {
  const { origin } = usePhoneOrigin();
  const start = scanHref("", origin || window.location.origin);

  return (
    <div className={styles.host}>
      <div className={styles.hostInner}>
        <p className={styles.kicker}>SoFi It</p>
        <h1 className={styles.title}>Scan the code. Then take one photo.</h1>
        <p className={styles.lead}>
          SoFi names the job, writes a plan, and waits for your tap.
        </p>
        <div className={styles.qrWrap}>
          <QrCard value={start} size={240} />
        </div>
        <p className={styles.url}>{start}</p>
        <p className={styles.kicker} style={{ marginTop: 32 }}>
          Jobs
        </p>
        <div className={styles.grid}>
          {jobCatalog.map((item) => (
            <Link
              key={item.id}
              className={styles.hostCard}
              to={`/live?object=${item.id}`}
            >
              <QrCard value={objectHref(item.id, origin)} size={140} label={item.name} />
            </Link>
          ))}
        </div>
        <p className={styles.kicker} style={{ marginTop: 32 }}>
          Objects
        </p>
        <div className={styles.grid}>
          {objectCatalog.map((item) => (
            <Link
              key={item.id}
              className={styles.hostCard}
              to={`/live?object=${item.id}`}
            >
              <QrCard value={objectHref(item.id, origin)} size={140} label={item.name} />
            </Link>
          ))}
        </div>
        <p className={styles.lead} style={{ marginTop: 28 }}>
          <Link className={styles.link} to="/scan">
            Open the scan on this device
          </Link>
          {" · "}
          <Link className={styles.link} to="/">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
