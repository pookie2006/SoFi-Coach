import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { jobCards } from "../../data/ambition";
import {
  liveAccount,
  money,
  riskLabels,
  type RiskLevel,
} from "../../data/liveAccount";
import {
  isShowroomJob,
  itemById,
  jobCatalog,
  objectCatalog,
  type CatalogItem,
} from "../../data/liveCatalog";
import { typicalPrices } from "../../data/typicalPrices";
import {
  reviewForJob,
  reviewForObject,
  lineHold,
  sleep,
  workingLines,
  type ReviewModel,
} from "../../live/jobReview";
import {
  applyExclusiveToggle,
  approvedSteps,
  buildPlan,
  seedApproved,
} from "../../live/buildPlan";
import { planHeader } from "../../live/jobView";
import { ReviewScreen } from "../scan/ReviewScreen";
import { lookupPrice, priceKnownItem } from "../../live/lookupPrice";
import { loadDetector, matchFrame } from "../../live/recognize";
import { useCamera } from "../../live/useCamera";
import { SofiHeader } from "../../components/StatusBar";
import { ExecutionProof } from "./ExecutionProof";
import styles from "./live.module.css";
import scanStyles from "../scan/scan.module.css";

type Phase = "home" | "scan" | "working" | "review" | "pricing" | "plan" | "done";

export function LiveApp() {
  const [params] = useSearchParams();
  const preset = itemById(params.get("object"));
  const [phase, setPhase] = useState<Phase>(() => {
    if (!preset) return "home";
    return isShowroomJob(preset) ? "working" : "pricing";
  });
  const [item, setItem] = useState<CatalogItem | null>(preset);
  const [asOf, setAsOf] = useState<string | null>(null);
  const [risk, setRisk] = useState<RiskLevel>(liveAccount.risk);
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const [hint, setHint] = useState(
    "Point the camera at almost anything — a laptop, cup, backpack, bike…",
  );
  const [review, setReview] = useState<ReviewModel | null>(null);
  const [reviewPick, setReviewPick] = useState<string>("");
  const [workLine, setWorkLine] = useState("Reading…");
  const [pickingObject, setPickingObject] = useState(false);

  const steps = useMemo(
    () => (item ? buildPlan(item, risk) : []),
    [item, risk],
  );

  useEffect(() => {
    if (item && phase === "pricing") {
      let cancelled = false;
      const job = item.identifiedAs
        ? lookupPrice(item.identifiedAs)
        : priceKnownItem(item);
      void job.then((priced) => {
        if (cancelled) return;
        setItem(priced);
        setAsOf(priced.asOf ?? null);
        setApproved(seedApproved(buildPlan(priced, risk)));
        setPhase("plan");
      });
      return () => {
        cancelled = true;
      };
    }
    return undefined;
  }, [item, phase]);

  useEffect(() => {
    if (item) setApproved(seedApproved(buildPlan(item, risk)));
  }, [item, risk]);

  const startReview = useCallback(
    async (next: CatalogItem, built: ReviewModel) => {
      setItem(next);
      setAsOf(null);
      setReview(built);
      setReviewPick(built.defaultId);
      setApproved(seedApproved(buildPlan(next, risk)));
      setPhase("working");
      for (const line of workingLines(next)) {
        setWorkLine(line);
        await sleep(lineHold(line));
      }
      setPhase("review");
    },
    [risk],
  );

  const startedPreset = useRef(false);
  useEffect(() => {
    if (!preset || !isShowroomJob(preset) || startedPreset.current) return;
    startedPreset.current = true;
    void startReview(preset, reviewForJob(preset));
  }, [preset, startReview]);

  const choose = useCallback(
    (next: CatalogItem, via: "scan" | "pick" | "qr") => {
      setHint(via === "scan" ? `Recognized ${next.identifiedAs ?? next.name}` : next.name);
      if (isShowroomJob(next)) {
        void startReview(next, reviewForJob(next));
        return;
      }
      setItem(next);
      setPhase("pricing");
    },
    [startReview],
  );

  const identify = useCallback((label: string) => {
    setHint(`Identified ${label}`);
    setItem({
      id: label,
      name: label,
      brand: "Identifying",
      price: 0,
      streetHigh: 0,
      blurb: "",
      source: "Camera",
      identifiedAs: label,
    });
    setPhase("pricing");
  }, []);

  const kept = approvedSteps(steps, approved);

  return (
    <div
      className={`${styles.page} ${phase === "home" || phase === "working" ? styles.pageDark : ""}`}
    >
      {phase === "home" || phase === "working" || phase === "review" ? null : (
        <SofiHeader
          title="SoFi It"
          onBack={() => {
            if (phase === "scan") setPhase("home");
            else if (phase === "plan" && review) {
              setPhase("review");
            } else if (phase === "pricing" || phase === "plan") {
              setPhase("home");
              setItem(null);
              setReview(null);
            } else setPhase("plan");
          }}
        />
      )}

      {phase === "home" ? (
        <Home
          pickingObject={pickingObject}
          onFinance={() => setPickingObject((on) => !on)}
          onScan={() => setPhase("scan")}
          onPick={choose}
          onObject={(entry) => void startReview(entry, reviewForObject(entry))}
        />
      ) : null}

      {phase === "working" ? (
        <div className={scanStyles.working}>
          <p className={scanStyles.kicker}>SoFi It</p>
          <h1 className={scanStyles.workingTitle}>{workLine}</h1>
        </div>
      ) : null}

      {phase === "review" && review ? (
        <ReviewScreen
          review={review}
          pickId={reviewPick}
          onPick={setReviewPick}
          onContinue={() => {
            if (item && !isShowroomJob(item) && reviewPick === "high" && item.streetHigh) {
              setItem({ ...item, price: item.streetHigh });
            }
            setPhase("plan");
          }}
          onBack={() => {
            setItem(null);
            setReview(null);
            setPhase("home");
          }}
        />
      ) : null}

      {phase === "scan" ? (
        <Scan hint={hint} onPick={choose} onIdentify={identify} onHint={setHint} />
      ) : null}

      {phase === "pricing" && item ? (
        <div className={styles.body}>
          <p className={styles.kicker}>
            {item.identifiedAs
              ? `Identified · ${item.identifiedAs}`
              : "Identifying"}
          </p>
          <h1 className={styles.title}>Finding the price…</h1>
          <p className={styles.muted}>
            Searching a live product catalog for a {item.identifiedAs ?? item.name}.
            Then SoFi writes a plan you can approve or reject.
          </p>
        </div>
      ) : null}

      {phase === "plan" && item ? (
        <div className={styles.body}>
          <PlanHeader item={item} asOf={asOf} risk={risk} onRisk={setRisk} />
          {steps.map((step) => {
            const on = Boolean(approved[step.id]);
            return (
              <button
                key={step.id}
                type="button"
                className={`${styles.step} ${on ? styles.stepOn : ""}`}
                disabled={step.disabled}
                onClick={() =>
                  setApproved((current) =>
                    applyExclusiveToggle(steps, current, step.id, !on),
                  )
                }
              >
                <span className={styles.box} />
                <span>
                  <p className={styles.stepTitle}>
                    {on ? "Approve · " : "Reject · "}
                    {step.title}
                  </p>
                  <p className={styles.stepDetail}>{step.detail}</p>
                </span>
              </button>
            );
          })}
          <div className={styles.spacer} />
          <button
            type="button"
            className={styles.cta}
            disabled={kept.length === 0}
            onClick={() => setPhase("done")}
          >
            SoFi the approved steps
          </button>
        </div>
      ) : null}

      {phase === "done" && item ? (
        <ExecutionProof
          key={item.id}
          item={item}
          kept={kept}
          onAgain={() => {
            setItem(null);
            setReview(null);
            setPickingObject(false);
            setPhase("home");
          }}
        />
      ) : null}
    </div>
  );
}

