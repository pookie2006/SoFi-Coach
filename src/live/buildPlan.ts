import {
  barcelona,
  barcelonaLoanMonthly,
  depositFromChecking,
  statementSoFiMonthly,
  studentStatement,
} from "../data/ambition";
import {
  aprPct,
  liveAccount,
  money,
  moneyExact,
  monthlyPayment,
  type RiskLevel,
} from "../data/liveAccount";
import type { CatalogItem } from "../data/liveCatalog";
import { scenario } from "../data/scenario";
import {
  PAY_IN_4_MAX,
  PERSONAL_LOAN_MAX,
  PERSONAL_LOAN_MIN,
  canPayCash,
  canUseCard,
  canUseCashOut,
  canUseHeloc,
  canUseHomeEquity,
  canUseMortgage,
  canUsePayIn4,
  canUsePersonalLoan,
  inferPurchaseKind,
} from "./sofiRoutes";

export type StepKind =
  | "loan"
  | "cash"
  | "card"
  | "payIn4"
  | "mortgage"
  | "heloc"
  | "homeEquity"
  | "cashOut"
  | "student"
  | "studentRefi"
  | "etf"
  | "stocks"
  | "crypto";

export type PlanStep = {
  id: string;
  kind: StepKind;
  exclusiveGroup?: "buy";
  title: string;
  detail: string;
  amount: number;
  monthly?: number;
  defaultOn: boolean;
  disabled?: boolean;
};

function loanMonthsFor(price: number) {
  if (price >= 15_000) return 60;
  if (price >= 5_000) return 36;
  return 24;
}

function skipInvest(
  kind: ReturnType<typeof inferPurchaseKind>,
) {
  return kind === "home" || kind === "tuition" || kind === "studentRefi";
}

function loftMortgage(): PlanStep {
  return {
    id: "mortgage",
    kind: "mortgage",
    exclusiveGroup: "buy",
    title: `SoFi mortgage for ${scenario.listing.address}`,
    detail: `${money(scenario.mortgage.loanAmount)} at ${aprPct(scenario.mortgage.sofiApr)} · 30-year fixed · 20% down ${money(scenario.mortgage.downPayment)} · ~${money(scenario.mortgage.sofiMonthly)}/mo. SoFi originates it.`,
    amount: scenario.mortgage.loanAmount,
    monthly: scenario.mortgage.sofiMonthly,
    defaultOn: true,
  };
}

function tuitionGapPlan(): PlanStep[] {
  const deposit = depositFromChecking();
  const gapMonthly = barcelonaLoanMonthly();
  return [
    {
      id: "deposit",
      kind: "cash",
      title: "Pay the deposit from checking",
      detail: `Debit ${money(deposit)} toward the ${money(barcelona.deposit)} deposit. Keeps ${money(liveAccount.cashBuffer)} in checking.`,
      amount: deposit,
      defaultOn: true,
    },
    {
      id: "student",
      kind: "student",
      title: "SoFi in-school loan for the gap",
      detail: `${money(barcelona.gap)} at ${aprPct(liveAccount.studentApr)} · ${barcelona.loanMonths / 12} years · ~${moneyExact(gapMonthly)}/mo. SoFi originates it.`,
      amount: barcelona.gap,
      monthly: gapMonthly,
      defaultOn: true,
    },
    studentRefiStep(false),
  ];
}

function studentRefiStep(defaultOn: boolean): PlanStep {
  const monthly = statementSoFiMonthly();
  return {
    id: "studentRefi",
    kind: "studentRefi",
    title: `Refinance existing student loans`,
    detail: `${money(studentStatement.balance)} at ${aprPct(liveAccount.studentApr)} · ${studentStatement.months / 12} years · ~${moneyExact(monthly)}/mo. SoFi refinances it.`,
    amount: studentStatement.balance,
    monthly,
    defaultOn,
  };
}

