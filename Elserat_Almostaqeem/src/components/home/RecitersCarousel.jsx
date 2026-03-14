import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { RECITERS } from '../../context/AudioContext';
import { Headphones } from 'lucide-react';

const RecitersCarousel = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % RECITERS.length);
                setIsTransitioning(false);
            }, 500); // Wait for fade out
        }, 4000); // Change reciter every 4 seconds

        return () => clearInterval(interval);
    }, []);

    const currentReciter = RECITERS[currentIndex];

    // Get background based on theme
    const getBackground = () => {
        if (theme === 'ramadan') return 'linear-gradient(135deg, var(--gold-main) 0%, var(--lantern) 100%)';
        if (theme === 'dark') return 'linear-gradient(135deg, var(--btn-primary) 0%, var(--color-primary-light) 100%)';
        return 'linear-gradient(135deg, var(--primary) 0%, var(--color-primary-light) 100%)';
    };

    return (
        <div className="card reciters-carousel-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative', padding: 0 }}>
            {/* Header / Title Area */}
            <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                <Headphones size={20} color={theme === 'ramadan' ? 'var(--gold-main)' : 'var(--primary)'} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {lang === 'ar' ? 'قرّاء العالم الإسلامي' : 'Islamic World Reciters'}
                </h3>
            </div>

            {/* Carousel Content */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', background: 'var(--color-surface-hover)' }}>
                <div
                    className="reciter-slide"
                    style={{
                        opacity: isTransitioning ? 0 : 1,
                        transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
                        transition: 'all 0.5s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: '1rem',
                        width: '100%'
                    }}
                >
                    {/* Reciter Image */}
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        padding: '4px',
                        background: getBackground(),
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <img
                            src={currentReciter.image}
                            alt={lang === 'ar' ? currentReciter.nameAr : currentReciter.nameEn}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '3px solid var(--color-surface)'
                            }}
                            onError={(e) => {
                                e.target.src = '/images/default-avatar.png'; // Fallback
                            }}
                        />
                    </div>

                    {/* Reciter Name & Style */}
                    <div style={{ marginTop: '0.5rem' }}>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 'bold' }}>
                            {lang === 'ar' ? currentReciter.nameAr : currentReciter.nameEn}
                        </h4>
                        <span className="badge badge-primary">
                            {lang === 'ar' ? currentReciter.style : currentReciter.styleEn}
                        </span>
                    </div>
                </div>
            </div>

            {/* Decorative progress bar at the bottom */}
            <div className="carousel-progress-bar" style={{ height: '3px', background: 'var(--color-primary-10)', width: '100%' }}>
                <div
                    key={currentIndex} // Re-triggers animation on index change
                    style={{
                        height: '100%',
                        background: getBackground(),
                        width: '100%',
                        animation: 'progress 4s linear'
                    }}
                />
            </div>
        </div>
    );
};

export default RecitersCarousel;
