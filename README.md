# SoFi It

SoFi does the thing. It does not stop at a plan.

Someone screenshots a thing they want and asks “is this even possible?” Explainers answer. **SoFi It** reads the job against the member’s SoFi accounts, writes a short plan, waits for them to approve or reject each line, then originates, refinances, or allocates.

**Scan an object** — a laptop, a bike, a phone. Document and home listing scan (leases, statements, Zillow cards) is the future.

**Live site:** [https://pookie2006.github.io/SoFi-Coach/](https://pookie2006.github.io/SoFi-Coach/)

**Scan:** [https://pookie2006.github.io/SoFi-Coach/scan](https://pookie2006.github.io/SoFi-Coach/scan)

![QR code that opens SoFi It scan](public/sofi-scan-qr.png)

Scan the code with your phone camera to open SoFi It.

---

## How the product works

1. **See** — Scan an object. Document and home listing scan is the future.
2. **Read** — SoFi names the job and shows the reading. The member confirms the price or rate.
3. **Recommend** — Eligible SoFi products only (checking, card, Pay in 4, personal loan, mortgage, student loan, invest), using the demo member’s balances.
4. **Choose** — Approve or reject each line. Buy options are exclusive — no double-funding.
5. **Do** — SoFi posts a receipt.

`/` is the story. `/scan` is where you try it.

Locked spec and numbers: [SOFI-IT-FINAL.md](SOFI-IT-FINAL.md) and [SOFI-IT.md](SOFI-IT.md).

---

## Run it locally

```bash
git clone https://github.com/pookie2006/SoFi-Coach.git
cd SoFi-Coach
npm install
npm run dev
```

Open **http://localhost:5180** (5173 is often another Vite app).

| URL | What it is |
|---|---|
| `/` | Pitch reel (share a listing → SoFi finances it) |
| `/scan` | Interactive scan + jobs — **this is the phone path** |
| `/scan/host` | Poster with a QR for the current origin |
| `/gallery` or `?static=1` | Screenshot-friendly slides |

---

## Scan portion

**Share this with testers (stays up when the laptop is closed):**

https://pookie2006.github.io/SoFi-Coach/scan

On the phone they can:

- **Scan an object** — take a photo of a physical thing. The phone names it and SoFi writes a plan.
- **Finance an object** — pick a catalog item (MacBook, iPhone, bike).

Document and home listing scan (leases, statements, Zillow cards) is the future. Until then, the SoMa loft, Barcelona semester, and student-loan jobs are tappable story examples, not camera scans.

On-device scan does not need this laptop. The richer vision + shopping-comps path needs keys in `scan/.env` and a running laptop:

```bash
cp scan/.env.example scan/.env   # add a vision key and SerpAPI
npm run demo                     # Vite + public HTTPS tunnel
```

Keep that terminal open. Then either:

- open **http://localhost:5180/scan** on the laptop, or
- open **http://localhost:5180/scan/host** and scan that QR (tunnel URL, laptop must stay awake).

`npm run demo` mints a new `*.trycloudflare.com` each time. GitHub Pages `/scan` is the stable link.

---

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Do not open a public issue for a vulnerability. See [SECURITY.md](SECURITY.md).

## License

[MIT License](LICENSE).
