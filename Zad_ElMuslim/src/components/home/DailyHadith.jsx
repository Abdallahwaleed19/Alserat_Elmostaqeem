import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getEgyptDateString } from '../../utils/egyptTime';

const BUKHARI_RANGE = 7563;

const DEFAULT_HADITH = {
    text: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    source: "صحيح البخاري",
    sourceEn: "Sahih Al-Bukhari"
};

const DailyHadith = () => {
    const { lang } = useLanguage();
    const [hadith, setHadith] = useState(DEFAULT_HADITH);
    const [loading, setLoading] = useState(true);
    const [egyptDateKey, setEgyptDateKey] = useState(() => getEgyptDateString());

    useEffect(() => {
        const key = getEgyptDateString();
        setEgyptDateKey(key);
        const interval = setInterval(() => {
            const next = getEgyptDateString();
            if (next !== key) setEgyptDateKey(next);
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchDailyHadith = async () => {
            const egyptToday = egyptDateKey;
            const cached = localStorage.getItem('zad_daily_hadith');
            const cachedDate = localStorage.getItem('zad_daily_hadith_date');

            if (cached && cachedDate === egyptToday) {
                try {
                    setHadith(JSON.parse(cached));
                } catch (_) {}
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const hadithNumber = Math.floor(Math.random() * BUKHARI_RANGE) + 1;

                const res = await fetch(`https://api.hadith.gading.dev/books/bukhari?range=${hadithNumber}-${hadithNumber}`);
                const data = await res.json();

                if (data?.data?.hadiths?.length > 0) {
                    const h = data.data.hadiths[0];
                    const fetchedHadith = {
                        text: h.arab || h.text?.arabic || h.text || '',
                        source: `${data.data.name || 'صحيح البخاري'} - رقم ${h.number ?? hadithNumber}`,
                        sourceEn: `Al-Bukhari - No. ${h.number ?? hadithNumber}`
                    };
                    setHadith(fetchedHadith);
                    localStorage.setItem('zad_daily_hadith', JSON.stringify(fetchedHadith));
                    localStorage.setItem('zad_daily_hadith_date', egyptToday);
                }
            } catch (err) {
                if (cached) {
                    try {
                        setHadith(JSON.parse(cached));
                    } catch (_) {}
                }
                console.error("Error fetching daily hadith", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDailyHadith();
    }, [egyptDateKey]);

    return (
        <div className="card h-full flex flex-col justify-center relative overflow-hidden" style={{ minHeight: '180px' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-10 rounded-full blur-3xl opacity-30 transform translate-x-10 -translate-y-10"></div>

            <div className="flex justify-between items-center relative z-10" style={{ marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="daily-hadith-icon" style={{ display: 'inline-flex', flexShrink: 0 }} aria-hidden>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                            <defs>
                                <linearGradient id="hadith-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#fcd34d" />
                                    <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                            </defs>
                            <path fill="url(#hadith-star-grad)" d="M14 2l2.5 7.5L24 12l-7.5 2.5L14 22l-2.5-7.5L4 12l7.5-2.5L14 2z" />
                            <path fill="url(#hadith-star-grad)" opacity="0.9" d="M6 6l1.2 3.5L11 10.5l-3.5 1.2L6 15l-1.2-3.5L1 10.5l3.5-1.2L6 6z" />
                            <path fill="url(#hadith-star-grad)" opacity="0.85" d="M22 8l.9 2.8 2.8.9-2.8.9L22 15.5l-.9-2.8-2.8-.9 2.8-.9L22 8z" />
                        </svg>
                    </span>
                    {lang === 'ar' ? 'حديث اليوم' : 'Daily Hadith'}
                </h3>
                <span className="badge" style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-surface-hover)' }}>
                    {loading ? '...' : (lang === 'ar' ? hadith.source : hadith.sourceEn)}
                </span>
            </div>

            <p className="quran-text relative z-10 leading-loose" style={{ fontSize: '1.2rem', margin: 0 }}>
                {loading ? (lang === 'ar' ? 'جاري التحميل...' : 'Loading...') : `"${hadith.text}"`}
            </p>
        </div>
    );
};

export default DailyHadith;
