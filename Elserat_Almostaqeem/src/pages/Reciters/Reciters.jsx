import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { ArrowLeft, ArrowRight, Play, Headphones, Mic2 } from 'lucide-react';
import './Reciters.css';

// Surah list with real names (Arabic)
const SURAHS = [
    { number: 1, nameAr: 'الفاتحة' },
    { number: 2, nameAr: 'البقرة' },
    { number: 3, nameAr: 'آل عمران' },
    { number: 4, nameAr: 'النساء' },
    { number: 5, nameAr: 'المائدة' },
    { number: 6, nameAr: 'الأنعام' },
    { number: 7, nameAr: 'الأعراف' },
    { number: 8, nameAr: 'الأنفال' },
    { number: 9, nameAr: 'التوبة' },
    { number: 10, nameAr: 'يونس' },
    { number: 11, nameAr: 'هود' },
    { number: 12, nameAr: 'يوسف' },
    { number: 13, nameAr: 'الرعد' },
    { number: 14, nameAr: 'إبراهيم' },
    { number: 15, nameAr: 'الحجر' },
    { number: 16, nameAr: 'النحل' },
    { number: 17, nameAr: 'الإسراء' },
    { number: 18, nameAr: 'الكهف' },
    { number: 19, nameAr: 'مريم' },
    { number: 20, nameAr: 'طه' },
    { number: 21, nameAr: 'الأنبياء' },
    { number: 22, nameAr: 'الحج' },
    { number: 23, nameAr: 'المؤمنون' },
    { number: 24, nameAr: 'النور' },
    { number: 25, nameAr: 'الفرقان' },
    { number: 26, nameAr: 'الشعراء' },
    { number: 27, nameAr: 'النمل' },
    { number: 28, nameAr: 'القصص' },
    { number: 29, nameAr: 'العنكبوت' },
    { number: 30, nameAr: 'الروم' },
    { number: 31, nameAr: 'لقمان' },
    { number: 32, nameAr: 'السجدة' },
    { number: 33, nameAr: 'الأحزاب' },
    { number: 34, nameAr: 'سبأ' },
    { number: 35, nameAr: 'فاطر' },
    { number: 36, nameAr: 'يس' },
    { number: 37, nameAr: 'الصافات' },
    { number: 38, nameAr: 'ص' },
    { number: 39, nameAr: 'الزمر' },
    { number: 40, nameAr: 'غافر' },
    { number: 41, nameAr: 'فصلت' },
    { number: 42, nameAr: 'الشورى' },
    { number: 43, nameAr: 'الزخرف' },
    { number: 44, nameAr: 'الدخان' },
    { number: 45, nameAr: 'الجاثية' },
    { number: 46, nameAr: 'الأحقاف' },
    { number: 47, nameAr: 'محمد' },
    { number: 48, nameAr: 'الفتح' },
    { number: 49, nameAr: 'الحجرات' },
    { number: 50, nameAr: 'ق' },
    { number: 51, nameAr: 'الذاريات' },
    { number: 52, nameAr: 'الطور' },
    { number: 53, nameAr: 'النجم' },
    { number: 54, nameAr: 'القمر' },
    { number: 55, nameAr: 'الرحمن' },
    { number: 56, nameAr: 'الواقعة' },
    { number: 57, nameAr: 'الحديد' },
    { number: 58, nameAr: 'المجادلة' },
    { number: 59, nameAr: 'الحشر' },
    { number: 60, nameAr: 'الممتحنة' },
    { number: 61, nameAr: 'الصف' },
    { number: 62, nameAr: 'الجمعة' },
    { number: 63, nameAr: 'المنافقون' },
    { number: 64, nameAr: 'التغابن' },
    { number: 65, nameAr: 'الطلاق' },
    { number: 66, nameAr: 'التحريم' },
    { number: 67, nameAr: 'الملك' },
    { number: 68, nameAr: 'القلم' },
    { number: 69, nameAr: 'الحاقة' },
    { number: 70, nameAr: 'المعارج' },
    { number: 71, nameAr: 'نوح' },
    { number: 72, nameAr: 'الجن' },
    { number: 73, nameAr: 'المزمل' },
    { number: 74, nameAr: 'المدثر' },
    { number: 75, nameAr: 'القيامة' },
    { number: 76, nameAr: 'الإنسان' },
    { number: 77, nameAr: 'المرسلات' },
    { number: 78, nameAr: 'النبأ' },
    { number: 79, nameAr: 'النازعات' },
    { number: 80, nameAr: 'عبس' },
    { number: 81, nameAr: 'التكوير' },
    { number: 82, nameAr: 'الانفطار' },
    { number: 83, nameAr: 'المطففين' },
    { number: 84, nameAr: 'الانشقاق' },
    { number: 85, nameAr: 'البروج' },
    { number: 86, nameAr: 'الطارق' },
    { number: 87, nameAr: 'الأعلى' },
    { number: 88, nameAr: 'الغاشية' },
    { number: 89, nameAr: 'الفجر' },
    { number: 90, nameAr: 'البلد' },
    { number: 91, nameAr: 'الشمس' },
    { number: 92, nameAr: 'الليل' },
    { number: 93, nameAr: 'الضحى' },
    { number: 94, nameAr: 'الشرح' },
    { number: 95, nameAr: 'التين' },
    { number: 96, nameAr: 'العلق' },
    { number: 97, nameAr: 'القدر' },
    { number: 98, nameAr: 'البينة' },
    { number: 99, nameAr: 'الزلزلة' },
    { number: 100, nameAr: 'العاديات' },
    { number: 101, nameAr: 'القارعة' },
    { number: 102, nameAr: 'التكاثر' },
    { number: 103, nameAr: 'العصر' },
    { number: 104, nameAr: 'الهمزة' },
    { number: 105, nameAr: 'الفيل' },
    { number: 106, nameAr: 'قريش' },
    { number: 107, nameAr: 'الماعون' },
    { number: 108, nameAr: 'الكوثر' },
    { number: 109, nameAr: 'الكافرون' },
    { number: 110, nameAr: 'النصر' },
    { number: 111, nameAr: 'المسد' },
    { number: 112, nameAr: 'الإخلاص' },
    { number: 113, nameAr: 'الفلق' },
    { number: 114, nameAr: 'الناس' },
];

