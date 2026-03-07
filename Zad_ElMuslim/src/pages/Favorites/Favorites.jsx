import React, { useState, useEffect, useRef } from 'react';
import { Heart, BookOpen, X, Play, Share2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import { useTheme } from '../../context/ThemeContext';
import html2canvas from 'html2canvas';
import './Favorites.css';
import QuranReader from '../../components/quran/QuranReader';

const Favorites = () => {
    const { lang, t } = useLanguage();
    const { theme, colorMode } = useTheme();
    const { playSurah } = useAudio();
    const [activeTab, setActiveTab] = useState('ayahs'); // 'ayahs', 'hadiths'
    const [favAyahs, setFavAyahs] = useState([]);
    const [favHadiths, setFavHadiths] = useState([]);
    const [readerConfig, setReaderConfig] = useState(null);
    const [shareItem, setShareItem] = useState(null); // { type: 'ayah' | 'hadith', data: obj }
    const shareCardRef = useRef(null);

    useEffect(() => {
        setFavAyahs(JSON.parse(localStorage.getItem('zad_ayah_favs') || '[]'));
        setFavHadiths(JSON.parse(localStorage.getItem('zad_hadith_favs') || '[]'));
    }, []);

    const removeAyah = (e, number) => {
        e.stopPropagation();
        const updated = favAyahs.filter(a => a.number !== number);
        setFavAyahs(updated);
        localStorage.setItem('zad_ayah_favs', JSON.stringify(updated));
    };

    const removeHadith = (e, number, collection) => {
        e.stopPropagation();
        const updated = favHadiths.filter(h => !(h.number === number && h.collection === collection));
        setFavHadiths(updated);
        localStorage.setItem('zad_hadith_favs', JSON.stringify(updated));
    };

    const convertToArabicNumber = (n) => {
        if (!n) return '';
        return n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    };

    const handleShare = async (item, type) => {
        setShareItem({ type, data: item });
        // Give React a tick to render the hidden share card
        setTimeout(async () => {
            if (shareCardRef.current) {
                try {
                    const canvas = await html2canvas(shareCardRef.current, {
                        scale: 3, // High quality
                        useCORS: true,
                        backgroundColor: null
                    });

                    const imgData = canvas.toDataURL('image/png');
                    const blob = await (await fetch(imgData)).blob();
                    const file = new File([blob], 'zad-almuslim-share.png', { type: 'image/png' });

                    if (navigator.share) {
                        await navigator.share({
                            files: [file],
                            title: lang === 'ar' ? 'مشاركة من زاد المسلم' : 'Share from Zad Al-Muslim',
                            text: lang === 'ar' ? 'تطبيق زاد المسلم' : 'Zad Al-Muslim App'
                        });
                    } else {
                        // Fallback: download
                        const link = document.createElement('a');
                        link.href = imgData;
                        link.download = 'zad-almuslim-share.png';
                        link.click();
                    }
                } catch (err) {
                    console.error('Error generating image', err);
                    alert(lang === 'ar' ? 'عذراً، حدث خطأ أثناء إنشاء الصورة للمشاركة.' : 'Sorry, an error occurred while generating the image for sharing.');
                }
                setShareItem(null); // Clean up
            }
        }, 100);
    };

    return (
        <div className="favorites-page page-transition">
            {readerConfig && (
                <div className="fullscreen-overlay z-50">
                    <div className="fullscreen-content container animate-scale-in">
                        <QuranReader
                            startPage={readerConfig.type === 'page' ? readerConfig.value : 1}
                            surahNumber={readerConfig.type === 'surah' ? readerConfig.value : null}
                            onClose={() => setReaderConfig(null)}
                        />
                    </div>
                </div>
            )}

            <section className="section py-8">
                <div className="container">
                    <div className="section-header text-center mb-8">
                        <Heart className="section-icon mx-auto text-primary mb-4" size={48} />
                        <h1 className="title-lg">{lang === 'ar' ? 'المفضلة' : 'Favorites'}</h1>
                        <p className="subtitle mx-auto">
                            {lang === 'ar'
                                ? 'احتفظ بالسور والآيات والأحاديث الأقرب لقلبك للرجوع إليها في أي وقت.'
                                : 'Keep the Surahs, Ayahs, and Hadiths closest to your heart to return to at any time.'}
                        </p>
                    </div>

                    <div className="tabs-container mb-8">
                        <div className="flex justify-center gap-4 flex-wrap">
                            <button
                                className={`btn ${activeTab === 'ayahs' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveTab('ayahs')}
                            >
                                {lang === 'ar' ? 'الآيات المفضلة' : 'Favorite Ayahs'} ({favAyahs.length})
                            </button>
                            <button
                                className={`btn ${activeTab === 'hadiths' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setActiveTab('hadiths')}
                            >
                                {lang === 'ar' ? 'الأحاديث المفضلة' : 'Favorite Hadiths'} ({favHadiths.length})
                            </button>
                        </div>
                    </div>

                    {/* Surahs tab removed entirely */}

                    {/* Ayahs Tab */}
                    {activeTab === 'ayahs' && (
                        <div className="flex flex-col gap-4">
                            {favAyahs.length === 0 ? (
                                <div className="text-center text-muted py-8">
                                    {lang === 'ar' ? 'لا يوجد آيات في المفضلة بعد.' : 'No favorited Ayahs yet.'}
                                </div>
                            ) : (
                                favAyahs.map((ayah) => (
                                    <div key={ayah.number} className="card p-6 flex flex-col gap-4 relative shadow-sm border border-border/50">
                                        <button
                                            className="absolute top-4 left-4 text-muted hover:text-error transition"
                                            onClick={(e) => removeAyah(e, ayah.number)}
                                            title={lang === 'ar' ? 'إزالة' : 'Remove'}
                                        >
                                            <X size={20} />
                                        </button>
                                        <button
                                            className="absolute top-4 left-12 text-muted hover:text-primary transition"
                                            onClick={() => handleShare(ayah, 'ayah')}
                                            title={lang === 'ar' ? 'مشاركة' : 'Share'}
                                        >
                                            <Share2 size={20} />
                                        </button>
                                        <div className="text-primary font-bold mb-2">
                                            سورة {ayah.surah.name.replace('سُورَةُ ', '')} -
                                            {lang === 'ar' ? ' صفحة ' : ' Page '}{ayah.page}
                                        </div>
                                        <div className="quran-text text-xl sm:text-2xl leading-loose text-center py-4 px-8 border-y border-border/30">
                                            {ayah.text}
                                            <span className="ayah-end-badge mx-2 inline-flex items-center justify-center">
                                                {convertToArabicNumber(ayah.numberInSurah)}
                                            </span>
                                        </div>
                                        <div className="flex justify-center mt-2">
                                            <button
                                                className="btn btn-outline text-sm"
                                                onClick={() => setReaderConfig({ type: 'page', value: ayah.page })}
                                            >
                                                <BookOpen size={16} className="ml-2" />
                                                {lang === 'ar' ? 'قراءة في المصحف' : 'Read in Mushaf'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Hadiths Tab */}
                    {activeTab === 'hadiths' && (
                        <div className="flex flex-col gap-4">
                            {favHadiths.length === 0 ? (
                                <div className="text-center text-muted py-8">
                                    {lang === 'ar' ? 'لا يوجد أحاديث في المفضلة بعد.' : 'No favorited Hadiths yet.'}
                                </div>
                            ) : (
                                favHadiths.map((hadith, idx) => (
                                    <div key={`${hadith.collection}-${hadith.number}-${idx}`} className="card p-6 hadith-card shadow-sm border border-border/50 relative">
                                        <button
                                            className="absolute top-4 left-4 text-muted hover:text-error transition"
                                            onClick={(e) => removeHadith(e, hadith.number, hadith.collection)}
                                            title={lang === 'ar' ? 'إزالة' : 'Remove'}
                                        >
                                            <X size={20} />
                                        </button>
                                        <button
                                            className="absolute top-4 left-12 text-muted hover:text-primary transition"
                                            onClick={() => handleShare(hadith, 'hadith')}
                                            title={lang === 'ar' ? 'مشاركة' : 'Share'}
                                        >
                                            <Share2 size={20} />
                                        </button>
                                        <div className="source-badge inline-block mb-4 text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                                            {hadith.colName || hadith.collection}
                                        </div>
                                        <div className="arabic-text text-xl leading-relaxed mb-4 font-traditional">
                                            {hadith.arab}
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-muted mt-4 pt-4 border-t border-border">
                                            <span>{lang === 'ar' ? `حديث رقم ${hadith.number}` : `Hadith ${hadith.number}`}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </section>
            {/* Hidden Share Card used purely for html2canvas generation */}
            {shareItem && (
                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', pointerEvents: 'none' }}>
                    <div
                        ref={shareCardRef}
                        className="share-card-export"
                        style={{
                            width: '800px',
                            background: theme === 'dark' ? '#1a1a1a' : theme === 'ramadan' ? '#fdfbf7' : '#ffffff',
                            color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                            padding: '60px',
                            borderRadius: '30px',
                            border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '30px',
                            fontFamily: 'traditional, Tahoma, Arial, sans-serif'
                        }}
                    >
                        {/* Header logo / branding */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`, paddingBottom: '20px', width: '100%', justifyContent: 'center' }}>
                            <div style={{ width: '40px', height: '40px', background: theme === 'dark' ? '#10b981' : theme === 'ramadan' ? '#d4af37' : '#0f5a47', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Heart size={20} color="white" />
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme === 'dark' ? '#10b981' : theme === 'ramadan' ? '#d4af37' : '#0f5a47' }}>الصراط المستقيم</span>
                        </div>

                        {/* Content */}
                        {shareItem.type === 'ayah' ? (
                            <>
                                <div style={{ color: theme === 'dark' ? '#10b981' : theme === 'ramadan' ? '#d4af37' : '#0f5a47', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    سورة {shareItem.data.surah.name.replace('سُورَةُ ', '')}
                                </div>
                                <div className="quran-text" style={{ fontSize: '2.5rem', lineHeight: '2.2', textAlign: 'center', color: theme === 'dark' ? '#f3f4f6' : '#1f2937' }}>
                                    {shareItem.data.text}
                                    <span className="ayah-end-badge" style={{ margin: '0 10px', transform: 'scale(1.3)', display: 'inline-flex', color: theme === 'dark' ? '#10b981' : theme === 'ramadan' ? '#d4af37' : '#0f5a47' }}>
                                        {convertToArabicNumber(shareItem.data.numberInSurah)}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ color: theme === 'dark' ? '#10b981' : theme === 'ramadan' ? '#d4af37' : '#0f5a47', fontSize: '1.2rem', fontWeight: 'bold', background: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : theme === 'ramadan' ? 'rgba(212, 175, 55, 0.1)' : 'rgba(15, 90, 71, 0.1)', padding: '5px 15px', borderRadius: '20px' }}>
                                    {shareItem.data.colName || shareItem.data.collection}
                                </div>
                                <div style={{ fontSize: '2.2rem', lineHeight: '2.0', textAlign: 'center', color: theme === 'dark' ? '#f3f4f6' : '#1f2937', maxWidth: '90%' }}>
                                    {shareItem.data.arab}
                                </div>
                            </>
                        )}

                        {/* Footer attribution */}
                        <div style={{ marginTop: '30px', opacity: 0.6, fontSize: '1rem', color: theme === 'dark' ? '#9ca3af' : '#4b5563' }}>
                            تمت المشاركة عبر تطبيق الصراط المستقيم
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Favorites;
