# SEC V1.2 — Profit %, quarter sort, and guidance handling

This version continues from the existing Stock Radar Python/IDLE app.

## Fixed in V1.2

1. Profit / EPS % change with losses

Standard percentage change is misleading when both values are negative:

- current net income = -641.39M
- previous net income = -222.94M
- normal formula shows +187.7%, but the loss actually widened.

V1.2 uses directional earnings change for Net Income and EPS:

- loss widened => negative percentage
- loss narrowed => positive percentage
- loss to profit => +100 sentinel and status `Turned profitable`
- profit to loss => -100 sentinel and status `Turned to loss`

The detail view also receives `profitQoQStatus`, `profitYoYStatus`, `epsQoQStatus`, and `epsYoYStatus`.

2. Latest Quarter sorting

The Fundamental table now sorts quarter labels chronologically by fiscal year and quarter:

Q3 2026 > Q2 2026 > Q1 2026 > Q4 2025

This fixes string sorting that treated quarter labels too naively.

3. Consensus estimate vs company guidance

V1.2 keeps analyst consensus fields as N/A because Alpha Vantage / other consensus APIs are not connected yet.

Company guidance is a different dataset from analyst consensus. It usually appears in 8-K / earnings release / exhibit 99.1 text, not in SEC companyfacts as a clean structured number. Automatic guidance parsing is intentionally not enabled in V1.2 to avoid false positives.

Planned V1.3 option:

- fetch latest 8-K / earnings release
- search for revenue outlook / guidance text
- parse ranges such as `$120M to $130M`
- label it as `Company Guidance`, not `Consensus Estimate`
- calculate actual vs guidance separately from consensus surprise

## Run in IDLE

Open `app.py` and press F5.

Then open:

http://localhost:8787

For module-only testing, open `run_sec_v1_idle_test.py` and press F5.
