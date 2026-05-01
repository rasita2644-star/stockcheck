# SEC V2.6.1 — AI View Collapsible Sources

ปรับ AI View ให้ซ่อนที่มาข้อมูลเป็นค่าเริ่มต้น เพื่อลดความรกของหน้า Earnings Snapshot

## เปลี่ยนแปลง

- ประโยค AI View ยังแสดงตัวเลขเต็มเหมือน V2.6
- ส่วน `— ที่มา: ...` ถูกย้ายไปอยู่ในปุ่มเล็ก `ที่มา` ต่อท้ายแต่ละ bullet
- กดปุ่ม `ที่มา` เพื่อเปิดดู source/context ของ metric นั้น ๆ
- แก้ทั้ง `static/app.js` และ `site/app.js`

## วิธีใช้

เปิด `app.py` ใน IDLE แล้วกด F5 จากนั้นเปิด `http://localhost:8787`

หากยังเห็นข้อความที่มาแบบยาว ๆ ให้ hard refresh:

- macOS: Cmd + Shift + R
- Windows: Ctrl + Shift + R
