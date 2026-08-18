import { JobMini } from "../components/Diagrams";
import { SofiHeader } from "../components/StatusBar";
import { scenario } from "../data/scenario";
import { useStaticMode } from "../useStaticMode";
import cards from "./BreadthScreen.module.css";
import sofi from "./sofi.module.css";

export function BreadthScreen() {
  const { go } = useStaticMode();

  return (
    <div className={sofi.screen}>
      <SofiHeader onBack={() => go("/done")} title="SoFi It" />
      <div className={sofi.body}>
        <h1 className={sofi.title}>SoFi did these too</h1>
        <div className={cards.grid}>
          {scenario.breadth.map((card) => (
            <article key={card.id} className={cards.card}>
              <JobMini kind={card.id} />
              <p className={cards.number}>{card.number}</p>
              <p className={cards.label}>{card.label}</p>
              <p className={cards.caption}>{card.caption}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
