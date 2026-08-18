import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  aprPct,
  liveAccount,
  money,
  riskLabels,
  type RiskLevel,
} from "../../data/liveAccount";
import { itemById, liveCatalog, type CatalogItem } from "../../data/liveCatalog";
import {
  applyExclusiveToggle,
  approvedSteps,
  buildPlan,
  seedApproved,
} from "../../live/buildPlan";
import { pullMarketPrice } from "../../live/fetchMarket";
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
  const [hint, setHint] = useState("Point the camera at a laptop, phone, or bike");

  const steps = useMemo(
    () => (item ? buildPlan(item, risk) : []),
    [item, risk],
  );

  useEffect(() => {
    if (item && phase === "pricing") {
      let cancelled = false;
      void pullMarketPrice(item).then((priced) => {
        if (cancelled) return;
        setItem(priced);
        setAsOf(priced.asOf);
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
    setHint(via === "scan" ? `Recognized ${next.name}` : next.name);
    setItem(next);
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
        <Home onScan={() => setPhase("scan")} onPick={choose} />
      ) : null}

      {phase === "scan" ? (
        <Scan hint={hint} onPick={choose} onHint={setHint} />
      ) : null}

      {phase === "pricing" && item ? (
        <div className={styles.body}>
          <p className={styles.kicker}>Pulling the street price</p>
          <h1 className={styles.title}>{item.name}</h1>
          <p className={styles.heroNum}>{money(item.price)}</p>
          <p className={styles.muted}>
            Checking {item.source}. Then SoFi writes a plan you can approve or
            reject, line by line.
          </p>
        </div>
      ) : null}

      {phase === "plan" && item ? (
        <div className={styles.body}>
          <p className={styles.kicker}>
            {item.brand} · {item.source}
            {asOf ? ` · ${asOf}` : ""}
          </p>
          <h1 className={styles.title}>{item.name}</h1>
          <p className={styles.heroNum}>{money(item.price)}</p>
          <p className={styles.muted}>{item.blurb}</p>
          <p className={styles.muted}>
            Cash {money(liveAccount.cash)} · loan room{" "}
            {money(liveAccount.personalLoanLimit)} · risk
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
            const cashBlocked = step.id === "cash" && liveAccount.cash < item.price;
            return (
              <button
                key={step.id}
                type="button"
                className={`${styles.step} ${on ? styles.stepOn : ""}`}
                disabled={cashBlocked}
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
                  {step.kind === "loan"
                    ? `Originating a ${money(step.amount)} personal loan at ${aprPct(liveAccount.personalLoanApr)}.`
                    : step.kind === "cash"
                      ? `Debiting ${money(step.amount)} from checking.`
                      : step.kind === "etf"
                        ? `Allocating ${money(step.amount)} across ETFs.`
                        : step.kind === "stocks"
                          ? `Buying ${money(step.amount)} in stocks.`
                          : `Booking ${money(step.amount)} in the optional crypto sleeve.`}
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

function Home({
  onScan,
  onPick,
}: {
  onScan: () => void;
  onPick: (item: CatalogItem, via: "pick") => void;
}) {
  return (
    <div className={styles.body}>
      <p className={styles.kicker}>{liveAccount.name}</p>
      <h1 className={styles.title}>Scan it. SoFi does it.</h1>
      <p className={styles.lead}>
        This phone is a mock SoFi member. Limits are real enough to force a
        choice: finance the object, pay cash, or invest — then approve or reject
        each line.
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
      <p className={styles.muted}>Or pick one if the room is dark:</p>
      <div className={styles.picks}>
        {liveCatalog.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={styles.pick}
            onClick={() => onPick(entry, "pick")}
          >
            {entry.name}
            <div className={styles.muted} style={{ margin: 0 }}>
              {money(entry.price)}
            </div>
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
  onHint,
}: {
  hint: string;
  onPick: (item: CatalogItem, via: "scan" | "pick") => void;
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
    let lastId: string | null = null;
    let count = 0;

    const tick = async () => {
      if (!alive) return;
      const video = videoRef.current;
      if (video) {
        const match = await matchFrame(video);
        if (match) {
          if (match.id === lastId) count += 1;
          else {
            lastId = match.id;
            count = 1;
          }
          setHits(count);
          onHint(`Seeing ${match.name}…`);
          if (count >= 3) {
            onPick(match, "scan");
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
  }, [onHint, onPick, ready, videoRef]);

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
