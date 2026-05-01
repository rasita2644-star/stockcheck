# Stock Radar SEC V2.4.1 — Fundamental dashboard JS error fix

## Fixed

- Fixed runtime error: `Cannot access 'keyActionHtml' before initialization`.
- Fundamental dashboard detail view now renders again.
- Analyst Consensus API key section still uses the saved server-side key when `alpha_vantage_api_key.txt` exists.
- If the key file is missing, the UI safely falls back to the manual key input.

## How to run in IDLE

1. Open `app.py`.
2. Press F5 / Run Module.
3. Open `http://localhost:8787`.
4. Hard refresh once if the browser cached the previous `app.js`.

Mac: Cmd + Shift + R  
Windows: Ctrl + Shift + R
