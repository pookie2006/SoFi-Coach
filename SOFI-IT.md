# SoFi It — Project Spec

**Status:** locked for the six-screen prototype. Iterate challenges and Q&A answers later; do not reopen Part A.

**This file is the source of truth.** One document, two audiences:

| Audience | Read | Do |
|---|---|---|
| **Team** | Parts A and B | Share the concept, numbers, deck jobs, packets, risks, Q&A |
| **Cursor Agent** | Parts A and C | Implement the prototype. Skip Part B (slides, packets, Q&A). Do not invent a second product, stack, or number set. |

Next-agent prompt: **Read `SOFI-IT.md` and implement it.**

The product is **execution**, not analysis. If a screen only explains and does not set up SoFi *doing* the job, it is wrong.

---

# Part A — Product lock

Do not reopen. If a slide, screen, or argument does not serve this, cut it.

## A1. Concept

**SoFi It** is an execution feature. Screenshot a listing or a document, *or* tell SoFi what you want — SoFi **completes the job**: finances the house, originates the loan, invests to your industry and risk. The number on screen is the proof of what SoFi is about to do. Analysis is the pre-flight receipt, not the destination.

**Strategic claim:** Screenshot-and-ask already happens (“can I even afford this??”). Explainers stop at the answer. We intercept the ask and **do the thing**.

**Moat:** SoFi is the bank, the lender, and the brokerage. It can fund, allocate, and move money in the same tap. ChatGPT cannot. A bank that only reads its own paper cannot start from Zillow.

**Tagline:** Screenshot it. SoFi it. SoFi does it.

**Engine — one product, two doors**

```text
Share sheet ──┐
              ├──► Job engine ──► Finance it / Invest it / Lend it
Stated intent ┘
```

| Door | How it starts | What SoFi does |
|---|---|---|
| **Share** (hero, built end-to-end) | Maya shares a Zillow listing | Originates the mortgage |
| **Intent** (same engine, breadth only) | “Invest in clean energy, moderate risk” / “I need an auto loan” | Allocates the portfolio / originates the loan |

Do not build a second full intent flow. Breadth cards prove the second door.

## A2. Locked calls

| Decision | Call | Why |
|---|---|---|
| Hero job | Home financing from a Zillow share | The thesis is “SoFi does it.” A listing SoFi can fund is the proof. |
| Hero visual | Phillips Building, 234 1st Street, SF — **fictional loft Unit 4B** | Judges will recognize SoFi HQ. The real building is **not for sale**. Do not claim it is. Photo + address are the hook. |
| Prototype fidelity | Static screens first, then click-through | Six finished screens are the guaranteed deliverable. The live demo must never depend on camera, network, Zillow, or OCR. |
| Demo person | Maya, 29 | Market can be broad. The demo is one named person. |
| Dual entry | Product is two doors; only share is built E2E | Intent is proven on `/breadth`, not as a second hero. |
| Stack | Vite + React + TypeScript | Fastest path to an iPhone-framed, screenshot-ready web prototype. |

## A3. Open — iterate later, do not block screens 1–6

These are known risks, not prototype blockers. **Do not build UI for either.**

1. **Conflict-of-interest posture** — open marketplace vs. SoFi-only with transparent market benchmarks. Sharper now: we are not a neutral decoder; we **execute SoFi products**. Still iterating. Does not change Maya’s six screens.
2. **Non-member cold-start flow** — working direction: non-members see the job SoFi *would* run; the tap to execute requires signup. Demo assumes Maya is a member.

## A4. Canonical numbers

Use these exact figures in the deck, the prototype, and any video. **Nobody invents replacements.** All UI amounts come from `src/data/scenario.ts` (see C5). Display tildes only where this table shows `~`.

Maya, 29. Group chat. Someone drops a Zillow link: a loft in the Phillips Building.

**Demo listing only.** The Phillips Building is SoFi’s San Francisco HQ. Unit 4B is fictional. Never say the HQ is on the market.

| Field | Value | Display |
|---|---|---|
| Address | `234 1st St, Unit 4B` | `234 1st St, Unit 4B` |
| Neighborhood | SoMa, San Francisco | `SoMa, San Francisco` |
| Building | Phillips Building | `Phillips Building` |
| Beds / baths | 2 / 2 | `2 bd · 2 ba` |
| Listing price | `1850000` | `$1,850,000` |
| Down payment | `370000` (20%) | `$370,000` |
| Loan amount | `1480000` | `$1,480,000` |
| Term | `360` months | `30-year fixed` |
| Other-lender / Zillow APR | `0.07125` | `7.125%` |
| Other monthly | `9975` | `~$9,975/mo` |
| SoFi APR | `0.06` | `6.00%` |
| SoFi monthly | `8873` | `~$8,873/mo` |
| **Real Number (monthly save)** | `1100` | **`$1,100`** |
| Lifetime save | `397000` | `~$397,000` |

