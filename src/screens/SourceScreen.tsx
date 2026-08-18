import { StatusBar } from "../components/StatusBar";
import { format, scenario } from "../data/scenario";
import { useStaticMode } from "../useStaticMode";
import styles from "./SourceScreen.module.css";

type MessagesThreadProps = {
  dimmed?: boolean;
  onShare?: () => void;
};

export function MessagesThread({ dimmed = false, onShare }: MessagesThreadProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.top}>
        <StatusBar variant="dark" />
        <div className={styles.nav}>
          <span className={styles.back} aria-hidden="true">
            ‹
          </span>
          <span className={styles.thread}>{scenario.chat.threadName}</span>
          <span className={styles.navIcons} aria-hidden="true">
            <VideoIcon />
            <InfoIcon />
          </span>
        </div>
      </div>

      <div className={styles.threadBody}>
        <div>
          <p className={styles.sender}>{scenario.chat.sender}</p>
          <p className={styles.bubble}>{scenario.chat.bubble}</p>
        </div>

        <article className={styles.card}>
          <div className={styles.hero}>
            <div className={styles.skyline} aria-hidden="true">
              <div className={styles.tower} />
              <div className={styles.towerMain} />
              <div className={styles.tower} />
            </div>
            {onShare ? (
              <button
                type="button"
                className={styles.shareOnCard}
                aria-label="Share"
                onClick={onShare}
              >
                <ShareIcon />
              </button>
            ) : (
              <span className={`${styles.shareOnCard} ${styles.shareIdle}`}>
                <ShareIcon />
              </span>
            )}
          </div>
          <div className={styles.cardBody}>
            <p className={styles.zillow}>Zillow</p>
            <p className={styles.address}>{format.address()}</p>
            <p className={styles.meta}>{format.listingMeta()}</p>
            <p className={styles.meta}>{format.bedsBathsLoft()}</p>
            <p className={styles.price}>{format.price()}</p>
            <p className={styles.est}>Est. payment {format.otherMonthly()}</p>
          </div>
        </article>
      </div>

      <div className={styles.composer} aria-hidden="true">
        <CameraIcon />
        <div className={styles.field} />
        <MicIcon />
      </div>

      {dimmed ? <div className={styles.dim} /> : null}
    </div>
  );
}

export function SourceScreen() {
  const { go } = useStaticMode();
  return <MessagesThread onShare={() => go("/share")} />;
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 26 26" fill="none">
      <path
        d="M13 4v12M13 4l-4.2 4.2M13 4l4.2 4.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 14.5V20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="currentColor">
      <rect x="0" y="2" width="14" height="12" rx="3" />
      <path d="M15.5 6.2 22 3.6v8.8l-6.5-2.6V6.2Z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M10 9v5M10 6.2h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="currentColor">
      <path d="M8 1.5h6l1.2 2H19a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2h3.8L8 1.5Z" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor">
      <rect x="5" y="0" width="6" height="11" rx="3" />
      <path d="M2 9a6 6 0 0 0 12 0M8 15v4" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  );
}
