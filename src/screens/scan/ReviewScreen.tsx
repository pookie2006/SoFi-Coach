import type { ReviewModel } from "../../live/jobReview";
import styles from "./scan.module.css";

type ReviewScreenProps = {
  review: ReviewModel;
  pickId: string;
  onPick: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function ReviewScreen({
  review,
  pickId,
  onPick,
  onContinue,
  onBack,
}: ReviewScreenProps) {
  const selected =
    review.picks.find((pick) => pick.id === pickId) ?? review.picks[0];

  return (
    <div className={styles.result}>
      {review.image ? (
        <img className={styles.photo} src={review.image} alt="" />
      ) : (
        <div className={`${styles.photo} ${styles[`banner_${review.banner}`]}`} />
      )}
      <div className={styles.body}>
        <p className={styles.kicker}>{review.kicker}</p>
        <h1 className={styles.name}>{review.name}</h1>
        {review.details ? <p className={styles.details}>{review.details}</p> : null}
        <p className={styles.range}>{selected.display}</p>
        <p className={styles.rangeLabel}>{review.heroLabel}</p>
        <p className={styles.band}>{review.band}</p>
        <p className={styles.section}>{review.section}</p>
        {review.picks.map((pick) => (
          <button
            key={pick.id}
            type="button"
            className={`${styles.comp} ${pick.id === pickId ? styles.compOn : ""}`}
            onClick={() => onPick(pick.id)}
          >
            <p className={styles.compTitle}>{pick.title}</p>
            <p className={styles.compMeta}>
              {pick.display} · {pick.source}
            </p>
          </button>
        ))}
        <button type="button" className={styles.cta} onClick={onContinue}>
          {review.continueLabel}
        </button>
        <button
          type="button"
          className={`${styles.ghost} ${styles.resultGhost}`}
          onClick={onBack}
        >
          Start over
        </button>
      </div>
    </div>
  );
}
