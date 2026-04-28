Stockcheck GitHub Pages v8.7 fixed

This package fixes the previous GitHub build where the redesigned UI existed in static/ but GitHub Pages used old files from site/.

Fixed:
- site/app.js is now synced from static/app.js
- site/styles.css is now synced from static/styles.css
- Fundamental detail uses the redesigned cards and target rail
- Number formatting uses M/B/T units in the UI

Upload/push this whole folder to GitHub, then run the Pages workflow.
