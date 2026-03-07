# خادم إشعارات الأذان (حتى عند إغلاق التطبيق)

هذا الخادم يرسل إشعاراً (Web Push) عند دخول وقت كل صلاة، بحسب موقع المستخدم. عند النقر على الإشعار يفتح التطبيق ويشغّل الأذان.

## التشغيل

1. تثبيت الحزم:
   ```bash
   cd server && npm install
   ```

2. إنشاء مفاتيح VAPID (مرة واحدة):
   ```bash
   npm run generate-vapid
   ```
   انسخ المفتاح العام (VAPID_PUBLIC_KEY) والمفتاح الخاص (VAPID_PRIVATE_KEY) إلى ملف `.env` داخل مجلد `server`:
   ```
   PORT=3001
   VAPID_PUBLIC_KEY=...
   VAPID_PRIVATE_KEY=...
   ```

3. تشغيل الخادم:
   ```bash
   npm run start
   ```
   أو من جذر المشروع: `npm run push-server` (بعد تثبيت حزم server).

## ملاحظات

- التطبيق الأمامي يتصل بالخادم على `http://localhost:3001` افتراضياً. لتغيير العنوان أنشئ ملف `.env` في جذر المشروع وضَع: `VITE_PUSH_SERVER_URL=https://عنوان-خادمك`.
- للإنتاج: انشر هذا الخادم على أي استضافة (Node.js) واتصل به عبر HTTPS (مطلوب لـ Web Push).
