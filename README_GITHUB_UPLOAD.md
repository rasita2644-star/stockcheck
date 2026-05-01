# Public GitHub Upload Notes — Stock Radar V2.7

This project can be uploaded to a public GitHub repository **only if no real API keys are committed**.

## Safe Alpha Vantage mode

V2.7 uses BYOK (Bring Your Own Key):

- No `alpha_vantage_api_key.txt` file is included.
- No `.env` file is included.
- Users paste their Alpha Vantage API key in the **Analyst Consensus** tab.
- The key is saved only in that browser's `localStorage`.
- The key is sent to the Python backend only when the user clicks **Load consensus for TICKER**.

## Do not commit

```bash
.env
alpha_vantage_api_key.txt
.alpha_vantage_cache/
.alpha_vantage_quota.json
__pycache__/
*.pyc
```

These are already included in `.gitignore`.

## Important: GitHub Pages is not enough

This version needs the Python backend (`app.py`) for `/api/scan`, SEC EDGAR fetching, Yahoo chart fetching, guidance parsing, and Alpha Vantage on-demand calls. GitHub Pages can host static files only, so for full functionality use a Python-capable host such as Render, Railway, PythonAnywhere, Fly.io, or a VPS.

## Local run

```bash
python app.py
```

Then open:

```text
http://localhost:8787
```
