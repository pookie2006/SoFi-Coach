import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SofiHeader } from "../../components/StatusBar";
import { jobCards } from "../../data/ambition";
import {
  liveAccount,
  money,
  riskLabels,
  type RiskLevel,
} from "../../data/liveAccount";
import {
  isShowroomJob,
  jobCatalog,
  objectCatalog,
  type CatalogItem,
} from "../../data/liveCatalog";
import {
  reviewForJob,
  reviewForObject,
  lineHold,
  sleep,
  workingLines,
  type ReviewModel,
} from "../../live/jobReview";
import { ReviewScreen } from "./ReviewScreen";
import {
  applyExclusiveToggle,
  approvedSteps,
  buildPlan,
  seedApproved,
} from "../../live/buildPlan";
import { planHeader } from "../../live/jobView";
import { ExecutionProof } from "../live/ExecutionProof";
import { identifyPhoto, scanStatus, searchComps } from "../../scan/api";
import { fileToJpeg } from "../../scan/photo";
import { priceRange } from "../../scan/range";
import type { ScanResult } from "../../scan/types";
import styles from "./scan.module.css";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type Phase = "camera" | "working" | "result" | "plan" | "done" | "error" | "blocked";

type PricePick = {
  id: string;
  title: string;
  price: number;
  source: string;
  link?: string;
};

function pricePicks(result: ScanResult): PricePick[] {
  const typical: PricePick = {
    id: "typical",
    title: "Typical from live comps",
    price: result.range.typical,
    source: `${usd.format(result.range.low)} low · ${usd.format(result.range.high)} high`,
  };
  const comps = result.comps.slice(0, 5).map((comp, index) => ({
    id: comp.link || `comp-${index}`,
    title: comp.title,
    price: comp.price,
    source: comp.source,
    link: comp.link,
  }));
  return [typical, ...comps];
}

function closestToTypical(result: ScanResult): string {
  const picks = pricePicks(result);
  let best = picks[0];
  let gap = Number.POSITIVE_INFINITY;
  for (const pick of picks) {
    const next = Math.abs(pick.price - result.range.typical);
    if (next < gap) {
      best = pick;
      gap = next;
    }
  }
  return best.id;
}

function itemFromPick(result: ScanResult, pick: PricePick): CatalogItem {
  return {
    id: pick.id,
    name: result.vision.name,
    brand: result.vision.brand ?? result.vision.category,
    price: pick.price,
    streetHigh: result.range.high,
    blurb:
      result.vision.details.join(" · ") ||
      `Priced from ${pick.source}. SoFi routes it to debit, Pay in 4, card, or a SoFi loan.`,
    source: pick.source,
    identifiedAs: result.vision.name,
    image: result.photoUri,
    category: result.vision.category,
  };
}

