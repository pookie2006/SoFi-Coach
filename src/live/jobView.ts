import {
  barcelona,
  barcelonaRows,
  loftRows,
  statementRows,
  statementSoFiMonthly,
} from "../data/ambition";
import { liveAccount, money } from "../data/liveAccount";
import type { CatalogItem } from "../data/liveCatalog";
import { format } from "../data/scenario";
import { inferPurchaseKind } from "./sofiRoutes";

export function planHeader(item: CatalogItem) {
  const kind = inferPurchaseKind(item);

  if (kind === "home") {
    return {
      kicker: item.source,
      title: item.name,
      hero: `${format.monthlySave()}/mo`,
      label: "less per month if SoFi finances this",
      rows: loftRows(),
      showRisk: false,
    };
  }

  if (kind === "tuition") {
    return {
      kicker: `${liveAccount.school} · ${item.source}`,
      title: item.name,
      hero: `${money(barcelona.gap)} left`,
      label: "after aid. SoFi originates the gap.",
      rows: barcelonaRows(),
      showRisk: false,
    };
  }

  if (kind === "studentRefi") {
    return {
      kicker: item.source,
      title: item.name,
      hero: `${money(Math.round(statementSoFiMonthly()))}/mo`,
      label: "if SoFi refinances this statement",
      rows: statementRows(),
      showRisk: false,
    };
  }

  return {
    kicker: item.source,
    title: item.name,
    hero: money(item.price),
    label: item.blurb,
    rows: [] as { label: string; value: string }[],
    showRisk: true,
  };
}
