import { format } from "./scenario";
import {
  aprPct,
  liveAccount,
  money,
  monthlyPayment,
} from "./liveAccount";

export const barcelona = {
  program: "Barcelona Studio Semester",
  school: "UC Davis",
  sticker: 18_400,
  grant: 7_600,
  gap: 10_800,
  deposit: 2_200,
  loanMonths: 120,
} as const;

export const studentStatement = {
  balance: 17_150,
  theirApr: 0.0899,
  months: 120,
} as const;

export function depositFromChecking() {
  return Math.min(
    Math.max(0, liveAccount.cash - liveAccount.cashBuffer),
    barcelona.deposit,
  );
}

export function barcelonaLoanMonthly() {
  return monthlyPayment(
    barcelona.gap,
    liveAccount.studentApr,
    barcelona.loanMonths,
  );
}

export function statementSoFiMonthly() {
  return monthlyPayment(
    studentStatement.balance,
    liveAccount.studentApr,
    studentStatement.months,
  );
}

export function statementTheirMonthly() {
  return monthlyPayment(
    studentStatement.balance,
    studentStatement.theirApr,
    studentStatement.months,
  );
}

export const jobCards = [
  {
    id: "loft",
    eyebrow: "Listing",
    title: "SoMa loft",
    hero: `${format.monthlySave()}/mo`,
    sub: "SoFi originates the mortgage",
  },
  {
    id: "barcelona",
    eyebrow: "Study abroad · aid applied",
    title: barcelona.program,
    hero: `${money(barcelona.gap)} left`,
    sub: "Deposit + in-school loan",
  },
  {
    id: "statement",
    eyebrow: "Document",
    title: "Student loan statement",
    hero: `${money(Math.round(statementSoFiMonthly()))}/mo`,
    sub: "SoFi refinances it",
  },
] as const;

export function barcelonaRows() {
  return [
    { label: "Sticker", value: money(barcelona.sticker) },
    { label: "University grant", value: money(barcelona.grant) },
    { label: "Left after aid", value: money(barcelona.gap) },
    { label: "Deposit due now", value: money(barcelona.deposit) },
    {
      label: `SoFi in-school · ${aprPct(liveAccount.studentApr)}`,
      value: `~${money(Math.round(barcelonaLoanMonthly()))}/mo`,
    },
  ];
}

export function loftRows() {
  return [
    { label: "Their estimate", value: `${format.otherApr()} · ${format.otherMonthly()}` },
    { label: "SoFi", value: `${format.sofiApr()} · ${format.sofiMonthly()}` },
    { label: "Loan", value: format.loanAmount() },
    { label: "20% down", value: format.downPayment() },
  ];
}

export function statementRows() {
  return [
    { label: "Remaining balance", value: money(studentStatement.balance) },
    {
      label: `Their ${aprPct(studentStatement.theirApr)}`,
      value: `~${money(Math.round(statementTheirMonthly()))}/mo`,
    },
    {
      label: `SoFi ${aprPct(liveAccount.studentApr)}`,
      value: `~${money(Math.round(statementSoFiMonthly()))}/mo`,
    },
  ];
}