export function ScanApp() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>("camera");
  const [step, setStep] = useState("Naming the object…");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [job, setJob] = useState<CatalogItem | null>(null);
  const [review, setReview] = useState<ReviewModel | null>(null);
  const [pickId, setPickId] = useState<string | null>(null);
  const [pickingObject, setPickingObject] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [photoOk, setPhotoOk] = useState(true);
  const [risk, setRisk] = useState<RiskLevel>(liveAccount.risk);
  const [approved, setApproved] = useState<Record<string, boolean>>({});

  const item = useMemo(() => {
    if (job) {
      if (!isShowroomJob(job) && pickId === "high" && job.streetHigh) {
        return { ...job, price: job.streetHigh };
      }
      return job;
    }
    if (!result || !pickId) return null;
    const selected = pricePicks(result).find((option) => option.id === pickId);
    return selected ? itemFromPick(result, selected) : null;
  }, [job, result, pickId]);
  const steps = useMemo(() => (item ? buildPlan(item, risk) : []), [item, risk]);
  const kept = approvedSteps(steps, approved);

  useEffect(() => {
    if (item) setApproved(seedApproved(buildPlan(item, risk)));
  }, [item, risk]);

  useEffect(() => {
    let cancelled = false;
    void scanStatus()
      .then((status) => {
        if (cancelled) return;
        setPhotoOk(Boolean(status.vision && status.comps));
      })
      .catch(() => {
        if (cancelled) return;
        setPhotoOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function runLoop(file: File) {
    setBusy(true);
    setPhase("working");
    setError(null);
    try {
      const photo = await fileToJpeg(file);
      setStep("Naming the object…");
      const vision = await identifyPhoto(photo.base64);
      setStep("Searching comps…");
      const comps = await searchComps(vision);
      const range = priceRange(comps);
      const next = { photoUri: photo.uri, vision, comps, range };
      const options = pricePicks(next);
      setResult(next);
      setJob(null);
      setReview({
        kicker: vision.brand ? `${vision.brand} · ${vision.category}` : vision.category,
        name: vision.name,
        details: vision.details.join(" · ") || undefined,
        heroLabel: "pick the most accurate price",
        band: `${usd.format(range.low)} low · ${usd.format(range.high)} high`,
        section: "Comparable listings",
        continueLabel: "Use this price",
        banner: "object",
        image: photo.uri,
        defaultId: closestToTypical(next),
        picks: options.map((option) => ({
          id: option.id,
          title: option.title,
          display: usd.format(option.price),
          source: option.source,
        })),
      });
      setPickId(closestToTypical(next));
      setPhase("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed.");
      setPhase("error");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function reset() {
    setResult(null);
    setJob(null);
    setReview(null);
    setPickId(null);
    setPickingObject(false);
    setError(null);
    setApproved({});
    setRisk(liveAccount.risk);
    setPhase("camera");
  }

  async function startReview(entry: CatalogItem, built: ReviewModel) {
    setJob(entry);
    setResult(null);
    setReview(built);
    setPickId(built.defaultId);
    setApproved(seedApproved(buildPlan(entry, risk)));
    setPhase("working");
    for (const line of workingLines(entry)) {
      setStep(line);
      await sleep(lineHold(line));
    }
    setPhase("result");
  }

  return (
    <div className={styles.page}>
      <input
        ref={inputRef}
        className={styles.hidden}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void runLoop(file);
        }}
      />

      {phase === "camera" ? (
        <div className={styles.camera}>
          <p className={styles.kicker}>SoFi It</p>
          <h1 className={styles.title}>Screenshot it. SoFi It.</h1>
          <p className={styles.lead}>
            Prototype — not the production pipe. Finance an object, scan
            one, or pick a job. SoFi writes a plan, then posts a receipt.
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cta}
              disabled={busy}
              onClick={() => setPickingObject((on) => !on)}
            >
              Finance an object
            </button>
            <button
              type="button"
              className={styles.ghost}
              disabled={busy || !photoOk}
              onClick={() => inputRef.current?.click()}
            >
              {photoOk ? "Scan an object" : "Scan needs the laptop demo"}
            </button>
          </div>
          {pickingObject ? (
            <div className={styles.jobs} style={{ marginTop: 12 }}>
              {objectCatalog.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={styles.job}
                  onClick={() => void startReview(entry, reviewForObject(entry))}
                >
                  <p className={styles.jobEyebrow}>{entry.brand}</p>
                  <p className={styles.jobTitle}>{entry.name}</p>
                  <p className={styles.jobHero}>{usd.format(entry.price)}</p>
                  <p className={styles.jobSub}>SoFi writes a finance plan</p>
                </button>
              ))}
            </div>
          ) : null}
          <p className={styles.orPick}>Or pick a job</p>
          <div className={styles.jobs}>
            {jobCards.map((card) => {
              const entry = jobCatalog.find((item) => item.id === card.id);
              if (!entry) return null;
              return (
                <button
                  key={card.id}
                  type="button"
                  className={styles.job}
                  onClick={() => void startReview(entry, reviewForJob(entry))}
                >
                  <p className={styles.jobEyebrow}>{card.eyebrow}</p>
                  <p className={styles.jobTitle}>{card.title}</p>
                  <p className={styles.jobHero}>{card.hero}</p>
                  <p className={styles.jobSub}>{card.sub}</p>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {phase === "working" ? (
        <div className={styles.working}>
          <p className={styles.kicker}>SoFi It</p>
          <h1 className={styles.workingTitle}>{step}</h1>
        </div>
      ) : null}

      {phase === "result" && review && pickId ? (
        <ReviewScreen
          review={review}
          pickId={pickId}
          onPick={setPickId}
          onContinue={() => setPhase("plan")}
          onBack={reset}
        />
      ) : null}

      {phase === "plan" && item ? (
        <PlanScreen
          item={item}
          risk={risk}
          steps={steps}
          approved={approved}
          keptCount={kept.length}
          onRisk={setRisk}
          onToggle={(id, next) =>
            setApproved((current) => applyExclusiveToggle(steps, current, id, next))
          }
          onBack={() => setPhase(review ? "result" : "camera")}
          onSoFi={() => setPhase("done")}
        />
      ) : null}

      {phase === "done" && item ? (
        <div className={styles.result}>
          <SofiHeader title="SoFi It" />
          <ExecutionProof key={item.id} item={item} kept={kept} onAgain={reset} />
        </div>
      ) : null}

      {phase === "error" || phase === "blocked" ? (
        <div className={styles.blocked}>
          <p className={styles.kicker}>SoFi It</p>
          <h1 className={styles.workingTitle}>
            {phase === "blocked" ? "Laptop setup" : "Couldn’t finish the loop"}
          </h1>
          <p className={styles.lead}>
            {error} Pick a job on home — same plans.
          </p>
          {phase === "error" ? (
            <button type="button" className={styles.cta} onClick={reset}>
              Try again
            </button>
          ) : (
            <Link className={styles.cta} to="/" style={{ display: "grid", placeItems: "center" }}>
              Back to the reel
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
}

function PlanScreen({
  item,
  risk,
  steps,
  approved,
  keptCount,
  onRisk,
  onToggle,
  onBack,
  onSoFi,
}: {
  item: CatalogItem;
  risk: RiskLevel;
  steps: ReturnType<typeof buildPlan>;
  approved: Record<string, boolean>;
  keptCount: number;
  onRisk: (level: RiskLevel) => void;
  onToggle: (id: string, next: boolean) => void;
  onBack: () => void;
  onSoFi: () => void;
}) {
  const header = planHeader(item);
  return (
    <div className={styles.result}>
      <SofiHeader title="SoFi It" onBack={onBack} />
      <div className={styles.body}>
        <p className={styles.kicker}>
          {item.identifiedAs ? `Saw ${item.identifiedAs} · ` : ""}
          {header.kicker}
        </p>
        <h1 className={styles.name}>{header.title}</h1>
        {item.image ? <img className={styles.thumb} src={item.image} alt="" /> : null}
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
        {steps.map((step) => {
          const on = Boolean(approved[step.id]);
          return (
            <button
              key={step.id}
              type="button"
              className={`${styles.step} ${on ? styles.stepOn : ""}`}
              disabled={step.disabled}
              onClick={() => onToggle(step.id, !on)}
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
          disabled={keptCount === 0}
          onClick={onSoFi}
        >
          SoFi the approved steps
        </button>
      </div>
    </div>
  );
}

