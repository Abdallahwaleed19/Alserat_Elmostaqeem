# تشغيل التطبيق + الأذان التلقائي لأي جهاز (Netlify + خادم الإشعارات)

حتى يعمل **الأذان عند إغلاق التطبيق** على أي جهاز يفتح الرابط من Netlify، تحتاج خطوتين: نشر الواجهة على Netlify، ونشر خادم الإشعارات على استضافة تدعم Node.js (مع HTTPS).

---

## الخطوة 1: نشر التطبيق (الواجهة) على Netlify

1. ارفع المشروع على GitHub (إن لم يكن مرفوعاً).
2. ادخل إلى [Netlify](https://netlify.com) واتصل بالمستودع.
3. إعدادات البناء (Build settings):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** (اتركه فارغاً إن المشروع من الجذر)
4. **لا تضف أي متغيرات بيئة الآن** — سنضيفها بعد نشر الخادم.
5. اضغط Deploy. بعد النشر سيكون عندك رابط مثل: `https://اسم-المشروع.netlify.app`  
   (Netlify يعطيك **HTTPS** تلقائياً، وهذا مطلوب للإشعارات.)

---

## الخطوة 2: نشر خادم الإشعارات (ليعمل على كل الأجهزة)

الخادم لازم يشتغل 24/7 عشان يرسل الإشعار في وقت الصلاة لأي مستخدم فعّل الميزة. استضافة مجانية مناسبة: **Render** أو **Railway**.

### أ) استخدام Render (مجاني)

1. ادخل [render.com](https://render.com) وسجّل دخول (أو عبر GitHub).
2. **New → Web Service**.
3. اتصل بنفس مستودع المشروع واختره.
4. الإعدادات:
   - **Name:** مثلاً `zad-adhan-push`
   - **Region:** اختر الأقرب (مثلاً Frankfurt).
   - **Root Directory:** اكتب `server` (مجلد الخادم داخل المشروع).
   - **Runtime:** `Node`.
   - **Build Command:** `npm install`
   - **Start Command:** `npm run start` أو `node index.js`
   - **Instance Type:** Free (يكفي للتجربة).
5. **Environment (Environment Variables)** — اضغط Add وضيف:
   - `VAPID_PUBLIC_KEY` = (المفتاح العام من الخطوة التالية)
   - `VAPID_PRIVATE_KEY` = (المفتاح الخاص من الخطوة التالية)
   - `NODE_ENV` = `production` (اختياري)
6. احفظ ثم **Create Web Service**. انتظر حتى يكتمل النشر.
7. خذ رابط الخدمة من أعلى الصفحة، مثل:  
   `https://zad-adhan-push.onrender.com`  
   (يجب أن يبدأ بـ **https**).

### إنشاء مفاتيح VAPID (مرة واحدة)

على جهازك في مجلد المشروع:

```bash
cd server
npm install
npm run generate-vapid
```

ستظهر في الطرفية سطران طويلان (مفتاح عام ومفتاح خاص). انسخهما وضع **المفتاح العام** في `VAPID_PUBLIC_KEY` و**المفتاح الخاص** في `VAPID_PRIVATE_KEY` في Render (كما في الفقرة 5 أعلاه).

---

## الخطوة 3: ربط Netlify بخادم الإشعارات

1. في Netlify: **Site settings → Environment variables**.
2. اضغط **Add a variable** أو **Add environment variable**.
3. اضف:
   - **Key:** `VITE_PUSH_SERVER_URL`
   - **Value:** رابط خادم الإشعارات **بدون شرطة في الآخر**، مثلاً:  
     `https://zad-adhan-push.onrender.com`
4. احفظ ثم من القائمة: **Deploys → Trigger deploy → Deploy site** (أو اعمل push جديد للمستودع ليعيد البناء).

مهم: المتغير `VITE_PUSH_SERVER_URL` يُضمَّن وقت البناء، لذلك **لازم تعيد نشر الموقع (Deploy)** بعد إضافته أو تغييره.

---

## النتيجة

- أي شخص يفتح **رابط Netlify** (مثلاً يشاركه أحد) ويدخل الصفحة الرئيسية ويضغط **"أذان عند إغلاق التطبيق"** ويسمح بالإشعارات → يُسجَّل على خادمك.
- عند دخول وقت كل صلاة يرسل الخادم إشعاراً لهذا الشخص (حتى لو التطبيق مغلق).
- عند النقر على الإشعار يفتح التطبيق على Netlify ويشغّل الأذان.

---

## ملخص سريع

| ماذا | أين |
|------|-----|
| رابط التطبيق (يشاركه الناس) | `https://اسم-موقعك.netlify.app` |
| خادم الإشعارات (يعمل في الخلفية) | Render (أو Railway) — رابط يبدأ بـ `https://` |
| متغير في Netlify | `VITE_PUSH_SERVER_URL` = رابط الخادم |
| إعادة النشر | بعد أي تغيير في متغيرات Netlify اعمل Deploy من جديد |

---

## لو ظهر خطأ "Subscribe failed" أو "VAPID not available"

- تأكد أن رابط الخادم يبدأ بـ **https** (مهم لـ Web Push).
- تأكد أنك أضفت `VAPID_PUBLIC_KEY` و `VAPID_PRIVATE_KEY` في Render (أو أي استضافة الخادم) وأعدت نشر الخدمة.
- على Render المجاني قد ينام الخدمة بعد فترة عدم استخدام؛ أول طلب بعدها قد يأخذ 30–60 ثانية، ثم تعود الإشعارات للعمل.
