# SEC V2.3 — Alpha Vantage Analyst Visuals

ต่อจาก V2.2 โดยยังคงหลักการเดิม:

- SEC EDGAR เป็น core fundamental engine
- Alpha Vantage ไม่ถูกเรียกตอน scan ตาราง
- ต้องเปิด detail รายหุ้นแล้วกด Load consensus เท่านั้น
- ticker เดิมในวันเดียวกันใช้ cache ไม่กิน quota ซ้ำ
- API key เก็บ local ในไฟล์ `alpha_vantage_api_key.txt` หรือใส่ผ่าน UI

## เพิ่มใน V2.3

### 1) Analyst Rating Distribution

หลังดึง Alpha Vantage `OVERVIEW` แล้ว ระบบแสดง bar chart จาก field:

- `AnalystRatingStrongBuy`
- `AnalystRatingBuy`
- `AnalystRatingHold`
- `AnalystRatingSell`
- `AnalystRatingStrongSell`

จุดประสงค์คือให้เห็นทันทีว่า consensus เป็น buy-heavy, hold-heavy หรือมี sell pressure จริง

### 2) Current vs Target Position

แสดง price map จาก:

- ราคาปัจจุบันจาก Yahoo chart
- `AnalystTargetPrice`
- `52WeekLow`
- `52WeekHigh`

หมายเหตุ: Alpha Vantage `OVERVIEW` ให้ target เป็นค่าเดียว ไม่ใช่ high/low/median target range ดังนั้นกราฟนี้คือ price-position map ไม่ใช่ full analyst target range distribution

## วิธีรันใน IDLE

เปิด `app.py` แล้วกด F5

จากนั้นเปิด:

```text
http://localhost:8787
```

เปิดหุ้นหนึ่งตัว กด `Load consensus for TICKER` แล้วดู section:

```text
Analyst Consensus — Alpha Vantage V2.3 Manual Loader
```

## Syntax checks

ตรวจแล้ว:

```text
python -m py_compile app.py sec_v1_fundamentals.py run_alpha_vantage_v2_idle_test.py
node --check static/app.js
node --check site/app.js
```
