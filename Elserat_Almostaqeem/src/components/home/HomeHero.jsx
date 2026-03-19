import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { usePrayer } from '../../context/PrayerContext';
import { MapPin, Moon as MoonIcon, CloudMoon, Map } from 'lucide-react';
import { useHijriDate } from '../../utils/useHijriDate';
import './HomeHero.css';

const HomeHero = () => {
    const { theme } = useTheme();
    const { t, lang } = useLanguage();
    const { city } = usePrayer();

    return (
        <div className={`home-hero ${theme === 'ramadan' ? 'ramadan-hero' : ''}`}>
            {/* Background Decorations */}
            {theme === 'ramadan' && (
                <div className="hero-decorations pointer-events-none">
                    <CloudMoon className="bg-moon" size={120} strokeWidth={1} />
                </div>
            )}

            <div className="hero-content">
                <div className="hero-welcome text-center">
                    <h1 className="quran-text">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h1>
                    <p>{lang === 'ar' ? 'مرحباً بك في الصِّرَاطِ الْمُسْتَقِيمِ، رفيقك اليومي.' : 'Welcome to As-Sirat Al-Mustaqeem, your daily companion.'}</p>
                </div>


            </div>
        </div>
    );
};

export default HomeHero;
