import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { usePrayer } from '../../context/PrayerContext';
import { Moon, Sun, Book } from 'lucide-react';
import { getEgyptHijriDateParts } from '../../utils/egyptTime';
import './RamadanSpecial.css';

const RamadanSpecial = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const { prayerTimes } = usePrayer();
    const [hijriDate, setHijriDate] = useState({ month: 9, day: 1 });
    const [iftarCountdown, setIftarCountdown] = useState('--:--:--');
    const [suhoorCountdown, setSuhoorCountdown] = useState('--:--:--');
    const [eidPrayerTime, setEidPrayerTime] = useState('--:--');

    useEffect(() => {
        // Get Hijri Date
        try {
            const { day: hDay, monthIndex } = getEgyptHijriDateParts();
            setHijriDate({
                month: monthIndex + 1,
                day: hDay
            });
        } catch (e) {
            console.error("Hijri calibration failed", e);
        }
    }, []);

    useEffect(() => {
        if (!prayerTimes) return;

        // لو مش في رمضان، نوقف تايمر الصيام
        if (hijriDate.month !== 9) return;

        const timer = setInterval(() => {
            const now = new Date();

            // Iftar (Maghrib)
            const [mH, mM] = prayerTimes.Maghrib.split(':');
            const maghribDate = new Date();
            maghribDate.setHours(parseInt(mH, 10), parseInt(mM, 10), 0);

            if (maghribDate > now) {
                const diff = maghribDate - now;
                setIftarCountdown(formatTime(diff));
            } else {
                setIftarCountdown(lang === 'ar' ? 'حان وقت الإفطار' : 'Iftar Time');
            }

            // Suhoor (Fajr)
            const [fH, fM] = prayerTimes.Fajr.split(':');
            const fajrDate = new Date();
            fajrDate.setHours(parseInt(fH, 10), parseInt(fM, 10), 0);
            if (fajrDate < now) {
                fajrDate.setDate(fajrDate.getDate() + 1);
            }
            const diffS = fajrDate - now;
            setSuhoorCountdown(formatTime(diffS));

        }, 1000);

        return () => clearInterval(timer);
    }, [prayerTimes, lang, hijriDate.month]);

    // حساب وقت صلاة العيد (تقريبًا: بعد الشروق بـ 20 دقيقة) ليوم 1–3 شوال
    useEffect(() => {
        if (!prayerTimes) return;
        if (!(hijriDate.month === 10 && hijriDate.day <= 3)) return;

        const sunriseStr = prayerTimes.Sunrise || prayerTimes.Sunrise;
        if (!sunriseStr) return;

        const [sH, sM] = sunriseStr.split(':');
        const eidDate = new Date();
        eidDate.setHours(parseInt(sH, 10), parseInt(sM, 10) + 20, 0, 0); // +20 دقيقة بعد الشروق تقريبًا

        const hh = eidDate.getHours().toString().padStart(2, '0');
        const mm = eidDate.getMinutes().toString().padStart(2, '0');
        setEidPrayerTime(`${hh}:${mm}`);
    }, [prayerTimes, hijriDate.month, hijriDate.day]);

    const formatTime = (ms) => {
        const h = Math.floor(ms / (1000 * 60 * 60));
        const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((ms % (1000 * 60)) / 1000);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const isRamadan = theme === 'ramadan';
    const isEid = theme === 'eid-fitr';

    // خارج رمضان وأيام العيد، أو عندما يكون الثيم "عادي"، لا نظهر أي كارت
    if (!isRamadan && !isEid) return null;

    if (isEid) {
        return (
            <div className="ramadan-special-card card animate-slide-up">
                <div className="ramadan-title-row">
                    <h3 className="ramadan-title">
                        {lang === 'ar' ? 'عيد فطر مبارك' : 'Eid Al-Fitr Mubarak'} 🎉
                    </h3>
                    <div className="ramadan-day-badge">
                        {lang === 'ar'
                            ? `صلاة العيد - اليوم ${hijriDate.day} شوال`
                            : `Eid Prayer – Day ${hijriDate.day} of Shawwal`}
                    </div>
                </div>

                <div className="ramadan-countdown-grid">
                    <div className="countdown-box">
                        <div className="countdown-label">
                            {lang === 'ar' ? 'موعد صلاة العيد (تقريبي)' : 'Approx. Eid Prayer Time'}
                        </div>
                        <div className="countdown-time">{eidPrayerTime}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ramadan-special-card card animate-slide-up">
            <div className="ramadan-title-row">
                <h3 className="ramadan-title">
                    {lang === 'ar' ? 'رمضان كريم' : 'Ramadan Kareem'} 🌙
                </h3>
                <div className="ramadan-day-badge">
                    {lang === 'ar' ? `اليوم ${hijriDate.day} رمضان` : `Day ${hijriDate.day} of Ramadan`}
                </div>
            </div>

            <div className="ramadan-countdown-grid">
                <div className="countdown-box">
                    <div className="countdown-label">
                        <Sun size={14} style={{ marginRight: '5px' }} />
                        {lang === 'ar' ? 'المتبقي للإفطار' : 'Remaining to Iftar'}
                    </div>
                    <div className="countdown-time">{iftarCountdown}</div>
                </div>
                <div className="countdown-box">
                    <div className="countdown-label">
                        <Moon size={14} style={{ marginRight: '5px' }} />
                        {lang === 'ar' ? 'المتبقي للإمساك' : 'Remaining to Suhoor'}
                    </div>
                    <div className="countdown-time">{suhoorCountdown}</div>
                </div>
            </div>
            <div className="ramadan-khatma-section">
                <div className="khatma-item">
                    <div className="khatma-info">
                        <span className="khatma-title-sub">
                            {lang === 'ar' ? 'ورد القرآن المقترح لليوم' : 'Suggested Quran for Today'}
                        </span>
                        <span className="khatma-juz">
                            {lang === 'ar' ? `الجزء ${hijriDate.day}` : `Juz ${hijriDate.day}`}
                        </span>
                    </div>
                    <Book size={24} color="#C9A24D" />
                </div>
            </div>
        </div>
    );
};

export default RamadanSpecial;
