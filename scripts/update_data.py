#!/usr/bin/env python3
"""Generate static market-data JSON for GitHub Pages.

Edit watchlist.txt, then run:
  python scripts/update_data.py

The output goes to:
  site/data/scanner.json
"""
from __future__ import annotations

import datetime as dt
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE_DATA = ROOT / "site" / "data"
WATCHLIST = ROOT / "watchlist.txt"

sys.path.insert(0, str(ROOT))
from app import build_analysis  # noqa: E402


def read_watchlist() -> list[str]:
    if not WATCHLIST.exists():
        return ["NVDA", "PLTR", "TSLA", "TSM", "COST", "MSFT", "AMZN", "ORCL", "HOOD", "MSTR"]
    symbols: list[str] = []
    for raw in WATCHLIST.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        for part in line.replace(";", ",").split(","):
            symbol = part.strip().upper()
            if symbol and symbol not in symbols:
                symbols.append(symbol)
    return symbols



def _safe_get(obj, path, default=None):
    cur = obj
    for part in path:
        if isinstance(cur, dict):
            cur = cur.get(part)
        elif isinstance(cur, list) and isinstance(part, int) and 0 <= part < len(cur):
            cur = cur[part]
        else:
            return default
        if cur is None:
            return default
    return cur


def _raw(obj, path, default=None):
    value = _safe_get(obj, path, default)
    if isinstance(value, dict) and "raw" in value:
        return value.get("raw")
    return value


def _round(value, digits=2):
    try:
        if value is None:
            return None
        return round(float(value), digits)
    except Exception:
        return None


def _fmt_quarter_from_date(timestamp):
    if not timestamp:
        return None
    try:
        d = dt.datetime.utcfromtimestamp(int(timestamp)).date()
        q = (d.month - 1) // 3 + 1
        return f"Q{q} {d.year}"
    except Exception:
        return None


def _date_from_ts(timestamp):
    if not timestamp:
        return None
    try:
        return dt.datetime.utcfromtimestamp(int(timestamp)).strftime("%Y-%m-%d")
    except Exception:
        return None


def _days_to(timestamp):
    if not timestamp:
        return None
    try:
        target = dt.datetime.utcfromtimestamp(int(timestamp)).date()
        return (target - dt.datetime.utcnow().date()).days
    except Exception:
        return None


def _http_get_json(url: str, timeout: int = 20) -> dict:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122 Safari/537.36",
            "Accept": "application/json,text/plain,*/*",
            "Accept-Language": "en-US,en;q=0.9,th;q=0.8",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8", errors="replace"))


def fetch_quote_summary(symbol: str) -> dict:
    modules = ",".join([
        "price",
        "financialData",
        "calendarEvents",
        "earningsTrend",
        "defaultKeyStatistics",
    ])
    url = f"https://query1.finance.yahoo.com/v10/finance/quoteSummary/{urllib.parse.quote(symbol)}?modules={modules}"
    payload = _http_get_json(url)
    result = _safe_get(payload, ["quoteSummary", "result", 0], {}) or {}
    return result


def _score_fundamental(f: dict) -> tuple[int | None, str, list[str]]:
    score = 0
    possible = 0
    reasons: list[str] = []

    def add_points(metric, value, max_points, kind="pct"):
        nonlocal score, possible
        if value is None:
            reasons.append(f"{metric}: N/A")
            return
        possible += max_points
        v = float(value)
        if kind == "surprise":
            pts = max(0, min(max_points, (v + 5) / 20 * max_points))
        elif kind == "growth":
            pts = max(0, min(max_points, v / 30 * max_points))
        elif kind == "target":
            pts = max(0, min(max_points, (v + 5) / 35 * max_points))
        else:
            pts = max(0, min(max_points, v / 20 * max_points))
        score += pts
        if v > 10:
            reasons.append(f"{metric} แข็งแรง ({v:.1f}%)")
        elif v > 0:
            reasons.append(f"{metric} เป็นบวก ({v:.1f}%)")
        else:
            reasons.append(f"{metric} อ่อน/ติดลบ ({v:.1f}%)")

    add_points("Revenue surprise", f.get("revenueSurprisePct"), 20, "surprise")
    add_points("Revenue YoY", f.get("revenueYoY"), 15, "growth")
    add_points("Revenue QoQ", f.get("revenueQoQ"), 10, "growth")
    add_points("EPS surprise", f.get("epsSurprisePct"), 20, "surprise")
    add_points("EPS YoY", f.get("epsYoY"), 15, "growth")
    add_points("EPS QoQ", f.get("epsQoQ"), 10, "growth")
    add_points("Upside to target", f.get("targetUpsidePct"), 10, "target")

    if possible == 0:
        return None, "Insufficient data", ["ข้อมูลพื้นฐาน/estimate ไม่พอสำหรับให้คะแนน"]

    final = round(score / possible * 100)
    if final >= 85:
        signal = "Fundamental Beat / Strong"
    elif final >= 70:
        signal = "Solid / Watch"
    elif final >= 55:
        signal = "Mixed"
    else:
        signal = "Weak / Avoid"
    return int(final), signal, reasons[:8]


