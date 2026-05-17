# v8.1.1 Attention Render Fix

Fixes Today page rendering blank because `#attentionPage` was inserted after `.app-shell`; `.app-shell` has `min-height: 100vh`, so the Attention content was pushed below the first viewport.

Change:
- Insert `#attentionPage` inside `.app-shell`, directly after `.topbar`.
- Keep existing `attention_today.json` loading logic.

Test:
```bash
node --check site/app.js
node --check static/app.js
python scripts/validate_static_data.py
```
