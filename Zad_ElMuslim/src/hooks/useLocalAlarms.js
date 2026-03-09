import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Geolocation } from '@capacitor/geolocation';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

const PRAYER_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_NAMES_AR = { Fajr: 'الفجر', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };

const RANDOM_DUAS = [
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",
    "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ",
    "لا إِلَهَ إِلا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
    "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    "رَبَّنَا لا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً",
    "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ",
    "اللَّهُمَّ اشْفِ مَرْضَانَا وَارْحَمْ مَوْتَانَا",
    "رَبِّ اشْرَحْ لِي صَدْرِي * وَيَسِّرْ لِي أَمْرِي",
    "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
    "اللَّهُمَّ اغْفِرْ لِلْمُسْلِمِينَ وَالْمُسْلِمَاتِ الْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ",
    "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ",
    "اللَّهُمَّ اجْعَلْنَا مِنَ الَّذِينَ يَسْتَمِعُونَ الْقَوْلَ فَيَتَّبِعُونَ أَحْسَنَهُ"
];

const RANDOM_DHIKR = [
    "سُبْحَانَ اللَّهِ",
    "الْحَمْدُ لِلَّهِ",
    "لا إِلَهَ إِلا اللَّهُ",
    "اللَّهُ أَكْبَرُ",
    "لاحَوْلَ وَلاقُوَّةَ إِلا بِاللَّهِ",
    "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    "سُبْحَانَ اللَّهِ الْعَظِيمِ",
    "أَسْتَغْفِرُ اللَّهَ",
    "حَسْبِيَ اللَّهُ وَنِعْمَ الْوَكِيلُ",
    "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
    "أَسْتَغْفِرُ اللَّهَ الَّذِي لا إِلَهَ إِلا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    "يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    "سُبْحَانَ الْمَلِكِ الْقُدُّوسِ"
];

