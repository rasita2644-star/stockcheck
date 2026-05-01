#!/usr/bin/env python3
"""IDLE test runner for SEC Fundamental V1.

How to use in IDLE:
1) Open this file in IDLE.
2) Edit TEST_SYMBOLS below if needed.
3) Press F5 / Run Module.

No API key required. First run may take time because it fetches SEC ticker map,
submissions, and companyfacts.
"""
from __future__ import annotations

import json
import traceback

from sec_v1_fundamentals import build_fundamental_sec_v1

TEST_SYMBOLS = [
    "NVDA",
    "HOOD",
    "TMDX",
    "ASTS",
    "MSFT",
    "JEPQ",  # ETF: should be skipped / ETF module required
    "TSM",   # ADR/foreign issuer case: may have less comparable SEC data
]

SHOW_TAG_AUDIT = False


def main() -> None:
    print("SEC Fundamental V1 IDLE Test")
    print("=" * 80)
    for symbol in TEST_SYMBOLS:
        print(f"\n--- {symbol} ---")
        try:
            result = build_fundamental_sec_v1(symbol, latest={}, include=True)
            summary_keys = [
                "fundamentalSignal",
                "fundamentalScore",
                "fundamentalSource",
                "fundamentalDataQuality",
                "assetType",
                "companyName",
                "cik",
                "latestQuarter",
                "periodEnd",
                "latestFilingDate",
                "formType",
                "dataFreshnessDays",
                "revenue",
                "revenueYoY",
                "revenueQoQ",
                "grossMargin",
                "operatingMargin",
                "netIncome",
                "profitYoY",
                "eps",
                "epsYoY",
                "freeCashFlow",
                "totalDebt",
                "debtToEquity",
                "priceTargetStatus",
            ]
            summary = {key: result.get(key) for key in summary_keys}
            print(json.dumps(summary, ensure_ascii=False, indent=2))
            reasons = result.get("fundamentalReasons") or []
            if reasons:
                print("Reasons:")
                for reason in reasons:
                    print(" -", reason)
            highlights = result.get("fundamentalHighlights") or []
            if highlights:
                print("Highlights:")
                for item in highlights:
                    print(" -", item)
            if SHOW_TAG_AUDIT:
                print("Tag audit:")
                print(json.dumps(result.get("tagAudit"), ensure_ascii=False, indent=2))
        except Exception:
            print("ERROR while testing", symbol)
            traceback.print_exc()


if __name__ == "__main__":
    main()
