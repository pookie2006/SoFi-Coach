# SoFi-Coach

**Start here:** [SOFI-IT.md](SOFI-IT.md) is the product and prototype spec. The team uses Parts A and B (locked concept, numbers, deck, ownership). A later Cursor Agent should read that file and implement Part C — a Vite + React + TypeScript iPhone prototype of Maya’s Zillow listing → SoFi-finances-it flow. Do not invent a second set of numbers or reopen the locked concept.

SoFi It is an execution feature: share a listing or state an intent, and SoFi completes the job (finance, invest, lend). This repository is the starting point for the prototype, docs, and contribution workflow.

## Status

[SOFI-IT.md](SOFI-IT.md) is the source of truth. Implement or align the six-screen prototype to Part C before changing copy or numbers.

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

   Open the local Vite URL. After Part C is implemented, tap through `/` → `/share` → `/processing` → `/execute` → `/action` → `/done`. Use `?static=1` or `/gallery` when screenshotting slides 5–8.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request, and follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

If you find a vulnerability, do not open a public issue. See [SECURITY.md](SECURITY.md) for how to report it privately.

## License

This project is licensed under the [MIT License](LICENSE).
