import React, { useState, useEffect } from 'react';
import { Play, Pause, BookOpen, X, ChevronDown, Heart } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import QuranReader from '../../components/quran/QuranReader';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';
import './Quran.css';
import { JUZ_START_PAGES, getLastActivePlanKey } from '../../data/khatmaPlans';

const Quran = () => {
    const { lang } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [readerConfig, setReaderConfig] = useState(null); // { type: 'surah' | 'juz', value: number }
    const [khatmaContext, setKhatmaContext] = useState(null); // { type: 'deceased' | 'group' | 'plan', khatmaId?, part?, planId?, task? }
    const [filterCategory, setFilterCategory] = useState('all'); // all, egyptian, saudi
    const [filterStyle, setFilterStyle] = useState('all'); // all, مجوّد, مرتّل
    const [showReciterModal, setShowReciterModal] = useState(false);
    const [surahForReciterPick, setSurahForReciterPick] = useState(null); // { number, name } عند الضغط على تشغيل
    const [showJuz, setShowJuz] = useState(false);
    const { currentSurah, isPlaying, playSurah, currentReciter, changeReciter, RECITERS } = useAudio();


    useEffect(() => {
        fetch('https://api.alquran.cloud/v1/surah')
            .then(res => res.json())
            .then(data => {
                setSurahs(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching surahs:', err);
                setLoading(false);
            });
    }, []);

    // Handle deep link from Khatma (reserve part and open reader)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const khatmaType = params.get('khatmaType');
        const khatmaId = params.get('khatmaId');
        const partStr = params.get('part');

        const planId = params.get('planId');
        const task = params.get('task');
        const startPageParam = params.get('startPage');
        const endPageParam = params.get('endPage');

        if (planId && startPageParam) {
            const startPage = parseInt(startPageParam, 10) || 1;
            const endPage = parseInt(endPageParam || '604', 10) || 604;
            setReaderConfig({ type: 'juz', value: startPage });
            setKhatmaContext({ type: 'plan', planId, task: Number(task || 1), endPage });
            localStorage.setItem(getLastActivePlanKey(), planId);
            return;
        }

        if (partStr) {
            const part = parseInt(partStr, 10);
            const startPage = JUZ_START_PAGES[part - 1] || 1;
            setReaderConfig({ type: 'juz', value: startPage });
            if (khatmaType && khatmaId) {
                setKhatmaContext({ type: khatmaType, khatmaId, part });
            }
        }
        const statePage = location.state?.page;
        if (!partStr && statePage && Number.isFinite(statePage)) {
            setReaderConfig({ type: 'juz', value: Math.max(1, Math.min(604, Number(statePage))) });
        }
    }, [location.search, location.state]);

    // Filter reciters based on category and style
    const filteredReciters = RECITERS.filter(r => {
        const categoryMatch = filterCategory === 'all' || r.category === filterCategory;
        const styleMatch = filterStyle === 'all' || r.style === filterStyle;
        return categoryMatch && styleMatch;
    });

    // Group reciters by category
    const egyptianReciters = RECITERS.filter(r => r.category === 'egyptian');
    const saudiReciters = RECITERS.filter(r => r.category === 'saudi');

    if (loading) {
        return (
            <div className="quran-page container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>{lang === 'ar' ? 'جاري تحميل القرآن الكريم...' : 'Loading the Holy Quran...'}</p>
                </div>
            </div>
        );
    }

    if (readerConfig) {
        return (
            <div className="container" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
                <QuranReader
                    surahNumber={readerConfig.type === 'surah' ? readerConfig.value : null}
                    startPage={readerConfig.type === 'juz' ? readerConfig.value : 1}
                    khatmaJuz={khatmaContext ? khatmaContext.part : null}
                    onClose={() => {
                        setReaderConfig(null);
                        if (khatmaContext) {
                            if (khatmaContext.type === 'plan') {
                                navigate('/khatma/plans');
                            } else {
                                navigate(khatmaContext.type === 'deceased' ? '/khatma/deceased' : '/khatma/group');
                            }
                        }
                    }}
                    khatmaEndPage={khatmaContext?.type === 'plan' ? khatmaContext.endPage : null}
                    onComplete={khatmaContext ? () => {
                        if (khatmaContext.type === 'plan') {
                            const key = `zad_khatma_plan_progress_${khatmaContext.planId}`;
                            const current = JSON.parse(localStorage.getItem(key) || '{}');
                            current[khatmaContext.task] = new Date().toISOString();
                            localStorage.setItem(key, JSON.stringify(current));
                            return;
                        }
                        const storageKey = khatmaContext.type === 'deceased' ? 'zad_khatmas_deceased' : 'zad_khatmas_group';
                        const stored = localStorage.getItem(storageKey);
                        if (!stored) return;
                        try {
                            const list = JSON.parse(stored);
                            const updated = list.map(k => {
                                if (k.id !== khatmaContext.khatmaId) return k;
                                return {
                                    ...k,
                                    parts: k.parts.map(p =>
                                        p.id === khatmaContext.part ? { ...p, status: 'completed' } : p
                                    )
                                };
                            });
                            localStorage.setItem(storageKey, JSON.stringify(updated));
                        } catch (err) {
                            console.error('Failed to update khatma on complete', err);
                        }
                    } : undefined}
                />
            </div>
        );
    }

    return (
        <div className="quran-page animate-slide-down">
            {/* Hero Section */}
            <div className="quran-hero">
                <div className="quran-hero-bg"></div>
                <div className="quran-hero-content container">
                    <div className="quran-hero-icon">
                        <BookOpen size={48} />
                    </div>
                    <h1 className="quran-hero-title quran-text">
                        {lang === 'ar' ? 'القرآن الكريم' : 'The Noble Quran'}
                    </h1>
                    <p className="quran-hero-subtitle">
                        {lang === 'ar' ? 'استمع وتدبر كلام الله' : 'Listen and contemplate the words of Allah'}
                    </p>
                </div>
            </div>

            <div className="container quran-container">
                {/* Juz (Parts) selector instead of search */}
                <div className="juz-card">
                    <button
                        type="button"
                        className="juz-toggle"
                        onClick={() => setShowJuz(prev => !prev)}
                    >
                        <span className="juz-title">
                            {lang === 'ar' ? 'الأجزاء' : 'Juz (Parts)'}
                        </span>
                        <ChevronDown
                            size={18}
                            className={showJuz ? 'juz-chevron open' : 'juz-chevron'}
                        />
                    </button>
                    {showJuz && (
                        <div className="juz-grid">
                            {JUZ_START_PAGES.map((page, index) => (
                                <button
                                    key={index + 1}
                                    type="button"
                                    className="juz-pill"
                                    onClick={() => setReaderConfig({ type: 'juz', value: page })}
                                >
                                    {lang === 'ar' ? `الجزء ${index + 1}` : `Juz ${index + 1}`}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Surahs Grid */}
                <div className="surahs-grid">
                    {surahs.map((surah, index) => {
                        const isThisSurahPlaying = currentSurah?.number === surah.number && isPlaying;

                        return (
                            <div
                                key={surah.number}
                                className={`surah-card ${isThisSurahPlaying ? 'playing' : ''}`}
                                style={{ animationDelay: `${index * 0.03}s` }}
                            >
                                <div className="surah-number-badge">
                                    {isThisSurahPlaying ? (
                                        <div className="playing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    ) : (
                                        <span>{surah.number}</span>
                                    )}
                                </div>

                                <div className="surah-info">
                                    <h3 className="surah-name quran-text">{surah.name}</h3>
                                    <div className="surah-meta">
                                        <span className="surah-type">
                                            {surah.revelationType === 'Meccan' ? (lang === 'ar' ? 'مكية' : 'Meccan') : (lang === 'ar' ? 'مدنية' : 'Medinan')}
                                        </span>
                                        <span className="surah-ayahs">{surah.numberOfAyahs} {lang === 'ar' ? 'آية' : 'verses'}</span>
                                    </div>
                                </div>

                                <div className="surah-actions">
                                    <button
                                        className="surah-action-btn read-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setReaderConfig({ type: 'surah', value: surah.number });
                                        }}
                                        title={lang === 'ar' ? 'قراءة' : 'Read'}
                                    >
                                        <BookOpen size={18} />
                                    </button>
                                    <button
                                        className={`surah-action-btn play-btn ${isThisSurahPlaying ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (isThisSurahPlaying) {
                                                playSurah(surah.number, surah.name);
                                            } else {
                                                setSurahForReciterPick({ number: surah.number, name: surah.name });
                                                setShowReciterModal(true);
                                            }
                                        }}
                                        title={isThisSurahPlaying ? (lang === 'ar' ? 'إيقاف' : 'Pause') : (lang === 'ar' ? 'تشغيل - اختر قارئاً' : 'Play - Choose reciter')}
                                    >
                                        {isThisSurahPlaying ? <Pause size={18} /> : <Play size={18} />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* شاشة اختيار القارئ — تظهر كاملة أمام المستخدم */}
            {showReciterModal && (
                <div
                    className="reciter-dropdown"
                    role="dialog"
                    aria-modal="true"
                    aria-label={lang === 'ar' ? 'اختر قارئاً' : 'Choose reciter'}
                    onClick={() => { setShowReciterModal(false); setSurahForReciterPick(null); }}
                >
                    <div className="reciter-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {surahForReciterPick
                                    ? (lang === 'ar' ? `اختر قارئاً لسورة ${surahForReciterPick.name}` : `Choose reciter for ${surahForReciterPick.name}`)
                                    : (lang === 'ar' ? 'اختر القارئ' : 'Select Reciter')}
                            </h2>
                            <button type="button" className="modal-close" onClick={() => { setShowReciterModal(false); setSurahForReciterPick(null); }} aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Filter Tabs */}
                        <div className="reciter-filters">
                            <div className="filter-group">
                                <button
                                    className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilterCategory('all')}
                                >
                                    {lang === 'ar' ? 'الكل' : 'All'}
                                </button>
                                <button
                                    className={`filter-btn ${filterCategory === 'egyptian' ? 'active' : ''}`}
                                    onClick={() => setFilterCategory('egyptian')}
                                >
                                    {lang === 'ar' ? '🇪🇬 مصر' : '🇪🇬 Egyptian'}
                                </button>
                                <button
                                    className={`filter-btn ${filterCategory === 'saudi' ? 'active' : ''}`}
                                    onClick={() => setFilterCategory('saudi')}
                                >
                                    {lang === 'ar' ? '🇸🇦 السعودية' : '🇸🇦 Saudi'}
                                </button>
                            </div>
                            <div className="filter-group">
                                <button
                                    className={`filter-btn style-btn ${filterStyle === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilterStyle('all')}
                                >
                                    {lang === 'ar' ? 'الكل' : 'All Styles'}
                                </button>
                                <button
                                    className={`filter-btn style-btn ${filterStyle === 'مجوّد' ? 'active' : ''}`}
                                    onClick={() => setFilterStyle('مجوّد')}
                                >
                                    {lang === 'ar' ? 'مجوّد' : 'Mujawwad'}
                                </button>
                                <button
                                    className={`filter-btn style-btn ${filterStyle === 'مرتّل' ? 'active' : ''}`}
                                    onClick={() => setFilterStyle('مرتّل')}
                                >
                                    {lang === 'ar' ? 'مرتّل' : 'Murattal'}
                                </button>
                            </div>
                        </div>

                        <div className="reciters-list">
                            {filteredReciters.map(reciter => (
                                <button
                                    key={reciter.id}
                                    type="button"
                                    className={`reciter-item ${currentReciter.id === reciter.id ? 'selected' : ''}`}
                                    onClick={() => {
                                        if (surahForReciterPick) {
                                            playSurah(surahForReciterPick.number, surahForReciterPick.name, reciter);
                                            setSurahForReciterPick(null);
                                        }
                                        setShowReciterModal(false);
                                    }}
                                >
                                    <img
                                        src={reciter.image || '/images/OIP.jpg'}
                                        alt=""
                                        className="reciter-item-avatar-img"
                                    />
                                    <div className="reciter-item-info">
                                        <span className="reciter-item-name">
                                            {lang === 'ar' ? reciter.nameAr : reciter.nameEn}
                                        </span>
                                        <span className="reciter-item-style">
                                            {reciter.category === 'egyptian' ? '🇪🇬' : '🇸🇦'} {reciter.style}
                                        </span>
                                    </div>
                                    {currentReciter.id === reciter.id && (
                                        <div className="reciter-check">✓</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quran;
