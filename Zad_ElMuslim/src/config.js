// عنوان خادم إشعارات الأذان (يُستخدم عند تفعيل "الأذان حتى عند إغلاق التطبيق")
export const PUSH_SERVER_URL =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PUSH_SERVER_URL
    ? import.meta.env.VITE_PUSH_SERVER_URL
    : 'http://localhost:3001';
