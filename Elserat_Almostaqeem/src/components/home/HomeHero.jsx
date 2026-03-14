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
                } catch (err) {
                    console.error("Error fetching location info", err);
                }
            },
            () => console.log("Geolocation permission denied")
        );
    }, [lang]);

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