`$1,100` is the emotional payload of the pitch. Every design decision on screen 4 serves making that number land *as the reason to let SoFi finance it*.

Finance owns a later amortization + public SoFi mortgage-rate check. Exact 30-year P&I on `$1,480,000` is about `$9,971` vs `$8,873` (`$1,098` / `~$395,000`). **Until Finance updates `scenario.ts` once and tells everyone, the display set above stands.**

## A5. Scope

**In**

- Consumer execution feature
- Two doors (share + intent), one engine
- One hero job end-to-end (Zillow → SoFi originates the mortgage)
- Breadth montage of four *completed jobs* (cards, not flows)
- Adoption story, success metrics, competitive moat (deck only)

**Out** — say this on a slide; it reads as discipline, not a gap

- Commercial / whole-building purchase of HQ
- Tax filing
- Underwriting model internals
- International
- Real OCR, camera, share-sheet API, Zillow API, auth, or backend
- Discretionary-invest compliance deep dive
- Marketplace-vs-SoFi-only UI
- Non-member paywall
- Pitch-deck generator, video, or analytics
- A second hero path

---

# Part B — Pitch + team

Shareable with the team. **The agent does not build this.**

Team of 4 · SoFi case competition · ~2 days.

## B1. Deck — 12 content slides

Intro slide (names, photos, school) and agenda do **not** count against the 10–15 limit. The brief requires the intro slide — do not forget it.

| # | Slide | Job |
|---|---|---|
| 1 | The Hook | Maya, the Phillips listing in the chat, “is this even possible??” Land the feeling before the concept. No statistics. Judges should recognize the building. |
| 2 | The Insight | People already screenshot listings and ask. Nothing *does* the next step. Show the behavior, not research stats. |
| 3 | Why Nobody Owns This | Explainers cannot fund. Banks cannot start from Zillow. Landscape as an opening, not a table. |
| 4 | The Solution: SoFi It | Two taps, two doors, one engine: **SoFi does it.** One-sentence slide. |
| 5–7 | The Demo | Hero flow end-to-end. Three beats: listing → SoFi understands the job → SoFi finances it. |
| 8 | Breadth | Four *jobs completed*, fast: auto loan originated; industry+risk portfolio invested; 401(k) rolled; student loan refinanced. |
| 9 | Why Only SoFi | Vertical integration: originate, allocate, move money. Verified member data. |
| 10 | The ChatGPT Slide | Name the objection first. ChatGPT can describe the listing. It cannot underwrite or wire funds. |
| 11 | Adoption & Growth | Share sheet + group chat + intent box. Cold start. Watchlist = SoFi keeps doing the job. |
| 12 | Metrics & Roadmap | North Star + 4 supporting metrics + 3 phases. |

**Close on the tagline:** Screenshot it. SoFi it. SoFi does it.

**Timing**

- ~45 seconds per slide average
- Slides 5–7 get **2.5 minutes total**
- Slide 4 gets **30 seconds**
- Rehearse against a timer. Running over is one of the few things the brief explicitly warns about.

**Slide 5–7 screenshot pairing (from the running prototype)**

| Slide | Screens |
|---|---|
| 5 | Screens 1–2 paired (source + share sheet) |
| 6 | Screen 4 solo (execute + `$1,100`) |
| 7 | Screens 5–6 paired (originate + confirmation) |

## B2. Work packets — all four run in parallel

Everyone answers questions on any slide. Judges ask the person who did not present a section.

### Designer — prototype (longest pole)

**Owns:** slides 4–8 visually; the six-screen build (via this repo / the agent).

**Start now.** Not blocked by open decisions.

Build the six screens in Part C, static first, then click-through. Post screens 1–4 for group review; **screen 4 is the review that matters.** Plus four rough completed-job cards for slide 8.

**Not this packet:** conflict-of-interest UI, cold-start / paywall, competing-lender marketplace, a second hero flow.

### Finance / Business — numbers, metrics, roadmap

**Owns:** slides 11–12 and the closing line.

