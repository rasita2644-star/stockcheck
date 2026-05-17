#!/usr/bin/env python3
"""v8.1.6 Finnhub earnings wrapper for Today’s Attention List.

This keeps the stable v8.1.x attention generator intact, but replaces its
`fetch_earnings_date` function at runtime with a source stack:

1. manual earnings_calendar.json entries with force=true
2. Finnhub earningsCalendar API for the portfolio window
3. Yahoo fallback from the existing generator
4. non-forced manual fallback

The output adds `earnings_diagnostics` so the UI/logs can tell whether earnings
were loaded, missing, or skipped because the Finnhub key is absent.
"""
from __future__ import annotations

import json
import os
import urllib.parse
from datetime import date, timedelta
from pathlib import Path
from typing import Any

import generate_attention as base

FINNHUB_API_KEY = os.environ.get("FINNHUB_API_KEY", "").strip()

DIAGNOSTICS: dict[str, Any] = {
    "checked": 0,
    "finnhub_enabled": bool(FINNHUB_API_KEY),
    "finnhub_status": "missing_api_key" if not FINNHUB_API_KEY else "pending",
    "loaded_from_finnhub": [],
    "loaded_from_yahoo": [],
    "loaded_from_manual": [],
    "missing": [],
    "api_failed": [],
}
FINNHUB_EARNINGS: dict[str, dict[str, Any]] = {}
ORIGINAL_FETCH_EARNINGS_DATE = base.fetch_earnings_date


def parse_date(raw: Any) -> date | None:
    if not raw:
        return None
    try:
        return date.fromisoformat(str(raw)[:10])
    except Exception:
        return None


def portfolio_tickers() -> set[str]:
    path = base.first_existing(base.PORTFOLIO_PATHS)
    portfolio = base.load_json(path, []) if path else []
    if not isinstance(portfolio, list):
        return set()
    return {str(row.get("ticker", "")).strip().upper() for row in portfolio if isinstance(row, dict) and row.get("ticker")}


def fetch_finnhub_calendar(tickers: set[str]) -> dict[str, dict[str, Any]]:
    DIAGNOSTICS["checked"] = len(tickers)
    if base.OFFLINE_MODE:
        DIAGNOSTICS["finnhub_status"] = "skipped_offline"
        return {}
    if not FINNHUB_API_KEY:
        DIAGNOSTICS["finnhub_status"] = "missing_api_key"
        return {}

    start = base.now_ict().date()
    end = start + timedelta(days=14)
    DIAGNOSTICS["finnhub_window"] = {"from": str(start), "to": str(end)}

    rows: list[dict[str, Any]] = []
    try:
        try:
            import finnhub  # type: ignore
            client = finnhub.Client(api_key=FINNHUB_API_KEY)
            data = client.earnings_calendar(_from=str(start), to=str(end), symbol="", international=False)
            rows = data.get("earningsCalendar") if isinstance(data, dict) else []
        except ImportError:
            url = f"https://finnhub.io/api/v1/calendar/earnings?from={start}&to={end}&token={urllib.parse.quote(FINNHUB_API_KEY)}"
            data = base.http_json(url, timeout=15) or {}
            rows = data.get("earningsCalendar") or []
    except Exception as exc:
        DIAGNOSTICS["finnhub_status"] = "error"
        DIAGNOSTICS["api_failed"].append(f"finnhub: {exc}")
        print(f"::warning::Finnhub earnings calendar failed: {exc}")
        return {}

    if not isinstance(rows, list):
        DIAGNOSTICS["finnhub_status"] = "invalid_response"
        return {}

    out: dict[str, dict[str, Any]] = {}
    for row in rows:
        if not isinstance(row, dict):
            continue
        symbol = str(row.get("symbol") or row.get("ticker") or "").strip().upper()
        if symbol not in tickers:
            continue
        earnings_date = parse_date(row.get("date") or row.get("earnings_date"))
        if not earnings_date:
            continue
        if symbol not in out or earnings_date < out[symbol]["earnings_date"]:
            out[symbol] = {**row, "ticker": symbol, "earnings_date": earnings_date, "source": "finnhub"}

    DIAGNOSTICS["finnhub_status"] = "loaded"
    DIAGNOSTICS["finnhub_rows_matched"] = len(out)
    return out


def manual_is_valid(manual: dict[str, Any] | None) -> bool:
    if not manual:
        return False
    d = manual.get("earnings_date")
    return isinstance(d, date) and d >= (base.now_ict().date() - timedelta(days=3))


def fetch_earnings_date_v816(ticker: str, manual_calendar: dict[str, dict[str, Any]] | None = None) -> tuple[date | None, str | None]:
    ticker = ticker.upper()
    manual = (manual_calendar or {}).get(ticker)

    if manual_is_valid(manual) and manual.get("force"):
        DIAGNOSTICS["loaded_from_manual"].append(ticker)
        return manual.get("earnings_date"), "manual_force"

    finnhub_row = FINNHUB_EARNINGS.get(ticker)
    if finnhub_row:
        DIAGNOSTICS["loaded_from_finnhub"].append(ticker)
        return finnhub_row.get("earnings_date"), "finnhub"

    yahoo_date, yahoo_source = ORIGINAL_FETCH_EARNINGS_DATE(ticker, {})
    if yahoo_date:
        DIAGNOSTICS["loaded_from_yahoo"].append(ticker)
        return yahoo_date, yahoo_source or "yahoo"

    if manual_is_valid(manual):
        DIAGNOSTICS["loaded_from_manual"].append(ticker)
        return manual.get("earnings_date"), "manual_fallback"

    DIAGNOSTICS["missing"].append(ticker)
    return None, None


def stable_unique(values: list[Any]) -> list[str]:
    return sorted(set(str(v) for v in values if v))


def main() -> None:
    global FINNHUB_EARNINGS
    tickers = portfolio_tickers()
    FINNHUB_EARNINGS = fetch_finnhub_calendar(tickers)
    base.fetch_earnings_date = fetch_earnings_date_v816

    data = base.generate()
    for key in ["loaded_from_finnhub", "loaded_from_yahoo", "loaded_from_manual", "missing", "api_failed"]:
        DIAGNOSTICS[key] = stable_unique(DIAGNOSTICS.get(key, []))

    data["earnings_diagnostics"] = DIAGNOSTICS
    data.setdefault("data_quality", {})["earnings_source"] = "Finnhub primary, Yahoo fallback, manual fallback; manual force overrides all"
    data.setdefault("data_quality", {})["finnhub_rows"] = len(FINNHUB_EARNINGS)

    for path in base.OUT_PATHS:
        base.save_json(path, data)

    print(f"Generated attention list: {len(data['items'])} / {data['total_monitored']} monitored")
    print("Earnings diagnostics:")
    print(f"- Finnhub status: {DIAGNOSTICS.get('finnhub_status')}")
    print(f"- Finnhub matched: {len(DIAGNOSTICS.get('loaded_from_finnhub', []))}")
    print(f"- Yahoo loaded: {len(DIAGNOSTICS.get('loaded_from_yahoo', []))}")
    print(f"- Manual loaded: {len(DIAGNOSTICS.get('loaded_from_manual', []))}")
    print(f"- Missing: {len(DIAGNOSTICS.get('missing', []))}")
    if DIAGNOSTICS.get("missing"):
        print("- Missing tickers: " + ", ".join(DIAGNOSTICS["missing"][:30]))
    if DIAGNOSTICS.get("api_failed"):
        print("- API failures: " + " | ".join(DIAGNOSTICS["api_failed"]))


if __name__ == "__main__":
    main()
