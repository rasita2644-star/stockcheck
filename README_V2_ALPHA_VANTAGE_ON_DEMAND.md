# Stock Radar V2 — Alpha Vantage Analyst Target On-demand

V2 keeps SEC EDGAR as the core fundamental engine and adds an optional Alpha Vantage analyst-target panel.

## Important

The Alpha Vantage key is **not hard-coded** into the app. Keep it local only.

Use one of these two methods:

### Option A: `.env`

Create a file named `.env` in the same folder as `app.py`:

```env
ALPHA_VANTAGE_API_KEY=your_key_here
ALPHA_VANTAGE_DAILY_LIMIT=25
```

### Option B: `alpha_vantage_api_key.txt`

Create a file named `alpha_vantage_api_key.txt` in the same folder as `app.py`, then paste only the key inside.

## How V2 works

- Normal scan does **not** call Alpha Vantage.
- Click a ticker to open detail.
- In `Analyst Target View — V2 On-demand`, click `Load Analyst Consensus`.
- One click uses at most one Alpha Vantage call: `OVERVIEW`.
- Same ticker on the same UTC day uses local cache and does **not** spend quota again.
- Daily quota is tracked locally in `.alpha_vantage_quota.json`.
- Cache is stored in `.alpha_vantage_cache/`.

## API routes

```text
GET /api/analyst-consensus?symbol=AMD&currentPrice=123.45
GET /api/alpha-vantage/quota
```

## Reset time

The app uses an internal reset at 00:00 UTC. The UI also shows the local equivalent time.

## What V2 currently pulls

From Alpha Vantage `OVERVIEW`:

- AnalystTargetPrice
- analyst rating fields if available
- sector / industry
- LatestQuarter
- EPS / RevenueTTM / ProfitMargin / ROE / PE / PEG / Beta / 52-week high-low

This is an analyst-target overlay, not the core fundamental score.
