# Stepdown sync relay (ตั้งครั้งเดียว ฟรี)

server ตัวกลางเล็ก ๆ ที่ให้ Shortcut ส่งข้อมูล Health มาให้แอปโดยไม่ต้อง copy and paste
ใช้ Cloudflare Workers แพ็กเกจฟรี (รองรับ 100,000 ครั้งต่อวัน)

## ขั้นตอน (ประมาณ 10 นาที ทำบนคอม)

1. สมัครหรือล็อกอินที่ https://dash.cloudflare.com
2. เมนูซ้าย **Storage & Databases → KV** กด **Create** ตั้งชื่อ `SYNC`
3. เมนูซ้าย **Compute (Workers) → Workers & Pages** กด **Create → Create Worker** ตั้งชื่อ `stepdown-sync` แล้วกด **Deploy**
4. กด **Edit code** ลบโค้ดเดิมทั้งหมด วางโค้ดจากไฟล์ `worker.js` แล้วกด **Deploy**
5. กลับไปหน้า Worker แท็บ **Settings → Bindings** กด **Add → KV namespace**
   Variable name = `SYNC` และเลือก namespace `SYNC` ที่สร้างในข้อ 2 แล้วกด **Save/Deploy**
6. คัดลอกที่อยู่ Worker เช่น `https://stepdown-sync.<ชื่อบัญชี>.workers.dev`
7. ในแอป: การ์ด Apple Health → **วิธีตั้งค่า** → ช่อง **ที่อยู่ server ซิงก์** วางที่อยู่ในข้อ 6 แล้วกด **บันทึก**
8. ทำตามขั้นตอนในแอปเพื่อเพิ่ม **Get Contents of URL** ใน Shortcut

## ทดสอบว่า Worker ทำงาน
เปิด `https://stepdown-sync.<ชื่อบัญชี>.workers.dev` ใน browser ต้องขึ้นข้อความ `Stepdown sync relay`

## ความเป็นส่วนตัว
- เก็บข้อมูลแค่ชั่วคราว ลบทันทีที่แอปดึงไป และลบเองภายใน 3 วัน
- แต่ละคนมีลิงก์ส่วนตัวเป็นรหัสสุ่ม 20 ตัวอักษร
- ถ้าเปิดให้คนอื่นใช้ ควรแจ้งใน privacy policy ว่าข้อมูลสุขภาพผ่าน server ชั่วคราว (ข้อมูลอ่อนไหวตาม PDPA)