export function buildPlan(item: CatalogItem, risk: RiskLevel = liveAccount.risk) {
  const price = item.price;
  const kind = inferPurchaseKind(item);
  const cash = liveAccount.cash;
  const cashOk = canPayCash(price);
  const leftover = cashOk ? cash - price : 0;
  const investToward = Math.min(400, Math.max(150, Math.round(cash * 0.12)));

  if (kind === "studentRefi") {
    return [studentRefiStep(true)];
  }

  if (kind === "tuition") {
    return tuitionGapPlan();
  }

  const buy: PlanStep[] = [];

  if (kind === "home" && canUseMortgage(price)) {
    buy.push(loftMortgage());
    buy.push({
      id: "cash",
      kind: "cash",
      exclusiveGroup: "buy",
      title: "Pay cash from checking",
      detail: `You have ${money(cash)}. The listing is ${money(price)}. Cash alone does not clear it.`,
      amount: price,
      defaultOn: false,
      disabled: true,
    });
    return buy;
  }

  if (kind === "homeImprovement") {
    if (canUseHeloc(price)) {
      const monthly = (price * liveAccount.helocApr) / 12;
      buy.push({
        id: "heloc",
        kind: "heloc",
        exclusiveGroup: "buy",
        title: `SoFi HELOC for the ${item.name}`,
        detail: `${money(price)} variable line at ${aprPct(liveAccount.helocApr)} · ~${moneyExact(monthly)}/mo interest-only to start. SoFi originates it.`,
        amount: price,
        monthly,
        defaultOn: false,
      });
    }
    if (canUseHomeEquity(price)) {
      const months = 120;
      const monthly = monthlyPayment(price, liveAccount.homeEquityApr, months);
      buy.push({
        id: "homeEquity",
        kind: "homeEquity",
        exclusiveGroup: "buy",
        title: `SoFi home equity loan for the ${item.name}`,
        detail: `${money(price)} fixed at ${aprPct(liveAccount.homeEquityApr)} · ${months / 12} years · ~${moneyExact(monthly)}/mo. SoFi originates it.`,
        amount: price,
        monthly,
        defaultOn: false,
      });
    }
    if (canUseCashOut(price)) {
      const monthly = monthlyPayment(price, liveAccount.mortgageApr, 360);
      buy.push({
        id: "cashOut",
        kind: "cashOut",
        exclusiveGroup: "buy",
        title: `Cash-out refinance for the ${item.name}`,
        detail: `Replace the mortgage and take ${money(price)} cash at ${aprPct(liveAccount.mortgageApr)}. SoFi originates the refinance.`,
        amount: price,
        monthly,
        defaultOn: false,
      });
    }
  }

  const allowPersonalLoan =
    kind === "debt" || kind === "homeImprovement" || kind === "retail";

  if (allowPersonalLoan && price >= PERSONAL_LOAN_MIN && price <= PERSONAL_LOAN_MAX) {
    const months = loanMonthsFor(price);
    const monthly = monthlyPayment(price, liveAccount.personalLoanApr, months);
    const directPay =
      kind === "debt"
        ? " Direct Pay to creditors knocks 0.25% off the APR."
        : "";
    buy.push({
      id: "loan",
      kind: "loan",
      exclusiveGroup: "buy",
      title:
        kind === "debt"
          ? "SoFi personal loan · Direct Pay"
          : `Personal loan for the ${item.name}`,
      detail: `${money(price)} at ${aprPct(liveAccount.personalLoanApr)} · ${months} months · ~${moneyExact(monthly)}/mo. SoFi originates it.${directPay}`,
      amount: price,
      monthly,
      defaultOn: false,
      disabled: !canUsePersonalLoan(price),
    });
  }

  if (kind !== "home") {
    if (price <= PAY_IN_4_MAX) {
      const installment = price / 4;
      buy.push({
        id: "payIn4",
        kind: "payIn4",
        exclusiveGroup: "buy",
        title: `Pay in 4 for the ${item.name}`,
        detail: `${money(price)} split into 4 interest-free payments of ${moneyExact(installment)} every two weeks. SoFi virtual card.`,
        amount: price,
        monthly: installment,
        defaultOn: false,
        disabled: !canUsePayIn4(price),
      });
    }

    buy.push({
      id: "card",
      kind: "card",
      exclusiveGroup: "buy",
      title: `SoFi credit card for the ${item.name}`,
      detail: canUseCard(price)
        ? `${money(price)} on your SoFi card · ${money(liveAccount.creditAvailable)} available. Rewards back into SoFi.`
        : `${money(price)} needs ${money(liveAccount.creditAvailable)} card room. The card alone does not clear it.`,
      amount: price,
      defaultOn: false,
      disabled: !canUseCard(price),
    });
  }

  buy.push({
    id: "cash",
    kind: "cash",
    exclusiveGroup: "buy",
    title: "Pay cash from checking",
    detail: cashOk
      ? `Debit ${money(price)} from ${money(cash)} available. Keeps you out of a loan.`
      : `You have ${money(cash)}. The ${item.name} is ${money(price)}. Cash alone does not clear it.`,
    amount: price,
    defaultOn: false,
    disabled: !cashOk,
  });

  const preferred =
    buy.find((step) => step.id === "mortgage" && !step.disabled) ??
    buy.find((step) => step.id === "student" && !step.disabled) ??
    buy.find((step) => step.id === "loan" && kind === "debt" && !step.disabled) ??
    buy.find((step) => step.id === "heloc" && !step.disabled) ??
    buy.find((step) => step.id === "homeEquity" && !step.disabled) ??
    buy.find((step) => step.id === "cash" && !step.disabled) ??
    buy.find((step) => step.id === "payIn4" && !step.disabled) ??
    buy.find((step) => step.id === "card" && !step.disabled) ??
    buy.find((step) => step.id === "loan" && !step.disabled);

  if (preferred) preferred.defaultOn = true;

  if (skipInvest(kind)) return buy;

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

  return [...buy, etf, stocks, crypto];
}

