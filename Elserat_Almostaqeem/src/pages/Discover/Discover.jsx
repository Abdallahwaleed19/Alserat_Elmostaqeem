import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRadio, RADIO_SOURCE_URL } from '../../context/RadioContext';
import { useTheme } from '../../context/ThemeContext';
import { Radio, BookOpen, Calendar as CalendarIcon, Play, Pause, Sparkles, ArrowLeft, Map, Coins, Droplets, Moon, Star, Compass, Heart, Download, Home as HomeIcon, Bookmark, Mic, Globe, Sun, Circle, Image as ImageIcon, Target, Award } from 'lucide-react';
import './Discover.css';

const Discover = () => {
    const { lang, toggleLanguage } = useLanguage();
    const { theme, colorMode, toggleColorMode } = useTheme();
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

            {/* Settings & Controls */}
            <div className="container discover-settings" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '2rem auto 1rem' }}>
                 <button onClick={toggleLanguage} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '100px' }}>
                    <Globe size={18} />
                    {lang === 'ar' ? 'English' : 'عربي'}
                 </button>
                 <button onClick={toggleColorMode} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '100px' }}>
                    {colorMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    {lang === 'ar' ? (colorMode === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح') : (colorMode === 'light' ? 'Dark Mode' : 'Light Mode')}
                 </button>
            </div>

            <div className="container discover-container">
                <div className="discover-grid">
                    {/* 0. Home Dashboard */}
                    <Link to="/home" className="discover-card" style={{ borderColor: 'var(--color-primary)' }}>
                        <div className="card-icon" style={{ color: 'var(--color-primary)' }}>
                            <HomeIcon size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'الرئيسية (اللوحة اليومية)' : 'Home Dashboard'}</h2>
                            <p>{lang === 'ar' ? 'مواقيت الصلاة، الحديث اليومي، وتتبع الجدول اليومي.' : 'Prayer times, daily Hadith, and daily schedule tracker.'}</p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'فتح الرئيسية' : 'Open Home'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>
 
                    {/* Sunnah (Hadith) */}
                    <Link to="/sunnah" className="discover-card" style={{ borderColor: 'var(--color-primary)' }}>
                        <div className="card-icon" style={{ color: 'var(--color-primary)' }}>
                            <BookOpen size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'السنة النبوية (الأحاديث)' : 'Prophetic Sunnah'}</h2>
                            <p>{lang === 'ar' ? 'تصفّح أهم كتب الحديث النبوي الشريف واقرأ جميع أحاديث صحيح البخاري وصحيح مسلم.' : 'Browse the most important Hadith collections including Sahih Al-Bukhari and Muslim.'}</p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'تصفح الأحاديث' : 'Go to Hadith'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

                    {/* Khatma */}
                    <Link to="/khatma" className="discover-card" style={{ borderColor: 'var(--color-accent)' }}>
                        <div className="card-icon" style={{ color: 'var(--color-accent)' }}>
                            <BookOpen size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'الخَتَمات والمشاركة' : 'Khatmas'}</h2>
                            <p>{lang === 'ar' ? 'ختمة للمتوفى، ختمة جماعية، ومتابعة ختمتك.' : 'Khatma for deceased, group khatma, and track yours.'}</p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'تصفح الختمات' : 'View Khatmas'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

                    {/* Reciters */}
                    <Link to="/reciters" className="discover-card">
                        <div className="card-icon" style={{ color: 'var(--color-primary)' }}>
                            <Mic size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'القراء' : 'Reciters'}</h2>
                            <p>{lang === 'ar' ? 'استمع إلى تلاوات القرآن الكريم بأصوات أشهر القراء.' : 'Listen to Quran recitations by famous reciters.'}</p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'استمع الآن' : 'Listen Now'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

                    {/* Greeting Cards */}
                    <Link to="/discover/greeting-cards" className="discover-card" style={{ borderColor: 'var(--color-primary)' }}>
                        <div className="card-icon" style={{ color: 'var(--color-primary)' }}>
                            <ImageIcon size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'بطاقات التهنئة' : 'Greeting Cards'}</h2>
                            <p>{lang === 'ar' ? 'صمم وشارك بطاقات تهنئة إسلامية بلمستك الخاصة.' : 'Design and share custom Islamic greeting cards.'}</p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'تصميم بطاقة' : 'Design Card'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

                    {/* Islamic Wallpapers */}
                    <Link to="/discover/wallpapers" className="discover-card" style={{ borderColor: 'var(--color-accent)' }}>
                        <div className="card-icon" style={{ color: 'var(--color-accent)' }}>
                            <ImageIcon size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'خلفيات إسلامية' : 'Islamic Wallpapers'}</h2>
                            <p>{lang === 'ar' ? 'مجموعة مختارة من الخلفيات الإسلامية عالية الدقة لهاتفك.' : 'A selection of high-quality Islamic wallpapers for your phone.'}</p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'عرض الخلفيات' : 'View Wallpapers'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

                    {/* Worship Tracker */}
                    <Link to="/discover/tracker" className="discover-card" style={{ borderColor: 'var(--color-primary)' }}>
                        <div className="card-icon" style={{ color: 'var(--color-primary)' }}>
                            <Target size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'متتبع العبادات' : 'Worship Tracker'}</h2>
                            <p>{lang === 'ar' ? 'سجل صلواتك وأذكارك اليومية واحصل على نقاط وأوسمة.' : 'Track your daily prayers and adhkar to earn points and badges.'}</p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'ابدأ التتبع' : 'Start Tracking'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

                    {/* Bookmarks */}
                    <Link to="/bookmarks" className="discover-card">
                        <div className="card-icon" style={{ color: 'var(--color-accent)' }}>
                            <Bookmark size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'العلامات المرجعية' : 'Bookmarks'}</h2>
                            <p>{lang === 'ar' ? 'الوصول السريع إلى الآيات والسور التي قمت بحفظها.' : 'Quick access to the verses and surahs you bookmarked.'}</p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'عرض المحفوظات' : 'View Bookmarks'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

                    {/* Favorites */}
                    <Link to="/discover/favorites" className="discover-card">
                        <div className="card-icon" style={{ color: 'var(--color-accent)' }}>
                            <Heart size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'المفضلة' : 'Favorites'}</h2>
                            <p>{lang === 'ar' ? 'الأذكار والأدعية التي أضفتها إلى المفضلة.' : 'The Adhkar and Supplications you added to your favorites.'}</p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'عرض المفضلة' : 'View Favorites'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

                    {/* Tasbeeh */}
                    <Link to="/tasbeeh" className="discover-card" style={{ borderColor: 'var(--color-primary)' }}>
                        <div className="card-icon" style={{ color: 'var(--color-primary)' }}>
                            <Sparkles size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'المسبحة الإلكترونية' : 'Digital Tasbeeh'}</h2>
                            <p>{lang === 'ar' ? 'مسبحة ذكية لحساب التسبيحات والأذكار.' : 'Smart digital rosary to count your tasbeeh and adhkar.'}</p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'ابدأ التسبيح' : 'Start Tasbeeh'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

                    {/* Qibla Compass */}
                    <Link to="/discover/compass" className="discover-card" style={{ borderColor: 'var(--color-primary)' }}>
                        <div className="card-icon" style={{ color: 'var(--color-primary)' }}>
                            <Compass size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'بوصلة القبلة' : 'Qibla Compass'}</h2>
                            <p>{lang === 'ar' ? 'حدد اتجاه القبلة بدقة من موقعك الحالي.' : 'Determine Qibla direction accurately from your location.'}</p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'فتح البوصلة' : 'Open Compass'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

                    {/* Pillars of Islam */}
                    <Link to="/pillars" className="discover-card">
                        <div className="card-icon" style={{ color: 'var(--color-primary)' }}>
                            <BookOpen size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'أركان الإسلام' : 'Pillars of Islam'}</h2>
                            <p>{lang === 'ar' ? 'تعرف على أركان الإسلام الخمسة بشرح مفصل ومبسط.' : 'Learn about the Five Pillars of Islam with a detailed explanation.'}</p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'عرض الأركان' : 'View Pillars'}</span>
                            <ArrowLeft size={18} className="cta-arrow" />
                        </div>
                    </Link>

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


                    {/* Islamic Quiz */}
                    <Link to="/discover/quiz" className="discover-card" style={{ borderColor: 'var(--color-accent)' }}>
                        <div className="card-icon" style={{ color: 'var(--color-accent)' }}>
                            <Award size={32} />
                        </div>
                        <div className="card-content">
                            <h2>{lang === 'ar' ? 'اختبارات إسلامية' : 'Islamic Quiz'}</h2>
                            <p>{lang === 'ar' ? 'اختبر معلوماتك الدينية بأسئلة متنوعة وشاملة.' : 'Test your religious knowledge with various questions.'}</p>
                        </div>
                        <div className="card-cta">
                            <span>{lang === 'ar' ? 'بدء الاختبار' : 'Start Quiz'}</span>
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
                </div>
            </div>
        </div>
    );
};

export default Discover;
