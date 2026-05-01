# SEC V2.4 — Saved Alpha Vantage key + detail tabs

Changes:

- Alpha Vantage API key is pre-saved in `alpha_vantage_api_key.txt` for local IDLE use.
- The frontend no longer asks for the key when the backend already has one.
- The detail dashboard is split into three tabs:
  - Earnings Snapshot
  - Company Guidance View
  - Analyst Consensus
- Alpha Vantage is still on-demand only. It does not run during scanner load.
- Analyst consensus still uses `OVERVIEW` only, one API call per ticker per day, with same-day cache.

Security note:

`alpha_vantage_api_key.txt` is local-only and excluded by `.gitignore`. Do not upload this file to public GitHub.
