# SEC V1.3 — Company Guidance Parser

เวอร์ชันนี้พัฒนาต่อจาก `stockcheck_sec_v1_2_python_idle` โดยยังเป็น Python-first สำหรับเปิดใน IDLE ได้เหมือนเดิม

## สิ่งที่เพิ่มจาก V1.2

1. เพิ่ม parser สำหรับ company guidance จาก SEC 8-K / 6-K และเอกสารแนบ เช่น Exhibit 99.1
2. แยกชื่อ field เป็น `companyGuidance*` เพื่อไม่ปนกับ analyst consensus
3. เพิ่มคอลัมน์ใน Fundamental tab:
   - `Co. Rev Guide Mid`
   - `Guide Period`
   - `Actual vs Guide %`
4. เพิ่ม Company Guidance View ใน detail popup
5. Consensus estimate / analyst target ยังเป็น V2 on-demand ผ่าน Alpha Vantage ตามแผนเดิม

## หลักการสำคัญ

Company guidance ไม่ใช่ analyst consensus

ดังนั้น V1.3 จะไม่เติมค่า `estimatedRevenue` หรือ `revenueSurprisePct` จาก guidance โดยตรง เพราะจะทำให้ตารางอ่านผิดว่าเป็น consensus estimate

V1.3 จะเติม field แยกต่างหากแทน:

```text
companyGuidanceRevenue
companyGuidanceRevenueLow
companyGuidanceRevenueHigh
companyGuidanceRevenuePeriod
guidanceRevenueDeltaPct
companyGuidanceEps
companyGuidanceEpsLow
companyGuidanceEpsHigh
```

## Logic การคำนวณ Actual vs Guide %

ระบบจะคำนวณ `guidanceRevenueDeltaPct` เฉพาะเมื่อ:

```text
companyGuidanceRevenuePeriod == latestQuarter
```

เช่น guidance บอก Q3 2025 revenue midpoint แล้วงบล่าสุดก็เป็น Q3 2025 ระบบจะเทียบ actual revenue กับ guidance midpoint ได้

ถ้า guidance เป็นอนาคต เช่น Q1 2026 แต่งบล่าสุดเป็น Q3 2025 ระบบจะแสดง guidance midpoint แต่ไม่คำนวณ surprise เพราะยังไม่ comparable

## Environment variables

ตั้งได้ถ้าต้องการลด/เพิ่มขอบเขตการค้นหา:

```bash
SEC_GUIDANCE_LOOKBACK_DAYS=240
SEC_GUIDANCE_MAX_FILINGS=6
SEC_GUIDANCE_MAX_DOCUMENTS_PER_FILING=3
```

ค่า default ถูกตั้งไว้ให้ conservative เพื่อไม่ยิง SEC หนักเกินไป

## วิธีรันใน IDLE

เปิดไฟล์นี้แล้วกด F5:

```text
app.py
```

จากนั้นเปิด:

```text
http://localhost:8787
```

หรือทดสอบ SEC module ตรง ๆ:

```text
run_sec_v1_idle_test.py
```

## ข้อจำกัด

Guidance ใน earnings release ไม่ได้มีรูปแบบเดียวกันทุกบริษัท บางบริษัทใช้รูปภาพ ตารางซับซ้อน หรือ wording แปลก ๆ ทำให้ parser อาจหาไม่เจอได้

ระบบจึงตั้งใจ conservative: ถ้าไม่มั่นใจจะขึ้น N/A ดีกว่าดึงเลขผิดแล้วทำเหมือนฉลาด
