import { liveAccount, money } from "../../data/liveAccount";
import styles from "./scan.module.css";

export function MemberWallet() {
  return (
    <div className={styles.wallet}>
      <p className={styles.walletWho}>
        {liveAccount.name} · since {liveAccount.memberSince} ·{" "}
        {liveAccount.school}
      </p>
      <div className={styles.walletGrid}>
        <div className={styles.walletCell}>
          <span>Checking</span>
          <strong>{money(liveAccount.cash)}</strong>
        </div>
        <div className={styles.walletCell}>
          <span>Credit available</span>
          <strong>{money(liveAccount.creditAvailable)}</strong>
        </div>
        <div className={styles.walletCell}>
          <span>Brokerage</span>
          <strong>{money(liveAccount.brokerage)}</strong>
        </div>
        <div className={styles.walletCell}>
          <span>Loan room</span>
          <strong>{money(liveAccount.personalLoanLimit)}</strong>
        </div>
      </div>
    </div>
  );
}