const RANDOM_SALAWAT = [
    "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ"
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

    const requestPermission = async (isSilent = false) => {
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

            if (req.display === 'granted') {
                setHasPermission(true);

                // --- APEX NATIVE WELCOME NOTIFICATION DISPATCH ---
                // Executes strictly immediately after the OS Permission Resolver returns 'granted'.
                // Completely decoupled from Geolocation or heavy background timers.
                if (!isSilent && window.Capacitor && window.Capacitor.getPlatform() === 'android') {
                    try {
                        // Natively ensure channels exist immediately before dispatching
                        await LocalNotifications.createChannel({
                            id: 'adhan_channel_v5',
                            name: 'Adhan Alarms v5',
                            description: 'High priority alarms for prayer times',
                            importance: 5,
                            visibility: 1,
                            vibration: true,
                            sound: 'adhan.mp3'
                        });
                        await LocalNotifications.createChannel({
                            id: 'general_channel_v5',
                            name: 'General Reminders v5',
                            description: 'Standard notifications for reminders and welcomes',
                            importance: 5, // 5 = MAX (forces Heads-Up rendering visual over the UI)
                            visibility: 1,
                            vibration: true,
                            sound: 'chime2.wav'
                        });

                        setTimeout(async () => {
                            await LocalNotifications.schedule({
                                notifications: [{
                                    id: Math.floor(Date.now() / 1000) + 777,
                                    title: 'تطبيق الصراط المستقيم 🕌',
                                    body: 'تم تفعيل الإشعارات بنجاح. ستصلك الآن مواقيت الصلاة والأذكار.',
                                    channelId: 'general_channel_v5',
                                    sound: 'chime2.wav'
                                }]
                            });
                            console.log("Apex Native Welcome Deployed.");
                        }, 500); // UI unblock buffer
                    } catch (err) {
                        console.error("Apex Dispatch failed:", err);
                    }
                }

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

    const generateOfflinePrayerTimes = (lat, lon, month, year) => {
        const daysInMonth = new Date(year, month, 0).getDate();
        const days = [];
        const coordinates = new Coordinates(lat, lon);
        const params = CalculationMethod.Egyptian();

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month - 1, i);
            const prayerTimes = new PrayerTimes(coordinates, date, params);

            const formatTime = (dateObj) => {
                return `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
            };

            days.push({
                date: { readable: date.toISOString() }, // Can be parsed by new Date() later
                timings: {
                    Fajr: formatTime(prayerTimes.fajr),
                    Dhuhr: formatTime(prayerTimes.dhuhr),
                    Asr: formatTime(prayerTimes.asr),
                    Maghrib: formatTime(prayerTimes.maghrib),
                    Isha: formatTime(prayerTimes.isha),
                }
            });
        }
        return days;
    };

    const fetchMonthPrayerTimes = async (lat, lon, month, year) => {
        try {
            const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lon}&method=5`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            const data = await res.json();

            if (data?.data && data.data.length > 0) {
                return data.data;
            }
            throw new Error("Invalid API response format");
        } catch (e) {
            console.error("Aladhan network fetch failed or timed out, falling back to offline Adhan:", e);
            return generateOfflinePrayerTimes(lat, lon, month, year);
        }
    };

    const scheduleOfflineAlarms = async (isSilent = false) => {
        // --- SYNCHRONOUS WEB SECURITY & AUDIO UNLOCK ---
        // Must be done immediately before any 'await' to satisfy browsers' strict Autoplay/Prompt policy
        const isWeb = !window.Capacitor || window.Capacitor.getPlatform() === 'web';

        if (isWeb) {
            // Audio unlock
            if (!window.webAdhanAudio) {
                window.webAdhanAudio = new Audio('/audio/adhan.mp3');
                window.webAdhanAudio.play().then(() => {
                    window.webAdhanAudio.pause();
                    window.webAdhanAudio.currentTime = 0;
                }).catch(e => console.log('Audio unlock failed:', e));
            }
        }

        setLoading(true);

        // 1. Request Location Permission natively FIRST! (User Explicit Constraint)
        try {
            if (isWeb) {
                await Geolocation.requestPermissions();
            } else {
                const locPerm = await Geolocation.checkPermissions();
                if (locPerm.location !== 'granted') {
                    await Geolocation.requestPermissions();
                }
            }
        } catch (e) {
            console.warn("Location prompt failed/denied, proceeding anyway:", e);
        }

        // 2. Request Notifications SECOND!
        let grantedStatus = false;
        grantedStatus = await requestPermission(isSilent);

        if (!grantedStatus) {
            // User explicitly requested to remove the "You must enable notifications" alert
            return;
        }
        // 3. Setup Android Notification Channels FIRST (Guaranteed setup)
        if (window.Capacitor && window.Capacitor.getPlatform() === 'android') {
            try {
                await LocalNotifications.createChannel({
                    id: 'adhan_channel_v5',
                    name: 'Adhan Alarms v5',
                    description: 'High priority alarms for prayer times',
                    importance: 5,
                    visibility: 1,
                    vibration: true,
                    sound: 'adhan.mp3'
                });
                await LocalNotifications.createChannel({
                    id: 'general_channel_v5',
                    name: 'General Reminders v5',
                    description: 'Standard notifications for reminders and welcomes',
                    importance: 5, // 5 = MAX (forces Heads-Up rendering visual)
                    visibility: 1,
                    vibration: true,
                    sound: 'chime2.wav'
                });
            } catch (err) { console.warn("Failed to create Alarms channel:", err); }
        }

        try {

            // 4. Clear old alarms (NATIVE ONLY)
            if (!isWeb) {
                try {
                    const pending = await LocalNotifications.getPending();
                    if (pending?.notifications?.length > 0) {
                        await LocalNotifications.cancel({ notifications: pending.notifications });
                    }
                } catch (err) {
                    console.warn("Failed to clear old alarms:", err);
                }
            }

            // Web Fallback Welcome Notification Array
            if (!isSilent && isWeb && Notification.permission === 'granted') {
                try {
                    new Notification('تطبيق الصراط المستقيم 🕌', {
                        body: 'تم تفعيل الإشعارات بنجاح. ستصلك الآن مواقيت الصلاة والأذكار.',
                        icon: '/zad_splash_logo.png'
                    });
                } catch (e) { console.error("Welcome Web Notification blocked:", e); }
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

            let duasScheduledDays = 0;
            let prayerDaysScheduled = 0;

            days.forEach((day, dayIndex) => {
                const dayDate = new Date(day.date.readable);
                // Skip past days
                if (dayDate.getDate() < now.getDate()) return;

                // CRITICAL: Android 14 enforces a hard limit of exactly 500 exact alarms per app.
                // 2 days of Duas (144/day) = 288 alarms.
                // If we also schedule 30 days of prayers (11/day) = 330 alarms. 288 + 330 = 618 > 500.
                // We MUST limit the prayer scheduling to 14 days max (154 alarms) to prevent a native app crash.
                if (prayerDaysScheduled >= 14) return;

                const timings = day.timings;

                const isRamadan = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { month: 'numeric' }).format(dayDate) === '9';

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
                            sound: 'adhan.mp3', // Native android raw file explicit extension
                            channelId: 'adhan_channel_v5',
                        });

                        // 15 Minutes Before Prayer Alert
                        const preAlertDate = new Date(scheduleDate.getTime() - 15 * 60000);
                        if (preAlertDate > new Date()) {
                            let preAlertTitle = `اقتربت صلاة ${PRAYER_NAMES_AR[prayerKey]}`;
                            let preAlertBody = `باقي 15 دقيقة على الأذان. استعد للصلاة.`;

                            if (isRamadan && prayerKey === 'Maghrib') {
                                preAlertTitle = `اقترب موعد الإفطار 🌙`;
                                preAlertBody = `باقي 15 دقيقة على أذان المغرب. حضر فطورك.`;
                            }

                            notifications.push({
                                id: idCounter++,
                                title: preAlertTitle,
                                body: preAlertBody,
                                schedule: { at: preAlertDate, allowWhileIdle: true },
                                channelId: 'general_channel_v5',
                                sound: 'chime2.wav',
                            });
                        }

                        // Ramadan Fajr (Imsak and Fasting Start)
                        if (isRamadan && prayerKey === 'Fajr') {
                            // Imsak Alert: 1 Hour before Fajr
                            const imsakAlertDate = new Date(scheduleDate.getTime() - 60 * 60000); // 60 minutes
                            if (imsakAlertDate > new Date()) {
                                notifications.push({
                                    id: idCounter++,
                                    title: 'وقت الإمساك 🌙',
                                    body: 'باقي ساعة على أذان الفجر، استعد للإمساك وتسحر.',
                                    schedule: { at: imsakAlertDate, allowWhileIdle: true },
                                    channelId: 'general_channel_v5',
                                    sound: 'chime2.wav',
                                });
                            }

                            // Fasting Begin Dua exactly at Fajr + 2 seconds (to let Adhan play)
                            const fastingBeginDate = new Date(scheduleDate.getTime() + 2000);
                            if (fastingBeginDate > new Date()) {
                                notifications.push({
                                    id: idCounter++,
                                    title: 'نية الصيام 🌙',
                                    body: 'اللهم إني نويت أن أصوم رمضان إيماناً واحتساباً، فاغفر لي ما تقدم من ذنبي وما تأخر.',
                                    schedule: { at: fastingBeginDate, allowWhileIdle: true },
                                    channelId: 'general_channel_v5',
                                    sound: 'chime2.wav',
                                });
                            }
                        }

                        // Ramadan Maghrib Exact Iftar Dua
                        if (isRamadan && prayerKey === 'Maghrib') {
                            // Ensure the Dua notification fires exactly 1 second after Adhan starts
                            const iftarDuaDate = new Date(scheduleDate.getTime() + 1000);
                            notifications.push({
                                id: idCounter++,
                                title: 'دعاء الإفطار 🌙',
                                body: 'اللهم إني لك صمت، وعلى رزقك أفطرت، وبك آمنت، وعليك توكلت، ذهب الظمأ، وابتلت العروق، وثبت الأجر إن شاء الله.',
                                schedule: { at: iftarDuaDate, allowWhileIdle: true },
                                channelId: 'general_channel_v5',
                                sound: 'chime2.wav',
                            });
                        }
                    }
                });

                // Schedule Reminders (Safely within Android Exact limits (~500 max))
                // We space these out across reasonable waking hours (8 AM to 10 PM)
                // Schedule for the next 4 days.
                // Schedule Random Duas/Dhikr/Salawat every 10 minutes (24/7)
                // Android has a hard limit of ~500 Exact Alarms per app. 24h * 6 = 144 alarms/day.
                // We schedule for the next 2 days (288 alarms) to remain safely under the limit.
                if (duasScheduledDays < 2) {
                    for (let hour = 0; hour <= 23; hour++) {
                        for (let minute = 0; minute < 60; minute += 10) {
                            const duaSchedule = new Date(year, month - 1, dayDate.getDate(), hour, minute, 0);
                            if (duaSchedule > now) {
                                // Cycle through types based on minute: 0,30=Dhikr | 10,40=Duas | 20,50=Salawat
                                let title, body;
                                if (minute % 30 === 0) {
                                    title = 'تذكير بذكر الله';
                                    body = RANDOM_DHIKR[idCounter % RANDOM_DHIKR.length];
                                } else if (minute % 30 === 10) {
                                    title = 'دعاء';
                                    body = RANDOM_DUAS[idCounter % RANDOM_DUAS.length];
                                } else {
                                    title = 'صلِّ على النبي';
                                    body = RANDOM_SALAWAT[idCounter % RANDOM_SALAWAT.length];
                                }

                                notifications.push({
                                    id: idCounter++,
                                    title: title,
                                    body: body,
                                    channelId: 'general_channel_v5',
                                    sound: 'chime2.wav',
                                    schedule: { at: duaSchedule, allowWhileIdle: true },
                                });
                            }
                        }
                    }
                    // 08:00 AM - Hadith Daily
                    const hadithSchedule = new Date(year, month - 1, dayDate.getDate(), 8, 0, 0);
                    if (hadithSchedule > now) {
                        notifications.push({
                            id: idCounter++,
                            title: 'حديث اليوم',
                            body: DAILY_HADITHS[idCounter % DAILY_HADITHS.length],
                            channelId: 'general_channel_v5',
                            sound: 'chime2.wav',
                            schedule: { at: hadithSchedule, allowWhileIdle: true },
                        });
                    }
                }

                // Friday specific reminder (Surah Al-Kahf & Salawat)
                if (dayDate.getDay() === 5) { // 5 is Friday
                    const fridayDate = new Date(year, month - 1, dayDate.getDate(), 9, 30, 0); // 9:30 AM
                    if (fridayDate > now) {
                        notifications.push({
                            id: idCounter++,
                            title: 'سنن يوم الجمعة 🕌',
                            body: 'لا تنسَ قراءة سورة الكهف، والإكثار من الصلاة على النبي ﷺ.',
                            channelId: 'general_channel_v5',
                            sound: 'chime2.wav',
                            schedule: { at: fridayDate, allowWhileIdle: true },
                        });
                    }
                }


                duasScheduledDays++;
                prayerDaysScheduled++;
            }); // End of days.forEach

            // ---------------------------------------------------------------------------------

            // 5. Schedule in Capacitor in chunks of 50 to avoid Android Binder Transaction limits
            const CHUNK_SIZE = 50;

            if (!isWeb) {
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
