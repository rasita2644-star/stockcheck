# Stock Radar SEC Fundamental V1 — Python / IDLE version

เวอร์ชันนี้พัฒนาต่อจาก `stockcheck_github_v8_8_static_json_fixed` ของเดิม ไม่ใช่โปรเจกต์ standalone ใหม่

## เปลี่ยนอะไรใน V1

- Price / Technical ยังใช้ flow เดิมของ `app.py`
- Core Fundamental เปลี่ยนเป็น SEC EDGAR ก่อน
- Yahoo fundamental / quoteSummary ไม่ถูกใช้เป็น source หลักแล้ว
- Analyst target / consensus ปิดไว้ก่อน รอ V2 เชื่อม Alpha Vantage แบบ on-demand
- เพิ่มไฟล์ `sec_v1_fundamentals.py` เพื่อเปิดรันใน IDLE แยกได้
- เพิ่มไฟล์ `run_sec_v1_idle_test.py` สำหรับ test tickers และดู error แบบง่าย

## วิธี test ใน IDLE

1. เปิด IDLE
2. เปิดไฟล์ `run_sec_v1_idle_test.py`
3. กด `F5` หรือเมนู `Run > Run Module`
4. ดูผลลัพธ์และ traceback ใน Python Shell

แก้ tickers ได้ที่ตัวแปร:

```python
TEST_SYMBOLS = ["NVDA", "HOOD", "TMDX", "ASTS", "MSFT", "JEPQ", "TSM"]
```

## วิธีรันเว็บเดิม

```bash
python app.py
```

แล้วเปิด:

```text
http://localhost:8787
```

## Environment ที่แนะนำ

SEC ขอให้ระบุ User-Agent ชัดเจน ควรตั้งค่าแบบนี้ก่อนรันจริง:

```bash
set SEC_USER_AGENT=StockRadar your-email@example.com
```

บน macOS/Linux:

```bash
export SEC_USER_AGENT="StockRadar your-email@example.com"
```

ถ้าไม่ตั้ง ระบบจะใช้ default placeholder:

```text
StockTimingRadar-SEC-V1 contact@example.com
```

## Output สำคัญที่เพิ่มมา

- `fundamentalSource`: SEC EDGAR companyfacts + submissions
- `fundamentalDataQuality`: high / aging / stale / insufficient
- `latestFilingDate`
- `periodEnd`
- `formType`
- `dataFreshnessDays`
- `grossMargin`
- `operatingMargin`
- `netMargin`
- `freeCashFlow`
- `debtToEquity`
- `tagAudit`

## Guardrail สำคัญ

- ถ้าข้อมูล SEC ล่าสุดเกิน 365 วัน จะไม่ให้ Strong/Weak จาก fundamental
- ETF เช่น JEPQ / COPX จะขึ้น `ETF module required`
- หุ้น non-US หรือ ticker ที่ไม่เจอใน SEC map จะขึ้น `Insufficient SEC data`

## V2 ที่ยังไม่ทำในรอบนี้

- Alpha Vantage analyst consensus popup
- quota 25 calls/day
- cache analyst consensus ต่อ ticker ต่อวัน
