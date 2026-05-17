#!/usr/bin/env python3
"""Generate Finnhub EPS surprise data for Stock Timing Radar.

Uses the FINNHUB_API_KEY GitHub Actions secret. The generated JSON is safe to
publish because it contains only earnings data, never the API key.
"""
from __future__ import annotations

import json
import os
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DATA_DIRS = [ROOT / "data", ROOT / "site" / "data", ROOT / "static" / "data"]
TECHNICAL_PATHS = [ROOT / "site" / "data" / "technical.json", ROOT / "data" / "technical.json", ROOT / "static" / "data" / "technical.json"]
PORTFOLIO_PATHS = [ROOT / "data" / "portfolio.json", ROOT / "site" / "data" / "portfolio.json"]


def now_ict() -> datetime:
    return datetime.now(timezone(timedelta(hours=7)))


def load_json(path: Path, default: Any) -> Any:
    try:
        if path.exists():
            return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        pass
    return default


def first_existing(paths: list[Path]) -> Path | None:
    return next((p for p in paths if p.exists()), None)


def normalize_ticker(value: Any) -> str:
    return str(value or "").strip().upper()


def load_tickers() -> list[str]:
    tickers: list[str] = []
    portfolio_path = first_existing(PORTFOLIO_PATHS)
    portfolio = load_json(portfolio_path, []) if portfolio_path else []
    if isinstance(portfolio, list):
        tickers.extend(normalize_ticker(row.get("ticker")) for row in portfolio if isinstance(row, dict))

    technical_path = first_existing(TECHNICAL_PATHS)
    technical = load_json(technical_path, {}) if technical_path else {}
    rows = technical.get("rows", []) if isinstance(technical, dict) else []
    if isinstance(rows, list):
        tickers.extend(normalize_ticker(row.get("ticker") or row.get("symbol")) for row in rows if isinstance(row, dict))

    out: list[str] = []
    seen: set[str] = set()
    for ticker in tickers:
        if not ticker or ticker in seen or ticker.endswith(".BK"):
            continue
        seen.add(ticker)
        out.append(ticker)
    return out[:80]


def safe_float(value: Any) -> float | None:
    try:
        if value is None or value == "":
            return None
        return float(value)
    except Exception:
        return None


def normalize_row(row: dict[str, Any]) -> dict[str, Any]:
    actual = safe_float(row.get("actual"))
    estimate = safe_float(row.get("estimate"))
    surprise = safe_float(row.get("surprise"))
    surprise_pct = safe_float(row.get("surprisePercent"))
    if surprise is None and actual is not None and estimate is not None:
        surprise = actual - estimate
    if surprise_pct is None and surprise is not None and estimate not in (None, 0):
        surprise_pct = (surprise / abs(estimate)) * 100
    return {
        "symbol": normalize_ticker(row.get("symbol")),
        "period": row.get("period"),
        "quarter": row.get("quarter"),
        "year": row.get("year"),
        "actual": actual,
        "estimate": estimate,
        "surprise": surprise,
        "surprisePercent": surprise_pct,
    }


def generate() -> dict[str, Any]:
    api_key = os.environ.get("FINNHUB_API_KEY", "").strip()
    tickers = load_tickers()
    output: dict[str, Any] = {
        "generated_at": now_ict().isoformat(timespec="seconds"),
        "source": "Finnhub company_earnings",
        "api_key_present": bool(api_key),
        "tickers_checked": len(tickers),
        "earnings": {},
        "errors": {},
    }
    if not api_key:
        output["errors"]["_api_key"] = "FINNHUB_API_KEY secret is missing"
        return output

    try:
        import finnhub  # type: ignore
    except Exception as exc:
        output["errors"]["_import"] = f"finnhub-python import failed: {exc}"
        return output

    client = finnhub.Client(api_key=api_key)
    for ticker in tickers:
        try:
            rows = client.company_earnings(ticker, limit=5) or []
            if not isinstance(rows, list):
                output["errors"][ticker] = "unexpected response"
                continue
            norm_rows = [normalize_row(r) for r in rows if isinstance(r, dict)]
            output["earnings"][ticker] = norm_rows
        except Exception as exc:
            output["errors"][ticker] = str(exc)
    output["count"] = sum(1 for rows in output["earnings"].values() if rows)
    return output


def save_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    data = generate()
    for folder in DATA_DIRS:
        save_json(folder / "eps_surprises.json", data)
    print(f"Generated EPS surprises: {data.get('count', 0)} / {data.get('tickers_checked', 0)} tickers")
    if data.get("errors"):
        print("EPS surprise warnings/errors:")
        for key, msg in list(data["errors"].items())[:20]:
            print(f"- {key}: {msg}")


if __name__ == "__main__":
    main()
