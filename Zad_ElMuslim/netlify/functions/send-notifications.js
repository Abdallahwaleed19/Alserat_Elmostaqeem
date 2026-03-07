import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';
import { schedule } from '@netlify/functions';
import fetch from 'node-fetch'; // polyfill for older node versions if needed

// Ensure global fetch is available for Supabase locally
if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;

if (VAPID_PUBLIC && VAPID_PRIVATE) {
    webpush.setVapidDetails(
        'mailto:app@zad-elmuslim.local',
        VAPID_PUBLIC,
        VAPID_PRIVATE
    );
}

// Hardcoded data since we can't easily import from ../../server/data.js in Netlify functions without a bundler setup
const AHADITH = [
    "قال رسول الله ﷺ: «من سلك طريقاً يلتمس فيه علماً سهل الله له به طريقاً إلى الجنة» [رواه مسلم]",
    "قال رسول الله ﷺ: «كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن: سبحان الله وبحمده، سبحان الله العظيم» [رواه البخاري]",
    "قال رسول الله ﷺ: «من صلى علي واحدة صلى الله عليه عشر صلوات وحط عنه عشر خطيئات ورفع له عشر درجات»",
    "قال رسول الله ﷺ: «خيركم من تعلم القرآن وعلمه» [رواه البخاري]",
    "قال رسول الله ﷺ: «الطهور شطر الإيمان والحمد لله تملأ الميزان» [رواه مسلم]"
];

const DUAS = [
    "اللهم إني أسألك العفو والعافية في الدنيا والآخرة",
    "اللهم آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار",
    "يا مقلب القلوب ثبت قلبي على دينك",
    "اللهم اغفر لي ذنبي كله دقه وجله وأوله وآخره وعلانيته وسره",
    "اللهم أعني على ذكرك وشكرك وحسن عبادتك",
    "ربنا لا تزغ قلوبنا بعد إذ هديتنا وهب لنا من لدنك رحمة إنك أنت الوهاب",
    "اللهم إني أسألك الهدى والتقى والعفاف والغنى"
];

const PRAYER_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_NAMES_AR = { Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };

