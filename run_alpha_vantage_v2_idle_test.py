#!/usr/bin/env python3
"""Small one-ticker Alpha Vantage V2.7 BYOK test for IDLE.

Public-safe mode no longer reads alpha_vantage_api_key.txt. When you run this
script, paste your Alpha Vantage API key into the IDLE prompt. The key is used
only for this test call and is not saved to disk.

This calls Alpha Vantage OVERVIEW once unless the same ticker is cached today.
"""

from __future__ import annotations

import getpass
import json

from app import build_alpha_vantage_consensus_payload, alpha_vantage_quota_status


TEST_SYMBOL = "AMD"
CURRENT_PRICE = None  # Optional: set a number to calculate target upside.


def main() -> None:
    print("Quota before:")
    print(json.dumps(alpha_vantage_quota_status(), indent=2, ensure_ascii=False))

    api_key = getpass.getpass("Paste Alpha Vantage API key for this one test call: ").strip()
    if not api_key:
        print("No API key entered. Aborted.")
        return

    print(f"\nLoading Alpha Vantage analyst target for {TEST_SYMBOL}...")
    payload = build_alpha_vantage_consensus_payload(TEST_SYMBOL, current_price=CURRENT_PRICE, api_key=api_key)
    print(json.dumps(payload, indent=2, ensure_ascii=False))

    print("\nQuota after:")
    print(json.dumps(alpha_vantage_quota_status(), indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
