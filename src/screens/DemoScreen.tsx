import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { PlanVsDo } from "../components/Diagrams";
import { DeviceFrame } from "../components/DeviceFrame";
import { StatusBar } from "../components/StatusBar";
import { format, scenario } from "../data/scenario";
import { cssVariables } from "../theme/tokens";
import { PlaybackLock, useStaticMode } from "../useStaticMode";
import { ActionScreen } from "./ActionScreen";
import { BreadthScreen } from "./BreadthScreen";
import styles from "./DemoScreen.module.css";
import { DoneScreen } from "./DoneScreen";
import { EndScreen } from "./EndScreen";
import { JudgeScan } from "./scan/JudgeScan";
import { ExecuteScreen } from "./ExecuteScreen";
import { JobVignette } from "./JobVignette";
import { ProcessingScreen } from "./ProcessingScreen";
import { ShareScreen } from "./ShareScreen";
import { SourceScreen } from "./SourceScreen";

const CROSSFADE_MS = 260;

function holdMs(copy: string, glance = 0) {
  const words = copy.trim().split(/\s+/).filter(Boolean).length;
  return Math.round(Math.min(5200, Math.max(1800, 1000 + words * 170 + glance)));
}

type Step = {
  id: string;
  holdMs: number;
  caption: string;
  render: () => ReactNode;
};

function TitleCard() {
  return (
    <div className={styles.card}>
      <StatusBar variant="light" />
      <div style={{ flex: 1, minHeight: 24 }} />
      <p className={styles.cardKicker}>
        <span className={styles.sofiMark}>SoFi</span> It
      </p>
      <div className={styles.cardRule} />
      <h1 className={styles.cardTitle}>See what’s possible.</h1>
      <p className={styles.cardLead}>
        Financial independence.
        <br />
        Realizing ambitions.
      </p>
      <p className={styles.cardBody}>SoFi It means see it — then SoFi does it.</p>
    </div>
  );
}

function IdeaCard() {
  return (
    <div className={styles.card}>
      <StatusBar variant="light" />
      <div style={{ flex: 1, minHeight: 16 }} />
      <p className={styles.cardKicker}>
        <span className={styles.sofiMark}>SoFi</span> It
      </p>
      <div className={styles.cardRule} />
      <h1 className={styles.cardTitle}>See the plan. Then SoFi runs it.</h1>
      <div className={styles.diagram}>
        <PlanVsDo />
      </div>
      <p className={styles.cardBody}>
        SoFi It means see what’s possible — then originate, invest, refinance,
        or roll it.
      </p>
    </div>
  );
}

function job(id: (typeof scenario.breadth)[number]["id"]) {
  return scenario.breadth.find((item) => item.id === id)!;
}

function buildSteps(): Step[] {
  return [
    {
      id: "open",
      holdMs: holdMs(
        "See what’s possible. Financial independence. Realizing ambitions. SoFi It means see it — then SoFi does it.",
      ),
      caption: "See what’s possible.",
      render: () => <TitleCard />,
    },
    {
      id: "idea",
      holdMs: holdMs(
        "See the plan. Then SoFi runs it. SoFi It means see what’s possible — then originate, invest, refinance, or roll it.",
        400,
      ),
      caption: "See the plan. Then SoFi runs it.",
      render: () => <IdeaCard />,
    },
    {
      id: "source",
      holdMs: holdMs(`${scenario.person.firstName} ${scenario.chat.threadName}`, 900),
      caption: `${scenario.person.firstName} · ${scenario.chat.threadName}`,
      render: () => <SourceScreen />,
    },
    {
      id: "share",
      holdMs: holdMs(`${scenario.person.firstName} SoFi It`, 600),
      caption: `${scenario.person.firstName} · SoFi It`,
      render: () => <ShareScreen />,
    },
    {
      id: "processing",
      holdMs: holdMs(`Home to finance ${format.shortStreet()}`, 800),
      caption: `Home to finance · ${format.shortStreet()}`,
      render: () => <ProcessingScreen />,
    },
    {
      id: "execute",
      holdMs: holdMs(
        `${scenario.person.firstName} SoFi finances ${format.shortStreet()}`,
        1600,
      ),
      caption: `${scenario.person.firstName} · SoFi finances ${format.shortStreet()}`,
      render: () => <ExecuteScreen />,
    },
    {
      id: "action",
      holdMs: holdMs(`Confirm ${format.sofiApr()} mortgage`),
      caption: `Confirm ${format.sofiApr()} mortgage`,
      render: () => <ActionScreen />,
    },
    {
      id: "done",
      holdMs: holdMs("SoFi is originating", 400),
      caption: "SoFi is originating",
      render: () => <DoneScreen />,
    },
    {
      id: "auto",
      holdMs: holdMs(`${scenario.person.firstName} personal loan`, 500),
      caption: `${scenario.person.firstName} · personal loan`,
      render: () => (
        <JobVignette
          kind="auto"
          quote="I need a personal loan for this car"
          number={job("auto").number}
          label={job("auto").label}
          caption={job("auto").caption}
        />
      ),
    },
    {
      id: "invest",
      holdMs: holdMs(`${scenario.person.firstName} clean energy`, 500),
      caption: `${scenario.person.firstName} · clean energy`,
      render: () => (
        <JobVignette
          kind="invest"
          quote="Invest in clean energy, moderate risk"
          number={job("invest").number}
          label={job("invest").label}
          caption={job("invest").caption}
        />
      ),
    },
    {
      id: "401k",
      holdMs: holdMs(`${scenario.person.firstName} 401(k)`, 500),
      caption: `${scenario.person.firstName} · 401(k)`,
      render: () => (
        <JobVignette
          kind="401k"
          quote="Roll over my old 401(k)"
          number={job("401k").number}
          label={job("401k").label}
          caption={job("401k").caption}
        />
      ),
    },
    {
      id: "student",
      holdMs: holdMs(`${scenario.person.firstName} student loan`, 500),
      caption: `${scenario.person.firstName} · student loan`,
      render: () => (
        <JobVignette
          kind="student"
          quote="Refinance my student loan"
          number={job("student").number}
          label={job("student").label}
          caption={job("student").caption}
        />
      ),
    },
    {
      id: "breadth",
      holdMs: holdMs("SoFi did these too", 900),
      caption: "SoFi did these too",
      render: () => <BreadthScreen />,
    },
    {
      id: "end",
      holdMs: holdMs(
        "Scan It & SoFi It. See what’s possible. Financial independence. Realizing ambitions.",
      ),
      caption: "See what’s possible.",
      render: () => <EndScreen />,
    },
  ];
}