function IdentifyField({ onIdentify }: { onIdentify: (label: string) => void }) {
  const [query, setQuery] = useState("");
  return (
    <form
      className={styles.search}
      onSubmit={(event) => {
        event.preventDefault();
        const value = query.trim();
        if (!value) return;
        const match =
          Object.keys(typicalPrices).find((key) => value.toLowerCase().includes(key)) ??
          value;
        onIdentify(match);
      }}
    >
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Or type it: laptop, mug, bike…"
        aria-label="Identify an object by name"
      />
      <button type="submit">Price it</button>
    </form>
  );
}

function Home({
  pickingObject,
  onFinance,
  onScan,
  onPick,
  onObject,
}: {
  pickingObject: boolean;
  onFinance: () => void;
  onScan: () => void;
  onPick: (item: CatalogItem, via: "pick") => void;
  onObject: (item: CatalogItem) => void;
}) {
  return (
    <div className={scanStyles.camera}>
      <p className={scanStyles.kicker}>{liveAccount.name}</p>
      <h1 className={scanStyles.title}>Screenshot it. SoFi It.</h1>
      <p className={scanStyles.lead}>
        Prototype — not the production pipe. Finance an object, scan
        one, or pick a job. SoFi writes a plan, then posts a receipt.
      </p>
      <div className={scanStyles.actions}>
        <button type="button" className={scanStyles.cta} onClick={onFinance}>
          Finance an object
        </button>
        <button type="button" className={scanStyles.ghost} onClick={onScan}>
          Scan an object
        </button>
      </div>
      {pickingObject ? (
        <div className={scanStyles.jobs} style={{ marginTop: 12 }}>
          {objectCatalog.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={scanStyles.job}
              onClick={() => onObject(entry)}
            >
              <p className={scanStyles.jobEyebrow}>{entry.brand}</p>
              <p className={scanStyles.jobTitle}>{entry.name}</p>
              <p className={scanStyles.jobHero}>{money(entry.price)}</p>
              <p className={scanStyles.jobSub}>SoFi writes a finance plan</p>
            </button>
          ))}
        </div>
      ) : null}
      <p className={scanStyles.orPick}>Or pick a job</p>
      <div className={scanStyles.jobs}>
        {jobCards.map((card) => {
          const item = jobCatalog.find((entry) => entry.id === card.id);
          if (!item) return null;
          return (
            <button
              key={card.id}
              type="button"
              className={scanStyles.job}
              onClick={() => onPick(item, "pick")}
            >
              <p className={scanStyles.jobEyebrow}>{card.eyebrow}</p>
              <p className={scanStyles.jobTitle}>{card.title}</p>
              <p className={scanStyles.jobHero}>{card.hero}</p>
              <p className={scanStyles.jobSub}>{card.sub}</p>
            </button>
          );
        })}
      </div>
      <Link
        className={scanStyles.ghost}
        to="/live/host"
        style={{ display: "block", textAlign: "center", lineHeight: "46px" }}
      >
        Host QR poster
      </Link>
    </div>
  );
}

