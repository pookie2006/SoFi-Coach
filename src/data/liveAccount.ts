export const riskLabels = {
  conservative: "Conservative",
  moderate: "Moderate",
  aggressive: "Aggressive",
} as const;

export type RiskLevel = keyof typeof riskLabels;

export const liveAccount = {
  name: "Judge member",
  memberSince: "2023",
  school: "UC Davis",
  cash: 1_640,
  cashBuffer: 400,
  brokerage: 12_840,
  creditAvailable: 5_500,
  personalLoanLimit: 20_000,
  personalLoanApr: 0.1149,
  mortgageApr: 0.06,
  helocApr: 0.074,
  homeEquityApr: 0.0699,
  studentApr: 0.0549,
  existingStudentBalance: 17_150,
  ownsHome: false,
  payIn4Eligible: true,
  risk: "moderate" as RiskLevel,
};

export const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const usd2 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function money(n: number) {
  return usd0.format(n);
}

export function moneyExact(n: number) {
  return usd2.format(n);
}

export function aprPct(rate: number) {
  return `${(rate * 100).toFixed(2)}%`;
}

export function monthlyPayment(principal: number, annual: number, months: number) {
  const r = annual / 12;
  if (r === 0) return principal / months;
  return (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1);
}
