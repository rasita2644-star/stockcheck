# SEC V1.1 Local API Fix

This version is developed from the existing Stock Radar / Stockcheck project.

## What was fixed

Previous local runs could show:

`โหลด scanner.json ไม่สำเร็จ: HTTP 404`

because the browser UI was still trying to load the GitHub Pages static file:

`static/data/scanner.json`

but local Python/IDLE mode did not generate that file.

V1.1 fixes this by:

1. Making `static/app.js` and `site/app.js` detect local Python mode.
2. Loading scan data from `/api/scan` when running on `localhost:8787`.
3. Adding compatibility route `/data/scanner.json` in `app.py`.
4. Returning `quotes` from `/api/scan`, so detail view works like the old static `scanner.json` shape.
5. Keeping GitHub Pages static behavior unchanged for non-local use.

## How to run in IDLE

Open:

`app.py`

Then press:

`F5 / Run Module`

Open browser:

`http://localhost:8787`

## Quick backend checks

After `app.py` is running, these should not return 404:

`http://localhost:8787/api/health`

`http://localhost:8787/api/scan?symbols=NVDA,MSFT&range=1y`

`http://localhost:8787/data/scanner.json?symbols=NVDA,MSFT&range=1y`

## Notes

- SEC EDGAR is used for core fundamentals.
- Yahoo remains the price/technical data source.
- Alpha Vantage analyst consensus is not connected in V1. It remains V2 on-demand.
