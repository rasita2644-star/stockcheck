# SEC V1.3.1 — BrokenPipe Guard for IDLE

This version keeps the SEC V1.3 company guidance parser and adds a local-server safety fix.

## What was fixed

When the browser refreshes, closes a tab, or starts a new `/api/scan` request before the previous response finishes, Python's built-in `http.server` can raise:

```text
BrokenPipeError: [Errno 32] Broken pipe
```

This is a client disconnect, not a SEC/company-guidance parsing failure.

## Changes

- Wrapped JSON responses in `try/except` for:
  - `BrokenPipeError`
  - `ConnectionResetError`
  - `ConnectionAbortedError`
- Added the same guard for static files such as `app.js` and `index.html`.
- IDLE now prints a short one-line message instead of a red traceback:

```text
client disconnected while sending response; ignored.
```

## How to run

Open `app.py` in IDLE and press `F5`.

Then open:

```text
http://localhost:8787
```