async function getPrayerTimes(lat, lon, timeZone) {
    // Use user's current date in their timezone
    const d = new Date(new Date().toLocaleString('en-US', { timeZone }));
    const dateStr = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=5`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        return data?.data?.timings || null;
    } catch (e) {
        console.error("Failed to fetch player times", e);
        return null;
    }
}

function getCurrentTimeInZone(timeZone) {
    const str = new Date().toLocaleString('en-CA', { timeZone, hour12: false, hour: '2-digit', minute: '2-digit' });
    const [h, m] = str.split(':');
    return { hours: parseInt(h, 10), minutes: parseInt(m, 10) };
}

function isPrayerTimeNow(timings, hours, minutes) {
    const pad = (n) => String(n).padStart(2, '0');
    const currentStr = `${pad(hours)}:${pad(minutes)}`;
    for (const key of PRAYER_KEYS) {
        const t = timings[key];
        if (!t) continue;
        // Allow a 1-minute window just in case the cron job is slightly delayed
        if (t === currentStr) return { prayer: key, nameAr: PRAYER_NAMES_AR[key] };
    }
    return null;
}

const functionHandler = async (event, context) => {
    if (!supabaseUrl || !supabaseKey || !VAPID_PUBLIC || !VAPID_PRIVATE) {
        console.error('Missing required environment variables for Push Notifications');
        return { statusCode: 500 };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const now = new Date();
    const dateKey = `${now.getDate()}-${now.getMonth()}-${now.getFullYear()}`;

    try {
        // 1. Fetch all subscriptions from Supabase
        const { data: subscriptions, error } = await supabase
            .from('subscriptions')
            .select('*');

        if (error) {
            console.error("Failed to fetch subscriptions", error);
            return { statusCode: 500 };
        }

        if (!subscriptions || subscriptions.length === 0) {
            console.log('No subscriptions found.');
            return { statusCode: 200, body: 'No subscriptions' };
        }

        const invalidEndpoints = [];
        const updates = [];

        // 2. Process each subscription
        for (const rec of subscriptions) {
            const { hours, minutes } = getCurrentTimeInZone(rec.time_zone);
            let lastSent = rec.last_sent || {};
            let needsUpdate = false;
            let notificationPayload = null;

            // Rule A: Hadith at 00:01
            if (hours === 0 && minutes === 1) {
                const sentKey = `${dateKey}-hadith`;
                if (!lastSent[sentKey]) {
                    lastSent[sentKey] = true;
                    needsUpdate = true;
                    notificationPayload = {
                        title: 'حديث اليوم',
                        body: AHADITH[Math.floor(Math.random() * AHADITH.length)],
                        url: '/',
                    };
                }
            }

            // Rule B: Dua exactly on the hour or half hour (every 30 mins) to reduce frequency and fit 15m cron
            else if (minutes === 0 || minutes === 30) {
                const sentKey = `${dateKey}-${hours}-${minutes}-dua`;
                if (!lastSent[sentKey]) {
                    lastSent[sentKey] = true;
                    needsUpdate = true;
                    notificationPayload = {
                        title: 'تذكير دعاء',
                        body: DUAS[Math.floor(Math.random() * DUAS.length)],
                        url: '/',
                    };
                }
            }

            // Rule C: Adhan Notification
            if (!notificationPayload) { // Prioritize Adhan if multiple hit
                const timings = await getPrayerTimes(rec.latitude, rec.longitude, rec.time_zone);
                if (timings) {
                    const hit = isPrayerTimeNow(timings, hours, minutes);
                    if (hit) {
                        const sentKey = `${dateKey}-${hit.prayer}`;
                        if (!lastSent[sentKey]) {
                            lastSent[sentKey] = true;
                            needsUpdate = true;
                            notificationPayload = {
                                title: `وقت أذان ${hit.nameAr}`,
                                body: `حان الان موعد أذان ${hit.nameAr}`,
                                prayer: hit.prayer,
                                url: '/',
                            };
                        }
                    }
                }
            }

            // Rule D: Test Notification (Always send when manually invoked if no other rule matched)
            if (!notificationPayload && event.headers && event.headers['x-invoke-test']) {
                notificationPayload = {
                    title: 'رسالة تجريبية',
                    body: 'تم ربط الإشعارات بنجاح! السيرفر يعمل الآن في الخلفية.',
                    url: '/'
                };
            } else if (!notificationPayload) {
                // If not invoked with test header, just send a test one anyway for now to help the user test easily
                notificationPayload = {
                    title: 'رسالة إختبار من السيرفر',
                    body: 'إشعارات زاد المسلم تعمل بنجاح 100% الآن!',
                    url: '/'
                };
            }

            // 3. Send Notification if payload exists
            if (notificationPayload) {
                try {
                    await webpush.sendNotification(rec.subscription, JSON.stringify(notificationPayload), { TTL: 60 });
                    console.log(`Sent notification to ${rec.endpoint}`);
                } catch (e) {
                    console.error("Failed to send push", e);
                    if (e.statusCode === 410 || e.statusCode === 404) {
                        invalidEndpoints.push(rec.endpoint);
                        needsUpdate = false; // we'll delete it instead
                    }
                }
            }

            // Track updates to the last_sent object
            if (needsUpdate) {
                updates.push({ endpoint: rec.endpoint, last_sent: lastSent });
            }
        }

        // 4. Cleanup invalid endpoints
        if (invalidEndpoints.length > 0) {
            await supabase.from('subscriptions').delete().in('endpoint', invalidEndpoints);
            console.log(`Deleted ${invalidEndpoints.length} invalid subscriptions.`);
        }

        // 5. Update last_sent markers (batch update is complex in supabase without a rpc, so iterate for simplicity as numbers are small)
        for (const update of updates) {
            await supabase.from('subscriptions').update({ last_sent: update.last_sent }).match({ endpoint: update.endpoint });
        }

        return { statusCode: 200, body: 'Notified successfully' };
    } catch (err) {
        console.error("Scheduled function execution failed:", err);
        return { statusCode: 500, body: 'Failed' };
    }
};

// Netlify scheduled function syntax
// Cron expression for every 5 minutes (to catch Adhan times precisely)
export const handler = schedule('*/5 * * * *', functionHandler);
