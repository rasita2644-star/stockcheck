#!/usr/bin/env python3
"""Run the fundamental resolver on a rotating Finnhub ticker batch.

Fundamental data is quarterly, so refreshing every ticker on every workflow run
is wasteful and can cause Finnhub quota/rate pressure.  This wrapper lets the
existing resolver update only a due batch of US-listed tickers, while preserving
existing data for the rest.
"""
from __future__ import annotations

import os
from typing import Any

import generate_fundamental_resolver as resolver
from finnhub_call_scheduler import select_batch, mark_checked, normalize_ticker


def all_current_tickers() -> list[str]:
    source_path = resolver.first_existing(resolver.FUNDAMENTAL_PATHS)
    data = resolver.load_json(source_path, {}) if source_path else {}
    rows = resolver.all_rows(data) if isinstance(data, dict) else []
    out: list[str] = []
    for row in rows:
        if isinstance(row, dict):
            ticker = normalize_ticker(row.get("ticker") or row.get("symbol"))
            if ticker:
                out.append(ticker)
    return sorted(dict.fromkeys(out))


def main() -> None:
    tickers = all_current_tickers()
    batch_size = int(os.environ.get("FINNHUB_FUNDAMENTAL_BATCH_SIZE", os.environ.get("FINNHUB_BATCH_SIZE", "20")))
    min_hours = float(os.environ.get("FINNHUB_FUNDAMENTAL_MIN_REFRESH_HOURS", "168"))  # weekly per ticker by default
    selected, state = select_batch("financials_reported", tickers, batch_size=batch_size, min_hours=min_hours)
    selected_set = set(selected)

    original_financials = resolver.fetch_finnhub_financials
    original_earnings = resolver.fetch_finnhub_earnings

    def financials_if_due(client: Any, ticker: str):
        ticker = normalize_ticker(ticker)
        if ticker not in selected_set:
            return []
        return original_financials(client, ticker)

    def earnings_if_due(client: Any, ticker: str):
        ticker = normalize_ticker(ticker)
        if ticker not in selected_set:
            return []
        return original_earnings(client, ticker)

    resolver.fetch_finnhub_financials = financials_if_due
    resolver.fetch_finnhub_earnings = earnings_if_due

    print(f"Finnhub financials_reported batch: {len(selected)} / {len(tickers)} tickers")
    if selected:
        print("Batch tickers: " + ", ".join(selected))
    else:
        print("No financials_reported tickers due this run.")

    resolver.main()
    if selected:
        mark_checked("financials_reported", selected, status="ok")


if __name__ == "__main__":
    main()
