import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { MapPin, Sun, Sunrise, Sunset, Moon, CalendarDays, Clock } from 'lucide-react';
import { useHijriDate } from '../../utils/useHijriDate';
import { usePrayer } from '../../context/PrayerContext';
import './HomeTopBar.css';

const HomeTopBar = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const { city, location, prayerTimes } = usePrayer();
    const { hijriShort } = useHijriDate(lang, theme);

    const getGregorianDateString = () => {
        const date = new Date();
        const optionsDays = { weekday: 'long' };
        const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };
        
        let day = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', optionsDays).format(date);
        const fullDate = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', optionsDate).format(date);
        
        return { day, fullDate };
    };

    const { day, fullDate } = getGregorianDateString();

    const prayerIcons = {
        Fajr: <Sunrise size={14} />,
        Sunrise: <Sun size={14} />,
        Dhuhr: <Sun size={14} fill="currentColor" />,
        Asr: <Sun size={14} strokeDasharray="2 2" />,
        Maghrib: <Sunset size={14} />,
        Isha: <Moon size={14} />
    };

    const prayerNamesAr = {
        Fajr: 'الفجر',
        Sunrise: 'الشروق',
        Dhuhr: 'الظهر',
        Asr: 'العصر',
        Maghrib: 'المغرب',
        Isha: 'العشاء'
    };

    // Calculate next prayer to highlight it
    const getNextPrayer = () => {
        if (!prayerTimes) return null;
        const now = new Date();
        const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        
        for (const p of prayers) {
            const timeStr = prayerTimes[p];
            if (!timeStr) continue;
            const [h, m] = timeStr.split(':');
            const ptDate = new Date();
            ptDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
            if (ptDate > now) return p;
        }
        return 'Fajr'; // default next day
    };

    const nextPrayer = getNextPrayer();

    return (
        <div className={`home-top-bar ${theme}`}>
            <div className="home-top-bar-inner">
                {/* Location side */}
                <div className="top-bar-location">
                    {city ? (
                        <>
                            <MapPin size={14} />
                            <span>{city}</span>
                        </>
                    ) : (
                        <span className="loading-loc">{lang === 'ar' ? 'تحديد الموقع...' : 'Locating...'}</span>
                    )}
                </div>

                {/* Prayer Times Center */}
                <div className="top-bar-prayers">
                    {prayerTimes ? (
                        ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => {
                            const isNext = prayer === nextPrayer;
                            return (
                                <div key={prayer} className={`prayer-item ${isNext ? 'next-prayer' : ''}`}>
                                    {prayerIcons[prayer]}
                                    <span className="prayer-name">{lang === 'ar' ? prayerNamesAr[prayer] : prayer}</span>
                                    <span className="prayer-time">{prayerTimes[prayer]}</span>
                                </div>
                            );
                        })
                    ) : (
                        <div className="loading-prayers">
                            <Clock size={14} className="animate-spin" />
                            <span>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
                        </div>
                    )}
                    <div className="prayer-title-box">
                        <Clock size={16} />
                        <span>{lang === 'ar' ? 'مواقيت الصلاة' : 'Prayer Times'}</span>
                    </div>
                </div>

                {/* Date side */}
                <div className="top-bar-date">
                    <CalendarDays size={14} />
                    <span>
                        {day} {hijriShort} - {fullDate} {lang === 'ar' ? 'م' : 'AD'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HomeTopBar;
