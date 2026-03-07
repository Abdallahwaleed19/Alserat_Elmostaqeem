import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRadio, RADIO_SOURCE_URL } from '../../context/RadioContext';
import { useTheme } from '../../context/ThemeContext';
import { Radio, BookOpen, Calendar as CalendarIcon, Play, Pause, Sparkles, ArrowLeft, Map, Coins, Droplets, Moon, Star, Compass, Heart, Download } from 'lucide-react';
import './Discover.css';

const Discover = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const { isActive: isRadioActive, isPlaying: isPlayingRadio, radioError, startRadio, togglePlayPause } = useRadio();

    const toggleRadio = () => {
        if (isPlayingRadio) {
            togglePlayPause();
        } else if (!isRadioActive) {
            startRadio();
        } else {
            togglePlayPause();
        }
    };

    return (
        <div className="discover-page animate-slide-down">
            {/* Hero Section */}
            <div className="discover-hero">
                <div className="discover-hero-bg"></div>
                <div className="discover-hero-content container">
                    <div className="discover-hero-icon">
                        <Sparkles size={40} />
                    </div>
                    <h1 className="discover-hero-title">
                        {lang === 'ar' ? 'المزيد - استكشف' : 'Discover More'}
                    </h1>
                    <p className="discover-hero-subtitle">
                        {lang === 'ar' ? 'اكتشف المزيد من الميزات والمحتوى الإسلامي' : 'Explore more Islamic features and content'}
                    </p>
                </div>
            </div>

            <div className="container discover-container">
                <div className="discover-grid">
                    {/* 1. Quran Radio */}
                    <div className="discover-card radio-card">
                        <div className="card-icon radio-icon">
                            <Radio size={32} />
                            {isPlayingRadio && <div className="radio-waves"></div>}
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'إذاعة القرآن الكريم' : 'Quran Radio (Cairo)'}</h2>
                            <p>
                                {lang === 'ar'
                                    ? 'استمع إلى البث المباشر لإذاعة القرآن الكريم من القاهرة على مدار الساعة.'
                                    : 'Listen to the live broadcast of Quran Radio from Cairo 24/7.'}
                            </p>
                        </div>

                        <button
                            onClick={toggleRadio}
                            className={`radio-play-btn ${isPlayingRadio ? 'playing' : ''}`}
                        >
                            {isPlayingRadio ? <Pause size={24} /> : <Play size={24} />}
                            <span>{lang === 'ar' ? (isPlayingRadio ? 'إيقاف' : 'تشغيل') : (isPlayingRadio ? 'Stop' : 'Play')}</span>
                        </button>
                    </div>

                    {/* 2. Seerah Section */}
                    <Link to="/seerah" className="discover-card seerah-card">
                        <div className="card-icon seerah-icon">
                            <BookOpen size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'السيرة النبوية' : 'Seerah (Prophetic Biography)'}</h2>
                            <p>
                                {lang === 'ar'
                                    ? 'انطلق في رحلة عبر المحطات الرئيسية في حياة محمد ﷺ والغزوات الفاصلة.'
                                    : 'Embark on a journey through the key milestones of Muhammad ﷺ life and pivotal battles.'}
                            </p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'تصفح السيرة' : 'Explore'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

                    {/* Download App Section */}
                    <Link to="/download-app" className="discover-card download-app-card">
                        <div className="card-icon download-app-icon" style={{ color: 'var(--color-primary)' }}>
                            <Download size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'تثبيت ومشاركة التطبيق' : 'Install & Share App'}</h2>
                            <p>
                                {lang === 'ar'
                                    ? 'احصل على تجربة أفضل بملء الشاشة عبر تثبيت الموقع، أو شاركه مع من تحب.'
                                    : 'Get a better full-screen experience by installing the app, or share it with others.'}
                            </p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

                    {/* 3. Islamic Calendar */}
                    <Link to="/calendar" className="discover-card calendar-card">
                        <div className="card-icon calendar-icon">
                            <CalendarIcon size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'التقويم الهجري' : 'Hijri Calendar'}</h2>
                            <p>
                                {lang === 'ar'
                                    ? 'تصفح التقويم الهجري التفاعلي وتعرف على المناسبات الإسلامية الهامة.'
                                    : 'Browse the interactive Hijri calendar and learn about important Islamic occasions.'}
                            </p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'عرض التقويم' : 'View Calendar'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

                    {/* 4. Zakat */}
                    <Link to="/zakat" className="discover-card zakat-card">
                        <div className="card-icon zakat-icon">
                            <Coins size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'الزكاة' : 'Zakat'}</h2>
                            <p>
                                {lang === 'ar'
                                    ? 'شرح مبسط وحاسبة زكاة لمصر حسب أسعار الذهب والفضة.'
                                    : 'Simple guide and Zakat calculator for Egypt based on gold and silver prices.'}
                            </p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'حساب الزكاة' : 'Calculate'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

                    {/* 5. Wudu (Ablution) */}
                    <Link to="/wudu" className="discover-card wudu-card">
                        <div className="card-icon wudu-icon">
                            <Droplets size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'أحكام الوضوء' : 'Rules of Wudu'}</h2>
                            <p>
                                {lang === 'ar'
                                    ? 'فروض الوضوء وسننه وما يبطله من السنة النبوية.'
                                    : 'Obligatory acts, sunnah, and what invalidates ablution.'}
                            </p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'عرض الأحكام' : 'View Rules'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>


                    {/* Conditional Cards based on Theme */}
                    {theme === 'ramadan' ? (
                        <Link to="/discover/laylat-alqadr" className="discover-card ramadan-special-card" style={{ borderColor: 'var(--color-primary-light)' }}>
                            <div className="card-icon ramadan-special-icon" style={{ background: 'linear-gradient(135deg, #1B4332 0%, #0F766E 100%)' }}>
                                <Moon size={32} color="white" />
                            </div>
                            <div className="card-content">
                                <h2>{lang === 'ar' ? 'ليلة القدر' : 'Laylat al-Qadr'}</h2>
                                <p>
                                    {lang === 'ar'
                                        ? 'شرح تفصيلي لفضائل وعلامات ليلة القدر وأفضل ما يُدعى فيها.'
                                        : 'Detailed explanation of the virtues, signs, and best supplications of the Night of Decree.'}
                                </p>
                            </div>
                            <div className="card-cta">
                                <span style={{ color: 'var(--color-primary)' }}>{lang === 'ar' ? 'اقرأ المزيد' : 'Read More'}</span>
                                <ArrowLeft size={18} className="cta-arrow" color="var(--color-primary)" />
                            </div>
                        </Link>
                    ) : (
                        <>
                            <Link to="/discover/isra-miraj" className="discover-card isra-card" style={{ borderColor: '#F59E0B' }}>
                                <div className="card-icon isra-icon" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
                                    <Star size={32} color="white" />
                                </div>
                                <div className="card-content">
                                    <h2>{lang === 'ar' ? 'رحلة الإسراء والمعراج' : 'Isra and Mi\'raj'}</h2>
                                    <p>
                                        {lang === 'ar'
                                            ? 'رحلة النبي ﷺ المعجزة من المسجد الحرام إلى المسجد الأقصى ثم إلى السماوات العلا.'
                                            : 'The miraculous journey of the Prophet ﷺ from Al-Haram to Al-Aqsa and the heavens.'}
                                    </p>
                                </div>
                                <div className="card-cta">
                                    <span style={{ color: '#D97706' }}>{lang === 'ar' ? 'اقرأ التفاصيل' : 'Read Details'}</span>
                                    <ArrowLeft size={18} className="cta-arrow" color="#D97706" />
                                </div>
                            </Link>

                            <Link to="/discover/qibla" className="discover-card qibla-card" style={{ borderColor: '#0EA5E9' }}>
                                <div className="card-icon qibla-icon" style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)' }}>
                                    <Compass size={32} color="white" />
                                </div>
                                <div className="card-content">
                                    <h2>{lang === 'ar' ? 'قصة تحويل القبلة' : 'Change of Qibla'}</h2>
                                    <p>
                                        {lang === 'ar'
                                            ? 'تفاصيل الحدث العظيم حينما تحولت قبلة المسلمين من بيت المقدس إلى الكعبة المشرفة.'
                                            : 'Details of the monumental event when the Qibla was changed from Jerusalem to the Kaaba.'}
                                    </p>
                                </div>
                                <div className="card-cta">
                                    <span style={{ color: '#0284C7' }}>{lang === 'ar' ? 'اقرأ التفاصيل' : 'Read Details'}</span>
                                    <ArrowLeft size={18} className="cta-arrow" color="#0284C7" />
                                </div>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Discover;
