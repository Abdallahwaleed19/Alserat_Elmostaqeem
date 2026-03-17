import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { RECITERS, useAudio } from '../../context/AudioContext';
import { Headphones, Play, Pause, ChevronRight, ChevronLeft, Info, Mic } from 'lucide-react';
import { RECITER_BIOS } from '../../data/reciterBios';

const RecitersCarousel = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const { currentReciter: audioCurrentReciter, isPlaying, playSurah, togglePlay } = useAudio();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Group reciters by base name so we don't repeat the same reciter if they have both Murattal and Mujawwad
    const groupedReciters = useMemo(() => {
        const map = new Map();
        RECITERS.forEach(reciter => {
            const baseNameAr = reciter.nameAr.split(' - ')[0];
            const baseNameEn = reciter.nameEn.split(' (')[0];
            
            if (!map.has(baseNameAr)) {
                const bioData = RECITER_BIOS[baseNameAr] || {};
                
                map.set(baseNameAr, {
                    id: baseNameAr,
                    baseNameAr,
                    baseNameEn,
                    category: reciter.category,
                    image: reciter.image,
                    recitations: [], // Array of original reciter objects (Mujawwad, Murattal, etc.)
                    bioAr: bioData.bioAr || 'لا توجد سيرة ذاتية متاحة حالياً.',
                    bioEn: bioData.bioEn || 'Biography currently unavailable.',
                    birth: bioData.birth || '',
                    birthEn: bioData.birthEn || '',
                    death: bioData.death || '',
                    deathEn: bioData.deathEn || '',
                    birthplace: bioData.birthplace || '',
                    birthplaceEn: bioData.birthplaceEn || '',
                    education: bioData.education || '',
                    educationEn: bioData.educationEn || ''
                });
            }
            map.get(baseNameAr).recitations.push(reciter);
        });
        return Array.from(map.values());
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 12000); // 12 seconds to give more time to read detailed bio

        return () => clearInterval(interval);
    }, [currentIndex, groupedReciters.length]);

    const handleNext = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % groupedReciters.length);
            setIsTransitioning(false);
        }, 400);
    };

    const handlePrev = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + groupedReciters.length) % groupedReciters.length);
            setIsTransitioning(false);
        }, 400);
    };

    if (groupedReciters.length === 0) return null;

    const currentGroup = groupedReciters[currentIndex];

    const getBackground = () => {
        if (theme === 'ramadan') return 'linear-gradient(135deg, var(--gold-main) 0%, var(--lantern) 100%)';
        if (theme === 'dark') return 'linear-gradient(135deg, var(--btn-primary) 0%, var(--shadow-color) 100%)';
        return 'linear-gradient(135deg, var(--primary) 0%, var(--color-primary-light) 100%)';
    };

    return (
        <div className="card reciters-carousel-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', padding: 0 }}>
            {/* Header / Title Area */}
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Headphones size={20} color={theme === 'ramadan' ? 'var(--gold-main)' : 'var(--primary)'} />
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {lang === 'ar' ? 'قرّاء العالم الإسلامي' : 'Islamic World Reciters'}
                    </h3>
                </div>
                {/* Navigation Arrows */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handlePrev} className="btn-icon" style={{ background: 'var(--color-surface-hover)', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {lang === 'ar' ? <ChevronRight size={18} color="var(--text-main)" /> : <ChevronLeft size={18} color="var(--text-main)" />}
                    </button>
                    <button onClick={handleNext} className="btn-icon" style={{ background: 'var(--color-surface-hover)', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {lang === 'ar' ? <ChevronLeft size={18} color="var(--text-main)" /> : <ChevronRight size={18} color="var(--text-main)" />}
                    </button>
                </div>
            </div>

            {/* Carousel Content */}
            <div style={{ position: 'relative', background: 'var(--color-surface-hover)' }}>
                <div
                    className="reciter-slide"
                    style={{
                        opacity: isTransitioning ? 0 : 1,
                        transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
                        transition: 'all 0.4s ease',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: '2.5rem',
                        padding: '2.5rem',
                        width: '100%',
                        flexWrap: 'wrap'
                    }}
                >
                    {/* Left side: Image and Actions */}
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', flexShrink: 0, margin: '0 auto', maxWidth: '240px' }}>
                        <div style={{
                            width: '160px',
                            height: '160px',
                            borderRadius: '50%',
                            padding: '5px',
                            background: getBackground(),
                            boxShadow: 'var(--shadow-lg)',
                            position: 'relative'
                        }}>
                            <img
                                src={currentGroup.image}
                                alt={lang === 'ar' ? currentGroup.baseNameAr : currentGroup.baseNameEn}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '4px solid var(--color-surface)'
                                }}
                                onError={(e) => { e.target.src = '/images/default-avatar.png'; }}
                            />
                        </div>
                        
                        {/* Playback Buttons list for available styles (Murattal / Mujawwad) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                            {currentGroup.recitations.map((rec) => {
                                const isThisReciterPlaying = isPlaying && audioCurrentReciter?.id === rec.id;
                                return (
                                    <button 
                                        key={rec.id}
                                        onClick={() => {
                                            if (isThisReciterPlaying) {
                                                togglePlay(); 
                                            } else {
                                                playSurah(1, lang === 'ar' ? 'الفاتحة' : 'Al-Fatiha', rec);
                                            }
                                        }}
                                        className="btn btn-primary"
                                        style={{ 
                                            borderRadius: '2rem', 
                                            padding: '0.6rem 1rem', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            background: isThisReciterPlaying ? 'var(--color-error)' : 'var(--primary)',
                                            border: 'none',
                                            color: 'white',
                                            boxShadow: 'var(--shadow-md)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            width: '100%'
                                        }}
                                    >
                                        {isThisReciterPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                                        {lang === 'ar' ? `استمع (${rec.style})` : `Listen (${rec.styleEn})`}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right side: Comprehensive Biography */}
                    <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 'bold' }}>
                                {lang === 'ar' ? currentGroup.baseNameAr : currentGroup.baseNameEn}
                            </h4>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                <span className="badge" style={{ background: 'var(--primary-10)', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, padding: '0.35rem 0.85rem', borderRadius: '1.5rem' }}>
                                    {lang === 'ar' ? (currentGroup.category === 'egyptian' ? '🇪🇬 مقرأة مصرية' : '🇸🇦 قراء السعودية') : (currentGroup.category === 'egyptian' ? '🇪🇬 Egyptian Reciters' : '🇸🇦 Saudi Reciters')}
                                </span>
                                {/* Badges for extracted styles without repeating the whole reciter */}
                                {currentGroup.recitations.map(rec => (
                                    <span key={`badge-${rec.id}`} className="badge" style={{ background: 'var(--color-surface)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '0.9rem', padding: '0.35rem 0.85rem', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Mic size={14} color="var(--primary)" />
                                        {lang === 'ar' ? rec.style : rec.styleEn}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div style={{ 
                            background: 'var(--color-surface)', 
                            padding: '1.5rem', 
                            borderRadius: 'var(--radius-lg)', 
                            border: '1px solid var(--border-light)',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                                <Info size={18} />
                                <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{lang === 'ar' ? 'السيرة الذاتية المفصلة' : 'Detailed Biography'}</span>
                            </div>
                            
                            {/* Structured Bio Data Grid */}
                            {currentGroup.birth && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--color-background)', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <div><strong style={{ color: 'var(--primary-dark)' }}>{lang === 'ar' ? 'الميلاد والوفاة:' : 'Lifespan:'}</strong> {lang === 'ar' ? `${currentGroup.birth} - ${currentGroup.death}` : `${currentGroup.birthEn} - ${currentGroup.deathEn}`}</div>
                                    <div><strong style={{ color: 'var(--primary-dark)' }}>{lang === 'ar' ? 'محل الميلاد:' : 'Birthplace:'}</strong> {lang === 'ar' ? currentGroup.birthplace : currentGroup.birthplaceEn}</div>
                                    <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: 'var(--primary-dark)' }}>{lang === 'ar' ? 'التعليم والنشأة:' : 'Education:'}</strong> {lang === 'ar' ? currentGroup.education : currentGroup.educationEn}</div>
                                </div>
                            )}

                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8 }}>
                                {lang === 'ar' ? currentGroup.bioAr : currentGroup.bioEn}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative progress bar at the bottom */}
                <div className="carousel-progress-bar" style={{ height: '4px', background: 'var(--border-light)', width: '100%', position: 'absolute', bottom: 0, left: 0 }}>
                    <div
                        key={currentIndex} // Re-triggers animation on index change
                        style={{
                            height: '100%',
                            background: getBackground(),
                            width: '100%',
                            animation: 'progress 12s linear'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default RecitersCarousel;
