import { useEffect, useMemo, useState, type ReactNode } from "react";
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
import { ExecuteScreen } from "./ExecuteScreen";
import { JobVignette } from "./JobVignette";
import { ProcessingScreen } from "./ProcessingScreen";
import { ShareScreen } from "./ShareScreen";
import { SourceScreen } from "./SourceScreen";

const CROSSFADE_MS = 400;

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
      <h1 className={styles.cardTitle}>SoFi does the thing.</h1>
      <p className={styles.cardLead}>It does not stop at a plan.</p>
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
        ChatGPT and most coaches end at “here’s what you could do.”
      </p>
      <p className={styles.cardBody}>
        SoFi It writes the short plan so you can see what you’re authorizing.
      </p>
      <p className={styles.cardBody}>
        Then it originates the mortgage, funds the auto loan, invests to an
        industry and risk, refinances, or rolls the 401(k).
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
      holdMs: 7000,
      caption: "SoFi does the thing.",
      render: () => <TitleCard />,
    },
    {
      id: "idea",
      holdMs: 11000,
      caption: "See the plan. Then SoFi runs it.",
      render: () => <IdeaCard />,
    },
    {
      id: "source",
      holdMs: 5500,
      caption: `${scenario.person.firstName} · ${scenario.chat.threadName}`,
      render: () => <SourceScreen />,
    },
    {
      id: "share",
      holdMs: 4200,
      caption: `${scenario.person.firstName} · SoFi It`,
      render: () => <ShareScreen />,
    },
    {
      id: "processing",
      holdMs: 5000,
      caption: `Home to finance · ${format.shortStreet()}`,
      render: () => <ProcessingScreen />,
    },
    {
      id: "execute",
      holdMs: 8500,
      caption: `${scenario.person.firstName} · SoFi finances ${format.shortStreet()}`,
      render: () => <ExecuteScreen />,
    },
    {
      id: "action",
      holdMs: 4500,
      caption: `Confirm ${format.sofiApr()} mortgage`,
      render: () => <ActionScreen />,
    },
    {
      id: "done",
      holdMs: 5200,
      caption: "SoFi is originating",
      render: () => <DoneScreen />,
    },
    {
      id: "auto",
      holdMs: 5000,
      caption: `${scenario.person.firstName} · auto loan`,
      render: () => (
        <JobVignette
          kind="auto"
          quote="I need an auto loan"
          number={job("auto").number}
          label={job("auto").label}
          caption={job("auto").caption}
        />
      ),
    },
    {
      id: "invest",
      holdMs: 5200,
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
      holdMs: 5000,
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
      holdMs: 5000,
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
      holdMs: 5500,
      caption: "SoFi did these too",
      render: () => <BreadthScreen />,
    },
    {
      id: "end",
      holdMs: 7000,
      caption: "Scan It & SoFi It",
      render: () => <EndScreen />,
    },
  ];
}

export function DemoScreen() {
  const steps = useMemo(() => buildSteps(), []);
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const navigate = useNavigate();
  const { isStatic } = useStaticMode();
  const step = steps[index];

  useEffect(() => {
    if (outgoing === null) return;
    const id = window.setTimeout(() => setOutgoing(null), CROSSFADE_MS);
    return () => window.clearTimeout(id);
  }, [outgoing]);

  useEffect(() => {
    if (!playing) return;
    const last = index >= steps.length - 1;
    const id = window.setTimeout(() => {
      if (last) {
        setPlaying(false);
        return;
      }
      setOutgoing(index);
      setIndex((current) => current + 1);
    }, step.holdMs);
    return () => window.clearTimeout(id);
  }, [index, playing, step.holdMs, steps.length]);

  return (
    <div className={styles.stage} style={cssVariables}>
      {isStatic ? null : (
        <>
          <p className={styles.wordmark}>
            <span className={styles.sofiMark}>SoFi</span> It
          </p>
          <div className={styles.rule} />
        </>
      )}

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

      {isStatic ? null : (
        <>
          <p className={styles.caption}>{step.caption}</p>
          <div className={styles.bar} aria-hidden="true">
            <div
              key={step.id}
              className={`${styles.fill} ${playing ? "" : styles.paused}`}
              style={{ animationDuration: `${step.holdMs}ms` }}
            />
          </div>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.btn}
              onClick={() => setPlaying((on) => !on)}
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={() => {
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
              className={styles.btn}
              onClick={() => navigate("/live")}
            >
              Judge live
            </button>
          </div>
        </>
      )}
    </div>
  );
}
