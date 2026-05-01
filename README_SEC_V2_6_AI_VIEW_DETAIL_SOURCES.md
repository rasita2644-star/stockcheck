# V2.6 — AI View Detail + SEC Source Context

ปรับ `AI view` ให้ไม่แสดงแค่เปอร์เซ็นต์แล้ว แต่เพิ่มตัวเลขประกอบและที่มาจาก SEC EDGAR companyfacts

## ตัวอย่างรูปแบบใหม่

- Revenue YoY เป็นบวก จาก 61.50M ใน Q3 2024 เป็น 71.71M ใน Q3 2025 (+16.6%) — ที่มา: SEC EDGAR companyfacts, 10-Q, filed 2025-10-30, period end 2025-09-30
- Gross margin เป็นบวกที่ 0.7% โดยคำนวณจาก gross profit / revenue ในไตรมาสล่าสุด
- Free cash flow เป็นบวกที่ ... จาก operating cash flow และ capex
- Debt/Equity แสดง total debt เทียบกับ equity

## Scope

- ยังใช้ SEC เป็น core fundamental เหมือน V2.5
- Analyst Consensus ยังเป็น Alpha Vantage manual/on-demand
- Company Guidance engine ยังเป็น V2.5 guidance history parser
