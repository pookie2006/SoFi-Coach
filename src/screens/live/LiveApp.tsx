import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  liveAccount,
  money,
  riskLabels,
  type RiskLevel,
} from "../../data/liveAccount";
import { itemById, liveCatalog, type CatalogItem } from "../../data/liveCatalog";
import { typicalPrices } from "../../data/typicalPrices";
import {
  applyExclusiveToggle,
  approvedSteps,
  buildPlan,
  executionLine,
  seedApproved,
} from "../../live/buildPlan";
import { lookupPrice, priceKnownItem } from "../../live/lookupPrice";
import { loadDetector, matchFrame } from "../../live/recognize";
import { useCamera } from "../../live/useCamera";
import { CtaButton, SofiHeader } from "../../components/StatusBar";
import styles from "./live.module.css";

type Phase = "home" | "scan" | "pricing" | "plan" | "done";

export function LiveApp() {
  const [params] = useSearchParams();
  const preset = itemById(params.get("object"));
  const [phase, setPhase] = useState<Phase>(preset ? "pricing" : "home");
  const [item, setItem] = useState<CatalogItem | null>(preset);
  const [asOf, setAsOf] = useState<string | null>(null);
  const [risk, setRisk] = useState<RiskLevel>(liveAccount.risk);
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const [hint, setHint] = useState(
    "Point the camera at almost anything — a laptop, cup, backpack, bike…",
  );

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

  const choose = useCallback((next: CatalogItem, via: "scan" | "pick" | "qr") => {
    setHint(via === "scan" ? `Recognized ${next.identifiedAs ?? next.name}` : next.name);
    setItem(next);
    setPhase("pricing");
  }, []);

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
    <div className={styles.page}>
      <SofiHeader
        title="SoFi It"
        onBack={
          phase === "home"
            ? undefined
            : () => {
                if (phase === "scan") setPhase("home");
                else if (phase === "pricing" || phase === "plan") {
                  setPhase("home");
                  setItem(null);
                } else setPhase("plan");
              }
        }
      />

      {phase === "home" ? (
        <Home
          onScan={() => setPhase("scan")}
          onPick={choose}
          onIdentify={identify}
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
          <p className={styles.kicker}>
            {item.identifiedAs ? `Saw ${item.identifiedAs} · ` : ""}
            {item.source}
            {asOf ? ` · ${asOf}` : ""}
          </p>
          <h1 className={styles.title}>{item.name}</h1>
          {item.image ? (
            <img className={styles.thumb} src={item.image} alt="" />
          ) : null}
          <p className={styles.heroNum}>{money(item.price)}</p>
          <p className={styles.muted}>{item.blurb}</p>
          <p className={styles.muted}>
            Cash {money(liveAccount.cash)} · card{" "}
            {money(liveAccount.creditAvailable)} · loan room{" "}
            {money(liveAccount.personalLoanLimit)}
          </p>
          <div className={styles.riskRow}>
            {(Object.keys(riskLabels) as RiskLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                className={`${styles.risk} ${risk === level ? styles.riskOn : ""}`}
                onClick={() => setRisk(level)}
              >
                {riskLabels[level]}
              </button>
            ))}
          </div>
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
        <div className={styles.body}>
          <p className={styles.kicker}>SoFi is doing it</p>
          <h1 className={styles.title}>Not a plan. The job.</h1>
          <p className={styles.muted}>
            {item.name} at {money(item.price)}. You approved {kept.length}{" "}
            {kept.length === 1 ? "step" : "steps"}.
          </p>
          <div className={styles.card} style={{ marginTop: 20 }}>
            {kept.length === 0 ? (
              <p className={styles.muted}>Nothing approved.</p>
            ) : (
              kept.map((step) => (
                <p key={step.id} className={styles.stepDetail}>
                  {executionLine(step)}
                </p>
              ))
            )}
          </div>
          <div className={styles.spacer} />
          <CtaButton
            onClick={() => {
              setItem(null);
              setPhase("home");
            }}
          >
            Scan another object
          </CtaButton>
          <Link className={styles.ghost} to="/" style={{ display: "block", textAlign: "center", lineHeight: "46px" }}>
            Back to the reel
          </Link>
        </div>
      ) : null}
    </div>
  );
}

const quickLabels = [
  "laptop",
  "cell phone",
  "bicycle",
  "backpack",
  "chair",
  "cup",
] as const;

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
  onScan,
  onPick,
  onIdentify,
}: {
  onScan: () => void;
  onPick: (item: CatalogItem, via: "pick") => void;
  onIdentify: (label: string) => void;
}) {
  return (
    <div className={styles.body}>
      <p className={styles.kicker}>{liveAccount.name}</p>
      <h1 className={styles.title}>Scan it. SoFi does it.</h1>
      <p className={styles.lead}>
        Scan an object. The camera names it, we look up a street price, then
        SoFi writes a plan — debit, Pay in 4, card, or a SoFi loan — that you
        approve or reject line by line.
      </p>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Cash</p>
          <p className={styles.statValue}>{money(liveAccount.cash)}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Brokerage</p>
          <p className={styles.statValue}>{money(liveAccount.brokerage)}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Card</p>
          <p className={styles.statValue}>{money(liveAccount.creditAvailable)}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Personal loan room</p>
          <p className={styles.statValue}>{money(liveAccount.personalLoanLimit)}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Risk</p>
          <p className={styles.statValue}>{riskLabels[liveAccount.risk]}</p>
        </div>
      </div>
      <div className={styles.spacer} />
      <button type="button" className={styles.cta} onClick={onScan}>
        Scan an object
      </button>
      <IdentifyField onIdentify={onIdentify} />
      <p className={styles.muted}>Or pick a class if the room is dark:</p>
      <div className={styles.picks}>
        {quickLabels.map((label) => (
          <button
            key={label}
            type="button"
            className={styles.pick}
            onClick={() => onIdentify(label)}
          >
            {typicalPrices[label].label}
          </button>
        ))}
        {liveCatalog.map((entry) => (
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
      <Link className={styles.ghost} to="/live/host" style={{ display: "block", textAlign: "center", lineHeight: "46px" }}>
        Host QR poster
      </Link>
    </div>
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
          {error ?? hint}
          {hits > 0 ? ` (${hits}/3)` : ""}
        </p>
      </div>
      <IdentifyField onIdentify={onIdentify} />
      <div className={styles.picks}>
        {liveCatalog.map((entry) => (
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