function PlanHeader({
  item,
  asOf,
  risk,
  onRisk,
}: {
  item: CatalogItem;
  asOf: string | null;
  risk: RiskLevel;
  onRisk: (level: RiskLevel) => void;
}) {
  const header = planHeader(item);
  return (
    <>
      <p className={styles.kicker}>
        {item.identifiedAs ? `Saw ${item.identifiedAs} · ` : ""}
        {header.kicker}
        {asOf ? ` · ${asOf}` : ""}
      </p>
      <h1 className={styles.title}>{header.title}</h1>
      {item.image ? (
        <img className={styles.thumb} src={item.image} alt="" />
      ) : null}
      <p className={styles.heroNum}>{header.hero}</p>
      <p className={styles.muted}>{header.label}</p>
      {header.rows.length > 0 ? (
        <div className={styles.rows}>
          {header.rows.map((row) => (
            <div key={row.label} className={styles.row}>
              <span>{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.muted}>
          Cash {money(liveAccount.cash)} · card{" "}
          {money(liveAccount.creditAvailable)} · loan room{" "}
          {money(liveAccount.personalLoanLimit)}
        </p>
      )}
      {header.showRisk ? (
        <div className={styles.riskRow}>
          {(Object.keys(riskLabels) as RiskLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              className={`${styles.risk} ${risk === level ? styles.riskOn : ""}`}
              onClick={() => onRisk(level)}
            >
              {riskLabels[level]}
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.riskRow} />
      )}
    </>
  );
}

function Scan({
  hint,
  onPick,
  onIdentify,
  onHint,
}: {
  hint: string;
  onPick: (item: CatalogItem, via: "scan" | "pick") => void;
  onIdentify: (label: string) => void;
  onHint: (text: string) => void;
}) {
  const { videoRef, error, ready } = useCamera(true);
  const [hits, setHits] = useState(0);

  useEffect(() => {
    void loadDetector().then((detector) => {
      if (!detector) onHint("Vision model blocked. Pick the object — same plan.");
    });
  }, [onHint]);

  useEffect(() => {
    if (!ready) return;
    let alive = true;
    let lastLabel: string | null = null;
    let count = 0;

    const tick = async () => {
      if (!alive) return;
      const video = videoRef.current;
      if (video) {
        const match = await matchFrame(video);
        if (match) {
          if (match.label === lastLabel) count += 1;
          else {
            lastLabel = match.label;
            count = 1;
          }
          setHits(count);
          onHint(`Seeing ${match.label}…`);
          if (count >= 3) {
            onIdentify(match.label);
            return;
          }
        }
      }
      window.setTimeout(() => void tick(), 280);
    };

    void tick();
    return () => {
      alive = false;
    };
  }, [onHint, onIdentify, ready, videoRef]);

  return (
    <div className={styles.body}>
      <div className={styles.scanStage}>
        <video
          ref={videoRef}
          className={styles.video}
          playsInline
          muted
          autoPlay
        />
        <div className={styles.reticle} />
        <p className={styles.banner}>
          {error
            ? `${error} Pick a job on home — same plans.`
            : hint}
          {hits > 0 ? ` (${hits}/3)` : ""}
        </p>
      </div>
      <IdentifyField onIdentify={onIdentify} />
      <div className={styles.picks}>
        {objectCatalog.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={styles.pick}
            onClick={() => onPick(entry, "pick")}
          >
            {entry.name}
          </button>
        ))}
      </div>
    </div>
  );
}