def build_fundamental(symbol: str, latest: dict) -> dict:
    """Best-effort Level 1 fundamentals. Missing values stay None; no fabricated figures."""
    try:
        qs = fetch_quote_summary(symbol)
    except Exception as exc:
        f = {
            "fundamentalScore": None,
            "fundamentalSignal": "Insufficient data",
            "fundamentalReasons": [f"Yahoo fundamental data unavailable: {str(exc)[:120]}"],
        }
        return f

    trend0 = _safe_get(qs, ["earningsTrend", "trend", 0], {}) or {}
    earnings_date = _raw(qs, ["calendarEvents", "earnings", "earningsDate", 0])
    current_price = latest.get("close") or _raw(qs, ["price", "regularMarketPrice"])
    target_mean = _raw(qs, ["financialData", "targetMeanPrice"])
    target_low = _raw(qs, ["financialData", "targetLowPrice"])
    target_high = _raw(qs, ["financialData", "targetHighPrice"])
    target_median = _raw(qs, ["financialData", "targetMedianPrice"])

    revenue = _raw(qs, ["financialData", "totalRevenue"])
    est_revenue = _raw(trend0, ["revenueEstimate", "avg"])
    eps = _raw(qs, ["defaultKeyStatistics", "trailingEps"])
    est_eps = _raw(trend0, ["earningsEstimate", "avg"])

    revenue_surprise = None
    if revenue is not None and est_revenue not in (None, 0):
        revenue_surprise = (float(revenue) / float(est_revenue) - 1) * 100
    eps_surprise = None
    if eps is not None and est_eps not in (None, 0):
        eps_surprise = (float(eps) / float(est_eps) - 1) * 100
    target_upside = None
    if current_price and target_mean:
        target_upside = (float(target_mean) / float(current_price) - 1) * 100

    # Public free endpoints often do not expose clean quarterly QoQ/YoY per symbol.
    # Keep these null rather than fake values.
    f = {
        "latestQuarter": _fmt_quarter_from_date(earnings_date),
        "earningsDate": _date_from_ts(earnings_date),
        "daysToNextQuarter": _days_to(earnings_date),
        "revenue": _round(revenue, 0),
        "estimatedRevenue": _round(est_revenue, 0),
        "revenueSurprisePct": _round(revenue_surprise, 2),
        "revenueQoQ": None,
        "revenueYoY": None,
        "netIncome": _round(_raw(qs, ["financialData", "netIncomeToCommon"]), 0),
        "estimatedNetIncome": None,
        "profitSurprisePct": None,
        "profitQoQ": None,
        "profitYoY": None,
        "eps": _round(eps, 3),
        "estimatedEps": _round(est_eps, 3),
        "epsSurprisePct": _round(eps_surprise, 2),
        "epsQoQ": None,
        "epsYoY": None,
        "targetLowPrice": _round(target_low, 2),
        "targetMeanPrice": _round(target_mean, 2),
        "targetMedianPrice": _round(target_median, 2),
        "targetHighPrice": _round(target_high, 2),
        "targetUpsidePct": _round(target_upside, 2),
        "fundamentalSource": "Yahoo quoteSummary best-effort; generated by workflow",
    }
    score, signal, reasons = _score_fundamental(f)
    f["fundamentalScore"] = score
    f["fundamentalSignal"] = signal
    f["fundamentalReasons"] = reasons

    highlights = []
    if f.get("revenueSurprisePct") is not None:
        highlights.append(f"Revenue เทียบ estimate: {f['revenueSurprisePct']:+.2f}%")
    if f.get("epsSurprisePct") is not None:
        highlights.append(f"EPS เทียบ estimate: {f['epsSurprisePct']:+.2f}%")
    if f.get("targetUpsidePct") is not None:
        highlights.append(f"Upside to analyst mean target: {f['targetUpsidePct']:+.2f}%")
    if not highlights:
        highlights.append("ข้อมูล estimate/target ยังไม่พอ ให้ใช้ Technical tab เป็นหลักก่อน")
    f["fundamentalHighlights"] = highlights
    return f


def main() -> None:
    SITE_DATA.mkdir(parents=True, exist_ok=True)
    rows = []
    quotes = {}
    errors = []
    symbols = read_watchlist()

    for symbol in symbols:
        try:
            data = build_analysis(symbol, range_="1y", interval="1d")
            # build_analysis already attaches fundamental data using the local v8.1 hotfix
            # (Yahoo quote v7 + SEC companyfacts fallback). Do not overwrite it here.
            rows.append(data["latest"])
            quotes[data["symbol"]] = data
            print(f"OK {symbol}")
        except Exception as exc:  # noqa: BLE001
            msg = str(exc) or repr(exc) or type(exc).__name__
            errors.append({"symbol": symbol, "error": msg})
            print(f"ERR {symbol}: {msg}")

    rows.sort(key=lambda r: (r.get("score") is not None, r.get("score", -1)), reverse=True)
    payload = {
        "generatedAt": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "count": len(rows),
        "watchlist": symbols,
        "rows": rows,
        "quotes": quotes,
        "errors": errors,
        "mode": "github-pages-static",
        "note": "Generated by GitHub Actions from watchlist.txt. Edit watchlist.txt and rerun workflow to add tickers."
    }
    (SITE_DATA / "scanner.json").write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Wrote {SITE_DATA / 'scanner.json'} with {len(rows)} rows and {len(errors)} errors")


if __name__ == "__main__":
    main()
