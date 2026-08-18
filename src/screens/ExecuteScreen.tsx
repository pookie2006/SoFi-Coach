import { PaymentBars } from "../components/Diagrams";
import { CtaButton, SofiHeader } from "../components/StatusBar";
import { format, scenario } from "../data/scenario";
import { useStaticMode } from "../useStaticMode";
import execute from "./ExecuteScreen.module.css";
import sofi from "./sofi.module.css";

export function ExecuteScreen() {
  const { go } = useStaticMode();

  return (
    <div className={sofi.screen}>
      <SofiHeader onBack={() => go("/processing")} />
      <div className={execute.body}>
        <p className={execute.eyebrow}>
          {scenario.person.firstName} · {format.shortStreet()}
        </p>
        <div className={execute.hero}>
          <p className={execute.number}>{format.monthlySave()}</p>
          <p className={execute.label}>less per month if SoFi finances this</p>
        </div>
        <div className={execute.compare}>
          <span className={execute.struck}>Their estimate {format.otherApr()}</span>
          <span aria-hidden="true">→</span>
          <span className={execute.sofiRate}>SoFi {format.sofiApr()}</span>
        </div>
        <div className={execute.chart}>
          <PaymentBars
            otherLabel={format.otherMonthly()}
            sofiLabel={format.sofiMonthly()}
            otherValue={scenario.mortgage.otherMonthly}
            sofiValue={scenario.mortgage.sofiMonthly}
          />
        </div>
        <ul className={execute.receipt}>
          <li>
            Zillow's estimate is about {format.otherMonthlyPlain()}/mo on a{" "}
            {format.loanAmount()} loan.
          </li>
          <li>
            SoFi can originate at {format.sofiApr()} — about{" "}
            {format.sofiMonthlyPlain()}/mo.
          </li>
          <li>
            That's about {format.lifetimeSavePlain()} less over 30 years. SoFi
            handles the loan.
          </li>
        </ul>
        <div className={execute.spacer} />
        <CtaButton onClick={() => go("/action")}>Let SoFi finance it</CtaButton>
      </div>
    </div>
  );
}
