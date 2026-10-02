# UNB Frontend

Angular 22 standalone frontend สำหรับตัวอย่าง Role-Based Login and Dynamic Menu

อ่านภาพรวม สถาปัตยกรรม Database/API contract วิธีเปิด PHP API และข้อจำกัดด้านความปลอดภัยได้ที่ [`../../README.md`](../../README.md)

## หน้าที่ของ frontend

- `/login` รับ username/password และเรียก `POST http://localhost:8000/login.php`
- `Auth` service เก็บ current user ใน `localStorage`
- `/main` เรียก `GET http://localhost:8000/menu.php`
- `Main` component แปลง flat menu list เป็น parent-child tree และเรียงด้วย `sort_order`

## ติดตั้งและรัน

```powershell
npm ci
npm start
```

เปิด `http://localhost:4200/` และเปิด PHP API ที่ `http://localhost:8000` ก่อนทดลอง login

## คำสั่งสำหรับพัฒนา

```powershell
npm test
npm run build
npm run watch
```

## จุดที่แก้เมื่อตั้งค่า environment

- Login API URL: `src/app/services/login.ts`
- Menu API URL: `src/app/services/menu.ts`
- Routes: `src/app/app.routes.ts`
- Login UI: `src/app/login/`
- Main/menu UI: `src/app/main/`

API URL ยังถูกกำหนดใน source codeเพื่อให้ตัวอย่างอ่านง่าย ก่อนใช้หลาย environment ควรย้ายไป Angular environment/configuration provider

## ขอบเขต

Frontend นี้เป็น learning prototype ยังไม่มี server-verified session, route guard, interceptor, session expiry หรือ production authorization โปรดอ่านรายการ security improvements ใน README หลักก่อนนำแนวคิดไปใช้งานจริง

