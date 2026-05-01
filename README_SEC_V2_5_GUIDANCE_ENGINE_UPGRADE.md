# SEC V2.5 — Guidance Engine Upgrade

ต่อจาก V2.4.1 โดยยังคงโครงเดิม: SEC เป็น fundamental core และ Alpha Vantage เป็น manual/on-demand analyst consensus

## สิ่งที่เพิ่มใน V2.5

### Guidance Extraction Engine
- ย้อนดู 8-K / 6-K หลายปีขึ้น: default 1460 วัน
- เพิ่มจำนวน filing ที่สแกน: default 40 filings
- สแกนหลาย exhibit ต่อ filing: default 8 docs
- อ่าน EX-99.1 / EX-99 / earnings release / shareholder letter / press release
- แปลง HTML table เป็น text ที่ parse ได้ดีขึ้น
- parse revenue guidance หลาย pattern:
  - revenue between $X and $Y
  - revenue of $X to $Y
  - table style: Revenue | $X | $Y
  - Q3 FY25 / fourth quarter fiscal 2025 / quarter ending Dec 31, 2025

### Confidence Score
ทุก guidance candidate มี confidence:
- high: period + revenue + guidance context ชัด
- medium: plausible แต่ไม่ครบทุกชิ้น
- low: เก็บไว้ debug แต่ไม่ใช้คำนวณ actual-vs-guide

ระบบจะใช้เฉพาะ medium/high ในการคำนวณ:
`Actual vs Prior Guide %`

### Debug View
ใน Company Guidance View เพิ่ม:
- Guidance History table
- filings/documents ที่ scan
- จำนวน raw candidates
- high / medium / low count
- debug snippets เพื่อดูว่าดึงเลขมาจากประโยคไหน

## วิธีรัน

เปิด `app.py` ใน IDLE แล้วกด F5

ถ้าอยากปรับความละเอียด:
```bash
SEC_GUIDANCE_LOOKBACK_DAYS=1460
SEC_GUIDANCE_MAX_FILINGS=40
SEC_GUIDANCE_MAX_DOCUMENTS_PER_FILING=8
SEC_GUIDANCE_MIN_CONFIDENCE=medium
```

## ข้อควรจำ
Company guidance ไม่ใช่ structured data แบบงบ SEC companyfacts จึงยังมีโอกาส N/A อยู่ โดยเฉพาะบริษัทที่ไม่ให้ guidance รายไตรมาส หรือ guidance อยู่ในไฟล์/รูปแบบที่ parse ยาก
