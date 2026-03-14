import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Moon, Sun, Book } from 'lucide-react';
import './RamadanSpecial.css';

const RamadanSpecial = () => {
    const { lang } = useLanguage();
    const [hijriDate, setHijriDate] = useState({ month: 9, day: 1 });
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [iftarCountdown, setIftarCountdown] = useState('--:--:--');
    const [suhoorCountdown, setSuhoorCountdown] = useState('--:--:--');
    const [eidPrayerTime, setEidPrayerTime] = useState('--:--');

    useEffect(() => {
        // Get Hijri Date
        try {
            const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', { month: 'numeric', day: 'numeric' });
            const parts = formatter.formatToParts(new Date());
            setHijriDate({
                month: parseInt(parts.find(p => p.type === 'month')?.value || '9', 10),
                day: parseInt(parts.find(p => p.type === 'day')?.value || '1', 10)
            });
        } catch (e) {
            console.error("Hijri calibration failed", e);
        }

        // Fetch Prayer Times for countdowns
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                const d = new Date();
                const res = await fetch(`https://api.aladhan.com/v1/timings/${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=5`);
                const data = await res.json();
                setPrayerTimes(data.data.timings);
            });
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

    const isRamadan = hijriDate.month === 9;
    const isEid = hijriDate.month === 10 && hijriDate.day <= 3;

    // خارج رمضان وأيام العيد لا نظهر أي كارت
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
