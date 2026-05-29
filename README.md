# GHS FX Converter

Real-time Ghana Cedi (GHS) currency converter with live rates, offline cache, and zero backend.

**Live demo:** https://ghs-fx-converter.vercel.app

![GHS FX Converter preview](./preview.png)

## Supported Currencies

| Code | Currency |
|---|---|
| GHS | Ghana Cedi |
| USD | US Dollar |
| EUR | Euro |
| GBP | British Pound |
| NGN | Nigerian Naira |
| ZAR | South African Rand |
| CAD | Canadian Dollar |
| JPY | Japanese Yen |
| CNY | Chinese Yuan |
| AED | UAE Dirham |
| KES | Kenyan Shilling |
| EGP | Egyptian Pound |
| MAD | Moroccan Dirham |
| XOF | West African CFA Franc |
| TZS | Tanzanian Shilling |

## Features

- **Live rates** via primary + fallback API with automatic failover
- **Auto-refresh** every hour while the tab is open, and on tab focus if rates are stale
- **1-hour localStorage cache** - works offline if rates were previously loaded
- **Live/Cached badge** on the result showing whether rates are fresh or from cache
- **Debounced input** - no recompute on every keystroke
- **Swap button** - flip from/to currencies in one click
- **About modal** - explains the rate fetch flow, supported currencies, and credits
- **Dark mode** toggle
- **Mobile-first** responsive layout

## How Rates Work

Rates are fetched from [fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api), a free, keyless, 200+ currency API:

- **Primary:** `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{base}.json`
- **Fallback:** `https://latest.currency-api.pages.dev/v1/currencies/{base}.json`

If the primary URL fails, the fallback is tried automatically. Successful responses are cached in localStorage for 1 hour. If both URLs fail and a cached entry exists, it is served with an amber "Cached" badge. Rates also refresh silently every hour while the tab is open, and whenever you switch back to the tab.

## Tech Stack

| Tool | Purpose |
|---|---|
| Vite 6 | Build tool & dev server |
| React 19 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling with custom design tokens |
| Vitest | Unit testing |
| Playwright | Automated screenshot script |

## Run Locally

```bash
npm install
npm run dev         # dev server at http://localhost:5173
npm run build       # production build
npm run preview     # preview production build
npm run screenshot  # take a fresh screenshot of the app into preview.png
```

## Tests

```bash
npm run test
```

Covers: `convert()` (zero, large, rounding, invalid inputs), `formatMoney()` (USD, GHS, zero, large, unknown codes), `fetchRates()` (primary fetch + cache, fallback, stale cache, error), `getRate()`, and `isCacheStale()`. Fetch is mocked so no network calls are made during tests.

---

> **Estimate only.** Rates are provided as-is for reference. Always confirm with your bank or a licensed financial institution before making any transactions.

**Rate source credit:** [fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api)

## License

MIT
