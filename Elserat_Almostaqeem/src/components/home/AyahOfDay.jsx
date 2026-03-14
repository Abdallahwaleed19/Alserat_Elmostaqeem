import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getEgyptDateString } from '../../utils/egyptTime';
import { Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { shareImageDataUrl } from '../../utils/shareImageNative';
import './ShareCard.css';

const QURAN_AYAH_COUNT = 6236;

const DEFAULT_AYAH = {
    text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Verily, with every difficulty, there is relief.",
    surah: "الشرح",
    surahEn: "Ash-Sharh",
    number: 6
};

const AyahOfDay = () => {
    const { lang } = useLanguage();
    const [ayah, setAyah] = useState(DEFAULT_AYAH);
    const [loading, setLoading] = useState(true);
    const [egyptDateKey, setEgyptDateKey] = useState(() => getEgyptDateString());
    const cardRef = useRef(null);
    const [isSharing, setIsSharing] = useState(false);

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
        const fetchDailyAyah = async () => {
            const egyptToday = egyptDateKey;
            const cached = localStorage.getItem('zad_daily_ayah');
            const cachedDate = localStorage.getItem('zad_daily_ayah_date');

            if (cached && cachedDate === egyptToday) {
                try {
                    setAyah(JSON.parse(cached));
                } catch (_) {}
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const ayahNumber = Math.floor(Math.random() * QURAN_AYAH_COUNT) + 1;
                const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/quran-uthmani,en.asad`);
                const data = await res.json();

                if (data?.code === 200 && data.data?.length > 0) {
                    const ar = data.data[0];
                    const en = data.data.length > 1 ? data.data[1] : null;

                    const fetchedAyah = {
                        text: ar.text,
                        translation: en ? en.text : '',
                        surah: ar.surah.name,
                        surahEn: ar.surah.englishName,
                        number: ar.numberInSurah
                    };
                    setAyah(fetchedAyah);
                    localStorage.setItem('zad_daily_ayah', JSON.stringify(fetchedAyah));
                    localStorage.setItem('zad_daily_ayah_date', egyptToday);
                }
            } catch (err) {
                if (cached) {
                    try {
                        setAyah(JSON.parse(cached));
                    } catch (_) {}
                }
                console.error("Error fetching daily ayah", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDailyAyah();
    }, [egyptDateKey]);

    const handleShare = async () => {
        if (!cardRef.current || isSharing) return;
        setIsSharing(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0F5D4A',
            });
            const dataUrl = canvas.toDataURL('image/png');
            
            if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                await shareImageDataUrl(dataUrl, 'Ayah of the Day', 'Share Ayah');
            } else {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], 'ayah_of_the_day.png', { type: 'image/png' });

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'Ayah of the Day',
                    });
                } else {
                    const link = document.createElement('a');
                    link.download = 'ayah_of_the_day.png';
                    link.href = dataUrl;
                    link.click();
                }
            }
        } catch (err) {
            console.error("Share failed", err);
        } finally {
            setIsSharing(false);
        }
    };

    const metaLabel = loading ? '...' : (lang === 'ar' ? `${ayah.surah} - أية ${ayah.number}` : `${ayah.surahEn} - Ayah ${ayah.number}`);

    return (
        <>
            {/* بطاقة المشاركة المزخرفة (مخفية للتصدير فقط) */}
            <div
                ref={cardRef}
                className="share-card-export"
                aria-hidden
                style={{ position: 'absolute', left: '-9999px', top: 0 }}
            >
                <div className="share-card-corner-b" aria-hidden />
                <div className="share-card-corner-br" aria-hidden />
                <div className="share-card-header">
                    <h2 className="share-card-title">{lang === 'ar' ? 'آية اليوم' : 'Ayah of the Day'}</h2>
                    <p className="share-card-subtitle">{metaLabel}</p>
                </div>
                <p className="share-card-body share-card-body-ar">
                    {loading ? (lang === 'ar' ? 'جاري التحميل...' : 'Loading...') : ayah.text}
                    {!loading && <span> ۝ {ayah.number.toLocaleString('ar-EG')}</span>}
                </p>
                {!loading && ayah.translation && (
                    <p className="share-card-translation">"{ayah.translation}"</p>
                )}
                <p className="share-card-meta">{metaLabel}</p>
                <div className="share-card-footer">الصراط المستقيم</div>
            </div>

            <div className="card h-full flex flex-col justify-center relative overflow-hidden" style={{ minHeight: '180px' }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-10 rounded-full blur-3xl opacity-30 transform translate-x-10 -translate-y-10"></div>

                    <div className="flex justify-between items-center relative z-10" style={{ marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="daily-hadith-icon" style={{ display: 'inline-flex', flexShrink: 0, color: 'var(--color-primary)' }} aria-hidden>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                                </svg>
                            </span>
                            {lang === 'ar' ? 'آية اليوم' : 'Ayah of the Day'}
                        </h3>
                        <span className="badge" style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-surface-hover)' }}>
                            {metaLabel}
                        </span>
                    </div>

                    <p className="quran-text relative z-10 leading-loose" style={{ fontSize: '1.4rem', margin: '0 0 0.5rem 0', textAlign: 'center' }}>
                        {loading ? (lang === 'ar' ? 'جاري التحميل...' : 'Loading...') : ayah.text}
                        <span className="ayah-end-badge" style={{ fontSize: '0.9rem', width: '30px', height: '30px', minWidth: '30px', marginInlineStart: '10px' }}>
                            {loading ? '?' : ayah.number.toLocaleString('ar-EG')}
                        </span>
                    </p>
                    {!loading && lang === 'en' && (
                        <p className="relative z-10" style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textAlign: 'center', margin: 0, fontStyle: 'italic' }}>
                            "{ayah.translation}"
                        </p>
                    )}
                </div>

                {!loading && (
                    <button 
                        onClick={handleShare}
                        className="icon-btn" 
                        style={{ position: 'absolute', bottom: '10px', left: lang === 'ar' ? '10px' : 'auto', right: lang === 'en' ? '10px' : 'auto', zIndex: 20, opacity: isSharing ? 0.5 : 1 }}
                        disabled={isSharing}
                    >
                        <Share2 size={16} />
                    </button>
                )}
            </div>
        </>
    );
};

export default AyahOfDay;
