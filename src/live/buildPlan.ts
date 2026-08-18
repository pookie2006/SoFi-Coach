import {
  aprPct,
  liveAccount,
  money,
  moneyExact,
  monthlyPayment,
  type RiskLevel,
} from "../data/liveAccount";
import type { CatalogItem } from "../data/liveCatalog";

export type StepKind = "loan" | "cash" | "etf" | "stocks" | "crypto";

export type PlanStep = {
  id: string;
  kind: StepKind;
  exclusiveGroup?: "buy";
  title: string;
  detail: string;
  amount: number;
  monthly?: number;
  defaultOn: boolean;
};

export function buildPlan(item: CatalogItem, risk: RiskLevel = liveAccount.risk) {
  const cash = liveAccount.cash;
  const canPayCash = cash >= item.price;
  const loanMonths = item.price >= 1_000 ? 24 : 12;
  const loanMonthly = monthlyPayment(
    item.price,
    liveAccount.personalLoanApr,
    loanMonths,
  );
  const leftover = canPayCash ? cash - item.price : 0;
  const investToward = Math.min(400, Math.max(150, Math.round(cash * 0.12)));

  const buyLoan: PlanStep = {
    id: "loan",
    kind: "loan",
    exclusiveGroup: "buy",
    title: `Personal loan for the ${item.name}`,
    detail: `${money(item.price)} at ${aprPct(liveAccount.personalLoanApr)} · ${loanMonths} months · ~${moneyExact(loanMonthly)}/mo. SoFi originates it.`,
    amount: item.price,
    monthly: loanMonthly,
    defaultOn: !canPayCash,
  };

  const buyCash: PlanStep = {
    id: "cash",
    kind: "cash",
    exclusiveGroup: "buy",
    title: `Pay cash from checking`,
    detail: canPayCash
      ? `Debit ${money(item.price)} from ${money(cash)} available. Keeps you out of a loan.`
      : `You have ${money(cash)}. The ${item.name} is ${money(item.price)}. Cash alone does not clear it.`,
    amount: item.price,
    defaultOn: canPayCash,
  };

  const etfAmount = leftover > 0 ? leftover : investToward;
  const etfMix =
    risk === "conservative"
      ? "80% bond ETF · 20% S&P 500 ETF"
      : risk === "aggressive"
        ? "20% bonds · 50% S&P 500 ETF · 30% growth stocks"
        : "20% bonds · 70% S&P 500 ETF · 10% international ETF";

  const etf: PlanStep = {
    id: "etf",
    kind: "etf",
    title: leftover > 0 ? "Invest the leftover in ETFs" : "Invest a slice toward the next buy",
    detail: `${money(etfAmount)} into ${etfMix}. SoFi allocates it to your ${risk} profile.`,
    amount: etfAmount,
    defaultOn: true,
  };

  const stockAmount = Math.round(etfAmount * 0.35);
  const stocks: PlanStep = {
    id: "stocks",
    kind: "stocks",
    title: "Add an individual-stock sleeve",
    detail: `${money(stockAmount)} in large-cap names SoFi can buy in the brokerage. On for aggressive; optional otherwise.`,
    amount: stockAmount,
    defaultOn: risk === "aggressive",
  };

  const cryptoAmount = Math.round(etfAmount * 0.15);
  const crypto: PlanStep = {
    id: "crypto",
    kind: "crypto",
    title: "Optional crypto sleeve",
    detail: `${money(cryptoAmount)} high-risk sleeve. Off unless you turn it on. Demo only — not a default SoFi action.`,
    amount: cryptoAmount,
    defaultOn: false,
  };

  return [buyLoan, buyCash, etf, stocks, crypto];
}

export function applyExclusiveToggle(
  steps: PlanStep[],
  approved: Record<string, boolean>,
  id: string,
  next: boolean,
) {
  const copy = { ...approved, [id]: next };
  const target = steps.find((step) => step.id === id);
  if (next && target?.exclusiveGroup) {
    for (const step of steps) {
      if (step.exclusiveGroup === target.exclusiveGroup && step.id !== id) {
        copy[step.id] = false;
      }
    }
  }
  return copy;
}

export function approvedSteps(steps: PlanStep[], approved: Record<string, boolean>) {
  return steps.filter((step) => approved[step.id]);
}

export function seedApproved(steps: PlanStep[]) {
  return Object.fromEntries(steps.map((step) => [step.id, step.defaultOn]));
}
