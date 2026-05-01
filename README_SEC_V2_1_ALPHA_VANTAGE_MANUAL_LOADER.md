# Stockcheck SEC V2.1 — Alpha Vantage Manual Loader Fix

ต่อจาก SEC V1.7 + Alpha Vantage V2 โดยแก้ตาม feedback:

## สิ่งที่เปลี่ยน

1. **ตาราง Fundamental ไม่มี analyst columns แล้ว**
   - ลบ Target Mean
   - ลบ Upside to Target
   - ลบ Analysts
   - analyst consensus อยู่เฉพาะใน detail section เท่านั้น

2. **เพิ่ม Manual Loader สำหรับ Alpha Vantage**
   - เปิด detail ของหุ้นหนึ่งตัว
   - ไปที่ `Analyst Consensus — Alpha Vantage V2 Manual Loader`
   - วาง API key แล้วกด `Save key locally`
   - กด `Load consensus for <TICKER>`

3. **scan ปกติไม่เรียก Alpha Vantage**
   - `/api/scan` ยังใช้ SEC + Yahoo price เหมือนเดิม
   - Alpha Vantage เรียกเฉพาะปุ่มใน detail
   - ticker เดิมในวัน UTC เดียวกันใช้ cache ไม่กิน quota ซ้ำ

4. **ป้องกัน browser cache ระหว่างทดสอบใน IDLE**
   - server ใส่ no-store header สำหรับ static files
   - เปลี่ยน localStorage key เพื่อล้าง column setting เก่า

5. **Fundamental score ไม่ใช้ analyst target แล้ว**
   - target/consensus เป็น optional overlay
   - SEC core score ใช้ revenue/earnings/profit/guidance เป็นหลัก

## วิธีรันใน IDLE

เปิด `app.py` แล้วกด F5 จากนั้นเปิด:

```text
http://localhost:8787
```

ถ้าต้องการใส่ key แบบไฟล์แทน UI ให้สร้างไฟล์:

```text
alpha_vantage_api_key.txt
```

แล้ววาง key อย่างเดียวในไฟล์นั้น

## หมายเหตุ

ไฟล์ `alpha_vantage_api_key.txt` ถูกใส่ใน `.gitignore` แล้ว ไม่ควรอัปโหลดขึ้น GitHub
