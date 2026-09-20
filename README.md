# ลดทีละด่าน

เว็บวางแผนลดน้ำหนัก: กรอกข้อมูลครั้งเดียว ได้แผนรายวัน รายสัปดาห์ รายเดือน และแผนออกกำลังกาย
ส่งเข้า Calendar / Reminders ของ iPhone และปรับแผนทุกสัปดาห์จากค่าเฉลี่ยน้ำหนักในแอป Health

- ไม่มี server ข้อมูลทั้งหมดเก็บใน browser ของผู้ใช้ (localStorage)
- ใช้งาน offline ได้หลังเปิดครั้งแรก (service worker)
- เพิ่มลงหน้าจอโฮมของ iPhone ได้ (Share → Add to Home Screen)

ไฟล์: `index.html` (ตัวแอป), `sw.js` (offline), `manifest.webmanifest` + `icon-*.png` (ไอคอนหน้าจอโฮม)

แผนนี้เป็นแนวทางทั่วไป ไม่ใช่คำแนะนำทางการแพทย์
