import React, { useState, useEffect } from 'react';
import { Book, ChevronRight, GraduationCap, Flame, Target } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const MushafHomeCard = () => {
    const { lang, t } = useLanguage();
    const navigate = useNavigate();
    const [lastPage, setLastPage] = useState(() => parseInt(localStorage.getItem('zad_last_read_page') || '1'));
    const [khatmahProgress, setKhatmahProgress] = useState(0);
    const [dailyAyah, setDailyAyah] = useState(() => JSON.parse(localStorage.getItem('zad_daily_ayah') || 'null'));

    useEffect(() => {
        // Calculate progress based on last page read
        const progress = Math.min(100, Math.round((lastPage / 604) * 100));
        setKhatmahProgress(progress);
        
        // Listen for storage changes in case other components update it
        const handleStorage = () => {
            const page = parseInt(localStorage.getItem('zad_last_read_page') || '1');
            setLastPage(page);
            setKhatmahProgress(Math.min(100, Math.round((page / 604) * 100)));
            const ayah = JSON.parse(localStorage.getItem('zad_daily_ayah') || 'null');
            setDailyAyah(ayah);
        };
        
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [lastPage]);

    const handleContinueReading = () => {
        navigate('/quran', { state: { page: lastPage } });
    };

    return (
        <div className="mushaf-home-card animate-scale-in" style={{
            background: 'linear-gradient(135deg, #1a2a1a 0%, #0d1a0d 100%)',
            borderRadius: '24px',
            padding: '2rem',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            marginBottom: '2rem'
        }}>
            {/* Background Ornaments */}
            <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                opacity: 0.1,
                transform: 'rotate(15deg)'
            }}>
                <Book size={200} />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                {/* Left side: Progress Circle */}
                <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="3"
                        />
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="var(--gold-main, #D4AF37)"
                            strokeWidth="3"
                            strokeDasharray={`${khatmahProgress}, 100`}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 1s ease' }}
                        />
                    </svg>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{khatmahProgress}%</span>
                        <div style={{ fontSize: '0.6rem', opacity: 0.7 }}>
                            {lang === 'ar' ? 'الختمة' : 'Khatmah'}
                        </div>
                    </div>
                </div>

                {/* Right side: Info and Actions */}
                <div className="flex-1 text-center md:text-right">
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--gold-main, #D4AF37)' }}>
                        {lang === 'ar' ? 'رحلتك القرآنية' : 'Your Quranic Journey'}
                    </h2>
                    <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>
                        {lang === 'ar' 
                            ? `وصلت إلى الجزء ${Math.ceil(lastPage / 20)}, صفحة ${lastPage}` 
                            : `You reached Juz ${Math.ceil(lastPage / 20)}, Page ${lastPage}`}
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                        <button 
                            onClick={handleContinueReading}
                            className="btn btn-primary" 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '12px',
                                background: 'var(--gold-main, #D4AF37)',
                                border: 'none',
                                color: '#1a2a1a',
                                fontWeight: 'bold'
                            }}
                        >
                            <Book size={18} />
                            {lang === 'ar' ? 'مواصلة القراءة' : 'Continue Reading'}
                            <ChevronRight size={18} />
                        </button>
                        
                        <button 
                            className="btn btn-outline" 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '12px',
                                borderColor: 'rgba(212, 175, 55, 0.5)',
                                color: 'var(--gold-main, #D4AF37)'
                            }}
                            onClick={() => navigate('/quran')}
                        >
                            <Target size={18} />
                            {lang === 'ar' ? 'خطة الختمة' : 'Khatmah Plan'}
                        </button>
                    </div>

                    {dailyAyah && (
                        <div style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '16px',
                            borderRight: '3px solid var(--gold-main, #D4AF37)',
                            textAlign: 'right'
                        }}>
                            <p style={{ 
                                margin: 0, 
                                fontSize: '1.2rem', 
                                fontFamily: 'Amiri, serif',
                                color: '#fff'
                            }}>
                                {dailyAyah.text}
                            </p>
                            <div style={{ 
                                fontSize: '0.8rem', 
                                opacity: 0.6, 
                                marginTop: '0.5rem' 
                            }}>
                                {lang === 'ar' ? `${dailyAyah.surah} - آية ${dailyAyah.number}` : `${dailyAyah.surahEn} - Ayah ${dailyAyah.number}`}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Footer */}
            <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-2">
                    <Flame size={16} color="#ef4444" />
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                        {lang === 'ar' ? 'نشاط متواصل: ٣ أيام' : '3 Day Streak'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <GraduationCap size={16} color="var(--gold-main, #D4AF37)" />
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                        {lang === 'ar' ? 'تذكير: ورد اليوم' : 'Daily Wird Reminder'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MushafHomeCard;
