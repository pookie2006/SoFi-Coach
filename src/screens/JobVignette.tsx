import { JobGlyph } from "../components/Diagrams";
import { CtaButton, SofiHeader } from "../components/StatusBar";
import { scenario } from "../data/scenario";
import execute from "./ExecuteScreen.module.css";
import sofi from "./sofi.module.css";

type JobId = (typeof scenario.breadth)[number]["id"];

type JobVignetteProps = {
  kind: JobId;
  quote: string;
  number: string;
  label: string;
  caption: string;
};

export function JobVignette({ kind, quote, number, label, caption }: JobVignetteProps) {
  return (
    <div className={sofi.screen}>
      <SofiHeader />
      <div className={execute.body}>
        <p className={execute.eyebrow}>
          {scenario.person.firstName} · {quote}
        </p>
        <div className={execute.hero}>
          <JobGlyph kind={kind} />
          <p className={`${execute.number} ${execute.compact}`}>{number}</p>
          <p className={execute.label}>{label}</p>
        </div>
        <p className={sofi.caption} style={{ textAlign: "center", marginTop: 16 }}>
          {caption}
        </p>
        <div className={execute.spacer} />
        <CtaButton onClick={() => {}}>SoFi did it</CtaButton>
      </div>
    </div>
  );
}
