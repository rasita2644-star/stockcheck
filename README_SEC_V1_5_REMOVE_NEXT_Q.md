# SEC V1.5 - Remove Days to Next Q

This version removes the `Days to Next Q End` / `Next Q End` UI elements because SEC period-end projection is not useful enough for the Stock Radar fundamental table.

Changes:

- Removed `Days to Next Q End` from the Fundamental table.
- Removed `Next Q End` mini-card from the detail dashboard.
- Kept backend fields harmlessly available for debugging/backward compatibility, but they are no longer shown in the UI.
- Consensus estimate columns remain removed; analyst consensus stays reserved for the future Alpha Vantage on-demand popup.

Run in IDLE:

1. Open `app.py`
2. Press F5
3. Open `http://localhost:8787`
4. Hard refresh the browser if old columns still show: Cmd+Shift+R / Ctrl+Shift+R
