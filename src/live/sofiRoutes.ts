import type { CatalogItem, PurchaseKind } from "../data/liveCatalog";
import { liveAccount } from "../data/liveAccount";

export const PAY_IN_4_MAX = 2_000;
export const PERSONAL_LOAN_MIN = 5_000;
export const PERSONAL_LOAN_MAX = 100_000;
export const MORTGAGE_MIN = 75_000;
export const HELOC_MIN = 50_000;

export function inferPurchaseKind(item: CatalogItem): PurchaseKind {
  if (item.purchaseKind) return item.purchaseKind;

  const hay = [
    item.id,
    item.name,
    item.brand,
    item.category,
    item.identifiedAs,
    item.blurb,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    /\b(tuition|university|college|semester|student loan|parent plus|law school|mba tuition)\b/.test(
      hay,
    )
  ) {
    return "tuition";
  }
  if (
    /\b(credit card consolidation|card balance|consolidat(?:e|ion)(?:\s+debt)?)\b/.test(
      hay,
    )
  ) {
    return "debt";
  }
  if (
    /\b(renovat|remodel|home improvement|kitchen remodel|bath remodel)\b/.test(
      hay,
    )
  ) {
    return "homeImprovement";
  }
  if (
    /\b(house|home listing|real estate|condo|loft|mortgage|zillow|apartment|townhouse|single.family)\b/.test(
      hay,
    ) ||
    (item.price >= MORTGAGE_MIN && /\b(home|house|unit \d)\b/.test(hay))
  ) {
    return "home";
  }
  return "retail";
}

export function canPayCash(price: number) {
  return liveAccount.cash >= price;
}

export function canUseCard(price: number) {
  return liveAccount.creditAvailable >= price;
}

export function canUsePayIn4(price: number) {
  return liveAccount.payIn4Eligible && price > 0 && price <= PAY_IN_4_MAX;
}

export function canUsePersonalLoan(price: number) {
  return (
    price >= PERSONAL_LOAN_MIN &&
    price <= PERSONAL_LOAN_MAX &&
    price <= liveAccount.personalLoanLimit
  );
}

export function canUseMortgage(price: number) {
  return price >= MORTGAGE_MIN;
}

export function canUseHeloc(price: number) {
  return liveAccount.ownsHome && price >= HELOC_MIN;
}

export function canUseHomeEquity(price: number) {
  return liveAccount.ownsHome && price > 0;
}

export function canUseCashOut(price: number) {
  return liveAccount.ownsHome && price >= HELOC_MIN;
}
