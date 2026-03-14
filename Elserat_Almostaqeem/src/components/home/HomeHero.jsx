import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Moon as MoonIcon, CloudMoon } from 'lucide-react';
import { useHijriDate } from '../../utils/useHijriDate';
import './HomeHero.css';

const HomeHero = () => {
    const { theme } = useTheme();
    const { t, lang } = useLanguage();

    const [city, setCity] = useState('');
    const [prayerTimes, setPrayerTimes] = useState(null); // { fajr, maghrib }
    const [timerState, setTimerState] = useState(null); // { target, labelAr, labelEn, showTimer, messageAr, messageEn }
    const [timeLeft, setTimeLeft] = useState(null);
    const { hijriShort: hijriDateStr } = useHijriDate(lang);

    useEffect(() => {
        if (!('geolocation' in navigator)) return;
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${lang}`);
                    const geoData = await geoRes.json();
                    setCity(geoData.city || geoData.locality || '');

                    const date = new Date();
                    const ptRes = await fetch(`https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=5`);
                    const ptData = await ptRes.json();
                    const maghribStr = ptData.data.timings.Maghrib;
                    const fajrStr = ptData.data.timings.Fajr;

                    const [mHours, mMins] = maghribStr.split(':');
                    const maghribDate = new Date();
                    maghribDate.setHours(parseInt(mHours, 10), parseInt(mMins, 10), 0, 0);

                    const [fHours, fMins] = fajrStr.split(':');
                    const fajrDate = new Date();
                    fajrDate.setHours(parseInt(fHours, 10), parseInt(fMins, 10), 0, 0);

                    setPrayerTimes({ fajr: fajrDate, maghrib: maghribDate });
                } catch (err) {
                    console.error("Error fetching location info", err);
                }
            },
            () => console.log("Geolocation permission denied")
        );
    }, [lang]);

    useEffect(() => {
        if (!prayerTimes) return;

        const interval = setInterval(() => {
            const now = new Date();
            const { fajr, maghrib } = prayerTimes;

            // 1 hr before Fajr is Imsak
            const imsakTime = new Date(fajr);
            imsakTime.setHours(fajr.getHours() - 1);

            let newState = null;

            if (now < imsakTime) {
                newState = { target: fajr, labelAr: 'وقت بداية الصيام', labelEn: 'Fasting Begins', showTimer: true };
            } else if (now >= imsakTime && now < fajr) {
                newState = { target: fajr, labelAr: 'وقت الإمساك', labelEn: 'Imsak Time', showTimer: true };
            } else if (now >= fajr && now < maghrib) {
                newState = { target: maghrib, labelAr: 'باقي على الإفطار', labelEn: 'Time until Iftar', showTimer: true };
            } else {
                // Post-Iftar, past Maghrib
                newState = { showTimer: false, messageAr: 'تقبل الله صيامكم وطاعتكم', messageEn: 'May Allah accept your fast' };
            }

            setTimerState(newState);

            if (newState.showTimer) {
                const diff = newState.target - now;
                if (diff > 0) {
                    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                    const m = Math.floor((diff / 1000 / 60) % 60);
                    const s = Math.floor((diff / 1000) % 60);

                    setTimeLeft({
                        hours: h.toString().padStart(2, '0'),
                        minutes: m.toString().padStart(2, '0'),
                        seconds: s.toString().padStart(2, '0')
                    });
                } else {
                    setTimeLeft(null);
                }
            } else {
                setTimeLeft(null);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [prayerTimes]);

    return (
        <div className={`home-hero ${theme === 'ramadan' ? 'ramadan-hero' : ''}`}>
            {/* Background Decorations */}
            {theme === 'ramadan' && (
                <div className="hero-decorations pointer-events-none">
                    <CloudMoon className="bg-moon" size={120} strokeWidth={1} />
                </div>
            )}

            <div className="hero-content">
                <div className="hero-top-bar">
                    <span className="hijri-date">{hijriDateStr}</span>
                    {city && (
                        <span className="city-name">
                            <MapPin size={16} /> {city}
                        </span>
                    )}
                </div>

                <div className="hero-welcome text-center">
                    <h1 className="quran-text">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h1>
                    <p>{lang === 'ar' ? 'مرحباً بك في الصِّرَاطِ الْمُسْتَقِيمِ، رفيقك اليومي.' : 'Welcome to As-Sirat Al-Mustaqeem, your daily companion.'}</p>
                </div>


            </div>
        </div>
    );
};

export default HomeHero;
