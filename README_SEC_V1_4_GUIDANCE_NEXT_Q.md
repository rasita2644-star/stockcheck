# SEC V1.4 — Guidance Comparison + Next Quarter End + Cleaner Fundamental Table

This version continues from the existing Stock Radar Python/IDLE app.

## Changes

1. **Days to Next Q End**
   - SEC does not provide a free/no-key earnings announcement calendar.
   - The app now estimates the next fiscal quarter-end from the latest SEC period end.
   - Positive number = days until the next expected accounting period end.
   - Negative number = that expected period end has already passed, so the SEC data may be waiting for the next filing/companyfacts update.

2. **Consensus columns removed from the V1 table**
   - Removed from the fundamental table and toggles:
     - Cons. Rev Est.
     - Cons. Rev Surprise %
     - Cons. EPS Est.
     - Cons. EPS Surprise %
   - These belong in V2 Alpha Vantage on-demand popup, not in SEC V1.

3. **Actual vs Company Guidance fixed**
   - Previous logic only compared guidance to the latest quarter.
   - New logic can compare the guidance period to the actual revenue for the same quarter even if that quarter is not the latest quarter anymore.
   - Example: if latest actual is Q1 2026 but parsed guidance was for Q4 2025, the app looks for actual Q4 2025 revenue and computes Actual vs Guide from that.
   - If the guidance is for a future quarter with no actual data yet, the app keeps Actual vs Guide as N/A and explains why.

## Run in IDLE

Open `app.py`, press F5, then visit:

```text
http://localhost:8787
```

