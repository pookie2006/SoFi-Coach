import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HouseDiagram } from "../components/Diagrams";
import { CtaButton, SofiHeader } from "../components/StatusBar";
import { format } from "../data/scenario";
import { useStaticMode } from "../useStaticMode";
import styles from "./sofi.module.css";

export function ProcessingScreen() {
  const { isStatic, go } = useStaticMode();
  const location = useLocation();

  useEffect(() => {
    if (isStatic || location.pathname !== "/processing") return;
    const id = window.setTimeout(() => go("/execute"), 1200);
    return () => window.clearTimeout(id);
  }, [go, isStatic, location.pathname]);

  return (
    <div className={styles.screen}>
      <SofiHeader onBack={() => go("/share")} />
      <div className={styles.body}>
        <HouseDiagram />
        <h1 className={styles.title}>Home to finance</h1>
        <p className={styles.subtitle}>Recognized from your screenshot</p>
        <div className={styles.rows}>
          <div className={styles.row}>
            <span>Address</span>
            <span>{format.address()}</span>
          </div>
          <div className={styles.row}>
            <span>Price</span>
            <span>{format.price()}</span>
          </div>
          <div className={styles.row}>
            <span>Loan</span>
            <span>{format.loanAmount()}</span>
          </div>
          <div className={styles.row}>
            <span>Term</span>
            <span>{format.term()}</span>
          </div>
        </div>
        <p className={styles.caption}>{format.buildingCaption()}</p>
        <p className={styles.caption}>SoFi can originate this mortgage.</p>
        <div className={styles.spacer} />
        <CtaButton onClick={() => go("/execute")}>Continue</CtaButton>
      </div>
    </div>
  );
}