- Verify Maya’s mortgage math. Run amortization on both rates. If `$1,100` / `~$397,000` is off, correct `scenario.ts` and tell everyone immediately.
- Check the SoFi rate against a **current public** SoFi mortgage ballpark. Do not invent a rate in the room.
- Pull **current** SoFi figures from the most recent earnings release: member count, products per member, growth rate. Do not use memory or an AI. A wrong number in front of SoFi employees is worse than no number.
- **North Star:** jobs SoFi completed per member per quarter (measures the verb *do*, not the app).
- **Exactly four supporting metrics:** share-sheet activation rate (installed → first use); share-or-intent → execute conversion; non-member → member conversion from a job preview; cumulative dollars SoFi put to work or saved by executing (the PR number).
- **Roadmap.** Phase 1: hero job (home finance), existing members. Phase 2: breadth of jobs + intent door + non-member acquisition. Phase 3: watchlist and proactive execution — the verb without the screenshot.
- Revenue model in two sentences, ready for Q&A (see B4 #6).

### Engineer — feasibility and moat

**Owns:** slides 9–10 and all technical Q&A.

- **Three named jobs. Never say “AI-powered.”** **See it** (read a listing, a document, or an intent). **Price it** (member-qualified rate or allocation vs. the market). **Do it** (originate, allocate, move money). **Do it is the product.**
- **ChatGPT slide, three steps:** no data → generic “here’s how mortgages work.” You give it the listing → privacy risk, still an opinion it cannot fund. SoFi already has the member → specific quote, and there is a button that originates.
- **Accuracy failure mode:** blurry screenshots, partial listings, glare → confidence threshold routes to human review rather than guessing a payment.
- **Why not Chase or Apple:** vertical integration. SoFi does not route you to a lender; it is the lender *and* the brokerage — quote and execute in the same second. An AI company would have to build a bank.

### Presenter A — narrative and open

**Owns:** slides 1–3. Sets emotional tone.

- **Hook:** Maya in the group chat. The Phillips Building on Zillow. “Is this even possible??” Feeling before concept. No statistics on slide 1. Let the room recognize the building.
- **Insight:** show the behavior — a group chat, a listing screenshot, the ask. Nothing finishes the job.
- **Gap:** explainers can’t fund; banks only read their own paper.
- Own the frequency Q&A answer (B4 #3).
- Run the timing rehearsal and hold everyone to it.

## B3. Challenges — known risks, still iterating

A judge panel with finance experience will find these. Assigned owners. Answers are **not locked.** Mark any spoken answer “still iterating” until the team writes the two sentences.

### A. Conflict of interest — biggest exposure

**Owner:** Finance. **Blocks:** slide 9 wording, not screens 1–6.

We read a listing (or a competitor’s quote), then **SoFi originates SoFi’s mortgage**. That is execution of our own product, and it undercuts “replaces asking your dad” — your dad is not getting a commission.

Two options (pick one and say it **before** they ask):

1. Open marketplace — competitors can bid; SoFi takes marketplace economics. Braver; converts the weakness into a trust asset.
2. SoFi-only with transparent market benchmarks — the `$1,100` is computed against a real other-lender / market rate; users can verify.

**Failure mode:** getting caught pretending this is a neutral decoder.

**Answer (still iterating):** _TBD — two sentences._

### B. Cold start

**Owner:** Engineer + Finance. **Blocks:** nothing in the prototype.

Differentiation includes “SoFi already has your verified data.” A non-member has no SoFi data, so the acquisition moment is the weakest version of the product.

Working direction (not built): non-members see the job SoFi would run (market-benchmark payment); the tap to **execute** requires signup. That makes the paywall the conversion event.

**Answer (still iterating):** _TBD — two sentences._

### C. Frequency

**Owner:** Presenter A.

A dealer packet is rare. A Zillow listing in a group chat is not. “Invest this for me” can be anytime. Use **both**: widen what starts a job (listings, checkout, promo emails, a typed intent), **and** lean on the watchlist so SoFi acts again without a new screenshot.

**Answer (still iterating):** _TBD — two sentences._

**Lower priority, prepared lines only (not prototype work):**

- **Regulatory:** originating a mortgage and allocating investments are regulated. Disclosure + human review for high-stakes jobs. We are not presenting this as unlicensed advice.
- **Bad photos:** confidence threshold routes to human review rather than guessing a payment.

## B4. Q&A — six questions

Assign owners. Write **two sentences**, not a paragraph. Placeholders stay until the owner fills them. Everyone must still be able to answer any of these.

Q2 is about **execution**, not a recommendation card.

| # | Question | Owner | Two-sentence answer |
|---|---|---|---|
| 1 | Why can’t I just use ChatGPT? | Engineer | _TBD._ |
| 2 | You’re originating *your* mortgage off *their* listing — how is that objective? | Finance | _TBD._ |
| 3 | How often does anyone actually do this? | Presenter A | _TBD._ |
| 4 | What if the AI reads the listing wrong and someone acts on it? | Engineer | _TBD._ |
| 5 | Why can’t Chase or Apple build this? | Engineer | _TBD._ |
| 6 | What’s the revenue model? | Finance | _TBD._ |

## B5. Sequence

**First**

- All four packets start in parallel.
- Designer / agent: screens 1–4 first. **Screen 4 needs group review.** If `$1,100` does not hit as “SoFi will finance this,” everything downstream weakens.
- Finance confirms Maya’s numbers early so nobody builds on a wrong figure.
- Conflict-of-interest posture decided before the engineer finalizes slide 9.

**Then**

- Finish screens 5–6 and breadth cards.
- Assemble the deck. Two full timed run-throughs minimum.
- Q&A drill: each person answers questions on someone else’s section.

**Do not**

- Rebuild the concept back into “decode-only.”
- Add a second hero listing or a second full intent flow.
- Claim the Phillips Building is actually for sale.
- Wait on challenges A/B to ship screens 1–6.

---

# Part C — Agent build spec

This is what gets implemented. Follow it literally.

If this repo already contains an older auto-loan prototype, **bring it in line with this spec.** Do not leave Maya’s Civic / `$3,830` / “You're overpaying by” anywhere in product UI. Replace data, copy, routes, and screens 1 and 4–6. Keep DeviceFrame, tokens, and share-sheet chrome if they already match C3–C4.

## C1. Mission

Build a **static-first, then clickable**, iPhone-framed web prototype of **Maya’s Zillow → SoFi-finances-it flow**. Export-friendly for slides 5–7.

The product story the UI must make obvious:

1. The listing lives **outside** SoFi (Messages / Zillow).
2. Distribution is the **iOS share sheet**, with **SoFi It** in the icon row.
3. SoFi **understands the job**: home to finance, price, loan.
4. One glance: **`$1,100` less per month if SoFi finances this.**
5. One button: **Let SoFi finance it.**
6. SoFi is originating. Done, plus **Keep watching this rate**.

## C2. Stack (locked)

```text
Vite + React + TypeScript
React Router (createBrowserRouter or BrowserRouter)
CSS Modules and/or one small global CSS file
```

- Scaffold with `npm create vite@latest` (React + TypeScript) if no Vite app exists. If one exists, reuse it and change product files.
- No component library, no Tailwind-as-a-project, no design-system kit, no animation library.
- No backend, no env secrets, no auth, no real share-sheet API, no OCR, no camera, no Zillow API, no network calls at runtime.
- No tests required for this pass.

**Run**

```bash
npm install
npm run dev
```

App must run locally with no extra setup.

## C3. Design tokens

Create or keep `src/theme/tokens.ts` and consume it from CSS. **Do not pick different brand hexes.**

These are prototype tokens matched to public SoFi cyan and marketing navy — not an official brand-guideline extract. Close enough for a case-comp prototype; do not “improve” them.

```ts
export const sofi = {
  navy: "#211747",
  navyInk: "#160E30",
  cyan: "#00A2C7",
  cyanPressed: "#00819D",
  paper: "#FFFFFF",
  ink: "#212121",
  inkMuted: "#5C5868",
  hairline: "rgba(33, 23, 71, 0.12)",
} as const;

export const ios = {
  bg: "#F2F2F7",
  grouped: "#FFFFFF",
  label: "#000000",
  secondaryLabel: "rgba(60, 60, 67, 0.60)",
  tertiaryLabel: "rgba(60, 60, 67, 0.30)",
  separator: "rgba(60, 60, 67, 0.29)",
  blue: "#007AFF",
  fill: "rgba(120, 120, 128, 0.16)",
  shareSheet: "rgba(242, 242, 247, 0.94)",
} as const;

export const type = {
  iosFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", sans-serif',
  sofiFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
} as const;

export const viewport = {
  width: 393,
  height: 852,
} as const;
```

**Color rules**

- Screens **1–2**: iOS / Zillow materials only. No SoFi navy page backgrounds. The **SoFi It** app icon is the only SoFi color on these screens.
- Screens **3–6**: SoFi paper + navy + cyan. Primary CTA is cyan pill, white label, ~50px tall, 16–20px radius.
- `$1,100` on screen 4 is **navy**, not red, not cyan. Cyan is for the SoFi rate accent and the button.

## C4. App chrome

- Center an **iPhone 15** frame on a neutral page (`#E8E6EF` or `#1A1528`).
- **Inner viewport is exactly `393×852`.** All screen UI lives inside it.
- Device frame: black bezel, rounded clip (`~55px` inner radius), **Dynamic Island**, home indicator on screens that need it.
- Status bar (all screens): time `9:41`, cellular, Wi‑Fi, battery. Use a simple `StatusBar` component; do not fake carrier names.
- Page around the phone may include a tiny caption (`SoFi It · Maya`) for the presenter. **`?static=1` hides that caption** so a crop of the `393×852` surface is clean.

## C5. Data contract — single source of numbers

Create `src/data/scenario.ts`. **UI never hardcodes a second set of listing or mortgage figures.** Import formatters from this module (or a sibling `format.ts` that only reads this object).

```ts
export const scenario = {
  person: {
    firstName: "Maya",
    age: 29,
    cityLine: "Group chat · SoMa listing",
  },
  listing: {
    address: "234 1st St, Unit 4B",
    neighborhood: "SoMa, San Francisco",
    building: "Phillips Building",
    beds: 2,
    baths: 2,
    price: 1_850_000,
    demoOnly: true,
  },
  chat: {
    sender: "Asha",
    bubble: "is this even possible??",
    threadName: "SF hunt",
  },
  mortgage: {
    downPaymentPct: 0.2,
    downPayment: 370_000,
    loanAmount: 1_480_000,
    termMonths: 360,
    otherApr: 0.07125,
    sofiApr: 0.06,
    otherMonthly: 9_975,
    sofiMonthly: 8_873,
    monthlySave: 1_100,
    lifetimeSave: 397_000,
  },
  breadth: [
    {
      id: "auto",
      label: "Auto loan",
      number: "$24,000",
      caption: "SoFi originated it",
    },
    {
      id: "invest",
      label: "Clean energy · moderate",
      number: "$10,000",
      caption: "SoFi invested it",
    },
    {
      id: "401k",
      label: "Old 401(k)",
      number: "$48,200",
      caption: "SoFi rolled it",
    },
    {
      id: "student",
      label: "Student loan",
      number: "$186/mo",
      caption: "SoFi refinanced it",
    },
  ],
} as const;
```

**Display helpers (required)**

| Token | Rendered string |
|---|---|
| price | `$1,850,000` |
| loanAmount | `$1,480,000` |
| downPayment | `$370,000` |
| bedsBaths | `2 bd · 2 ba` |
| otherApr | `7.125%` |
| sofiApr | `6.00%` |
| otherMonthly | `~$9,975/mo` |
| sofiMonthly | `~$8,873/mo` |
| monthlySave | `$1,100` |
| lifetimeSave | `~$397,000` |
| address | `234 1st St, Unit 4B` |
| building | `Phillips Building` |

Use `Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })` for dollar amounts. Other APR: three decimal places. SoFi APR: two decimal places.

**Breadth cards** are demo-only and live in the same file so slide 8 cannot drift. They are **completed jobs**, not decodes. They are **not** Maya mortgage figures and are **not** finance-verified.

## C6. Routes and screens

| Route | Screen | iOS or SoFi | Primary action |
|---|---|---|---|
| `/` | 1 Source | iOS Messages + Zillow card | Tap the share icon |
| `/share` | 2 Share sheet | iOS share tray | Tap **SoFi It** |
| `/processing` | 3 Job recognized | SoFi | Auto-advance **and** tap **Continue** |
| `/execute` | 4 Execute + `$1,100` | SoFi | Tap **Let SoFi finance it** |
| `/action` | 5 Originate | SoFi | Tap **Confirm 6.00% mortgage** |
| `/done` | 6 Confirmation | SoFi | Toggle **Keep watching this rate** |
| `/breadth` | Slide 8 cards | SoFi-ish, small | None required |
| `/gallery` | Screenshot strip | Frame only | Optional; for exporting |

If an older `/decode` route exists, **replace it with `/execute`.** Do not keep both as competing hero screens.

Tap-through order is the table order, `/` → `/done`. `/breadth` and `/gallery` are **not** in the hero loop.

### Shared “do not” (every screen)

- No lorem ipsum. No “TODO”. No “Lorem”. No placeholder Latin.
- No second hero listing. No “HQ for sale” claim.
- No competing-lender list. No “Sign up to see your rate.”
- No live camera, file picker, fetch, or Zillow embed.
- One dominant number per screen. If two things compete, one is wrong.
- Do not put SoFi navy page chrome on screens 1–2.
- Do not make screen 4 a decode-only “you're overpaying” poster. The button must be **Let SoFi finance it.**

---

### Screen 1 — `/` — Source context

**Purpose:** Prove the product starts **outside** SoFi. A real phone, a real group chat, a Zillow listing.

**Chrome:** Native **iOS Messages**. Not a SoFi card. Not a Photos crop of a PDF.

**Layout (top → bottom)**

1. iOS status bar.
2. Messages nav: back `<`, title `SF hunt`, FaceTime / info icons (decorative).
3. Thread:
   - Incoming gray bubble from `Asha`: `is this even possible??`
   - A **Zillow-style listing card** (white, rounded, Zillow-ish navy/blue accent — not SoFi navy). This is a **link preview in Messages**, not an in-app SoFi module.
4. Composer row with a **share / share-sheet affordance** on the listing card (iOS share icon on the card or the nav). **Share is the hit target.**

**Exact listing-card text** (pull numbers from `scenario`; do not retype literals in JSX):

```text
Zillow

234 1st St, Unit 4B
Phillips Building · SoMa, San Francisco
2 bd · 2 ba loft

$1,850,000
```

Optional one-line Zillow-style estimate on the card, muted: `Est. payment ~$9,975/mo` from `otherMonthly`. **Do not add extra dollar amounts.**

Tiny caption allowed under the address, 10px, not a legal banner: `Demo listing` — only if it does not kill the joke. Prefer no extra chrome; the spec’s “not for sale” rule is for the team, not a disclaimer slapped on the hook.

**Microcopy (chrome)**

- Thread name: `SF hunt`
- Sender: `Asha`
- Bubble: `is this even possible??`
- Accessibility label on share: `Share`

**Primary action:** tap share → `/share`.

**Do not**

- Brand this screen SoFi.
- Use a clean SoFi property module as the “listing.” It must read as Messages + Zillow.
- Photograph or claim a real active sale of 234 1st Street.

---

### Screen 2 — `/share` — Share sheet (thesis screen)

**Purpose:** Visual proof of the distribution thesis. This is the most important screen in the deck. A fake-looking share sheet undercuts the whole argument.

**Chrome:** Same Messages thread, dimmed. Native-looking **iOS share tray** rising from the bottom (~70% of height). Grabber. No SoFi page header.

**Layout**

1. Dimmed Messages + listing behind the sheet.
2. Share sheet card (`ios.shareSheet`, 16px top radius, hairline).
3. AirDrop row: title `AirDrop` + two gray contact circles (`Finn`, `Jordan`) — decorative, not tappable.
4. **App icon row** (horizontal, 4th icon fully visible, no scroll required in 393pt):

   | Order | Label | Treatment |
   |---|---|---|
   | 1 | Messages | Green bubble, fake |
   | 2 | Mail | Blue/white, fake |
   | 3 | Notes | Yellow, fake |
   | 4 | **SoFi It** | Navy circle, cyan mark (dot or simple ∞), **selected** (light ring or scale). This is the only real target. |
   | 5 | Shortcuts | Pink, fake |

5. Action list (iOS grouped): `Copy`, `Add to Reading List`, `Add Bookmark`. Not tappable.

**Exact labels**

- AirDrop header: `AirDrop`
- SoFi icon label: `SoFi It`
- Sheet close affordance: iOS `Close` (x) — may navigate back to `/`.

**Primary action:** tap **SoFi It** → `/processing`.

**Do not**

- Use a SoFi bottom sheet. This is UIKit, not the SoFi app.
- Hide SoFi It behind a “More” overflow.
- Animate a real iOS share controller. CSS is enough; proportions matter more than motion.

---

### Screen 3 — `/processing` — Job recognized

**Purpose:** SoFi understood a **job**, not a document trivia quiz. Terms are visible. The next step is execution.

**Chrome:** SoFi. Navy top safe area. White body. Small wordmark `SoFi It` in white on navy.

**Layout**

1. Title: `Home to finance`
2. Subtitle: `Recognized from your screenshot`
3. Four extracted rows (label left, value right, from `scenario`):

   | Label | Value |
   |---|---|
   | Address | `234 1st St, Unit 4B` |
   | Price | `$1,850,000` |
   | Loan | `$1,480,000` |
   | Term | `30-year fixed` |

4. Caption: `Phillips Building · SoMa`
5. Status line (one sentence): `SoFi can originate this mortgage.`
6. Primary button: `Continue`

**Primary action:** `Continue` → `/execute`. Also auto-navigate after **1200ms** so the click-through feels alive. **`?static=1` disables auto-navigate** and leaves the recognized state on screen for screenshots. Auto-navigate must never be the only path (tap always works).

**Do not**

- Show a looping spinner that never resolves.
- Show a chat transcript or “AI thinking” tokens.
- Invent taxes, HOA, credit score, or PMI.
- Title this screen “Auto loan offer” or any leftover Civic copy.

---

### Screen 4 — `/execute` — SoFi will finance this (hero)

**Purpose:** Two-second glance test. A judge across the room must read **`$1,100`** and know SoFi will make the house cheaper **by doing the mortgage**.

**Spend the most visual care here.** This screen gets a full slide.

**Required hierarchy, top → bottom — do not reorder**

1. Eyebrow (small, muted): `Maya · 234 1st St`
2. **The number:** `$1,100` — largest element on screen. ~64–72px, weight 700–800, `sofi.navy`, tabular lining if possible. **This is the only hero number.**
3. Label immediately under the number (17–20px): `less per month if SoFi finances this`
4. Comparison row (not competing with the hero):

   `Their estimate 7.125%`  →  `SoFi 6.00%`

   Other side muted; SoFi side cyan or navy emphasis. Use formatted APRs from `scenario`.
5. **Exactly three** receipt lines (plain English, 13–15px). Use formatted helpers; do not hardcode digits:

   - `Zillow’s estimate is about $9,975/mo on a $1,480,000 loan.`
   - `SoFi can originate at 6.00% — about $8,873/mo.`
   - `That’s about $397,000 less over 30 years. SoFi handles the loan.`

6. One button: `Let SoFi finance it`

**Two-second test (acceptance):** from across a room, the number is `$1,100` and the meaning is **SoFi finances it for less**. If the comparison or receipt lines shout louder than the number, shrink them. If the button says “See breakdown” or “You're overpaying,” redesign.

**Primary action:** tap `Let SoFi finance it` → `/action`.

**Do not**

- Put monthly payment or APR in a size that rivals `$1,100`.
- Use red for the hero number.
- Add charts, confetti, or a second CTA (“Share”, “Ask an advisor”).
- Show competing lender offers.
- Make this a decode poster without an execution verb.

---

### Screen 5 — `/action` — SoFi originates

**Purpose:** One button. What SoFi is **doing** is visible: rate, new payment, then confirm.

**Chrome:** SoFi.

**Layout**

1. Title: `SoFi will finance this`
2. Subtitle: `$1,480,000 · 30-year fixed · your rate`
3. Two stacked figures (SoFi monthly is dominant; the other estimate is secondary):

   | Label | Value |
   |---|---|
   | Your payment | `~$8,873/mo` |
   | Their estimate | `~$9,975/mo` |

4. One line under the figures: `Same house. SoFi is the lender.`
5. One primary button: `Confirm 6.00% mortgage`

No menu. No “compare offers.” No secondary ghost button.

**Primary action:** tap `Confirm 6.00% mortgage` → `/done`.

**Do not**

- Multi-step application forms, SSN, income, or hard-pull copy.
- A second rate or a “see more lenders” link.
- “Refinance at 6.4%” leftover auto-loan copy.

---

### Screen 6 — `/done` — Confirmation + watchlist

**Purpose:** The job is in motion. The toggle is the **retention story for slide 11** — it must be visible.

**Chrome:** SoFi.

**Layout**

1. Title: `SoFi is financing 234 1st St`
2. Body (one short block, numbers from `scenario`):

   `Phillips Building loft. 6.00% · ~$8,873/mo. We'll originate the $1,480,000 loan.`

3. Small confirmation line: `You don’t start over in a mortgage tab. SoFi is doing it.`
4. **Toggle row** (iOS-style switch, SoFi cyan when on):

   - Label: `Keep watching this rate`
   - Helper: `If a better SoFi rate shows up, we can redo the job.`
   - Default: **on**

5. No required next button. Optional text link, muted: `Other jobs` → `/breadth` (for slide 8 only; hide if `?static=1`).

**Primary action:** the toggle. Toggling off/on must be visible (track color). Do not navigate away on toggle.

**Do not**

- Auto-advance off this screen.
- Hide the toggle below the fold on 852pt height.
- Say “You're refinancing” (auto-loan leftover).

---

### Breadth — `/breadth` (slide 8)

**Purpose:** Prove the engine does more than one job, in three seconds. Rough is fine. These are **completed actions**, not Real-Number decodes.

**Layout:** SoFi navy title `SoFi did these too` + four equal cards. Each card is **one number + label + a past-tense SoFi verb** (caption). Data from `scenario.breadth`.

The invest card (`Clean energy · moderate` / `$10,000` / `SoFi invested it`) is the **intent-door proof**. Do not add a fifth card or a chat composer.

**Do not** turn these into four more flows.

### Gallery — `/gallery`

Optional strip of framed screens 1–6 plus breadth, for screenshotting. No extra product UI.

## C7. Click behavior

- Hero path is linear and always available. **No live demo dependencies.**
- Back: iOS chevron on screens 2–6 returns to the previous hero route.
- Keyboard: not required.
- `?static=1` (read in a small hook, persist while navigating):
  - No processing auto-advance
  - Hide presenter caption and the “Other jobs” link
  - Hide any “tap to continue” developer hint
- Do not require query params for the happy path.

## C8. File tree the agent must create

Do not add extra product screens or a `components/ui` kit. Names may vary by one word; **this shape is required.**

```text
package.json
index.html
vite.config.ts
tsconfig.json
src/
  main.tsx
  App.tsx
  index.css                 # reset + page background + CSS variables from tokens
  theme/
    tokens.ts
  data/
    scenario.ts             # THE numbers file — only source of listing + mortgage + breadth
  components/
    DeviceFrame.tsx
    DeviceFrame.module.css
    StatusBar.tsx
    IosShareSheet.tsx       # used by screen 2
  screens/
    SourceScreen.tsx
    ShareScreen.tsx
    ProcessingScreen.tsx
    ExecuteScreen.tsx       # was DecodeScreen — rename if migrating
    ActionScreen.tsx
    DoneScreen.tsx
    BreadthScreen.tsx
    GalleryScreen.tsx       # optional but preferred
  routes.tsx                # or route table inside App.tsx
```

GitHub templates already in the repo (`README.md`, `CONTRIBUTING.md`, etc.) stay. Do not delete them.

## C9. Implementation order

Do not skip ahead to polish until the previous step exists.

1. **Tokens + data** — `tokens.ts`, `scenario.ts` with the mortgage listing (not the Civic). `DeviceFrame` shows 393×852.
2. **Six static screens** — routes render each screen with final copy. Navigation can be temporary (`/` links) but every screen must look finished.
3. **Wire navigation** — primary actions, back chevrons, processing auto-advance + tap, `?static=1`.
4. **Breadth** — `/breadth` completed-job cards from `scenario.breadth`.
5. **Polish last, and only these two:** share sheet proportions (screen 2) and the two-second test on screen 4.

## C10. Acceptance checks

The agent may claim done only if **all** of these are true:

1. `npm run dev` starts the prototype with no extra env or backend.
2. **One** canonical numbers module (`src/data/scenario.ts`). Searching the repo for leftover auto-loan product copy (`Lakeside`, `Civic`, `3830`, `You're overpaying`, `Refinance at 6.4%`) finds **none** in `src/`.
3. Searching screen files for `1850000`, `9975`, `1100`, `7.125` finds **no competing hardcoded mortgage set** (imports / formatters only).
4. **No lorem ipsum** and no `TODO` user-facing copy.
5. Six hero routes exist and tap through in order: `/` → `/share` → `/processing` → `/execute` → `/action` → `/done`.
6. Screen 4 has **one** dominant number: `$1,100`. Label is `less per month if SoFi finances this`. Button is `Let SoFi finance it`.
7. Screen 5 primary button label is exactly `Confirm 6.00% mortgage`.
8. Screen 6 title includes `234 1st St` (or the formatted address). Toggle is `Keep watching this rate`, default on.
9. Screens 1–2 read as **iOS Messages + share tray**, not the SoFi app. Screens 3–6 use navy + cyan tokens from `tokens.ts`.
10. `/breadth` shows four **completed jobs**: auto originated, clean-energy invested, 401(k) rolled, student refinanced — each one number + SoFi-did-it caption.
11. Viewport content is **393×852** and screenshot-ready. `?static=1` freezes processing and hides extra chrome.
12. **Six PNGs are not required.** The running app is what the team screenshots.
13. No UI copy claims the Phillips Building / SoFi HQ is actually for sale.

## C11. Explicitly do not build

- Marketplace vs. SoFi-only product picker
- Non-member paywall or signup
- Real AI, OCR, uploads, chat, or Zillow API
- Pitch-deck generator or slide routes for Part B
- Video, analytics, auth, CMS
- A second hero listing or a second full intent flow
- A whole-building commercial purchase of HQ
- Design-system / component-library rabbit hole

---

## Appendix — How the team screenshots slides 5–7

1. Run the app. Open `/?static=1`, then walk routes with `?static=1` appended.
2. Crop to the **393×852** inner surface (or the whole device frame if the slide wants a phone).
3. Pair 1+2 on slide 5, isolate 4 on slide 6, pair 5+6 on slide 7.
4. Use `/breadth` for slide 8.

The agent does not export PNGs.

## Appendix — How to use this file

- **Team:** send this whole file. Parts A and B are the shared scope.
- **Next Cursor Agent:** implement Part C against Part A. Do not reopen A2. Do not implement Part B as screens.
- **Open decisions (A3, B3):** keep iterating in conversation. They do not block the prototype.
