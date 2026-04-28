Stockcheck GitHub v8.8 — Static JSON fix

This fixes the GitHub Pages error:
Unexpected token '<', '<!DOCTYPE...' is not valid JSON

Cause:
The previous GitHub package used the Python local app.js that calls /api/scan and /api/quote.
GitHub Pages is static and has no backend API, so those requests returned HTML instead of JSON.

Fix:
site/app.js and static/app.js now load:
site/data/scanner.json

How to update:
1) Push this folder to GitHub.
2) Run Actions workflow.
3) Open https://rasita2644-star.github.io/stockcheck/?v=88
4) Check https://rasita2644-star.github.io/stockcheck/data/scanner.json?v=88
   It must start with { not <!DOCTYPE html>.
