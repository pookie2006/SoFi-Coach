# SoFi It — Final Project Document

**SoFi does the thing.** It does not stop at a plan.

ChatGPT, a dad text, a bank chatbot, and most “AI coaches” all end the same way: here is what you *could* do. SoFi It starts there and **finishes the job** — originates the loan, invests the money, refinances the rate, moves the 401(k). The plan is only the receipt for an action SoFi is about to take.

Tagline: **Screenshot it. SoFi it. SoFi does it.**

---

## The idea (locked)

People already screenshot a listing, a loan offer, or a statement and ask “is this even possible??” That habit has no product. Explainers answer. SoFi **acts**.

You share a document or you state an intent. SoFi returns a short, numbered plan — then **runs it**.

| You want… | Other tools | SoFi It |
|---|---|---|
| A home | “Here’s how mortgages work.” | **SoFi originates the mortgage.** |
| A car loan | “Shop around at 6–8%.” | **SoFi funds the loan.** |
| To invest in an industry, at a risk level | “Consider an ETF. Not advice.” | **SoFi allocates the money.** |
| A better student rate | “You might refinance.” | **SoFi refinances it.** |
| An old 401(k) sitting somewhere | “You should roll it over.” | **SoFi moves it.** |

If the screen only ideates, it is the wrong product. If the plan has no “SoFi will do this” button, it is a note, not SoFi It.

---

## Plan, then do — never plan-only

Every job has two beats. Both are required.

1. **The plan** — plain English, one dominant number, the steps SoFi will take. This is the pre-flight, not the product.
2. **The action** — one button that executes: finance it, invest it, originate it, roll it. SoFi is the bank, the lender, and the brokerage, so the button is real.

Example (hero demo — Maya, 29):

- **Ask:** A group chat drops a Zillow loft at **234 1st St, Unit 4B** (Phillips Building, SoMa — **demo listing only**; HQ is not for sale).
- **Plan:** Their estimate **7.125% (~$9,975/mo)** vs SoFi **6.00% (~$8,873/mo)**.
- **Number:** **$1,100 less per month** if SoFi finances it (~$397,000 over the loan).
- **Action:** **Let SoFi finance it** → SoFi originates the **$1,480,000** mortgage. Not “save this plan.” Not “talk to an advisor.”

The plan exists so she can see what she is authorizing. The product is the authorization.

---

## Two ways in, one engine

```text
Share a listing or document ──┐
                              ├──► Plan (receipt) ──► SoFi executes
Type an intent ───────────────┘
```

- **Share:** screenshot / share sheet → SoFi reads the job → plans → does it.
- **Intent:** “Invest $10,000 in clean energy, moderate risk” → SoFi writes the allocation → **invests it**.

Same engine. Finance it. Invest it. Lend it.

---

## Why this is only SoFi

An AI company can draft the plan. It cannot wire the funds.  
A bank can fund its own paper. It cannot start from a Zillow screenshot or “invest in this sector.”  
SoFi already has the member, the license, and the products. **See it → price it → do it.** Doing it is the product.

---

## What we are not building

- A decoder that stops at “you’re overpaying.”
- A chatbot that hands you a checklist.
- A second app you open to “apply later.”
- Neutral shopping-advice theater. SoFi executes SoFi products (say that in Q&A; don’t pretend otherwise).

Full prototype, numbers, slides, and team packets: [SOFI-IT.md](SOFI-IT.md).

## Judge live (interactive)

The reel at `/` is the story. **`/live` is the room.**

1. Laptop opens `/live/host` — QR for judges.
2. Phone opens `/live` — mock SoFi account (cash, loan room, risk).
3. Camera scan (laptop → MacBook, phone → iPhone, bicycle → bike). If vision misses, they pick the object. Backup QRs on the host page skip the camera.
4. Street price is pulled (local market snapshot, presented as a live check).
5. SoFi writes a plan: finance it, pay cash, ETF mix, stock sleeve, optional crypto. Judges **approve or reject each line**.
6. **SoFi the approved steps** — the product still ends on execution, not a checklist.

This is still a prototype: no real underwriting, no real brokerage tickets, no live Apple/Amazon scrape (those fail in a room). Camera needs HTTPS or localhost.
