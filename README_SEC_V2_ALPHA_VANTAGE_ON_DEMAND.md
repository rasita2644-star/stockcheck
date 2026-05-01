# SEC V1.7 + Alpha Vantage V2 On-demand

## Summary

This version keeps the V1.7 SEC-first design and adds V2 analyst-target loading from Alpha Vantage only after the user clicks a button.

## What changed

- SEC EDGAR remains the core fundamental engine.
- Guidance history matching remains unchanged.
- Alpha Vantage is now connected through `/api/analyst-consensus`.
- No Alpha Vantage request is made during scan.
- The detail page has `Analyst Target View — V2 On-demand`.
- Same ticker on the same UTC day uses cache.
- Daily call counter is capped at 25 by default.
- Quota reset display is shown in the analyst panel.

## Key setup

The API key is intentionally not included in this package.

Create either:

```text
.env
```

with:

```env
ALPHA_VANTAGE_API_KEY=your_key_here
ALPHA_VANTAGE_DAILY_LIMIT=25
```

or create:

```text
alpha_vantage_api_key.txt
```

and paste only the key.

## Run

Open `app.py` in IDLE and press F5, then open:

```text
http://localhost:8787
```

Click a ticker, then click `Load Analyst Consensus`.

## One-stock test

Open `run_alpha_vantage_v2_idle_test.py` in IDLE and press F5.
