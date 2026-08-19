import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { liveAccount } from "../../data/liveAccount";
import type { CatalogItem } from "../../data/liveCatalog";
import {
  approvedSteps,
  doneCopy,
} from "../../live/buildPlan";
import {
  confirmationId,
  postedAt,
  proofLine,
} from "../../live/receipt";
import styles from "./live.module.css";

type ExecutionProofProps = {
  item: CatalogItem;
  kept: ReturnType<typeof approvedSteps>;
  onAgain: () => void;
};

export function ExecutionProof({ item, kept, onAgain }: ExecutionProofProps) {
  const [tick, setTick] = useState(0);
  const copy = doneCopy(item);
  const when = postedAt();
  const confirmation = confirmationId(item);
  const proofs = kept.map((step) => proofLine(step, item));
  const running = tick < proofs.length;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setTick((n) => n + 1), 650);
    return () => window.clearTimeout(id);
  }, [running, tick]);

  return (
    <div className={styles.body}>
      <p className={styles.kicker}>{running ? "Posting to SoFi" : "Posted"}</p>
      <h1 className={styles.title}>
        {running ? "SoFi is doing the job." : copy.title}
      </h1>
      <p className={styles.muted}>
        {item.name} · {liveAccount.name} · {when}
      </p>

      <div className={styles.receipt}>
        <div className={styles.receiptTop}>
          <div>
            <p className={styles.receiptLabel}>Confirmation</p>
            <p className={styles.receiptId}>{confirmation}</p>
          </div>
          <p className={styles.receiptStamp}>
            {running ? `${tick}/${proofs.length}` : "Complete"}
          </p>
        </div>
        {proofs.map((proof, index) => {
          const state =
            index < tick ? "posted" : index === tick ? "running" : "queued";
          return (
            <div
              key={proof.id}
              className={`${styles.proof} ${styles[`proof_${state}`]}`}
            >
              <p className={styles.proofVerb}>
                {state === "posted"
                  ? proof.verb
                  : state === "running"
                    ? "Sending"
                    : "Queued"}
              </p>
              <p className={styles.proofAmount}>{proof.amount}</p>
              <p className={styles.proofRef}>{proof.ref}</p>
              {state === "posted" ? (
                <p className={styles.proofDetail}>{proof.detail}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className={styles.muted} style={{ marginTop: 16 }}>
        Prototype receipt. If this were a live member, these would post to their
        SoFi accounts tonight.
      </p>

      <div className={styles.spacer} />
      <button type="button" className={styles.cta} onClick={onAgain}>
        Scan another object
      </button>
      <Link
        className={styles.ghost}
        to="/"
        style={{ display: "block", textAlign: "center", lineHeight: "46px" }}
      >
        Back to the reel
      </Link>
    </div>
  );
}
