import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Geolocation } from '@capacitor/geolocation';

const PRAYER_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_NAMES_AR = { Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };

const RANDOM_DUAS = [
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
    "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ العَظِيمِ",
    "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    "لا حَوْلَ وَلا قُوَّةَ إِلا بِاللَّهِ",
    "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لا إِلَهَ إِلا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ",
    "لا إِلَهَ إِلا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
    "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي"
];

const DAILY_HADITHS = [
    "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    "الدِّينُ النَّصِيحَةُ",
    "مَنْ صَمَتَ نَجَا",
    "الْمَرْءُ مَعَ مَنْ أَحَبَّ",
    "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
    "يسِّرُوا وَلا تُعَسِّرُوا، وَبَشِّرُوا وَلا تُنَفِّرُوا",
    "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    "لا تَغْضَبْ",
    "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    "الطهور شطر الإيمان",
    "المسلم من سلم المسلمون من لسانه ويده",
    "الظلم ظلمات يوم القيامة",
    "اتق الله حيثما كنت",
    "من حسن إسلام المرء تركه ما لا يعنيه"
];

export function useLocalAlarms() {
    const [hasPermission, setHasPermission] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        try {
            const current = await LocalNotifications.checkPermissions();
            if (current.display === 'granted') {
                setHasPermission(true);
            }
        } catch (e) {
            console.error('Local notifications not supported or error:', e);
        }
    };

    const requestPermission = async () => {
        try {
            const isWeb = !window.Capacitor || window.Capacitor.getPlatform() === 'web';

            if (isWeb) {
                if (!("Notification" in window)) return false;
                if (Notification.permission === "granted") {
                    setHasPermission(true);
                    return true;
                }
                const perm = await Notification.requestPermission();
                if (perm === "granted") {
                    setHasPermission(true);
                    return "just_granted";
                }
                return false;
            }

            // Native Android/iOS permission request
            let req = await LocalNotifications.requestPermissions();

            // On Android 13+, check if exact alarm permission is needed and granted
            if (window.Capacitor && window.Capacitor.getPlatform() === 'android') {
                try {
                    const exactPerms = await LocalNotifications.checkPermissions();
                    if (exactPerms.exact_alarm === 'prompt' || exactPerms.exact_alarm === 'prompt-with-rationale') {
                        if (LocalNotifications.requestExactAlarm) {
                            await LocalNotifications.requestExactAlarm();
                        }
                    }
                } catch (e) { console.warn('checkPermissions exact_alarm failed', e); }
            }

            if (req.display === 'granted') {
                setHasPermission(true);
                return "just_granted";
            }
            return false;
        } catch (e) {
            console.error('Failed to request perms:', e);
            return false;
        }
    };

    const getPositionLocationOnly = async () => {
        try {
            const pos = await Geolocation.getCurrentPosition();
            return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        } catch (e) {
            console.error('Geolocation error:', e);
            return { latitude: 30.0444, longitude: 31.2357 }; // Default Cairo
        }
    };

    const fetchMonthPrayerTimes = async (lat, lon, month, year) => {
        const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lon}&method=5`;
        const res = await fetch(url);
        const data = await res.json();
        return data?.data || [];
    };

    const scheduleOfflineAlarms = async (isSilent = false) => {
        // --- SYNCHRONOUS WEB SECURITY & AUDIO UNLOCK ---
        // Must be done immediately before any 'await' to satisfy browsers' strict Autoplay/Prompt policy
        const isWeb = !window.Capacitor || window.Capacitor.getPlatform() === 'web';

        let grantedStatus = false;
        if (isWeb) {
            // Audio unlock
            if (!window.webAdhanAudio) {
                window.webAdhanAudio = new Audio('/audio/adhan.mp3');
                window.webAdhanAudio.play().then(() => {
                    window.webAdhanAudio.pause();
                    window.webAdhanAudio.currentTime = 0;
                }).catch(e => console.log('Audio unlock failed:', e));
            }
            // 1. Request Notifications FIRST directly in the sync click path
            grantedStatus = await requestPermission();
        } else {
            grantedStatus = await requestPermission();
        }

        if (!grantedStatus) {
            if (!isSilent) alert('عذراً، يجب الموافقة على الإشعارات لتفعيل التطبيق');
            return;
        }

        setLoading(true);
        try {
            // 2. Setup Android Notification Channels
            if (window.Capacitor && window.Capacitor.getPlatform() === 'android') {
                try {
                    await LocalNotifications.createChannel({
                        id: 'adhan_channel_v4',
                        name: 'Adhan Alarms v4',
                        description: 'High priority alarms for prayer times',
                        importance: 5,
                        visibility: 1,
                        vibration: true,
                        sound: 'adhan.wav'
                    });
                    await LocalNotifications.createChannel({
                        id: 'general_channel',
                        name: 'General Reminders',
                        description: 'Standard notifications for reminders and welcomes',
                        importance: 3,
                        visibility: 1,
                        vibration: true,
                    });
                } catch (err) { console.warn("Failed to create Alarms channel:", err); }
            }

            // 3. Request Location Permission natively if needed, OR web will prompt on `getCurrentPosition`
            if (isWeb) {
                try { await Geolocation.requestPermissions(); } catch (e) { }
            } else {
                const locPerm = await Geolocation.checkPermissions();
                if (locPerm.location !== 'granted') {
                    await Geolocation.requestPermissions();
                }
            }

            // 4. Clear old alarms (NATIVE ONLY)
            if (!isWeb) {
                try {
                    const pending = await LocalNotifications.getPending();
                    if (pending?.notifications?.length > 0) {
                        await LocalNotifications.cancel({ notifications: pending.notifications });
                    }
                } catch (err) {
                    console.warn("Failed to clear old alarms (probably unsupported on this platform):", err);
                }
            }

            // --- FIRE WELCOME NOTIFICATION IMMEDIATELY AFTER PROMPT MODALS CLOSE ---
            // This guarantees zero-latency user feedback before the heavy GPS satellite locking loops begin.
            if (!isSilent) {
                if (isWeb && Notification.permission === 'granted') {
                    try {
                        new Notification('تطبيق الصراط المستقيم 🕌', {
                            body: 'تم تفعيل الإشعارات بنجاح. ستصلك الآن مواقيت الصلاة والأذكار.',
                            icon: '/zad_splash_logo.png'
                        });
                    } catch (e) { console.error("Welcome Web Notification blocked:", e); }
                } else if (!isWeb) {
                    try {
                        // Restore a minimal 2-second timestamp padding to prevent certain OEM AlarmManagers from dropping the payload
                        await LocalNotifications.schedule({
                            notifications: [{
                                id: 9999,
                                title: 'تطبيق الصراط المستقيم 🕌',
                                body: 'تم تفعيل الإشعارات بنجاح. ستصلك الآن مواقيت الصلاة والأذكار.',
                                channelId: 'general_channel',
                                schedule: { at: new Date(new Date().getTime() + 2000), allowWhileIdle: true }
                            }]
                        });
                        console.log("[Welcome Alert] Instant Native Android Notification Dispatched.");
                    } catch (e) { console.error("Native Android Welcome failed:", e); }
                }
            }

            // 3. NOW fetch location and API (this takes time! GPS lock can take 5-15 seconds)
            const { latitude, longitude } = await getPositionLocationOnly();


            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            const days = await fetchMonthPrayerTimes(latitude, longitude, month, year);

            const notifications = [];
            // Calculate `now` AFTER API network latency so test schedules don't expire instantly!
            const now = new Date();
            let idCounter = 1;

            days.forEach(day => {
                const dayDate = new Date(day.date.readable);
                // Skip past days
                if (dayDate.getDate() < now.getDate()) return;

                const timings = day.timings;

                PRAYER_KEYS.forEach(prayerKey => {
                    const timeStr = timings[prayerKey].split(' ')[0]; // remove (EEST)
                    const [h, m] = timeStr.split(':');

                    const scheduleDate = new Date(year, month - 1, dayDate.getDate(), parseInt(h), parseInt(m), 0);

                    // Only schedule future prayers
                    if (scheduleDate > new Date()) {
                        notifications.push({
                            id: idCounter++,
                            title: `حان الآن وقت صلاة ${PRAYER_NAMES_AR[prayerKey]}`,
                            body: 'حَيَّ عَلَى الصَّلَاةِ',
                            schedule: { at: scheduleDate, allowWhileIdle: true },
                            sound: 'adhan', // Native android raw file
                            channelId: 'adhan_channel_v4',
                        });
                    }
                });

                // Schedule Daily Hadith at 8:00 AM
                const hadithSchedule = new Date(year, month - 1, dayDate.getDate(), 8, 0, 0);
                if (hadithSchedule > new Date()) {
                    const randomHadith = DAILY_HADITHS[idCounter % DAILY_HADITHS.length];
                    notifications.push({
                        id: idCounter++,
                        title: 'حديث اليوم',
                        body: randomHadith,
                        channelId: 'general_channel',
                        schedule: { at: hadithSchedule, allowWhileIdle: true },
                    });
                }

                // Schedule Random Duas every 10 minutes between 9 AM and 10 PM (waking hours)
                // We limit this ultra-frequent scheduling to the next 3 days only to avoid exceeding Android's 500 Exact Alarm limit
                if (dayIndex < 3) {
                    for (let hour = 9; hour <= 21; hour++) {
                        for (let minute = 0; minute < 60; minute += 10) {
                            const duaSchedule = new Date(year, month - 1, dayDate.getDate(), hour, minute, 0);
                            if (duaSchedule > now) {
                                const randomDua = RANDOM_DUAS[idCounter % RANDOM_DUAS.length];
                                notifications.push({
                                    id: idCounter++,
                                    title: 'تذكير بذكر الله',
                                    body: randomDua,
                                    channelId: 'general_channel',
                                    schedule: { at: duaSchedule, allowWhileIdle: true },
                                });
                            }
                        }
                    }
                }
            }); // End of days.forEach
            // ---------------------------------------------------------------------------------

            // 5. Schedule in Capacitor in chunks of 50 to avoid Android Binder Transaction limits
            const CHUNK_SIZE = 50;

            if (!isWebEnv) {
                for (let i = 0; i < notifications.length; i += CHUNK_SIZE) {
                    const chunk = notifications.slice(i, i + CHUNK_SIZE);
                    try {
                        await LocalNotifications.schedule({ notifications: chunk });
                    } catch (err) {
                        console.error('Failed to schedule chunk', i, err);
                    }
                }
            }

            // Web/PWA Fallback for open laptops: Check every second and show Web Notifications manually
            if (isWeb) {
                // Keep track of ALL notifications dynamically on the web
                window.webAllSchedules = notifications;
                if (window.webIntervalWatchdog) clearInterval(window.webIntervalWatchdog);

                window.webIntervalWatchdog = setInterval(() => {
                    const currentTime = new Date().getTime();
                    window.webAllSchedules.forEach((n, idx) => {
                        if (n.schedule.at === 0) return; // already played

                        const targetTime = new Date(n.schedule.at).getTime();
                        // If we are within 2 seconds past the target time, trigger it
                        if (currentTime >= targetTime && currentTime - targetTime <= 2500) {

                            // If this specific notification has the Adhan sound, play it
                            if (n.sound === 'adhan' || n.sound === 'adhan.mp3') {
                                window.webAdhanAudio.currentTime = 0;
                                window.webAdhanAudio.play().catch(e => console.log('Web audio play blocked by browser:', e));
                            }

                            // Native HTML5 visual notification (appears for ALL notifications)
                            if (Notification.permission === 'granted') {
                                new Notification(n.title, { body: n.body, icon: '/zad_splash_logo.png' });
                            }

                            // Prevent duplicating
                            window.webAllSchedules[idx].schedule.at = 0;
                        }
                    });
                }, 1000);
            }

        } catch (error) {
            console.error('Failed to schedule offline alarms:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        hasPermission,
        loading,
        scheduleOfflineAlarms,
    };
}
