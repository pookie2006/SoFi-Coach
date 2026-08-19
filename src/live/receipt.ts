import { liveAccount, money, moneyExact } from "../data/liveAccount";
import type { CatalogItem } from "../data/liveCatalog";
import { executionLine, type PlanStep } from "./buildPlan";

function stamp(seed: string) {
  let n = 2166136261;
  for (const ch of seed) n = Math.imul(n ^ ch.charCodeAt(0), 16777619);
  return (n >>> 0).toString(16).slice(-4).toUpperCase().padStart(4, "0");
}

export function confirmationId(item: CatalogItem) {
  return `SOFI-${stamp(item.id).slice(0, 4)}-${stamp(item.name).slice(0, 4)}`;
}

export function postedAt() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export type ProofLine = {
  id: string;
  verb: string;
  amount: string;
  ref: string;
  detail: string;
};

export function proofLine(step: PlanStep, item: CatalogItem): ProofLine {
  const refBase = stamp(`${item.id}-${step.id}`);
  switch (step.kind) {
    case "mortgage":
      return {
        id: step.id,
        verb: "Originated",
        amount: money(step.amount),
        ref: `Loan SOFI-MTG-${refBase}`,
        detail: `30-year fixed. First draft disclosures queued. ${executionLine(step)}`,
      };
    case "cash":
      return {
        id: step.id,
        verb: "Debited",
        amount: money(step.amount),
        ref: `Checking ••••${String(liveAccount.cash).slice(-4)}`,
        detail: `Posted to ${item.name}. ${money(liveAccount.cashBuffer)} left as buffer.`,
      };
    case "student":
      return {
        id: step.id,
        verb: "Originated",
        amount: money(step.amount),
        ref: `App SOFI-SL-${refBase}`,
        detail: `In-school loan. Disburses to the school on the next cycle.`,
      };
    case "studentRefi":
      return {
        id: step.id,
        verb: "Refinanced",
        amount: money(step.amount),
        ref: `Loan SOFI-RF-${refBase}`,
        detail: `Payoff sent to the current servicer. New payment ~${moneyExact(step.monthly ?? 0)}/mo.`,
      };
    case "loan":
      return {
        id: step.id,
        verb: "Originated",
        amount: money(step.amount),
        ref: `Loan SOFI-PL-${refBase}`,
        detail: executionLine(step),
      };
    case "card":
      return {
        id: step.id,
        verb: "Charged",
        amount: money(step.amount),
        ref: `Card ••••${String(liveAccount.creditAvailable).slice(-4)}`,
        detail: executionLine(step),
      };
    case "payIn4":
      return {
        id: step.id,
        verb: "Opened",
        amount: money(step.amount),
        ref: `Pay in 4 SOFI-P4-${refBase}`,
        detail: executionLine(step),
      };
    case "etf":
    case "stocks":
    case "crypto":
      return {
        id: step.id,
        verb: "Allocated",
        amount: money(step.amount),
        ref: `Brokerage SOFI-BR-${refBase}`,
        detail: executionLine(step),
      };
    default:
      return {
        id: step.id,
        verb: "Posted",
        amount: money(step.amount),
        ref: `SOFI-${refBase}`,
        detail: executionLine(step),
      };
  }
}
