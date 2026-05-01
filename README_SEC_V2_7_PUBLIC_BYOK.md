# Stock Radar SEC V2.7 — Public GitHub Safe BYOK

This version removes the local Alpha Vantage key file flow.

## What changed

- `alpha_vantage_api_key.txt` is removed from the package.
- The app no longer writes API keys to disk.
- The Analyst Consensus tab uses BYOK: Bring Your Own Key.
- Users paste their Alpha Vantage API key in the browser and click **Save locally**.
- The key is stored only in that browser's `localStorage`.
- The key is sent to the Python backend only when the user clicks **Load consensus for TICKER**.
- Normal scan does **not** call Alpha Vantage.
- The key is not logged, cached, or committed.

## Public GitHub checklist

Before pushing this repo publicly, confirm:

```bash
rm -f alpha_vantage_api_key.txt
rm -f .env
rm -rf .alpha_vantage_cache .alpha_vantage_quota.json __pycache__
grep -R "YOUR_REAL_KEY_PREFIX" . || true
```

The `.gitignore` already excludes local secrets/runtime files:

```gitignore
.env
alpha_vantage_api_key.txt
.alpha_vantage_cache/
.alpha_vantage_quota.json
__pycache__/
*.pyc
```

## How to use Analyst Consensus

1. Run `app.py`.
2. Open a ticker detail page.
3. Go to **Analyst Consensus**.
4. Paste your Alpha Vantage key.
5. Click **Save locally**.
6. Click **Load consensus for TICKER**.

The same ticker on the same UTC day uses the local backend cache and should not spend another Alpha Vantage call.

## Optional private deployment mode

For a private deployment, you may still set an environment variable:

```bash
ALPHA_VANTAGE_API_KEY=your_key_here
```

But for public GitHub, do not commit `.env` and do not include any key file.
