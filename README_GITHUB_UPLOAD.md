# Stockcheck v8.6 — GitHub Pages Yahoo-only

เวอร์ชันนี้ทำไว้สำหรับอัปโหลดลง GitHub Pages โดยไม่ต้องใช้ FMP/Finnhub API key

## ใช้ข้อมูลจาก
- Yahoo chart / quoteSummary / quote v7 แบบ best-effort
- SEC companyfacts สำหรับ quarterly actuals ของหุ้น US

## โครงสร้างสำคัญ

```text
.github/workflows/deploy-pages.yml
scripts/update_data.py
site/index.html
site/app.js
site/styles.css
site/data/scanner.json
static/index.html
static/app.js
static/styles.css
app.py
watchlist.txt
requirements.txt
```

## วิธีอัปโหลดทับ repo เดิมผ่าน Terminal

```bash
cd ~/Downloads/stockcheck_github_v8_6_yahoo_only
git init
git branch -M main
git remote add origin https://github.com/rasita2644-star/stockcheck.git
git add .
git commit -m "Update Stockcheck v8.6 Yahoo-only GitHub Pages"
git push -u origin main --force
```

ถ้า remote มีอยู่แล้ว:

```bash
git remote set-url origin https://github.com/rasita2644-star/stockcheck.git
git push -u origin main --force
```

## หลัง push เสร็จ

1. ไปที่ GitHub repo
2. Settings → Pages → Source: GitHub Actions
3. Actions → Update stock data and deploy GitHub Pages → Run workflow
4. รอเขียว แล้วเปิด Pages URL

## แก้ watchlist

แก้ `watchlist.txt` แล้ว commit/push หรือแก้ผ่าน GitHub web จากนั้น Run workflow ใหม่

## หมายเหตุเรื่อง Price Target

Yahoo free endpoint ไม่รับประกันว่า targetMean/targetLow/targetHigh จะมีทุกตัว ดังนั้นบางตัวจะยังเป็น N/A ได้ โดยเฉพาะ ETF, หุ้นเล็ก, หุ้นต่างประเทศ, IPO ใหม่ หรือวันที่ endpoint ไม่ส่งค่า
