import React, { useState, useEffect } from 'react';
import { Book, ChevronRight, GraduationCap, Flame, Target } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { getKhatmaPlanById, getLastActivePlanKey, getPlanProgressKey } from '../../data/khatmaPlans';

const MushafHomeCard = () => {
    const { lang, t } = useLanguage();
    const navigate = useNavigate();
    const [lastPage, setLastPage] = useState(() => parseInt(localStorage.getItem('zad_last_read_page') || '1'));
    const [khatmahProgress, setKhatmahProgress] = useState(0);
    const [dailyAyah, setDailyAyah] = useState(() => JSON.parse(localStorage.getItem('zad_daily_ayah') || 'null'));
    const [activePlanStats, setActivePlanStats] = useState(null);

    const getPlanStreak = (progressObj) => {
        const dates = new Set(
            Object.values(progressObj || {})
                .filter(Boolean)
                .map((iso) => String(iso).slice(0, 10))
        );
        if (!dates.size) return 0;
        const cursor = new Date();
        cursor.setHours(0, 0, 0, 0);
        let streak = 0;

        const today = cursor.toISOString().slice(0, 10);
        if (!dates.has(today)) {
            cursor.setDate(cursor.getDate() - 1);
        }

        while (dates.has(cursor.toISOString().slice(0, 10))) {
            streak += 1;
            cursor.setDate(cursor.getDate() - 1);
        }
        return streak;
    };

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

            const activePlanId = localStorage.getItem(getLastActivePlanKey());
            const activePlan = activePlanId ? getKhatmaPlanById(activePlanId) : null;
            if (!activePlan) {
                setActivePlanStats(null);
                return;
            }
            const progressRaw = JSON.parse(localStorage.getItem(getPlanProgressKey(activePlanId)) || '{}');
            const doneCount = activePlan.tasks.filter((t) => !!progressRaw[t.day]).length;
            const percent = Math.round((doneCount / activePlan.tasks.length) * 100);
            const nextTask = activePlan.tasks.find((t) => !progressRaw[t.day]) || null;
            setActivePlanStats({
                planId: activePlan.id,
                titleAr: activePlan.titleAr,
                titleEn: activePlan.titleEn,
                doneCount,
                total: activePlan.tasks.length,
                percent,
                streak: getPlanStreak(progressRaw),
                nextTask
            });
        };
        handleStorage();
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
                            onClick={() => navigate('/khatma/plans')}
                        >
                            <Target size={18} />
                            {lang === 'ar' ? 'خطة الختمة' : 'Khatmah Plan'}
                        </button>
                    </div>

                    {activePlanStats && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '0.85rem 1rem',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(212,175,55,0.25)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                <strong style={{ color: 'var(--gold-main, #D4AF37)' }}>
                                    {lang === 'ar' ? `آخر خطة نشطة: ${activePlanStats.titleAr}` : `Last active plan: ${activePlanStats.titleEn}`}
                                </strong>
                                <span style={{ fontSize: '0.82rem', opacity: 0.85 }}>
                                    {activePlanStats.doneCount}/{activePlanStats.total}
                                </span>
                            </div>
                            <div style={{ marginTop: '0.45rem', fontSize: '0.82rem', opacity: 0.9 }}>
                                {lang === 'ar'
                                    ? `التقدم ${activePlanStats.percent}% • نشاط ${activePlanStats.streak} يوم`
                                    : `Progress ${activePlanStats.percent}% • Streak ${activePlanStats.streak} days`}
                            </div>
                            {activePlanStats.nextTask && (
                                <div style={{ marginTop: '0.35rem', fontSize: '0.82rem', opacity: 0.78 }}>
                                    {lang === 'ar'
                                        ? `التالي: اليوم ${activePlanStats.nextTask.day} (ص ${activePlanStats.nextTask.startPage} - ${activePlanStats.nextTask.endPage})`
                                        : `Next: Day ${activePlanStats.nextTask.day} (p ${activePlanStats.nextTask.startPage}-${activePlanStats.nextTask.endPage})`}
                                </div>
                            )}
                        </div>
                    )}

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
