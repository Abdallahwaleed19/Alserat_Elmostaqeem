import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Bookmark, X, Info, BookOpen, Heart, Image as ImageIcon, Type, CheckCircle } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useLanguage } from '../../context/LanguageContext';

const TAFSIR_SOURCES = [
    { id: 'ar.muyassar', name: 'التفسير الميسر', lang: 'ar' },
    { id: 'ar.jalalayn', name: 'تفسير الجلالين', lang: 'ar' },
    { id: 'en.asad', name: 'Translation (Asad)', lang: 'en' },
    { id: 'en.sahih', name: 'Translation (Sahih Int.)', lang: 'en' }
];

const JUZ_START_PAGES = [
    1, 22, 42, 62, 82, 102, 122, 142, 162, 182, 202, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582
];

const getCurrentJuz = (pageNum) => {
    for (let i = JUZ_START_PAGES.length - 1; i >= 0; i--) {
        if (pageNum >= JUZ_START_PAGES[i]) {
            return i + 1;
        }
    }
    return 1;
};

// تقريب رقم الحزب لكل صفحة (60 حزبًا على 604 صفحات)
const getApproxHizb = (pageNum) => {
    const TOTAL_HIZB = 60;
    const approx = Math.floor((pageNum - 1) / (604 / TOTAL_HIZB)) + 1;
    return Math.min(TOTAL_HIZB, Math.max(1, approx));
};

