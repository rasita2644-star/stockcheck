# SEC V1.6.1 — Quiet IDLE logs

This version suppresses normal local HTTP access logs in IDLE.

Normal lines such as these are not errors:

- `GET / HTTP/1.1 200`
- `GET /app.js HTTP/1.1 304`
- `GET /api/scan?... HTTP/1.1 200`

Meaning:

- `200` = request succeeded
- `304` = browser cache is still valid
- long `/api/scan?...` URL = the watchlist symbols passed to the local scanner

By default, the app now only prints the startup line and real 4xx/5xx errors.

To re-enable full HTTP logs for debugging, run with:

```bash
STOCK_RADAR_HTTP_LOG=1 python app.py
```
