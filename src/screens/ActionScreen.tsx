import { PaymentBars } from "../components/Diagrams";
import { CtaButton, SofiHeader } from "../components/StatusBar";
import { format, scenario } from "../data/scenario";
import { useStaticMode } from "../useStaticMode";
import styles from "./sofi.module.css";

export function ActionScreen() {
  const { go } = useStaticMode();

  return (
    <div className={styles.screen}>
      <SofiHeader onBack={() => go("/execute")} />
      <div className={styles.body}>
        <h1 className={styles.title}>SoFi will finance this</h1>
        <p className={styles.subtitle}>
          {format.loanAmount()} · {format.term()} · your rate
        </p>
        <div style={{ marginTop: 28 }}>
          <p className={styles.figureLabel}>Your payment</p>
          <p className={styles.figure}>{format.sofiMonthly()}</p>
          <div style={{ marginTop: 18 }}>
            <PaymentBars
              otherLabel={format.otherMonthly()}
              sofiLabel={format.sofiMonthly()}
              otherValue={scenario.mortgage.otherMonthly}
              sofiValue={scenario.mortgage.sofiMonthly}
            />
          </div>
        </div>
        <p className={styles.line}>Same house. SoFi is the lender.</p>
        <div className={styles.spacer} />
        <CtaButton onClick={() => go("/done")}>
          Confirm {format.sofiApr()} mortgage
        </CtaButton>
      </div>
    </div>
  );
}
