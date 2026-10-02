# UNB Frontend

Angular 22 standalone frontend สำหรับตัวอย่าง Role-Based Login and Dynamic Menu

อ่านภาพรวมและขอบเขตของโปรเจกต์ได้ที่ [`../../README.md`](../../README.md)

## หน้าที่ของ frontend

- แสดงหน้า Login และสถานะระหว่างส่งคำขอ
- เรียก PHP API ผ่าน Angular services
- เก็บสถานะผู้ใช้สำหรับการสาธิต
- แสดงหน้าหลักหลังเข้าสู่ระบบ
- แปลงรายการเมนูเป็น parent-child tree
- เรียงและเปิด/ปิดรายการเมนูย่อย

## ติดตั้งและรัน

```powershell
npm ci
npm start
```

เปิด `http://localhost:4200/`

การทดลอง flow แบบครบระบบต้องเปิด PHP API และตั้งค่า test environment ของผู้ทดลองเอง

## คำสั่งสำหรับพัฒนา

```powershell
npm test
npm run build
npm run watch
```

## จุดสำคัญใน source code

- API clients และสถานะผู้ใช้: `src/app/services/`
- Routes: `src/app/app.routes.ts`
- Login UI: `src/app/login/`
- Main และ Dynamic Menu UI: `src/app/main/`

## ขอบเขต

Frontend นี้เป็น learning prototype ก่อนใช้จริงควรเพิ่ม server-verified session, route guard, interceptor, session expiry, environment configuration และ automated security tests ตาม README หลัก