export function DemoScreen() {
  const steps = useMemo(() => buildSteps(), []);
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [tab, setTab] = useState<"reel" | "judge">("reel");
  const navigate = useNavigate();
  const { isStatic } = useStaticMode();
  const step = steps[index];

  useEffect(() => {
    if (outgoing === null) return;
    const id = window.setTimeout(() => setOutgoing(null), CROSSFADE_MS);
    return () => window.clearTimeout(id);
  }, [outgoing]);

  const goNext = useCallback(() => {
    if (isStatic) return;
    if (index >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    setOutgoing(index);
    setIndex(index + 1);
  }, [index, isStatic, steps.length]);

  useEffect(() => {
    if (!playing || tab === "judge") return;
    const last = index >= steps.length - 1;
    const id = window.setTimeout(() => {
      if (last) {
        setPlaying(false);
        return;
      }
      goNext();
    }, step.holdMs);
    return () => window.clearTimeout(id);
  }, [goNext, index, playing, step.holdMs, tab]);

  return (
    <div
      className={`${styles.stage} ${isStatic ? "" : styles.skippable}`}
      style={cssVariables}
      onClick={
        isStatic || tab === "judge"
          ? undefined
          : (event) => {
              if ((event.target as HTMLElement).closest("button")) return;
              goNext();
            }
      }
    >
      {isStatic ? null : (
        <>
          <p className={styles.wordmark}>
            <span className={styles.sofiMark}>SoFi</span> It
          </p>
          <div className={styles.rule} />
        </>
      )}

      {tab === "judge" ? (
        <JudgeScan embedded />
      ) : (
        <div className={styles.phoneWrap}>
          <DeviceFrame caption={null} variant="item">
            <PlaybackLock>
              <div className={`${styles.viewport} ${styles.frozen}`}>
                {outgoing !== null ? (
                  <div className={`${styles.layer} ${styles.outgoing}`}>
                    {steps[outgoing].render()}
                  </div>
                ) : null}
                <div
                  className={`${styles.layer} ${outgoing === null ? "" : styles.incoming}`}
                >
                  {step.render()}
                </div>
              </div>
            </PlaybackLock>
          </DeviceFrame>
        </div>
      )}

      {isStatic ? null : (
        <>
          {tab === "judge" ? (
            <p className={styles.caption}>See what’s possible.</p>
          ) : (
            <>
              <p className={styles.caption}>{step.caption}</p>
              <div className={styles.bar} aria-hidden="true">
                <div
                  key={step.id}
                  className={`${styles.fill} ${playing ? "" : styles.paused}`}
                  style={{ animationDuration: `${step.holdMs}ms` }}
                />
              </div>
            </>
          )}
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.btn}
              onClick={() => {
                setTab("reel");
                setPlaying((on) => !on);
              }}
            >
              {playing && tab === "reel" ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={() => {
                setTab("reel");
                setOutgoing(index);
                setIndex(0);
                setPlaying(true);
              }}
            >
              Replay
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => navigate("/story")}
            >
              Tap through
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => navigate("/scan")}
            >
              Scan
            </button>
          </div>
        </>
      )}
    </div>
  );
}