const QuranReader = ({ startPage = 1, surahNumber = null, onClose, onComplete, khatmaJuz = null }) => {
    const { lang, t } = useLanguage();
    const [page, setPage] = useState(startPage);
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [readMode] = useState('image'); // Hardcoded to image mode
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    // دعم السحب (Swipe) لتقليب الصفحات
    const [touchStartX, setTouchStartX] = useState(null);

    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (!touchStartX) return;

        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (diff > 50) {
            setPage((p) => Math.min(604, p + 1));
        } else if (diff < -50) {
            setPage((p) => Math.max(1, p - 1));
        }

        setTouchStartX(null);
    };

    const toggleFavoriteAyah = (ayah) => {
        let saved = JSON.parse(localStorage.getItem('zad_ayah_favs') || '[]');
        const exists = saved.find(a => a.number === ayah.number);
        if (exists) {
            saved = saved.filter(a => a.number !== ayah.number);
        } else {
            saved.push({
                number: ayah.number,
                text: ayah.text,
                surah: ayah.surah,
                numberInSurah: ayah.numberInSurah,
                page: ayah.page
            });
        }
        localStorage.setItem('zad_ayah_favs', JSON.stringify(saved));
        setFavoriteAyahs(saved);
    };

    const isAyahFavorite = (ayahNum) => {
        return favoriteAyahs.some(a => a.number === ayahNum);
    };

    // Resolve starting page if surahNumber is provided instead of startPage
    useEffect(() => {
        if (surahNumber) {
            setLoading(true);
            fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`)
                .then(res => res.json())
                .then(data => {
                    const firstPage = data.data.ayahs[0].page;
                    setPage(firstPage);
                })
                .catch(err => console.error(err));
        }
    }, [surahNumber]);

    // Fetch Page Data (for progress and bookmarks)
    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            try {
                // Check Bookmark & Favorite
                const savedBookmarks = JSON.parse(localStorage.getItem('zad_bookmarks') || '[]');
                const savedFavs = JSON.parse(localStorage.getItem('zad_page_favs') || '[]');
                setIsBookmarked(savedBookmarks.includes(page));
                setIsFavorited(savedFavs.includes(page));

                // Update Progress (for Home Card)
                localStorage.setItem('zad_last_read_page', page.toString());
                
            } catch (err) {
                console.error('Error fetching page', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [page, lang]);

    const toggleBookmark = () => {
        let saved = JSON.parse(localStorage.getItem('zad_bookmarks') || '[]');
        if (isBookmarked) {
            saved = saved.filter(p => p !== page);
            setIsBookmarked(false);
        } else {
            saved.push(page);
            setIsBookmarked(true);
        }
        localStorage.setItem('zad_bookmarks', JSON.stringify(saved));
    };

    const toggleFavorite = () => {
        let saved = JSON.parse(localStorage.getItem('zad_page_favs') || '[]');
        if (isFavorited) {
            saved = saved.filter(p => p !== page);
            setIsFavorited(false);
        } else {
            saved.push(page);
            setIsFavorited(true);
        }
        localStorage.setItem('zad_page_favs', JSON.stringify(saved));
    };

    const getImageUrl = (pageNum) => {
        return `https://quran.islam-db.com/public/data/pages/quranpages_1024/images/page${pageNum.toString().padStart(3, '0')}.png`;
    };

    const convertToArabicNumber = (n) => {
        return n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    };

    const currentJuz = getCurrentJuz(page);
    const currentHizb = getApproxHizb(page);

    // Khatma completion logic: determine the end page of the assigned part
    const khatmaTargetEndPage = khatmaJuz ? (JUZ_START_PAGES[khatmaJuz] ? JUZ_START_PAGES[khatmaJuz] - 1 : 604) : null;
    const isEndOfJuz = khatmaJuz ? (page >= khatmaTargetEndPage) : false;

    return (
        <div className="quran-reader-container animate-fade-in" style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text)'
        }}>
            {/* Toolbar */}
            <div className="reader-toolbar flex justify-between items-center card" style={{ padding: '0.8rem 1.5rem', marginBottom: '1rem', zIndex: 50, borderRadius: '0 0 20px 20px' }}>
                <div className="flex gap-4 items-center">
                    <button onClick={onClose} className="btn-icon" title={lang === 'ar' ? 'إغلاق' : 'Close'}>
                        <X size={20} />
                    </button>
                    <div className="flex gap-2">
                        <span className="reader-badge">
                            {lang === 'ar' ? `الجزء ${convertToArabicNumber(currentJuz)}` : `Juz ${currentJuz}`}
                        </span>
                        <span className="reader-badge">
                            {lang === 'ar' ? `الحزب ${convertToArabicNumber(currentHizb)}` : `Hizb ${currentHizb}`}
                        </span>
                        <span className="reader-badge">
                            {lang === 'ar' ? `صفحة ${convertToArabicNumber(page)}` : `Page ${page}`}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 toolbar-actions">
                    {onComplete && (
                        <button
                            onClick={() => {
                                if (isEndOfJuz) setShowCompletionModal(true);
                            }}
                            className={`btn flex items-center gap-1 ${isEndOfJuz ? 'btn-primary' : ''}`}
                            style={{ 
                                padding: '0.4rem 0.8rem', 
                                borderRadius: 'var(--radius-full)', 
                                fontSize: '0.86rem', 
                                background: isEndOfJuz ? 'var(--gold-main, #D4AF37)' : 'transparent',
                                border: `1px solid ${isEndOfJuz ? 'var(--gold-main, #D4AF37)' : 'var(--color-border)'}`,
                                color: isEndOfJuz ? '#1a1a1a' : 'var(--color-text-muted)',
                                fontWeight: 'bold',
                                cursor: isEndOfJuz ? 'pointer' : 'not-allowed',
                                opacity: isEndOfJuz ? 1 : 0.5
                            }}
                            disabled={!isEndOfJuz}
                        >
                            <CheckCircle size={16} />
                            <span className="hidden-mobile">{lang === 'ar' ? 'تم الانتهاء' : 'Done'}</span>
                        </button>
                    )}
                    <button
                        onClick={toggleFavorite}
                        className={`btn-icon ${isFavorited ? 'active' : ''}`}
                        title={lang === 'ar' ? 'تفضيل الصفحة' : 'Favorite Page'}
                        style={{ color: isFavorited ? 'var(--color-error, #ef4444)' : 'inherit' }}
                    >
                        <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        onClick={toggleBookmark}
                        className={`btn-icon ${isBookmarked ? 'active' : ''}`}
                        title={lang === 'ar' ? 'حفظ الصفحة' : 'Bookmark Page'}
                        style={{ color: isBookmarked ? 'var(--gold-main, #D4AF37)' : 'inherit' }}
                    >
                        <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative p-2 sm:p-8" style={{ paddingBottom: '8rem' }}>
                {/* Floating Side Arrows */}
                <button
                    className="floating-nav-btn right"
                    onClick={() => setPage((p) => Math.min(604, p + 1))}
                    disabled={page === 604}
                    aria-label="Next Page"
                >
                    <ChevronRight size={32} />
                </button>
                <button
                    className="floating-nav-btn left"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Previous Page"
                >
                    <ChevronLeft size={32} />
                </button>

                {/* Mushaf Image Wrapper */}
                <div
                    className="mushaf-image-frame animate-scale-in"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Decorative Border Internal */}
                    <div className="mushaf-ornamental-corners" />
                    
                    <div className="mushaf-img-inner">
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                                <div className="spinner"></div>
                            </div>
                        )}
                        <Zoom>
                            <img
                                src={getImageUrl(page)}
                                alt={`Quran Page ${page}`}
                                className="mushaf-main-img"
                                onLoad={() => setLoading(false)}
                            />
                        </Zoom>
                    </div>
                </div>
            </div>

            {/* Completion Modal */}
            {showCompletionModal && (
                <div className="modal-overlay" style={{ zIndex: 100 }}>
                    <div className="modal-content animate-scale-in text-center" style={{ maxWidth: '400px', padding: '2rem' }}>
                        <div style={{ color: 'var(--gold-main)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                            <CheckCircle size={64} />
                        </div>
                        <h2 className="quran-text" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                            {lang === 'ar' ? 'تم قراءة الجزء بنجاح' : 'Juz Read Successfully'}
                        </h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
                            {lang === 'ar' ? 'تقبل الله منا ومنكم صالح الأعمال. أسأل الله أن يجعله شفيعاً لك يوم القيامة، وأن ينور دربك بالقرآن.' : 'May Allah accept from us and you. May He make it an intercessor for you on the Day of Judgment.'}
                        </p>
                        <button 
                            className="btn btn-primary w-full"
                            style={{ background: 'var(--gold-main)', color: '#1a1a1a', fontWeight: 'bold', padding: '0.8rem' }}
                            onClick={() => {
                                setShowCompletionModal(false);
                                onComplete();
                                onClose();
                            }}
                        >
                            {lang === 'ar' ? 'تقبل الله' : 'Ameen'}
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .reader-badge {
                    background: rgba(212, 175, 55, 0.1);
                    color: var(--gold-main, #D4AF37);
                    padding: 0.25rem 0.75rem;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    border: 1px solid rgba(212, 175, 55, 0.2);
                }

                .btn-icon {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    border: 1px solid var(--color-border);
                    background: transparent;
                    color: var(--color-text-muted);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-icon:hover { border-color: var(--gold-main); color: var(--gold-main); }
                .btn-icon.active { border-color: var(--gold-main); color: var(--gold-main); background: rgba(212, 175, 55, 0.05); }

                .floating-nav-btn {
                    position: fixed;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 56px;
                    height: 56px;
                    background: rgba(212, 175, 55, 0.9);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 100;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .floating-nav-btn:hover:not(:disabled) { background: #c9a227; transform: translateY(-50%) scale(1.1); box-shadow: 0 12px 30px rgba(0,0,0,0.3); }
                .floating-nav-btn:disabled { opacity: 0.2; cursor: not-allowed; }
                .floating-nav-btn.right { right: 2rem; }
                .floating-nav-btn.left { left: 2rem; }

                .mushaf-image-frame {
                    max-width: 850px;
                    width: 100%;
                    margin: 0 auto;
                    background: white;
                    position: relative;
                    padding: 16px;
                    border: 10px solid #e8dfc4;
                    border-radius: 12px;
                    box-shadow: 0 15px 45px rgba(0,0,0,0.2);
                    background-image: url("https://www.transparenttextures.com/patterns/paper.png");
                }

                .mushaf-ornamental-corners {
                    position: absolute;
                    inset: -5px;
                    border: 2px solid #d4af37;
                    border-radius: 8px;
                    pointer-events: none;
                    opacity: 0.6;
                }

                .mushaf-main-img {
                    width: 100%;
                    height: auto;
                    display: block;
                    mix-blend-mode: multiply;
                }

                @media (max-width: 1100px) {
                    .floating-nav-btn { width: 44px; height: 44px; }
                    .floating-nav-btn.right { right: 0.8rem; }
                    .floating-nav-btn.left { left: 0.8rem; }
                }

                @media (max-width: 768px) {
                    .hidden-mobile { display: none !important; }
                    .reader-toolbar {
                        padding: 0.6rem 0.5rem !important;
                    }
                    .reader-toolbar > div {
                        gap: 0.4rem !important;
                    }
                    .reader-badge {
                        padding: 0.15rem 0.35rem;
                        font-size: 0.7rem;
                        border-radius: 6px;
                    }
                    .btn-icon {
                        width: 34px;
                        height: 34px;
                    }
                    .btn-icon svg { width: 18px; height: 18px; }
                    .toolbar-actions .btn {
                        padding: 0.3rem 0.6rem !important;
                        font-size: 0.75rem !important;
                    }
                    
                    .floating-nav-btn { 
                        display: flex; 
                        width: 40px; 
                        height: 40px;
                        background: rgba(212, 175, 55, 0.7); /* More transparent on mobile */
                    }
                    .floating-nav-btn svg { width: 20px; height: 20px; }
                    .floating-nav-btn.right { right: 0.5rem; }
                    .floating-nav-btn.left { left: 0.5rem; }

                    .mushaf-image-frame { 
                        padding: 4px; 
                        border-width: 4px; 
                        max-width: 100vw;
                        border-radius: 6px;
                    }
                    .mushaf-ornamental-corners {
                        inset: -2px;
                        border-width: 1px;
                    }
                }
            `}</style>
        </div>
    );
};

export default QuranReader;
