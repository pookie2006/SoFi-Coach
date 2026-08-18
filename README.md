# SoFi-Coach

**Start here:** [SOFI-IT-FINAL.md](SOFI-IT-FINAL.md) is the condensed product lock — SoFi executes the job; it does not stop at a plan. [SOFI-IT.md](SOFI-IT.md) is the full spec (deck, numbers, prototype). A later Cursor Agent should read `SOFI-IT.md` and implement Part C. Do not invent a second set of numbers or reopen the locked concept.

SoFi It is an execution feature: share a listing or state an intent, and SoFi completes the job (finance, invest, lend). This repository is the starting point for the prototype, docs, and contribution workflow.

## Live demo

https://pookie2006.github.io/SoFi-Coach/

## Status

The six-screen prototype matches [SOFI-IT.md](SOFI-IT.md) Part C: Maya shares a Zillow listing; SoFi originates the mortgage.

## Getting started

1. Clone the repository:

   ```bash
   git clone https://github.com/pookie2006/SoFi-Coach.git
   cd SoFi-Coach
   ```

2. Install and run the prototype:

   ```bash
   npm install
   npm run dev
   ```

   Open the local Vite URL. `/` auto-plays the hypothetical demo. Tap through Maya at `/story`. **Judge live:** put `/live/host` on the laptop (QR poster). Judges open `/live`, scan a MacBook / iPhone / bike (or pick one), then approve or reject each line of the plan. Camera needs HTTPS or localhost; use the Vite Network URL on the same Wi-Fi. Use `?static=1` or `/gallery` when screenshotting slides.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request, and follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

If you find a vulnerability, do not open a public issue. See [SECURITY.md](SECURITY.md) for how to report it privately.

## License

This project is licensed under the [MIT License](LICENSE).