export function executionLine(step: PlanStep) {
  switch (step.kind) {
    case "loan":
      return `Originating a ${money(step.amount)} personal loan at ${aprPct(liveAccount.personalLoanApr)}.`;
    case "cash":
      return `Debiting ${money(step.amount)} from checking.`;
    case "card":
      return `Charging ${money(step.amount)} to your SoFi credit card.`;
    case "payIn4":
      return `Opening Pay in 4 — four interest-free payments of ${moneyExact(step.amount / 4)}.`;
    case "mortgage":
      return `Originating a ${money(step.amount)} SoFi mortgage at ${aprPct(scenario.mortgage.sofiApr)}.`;
    case "heloc":
      return `Opening a ${money(step.amount)} SoFi HELOC at ${aprPct(liveAccount.helocApr)}.`;
    case "homeEquity":
      return `Originating a ${money(step.amount)} SoFi home equity loan at ${aprPct(liveAccount.homeEquityApr)}.`;
    case "cashOut":
      return `Originating a cash-out refinance for ${money(step.amount)}.`;
    case "student":
      return `Originating a ${money(step.amount)} SoFi student loan at ${aprPct(liveAccount.studentApr)}.`;
    case "studentRefi":
      return `Refinancing the ${money(step.amount)} student loan at ${aprPct(liveAccount.studentApr)}.`;
    case "etf":
      return `Allocating ${money(step.amount)} across ETFs.`;
    case "stocks":
      return `Buying ${money(step.amount)} in stocks.`;
    case "crypto":
      return `Booking ${money(step.amount)} in the optional crypto sleeve.`;
  }
}

export function doneCopy(item: CatalogItem) {
  const kind = inferPurchaseKind(item);
  if (kind === "home") {
    return {
      kicker: "Posted",
      title: `SoFi originated the ${money(scenario.mortgage.loanAmount)} mortgage.`,
    };
  }
  if (kind === "tuition") {
    return {
      kicker: "Posted",
      title: "SoFi originated the Barcelona gap.",
    };
  }
  if (kind === "studentRefi") {
    return {
      kicker: "Posted",
      title: "SoFi refinanced the student loan.",
    };
  }
  return {
    kicker: "Posted",
    title: "SoFi did the job.",
  };
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
