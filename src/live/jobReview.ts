import {
  barcelona,
  barcelonaLoanMonthly,
  statementSoFiMonthly,
  statementTheirMonthly,
  studentStatement,
} from "../data/ambition";
import { aprPct, liveAccount, money } from "../data/liveAccount";
import type { CatalogItem } from "../data/liveCatalog";
import { format, scenario } from "../data/scenario";

export type ReviewPick = {
  id: string;
  title: string;
  display: string;
  source: string;
};

export type ReviewModel = {
  kicker: string;
  name: string;
  details?: string;
  heroLabel: string;
  band: string;
  section: string;
  continueLabel: string;
  picks: ReviewPick[];
  defaultId: string;
  image?: string;
  banner: "listing" | "abroad" | "document" | "object";
};

export function workingLines(item: CatalogItem): string[] {
  if (item.id === "loft") {
    return ["Reading the listing…", "Comparing their estimate to SoFi…"];
  }
  if (item.id === "barcelona") {
    return ["Reading the program…", "Netting school aid…"];
  }
  if (item.id === "statement") {
    return ["Reading the statement…", "Pricing the refinance…"];
  }
  return [`Pricing the ${item.name}…`, "Writing a SoFi plan…"];
}

export function reviewForJob(item: CatalogItem): ReviewModel {
  if (item.id === "loft") {
    return {
      kicker: `${scenario.listing.building} · ${scenario.listing.neighborhood}`,
      name: scenario.listing.address,
      details: format.bedsBathsLoft(),
      heroLabel: "pick the reading SoFi will use",
      band: `Their ${format.otherApr()} · SoFi ${format.sofiApr()}`,
      section: "Comparable readings",
      continueLabel: "Use this reading",
      banner: "listing",
      defaultId: "list",
      picks: [
        {
          id: "list",
          title: "Listing price",
          display: format.price(),
          source: "Zillow card",
        },
        {
          id: "sofi",
          title: "SoFi finances it",
          display: `${format.sofiMonthly()}`,
          source: `${format.sofiApr()} · ${format.monthlySave()}/mo less`,
        },
        {
          id: "their",
          title: "Their estimate",
          display: format.otherMonthly(),
          source: format.otherApr(),
        },
      ],
    };
  }

  if (item.id === "barcelona") {
    return {
      kicker: `${barcelona.school} · study abroad`,
      name: barcelona.program,
      details: "Aid already awarded. SoFi covers the gap.",
      heroLabel: "pick the reading SoFi will use",
      band: `${money(barcelona.sticker)} sticker · ${money(barcelona.grant)} grant`,
      section: "Comparable readings",
      continueLabel: "Use this reading",
      banner: "abroad",
      defaultId: "gap",
      picks: [
        {
          id: "gap",
          title: "Left after aid",
          display: `${money(barcelona.gap)} left`,
          source: "SoFi originates this",
        },
        {
          id: "sticker",
          title: "Program sticker",
          display: money(barcelona.sticker),
          source: "Tuition + housing + fee",
        },
        {
          id: "grant",
          title: "University grant",
          display: money(barcelona.grant),
          source: barcelona.school,
        },
        {
          id: "loan",
          title: "SoFi in-school payment",
          display: `~${money(Math.round(barcelonaLoanMonthly()))}/mo`,
          source: aprPct(liveAccount.studentApr),
        },
      ],
    };
  }

  if (item.id === "statement") {
    return {
      kicker: "Servicer statement",
      name: "Student loan statement",
      details: `Remaining ${money(studentStatement.balance)}`,
      heroLabel: "pick the reading SoFi will use",
      band: `Their ${aprPct(studentStatement.theirApr)} · SoFi ${aprPct(liveAccount.studentApr)}`,
      section: "Comparable readings",
      continueLabel: "Use this reading",
      banner: "document",
      defaultId: "sofi",
      picks: [
        {
          id: "sofi",
          title: "SoFi refinance",
          display: `~${money(Math.round(statementSoFiMonthly()))}/mo`,
          source: aprPct(liveAccount.studentApr),
        },
        {
          id: "their",
          title: "Their payment",
          display: `~${money(Math.round(statementTheirMonthly()))}/mo`,
          source: aprPct(studentStatement.theirApr),
        },
        {
          id: "balance",
          title: "Remaining balance",
          display: money(studentStatement.balance),
          source: "Statement",
        },
      ],
    };
  }

  return reviewForObject(item);
}

export function reviewForObject(item: CatalogItem): ReviewModel {
  const typical = money(item.price);
  const high = money(item.streetHigh || item.price);
  return {
    kicker: item.brand,
    name: item.name,
    details: item.blurb,
    heroLabel: "pick the most accurate price",
    band: `${typical} typical · ${high} high`,
    section: "Comparable listings",
    continueLabel: "Use this price",
    banner: "object",
    image: item.image,
    defaultId: "typical",
    picks: [
      {
        id: "typical",
        title: "Typical from live comps",
        display: typical,
        source: item.source,
      },
      {
        id: "high",
        title: "Street high",
        display: high,
        source: "Range top",
      },
    ],
  };
}

export function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/** Shorter lines move faster. */
export function lineHold(line: string) {
  const words = line.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(560, Math.max(220, 140 + words * 70));
}
