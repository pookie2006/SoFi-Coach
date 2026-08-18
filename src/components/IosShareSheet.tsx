import styles from "./IosShareSheet.module.css";

type IosShareSheetProps = {
  onSofiIt: () => void;
  onClose: () => void;
};

export function IosShareSheet({ onSofiIt, onClose }: IosShareSheetProps) {
  return (
    <div className={styles.sheet} role="dialog" aria-label="Share">
      <div className={styles.grabber} />
      <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
        ×
      </button>

      <div className={styles.airdropLabel}>AirDrop</div>
      <div className={styles.contacts}>
        <div className={styles.contact}>
          <div className={styles.avatar} />
          Finn
        </div>
        <div className={styles.contact}>
          <div className={styles.avatar} />
          Jordan
        </div>
      </div>

      <div className={styles.apps}>
        <div className={styles.app}>
          <div className={`${styles.glyph} ${styles.messages}`}>
            <BubbleIcon />
          </div>
          Messages
        </div>
        <div className={styles.app}>
          <div className={`${styles.glyph} ${styles.mail}`}>
            <MailIcon />
          </div>
          Mail
        </div>
        <div className={styles.app}>
          <div className={`${styles.glyph} ${styles.notes}`}>
            <NotesIcon />
          </div>
          Notes
        </div>
        <button type="button" className={`${styles.app} ${styles.sofi}`} onClick={onSofiIt}>
          <div className={`${styles.glyph} ${styles.sofiGlyph}`}>
            <SofiMark />
          </div>
          SoFi It
        </button>
        <div className={styles.app}>
          <div className={`${styles.glyph} ${styles.shortcuts}`}>
            <ShortcutsIcon />
          </div>
          Shortcuts
        </div>
      </div>

      <div className={styles.actions}>
        <div className={styles.action}>Copy</div>
        <div className={styles.action}>Add to Reading List</div>
        <div className={styles.action}>Add Bookmark</div>
      </div>
    </div>
  );
}

function BubbleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="currentColor">
      <path d="M6 8.5C6 6.6 7.6 5 9.5 5h9C20.4 5 22 6.6 22 8.5v7c0 1.9-1.6 3.5-3.5 3.5H12l-4.4 3.2c-.7.5-1.6-.1-1.6-.9V8.5Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="7" width="20" height="14" rx="2" fill="#fff" />
      <path d="M5 9l9 7 9-7" stroke="#0A84FF" strokeWidth="1.8" fill="none" />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M4 6h14M4 11h14M4 16h9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function SofiMark() {
  return (
    <svg width="30" height="16" viewBox="0 0 30 16" fill="none">
      <circle cx="8.5" cy="8" r="5.4" stroke="#00A2C7" strokeWidth="3" />
      <circle cx="21.5" cy="8" r="5.4" stroke="#00A2C7" strokeWidth="3" />
    </svg>
  );
}

function ShortcutsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M4 11h8l-3-4M12 11l-3 4M14 6l4 5-4 5"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