const Reciters = () => {
    const { lang } = useLanguage();
    const { RECITERS, changeReciter, playSurah, currentSurah, isPlaying, currentReciter } = useAudio();
    const [selectedReciter, setSelectedReciter] = useState(null);

    const egyptianReciters = RECITERS.filter(r => r.category === 'egyptian');
    const saudiReciters = RECITERS.filter(r => r.category === 'saudi');

    const handleReciterSelect = (reciter) => {
        setSelectedReciter(reciter);
        changeReciter(reciter.id);
    };

    const handleSurahPlay = (surahNumber) => {
        const surah = SURAHS.find((s) => s.number === surahNumber);
        const name = surah ? surah.nameAr : (lang === 'ar' ? `رقم ${surahNumber}` : `No. ${surahNumber}`);
        playSurah(surahNumber, name);
    };

    if (selectedReciter) {
        const isEgyptian = selectedReciter.category === 'egyptian';
        const flag = isEgyptian ? '🇪🇬' : '🇸🇦';

        return (
            <div className="container reciters-page animate-slide-down">
                <div className="reciter-detail-hero card card-glass">
                    <button
                        onClick={() => setSelectedReciter(null)}
                        className="btn btn-outline reciter-back-btn"
                        type="button"
                    >
                        {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                        <span>{lang === 'ar' ? 'عودة إلى القائمة' : 'Back to list'}</span>
                    </button>

                    <div className="reciter-detail-avatar-wrapper">
                        <div className="reciter-detail-avatar-ring"></div>
                        <img
                            src={selectedReciter.image || '/images/minshawi.jpg'}
                            alt={selectedReciter.nameEn}
                            className="reciter-detail-avatar"
                            onError={(e) => {
                                e.target.src = '/images/minshawi.jpg';
                            }}
                        />
                    </div>

                    <div className="reciter-detail-text">
                        <h1 className="reciter-detail-name quran-text">
                            {lang === 'ar' ? selectedReciter.nameAr : selectedReciter.nameEn}
                        </h1>
                        <div className="reciter-detail-meta">
                            <span className="reciter-detail-flag">{flag}</span>
                            <span className="reciter-detail-style-badge">
                                {selectedReciter.style}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card reciter-surah-card">
                    <div className="reciter-surah-header">
                        <h2>{lang === 'ar' ? 'اختر سورة للاستماع' : 'Choose a surah to listen'}</h2>
                        <p>
                            {lang === 'ar'
                                ? 'اضغط على رقم السورة لبدء الاستماع بصوت القارئ المختار.'
                                : 'Tap a surah number to start listening with the selected reciter.'}
                        </p>
                    </div>
                    <div className="reciter-surah-grid">
                        {SURAHS.filter(surah => !selectedReciter.availableSurahs || selectedReciter.availableSurahs.includes(surah.number)).map((surah) => {
                            const isCurrentPlaying =
                                isPlaying &&
                                currentSurah?.number === surah.number &&
                                currentReciter?.id === selectedReciter.id;

                            return (
                                <button
                                    key={surah.number}
                                    type="button"
                                    onClick={() => handleSurahPlay(surah.number)}
                                    className={`reciter-surah-btn ${isCurrentPlaying ? 'playing' : ''}`}
                                    title={surah.number.toString()}
                                >
                                    <div className="reciter-surah-main">
                                        <span className="reciter-surah-name">{surah.nameAr}</span>
                                    </div>
                                    <span className="reciter-surah-icon">
                                        {isCurrentPlaying ? (
                                            <Headphones size={18} />
                                        ) : (
                                            <Play size={18} />
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container reciters-page animate-slide-down">
            <div className="reciters-hero card card-glass">
                <div className="reciters-hero-icon">
                    <Mic2 size={32} />
                </div>
                <div className="reciters-hero-text">
                    <h1 className="reciters-hero-title">
                        {lang === 'ar' ? 'القرّاء' : 'Reciters'}
                    </h1>
                    <p className="reciters-hero-sub">
                        {lang === 'ar'
                            ? 'تصفّح قائمة القرّاء المصريين والسعوديين واختَر صوتك المفضّل للاستماع إلى كتاب الله.'
                            : 'Browse Egyptian and Saudi reciters and pick your favourite voice to listen to the Qur’an.'}
                    </p>
                    <div className="reciters-hero-tags">
                        <span className="badge badge-primary">🇪🇬 {lang === 'ar' ? 'المدارس المصرية' : 'Egyptian school'}</span>
                        <span className="badge badge-primary">🇸🇦 {lang === 'ar' ? 'قراء الحرمين' : 'Haramain reciters'}</span>
                    </div>
                </div>
            </div>

            <section className="reciters-section">
                <div className="reciters-section-header">
                    <h2 className="reciters-section-title">
                        {lang === 'ar' ? 'المدارس المصرية' : 'Egyptian Reciters'}
                    </h2>
                    <span className="reciters-section-pill">🇪🇬</span>
                </div>
                <div className="reciters-grid">
                    {egyptianReciters.map((reciter) => (
                        <button
                            key={reciter.id}
                            type="button"
                            className="reciter-card"
                            onClick={() => handleReciterSelect(reciter)}
                        >
                            <div className="reciter-avatar-wrapper">
                                <img
                                    src={reciter.image || '/images/minshawi.jpg'}
                                    alt={reciter.nameEn}
                                    className="reciter-avatar"
                                    onError={(e) => {
                                        e.target.src = '/images/minshawi.jpg';
                                    }}
                                />
                            </div>
                            <div className="reciter-info">
                                <div className="reciter-names">
                                    <span className="reciter-name-ar">
                                        {reciter.nameAr}
                                    </span>
                                    <span className="reciter-name-en">
                                        {reciter.nameEn}
                                    </span>
                                </div>
                                <div className="reciter-meta">
                                    <span className="reciter-style-badge">
                                        {reciter.style}
                                    </span>
                                    <span className="reciter-category">
                                        {lang === 'ar' ? 'مصري' : 'Egyptian'}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <section className="reciters-section">
                <div className="reciters-section-header">
                    <h2 className="reciters-section-title">
                        {lang === 'ar' ? 'قراء الحرمين والخليج' : 'Saudi & Gulf Reciters'}
                    </h2>
                    <span className="reciters-section-pill">🇸🇦</span>
                </div>
                <div className="reciters-grid">
                    {saudiReciters.map((reciter) => (
                        <button
                            key={reciter.id}
                            type="button"
                            className="reciter-card"
                            onClick={() => handleReciterSelect(reciter)}
                        >
                            <div className="reciter-avatar-wrapper">
                                <img
                                    src={reciter.image || '/images/minshawi.jpg'}
                                    alt={reciter.nameEn}
                                    className="reciter-avatar"
                                    onError={(e) => {
                                        e.target.src = '/images/minshawi.jpg';
                                    }}
                                />
                            </div>
                            <div className="reciter-info">
                                <div className="reciter-names">
                                    <span className="reciter-name-ar">
                                        {reciter.nameAr}
                                    </span>
                                    <span className="reciter-name-en">
                                        {reciter.nameEn}
                                    </span>
                                </div>
                                <div className="reciter-meta">
                                    <span className="reciter-style-badge">
                                        {reciter.style}
                                    </span>
                                    <span className="reciter-category">
                                        {lang === 'ar' ? 'سعودي / خليجي' : 'Saudi / Gulf'}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Reciters;
