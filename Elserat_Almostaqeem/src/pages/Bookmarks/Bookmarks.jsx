import React, { useState, useEffect } from 'react';
import { Bookmark, BookOpen, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import QuranReader from '../../components/quran/QuranReader';
import './Bookmarks.css';

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

const Bookmarks = () => {
    const { lang } = useLanguage();
    const [savedPages, setSavedPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState(null);

    useEffect(() => {
        const loadBookmarks = () => {
            const saved = JSON.parse(localStorage.getItem('zad_bookmarks') || '[]');
            // Sort pages numerically
            saved.sort((a, b) => a - b);
            setSavedPages(saved);
        };
        loadBookmarks();
    }, [selectedPage]); // Re-load when reader closes to catch changes

    const removeBookmark = (e, pageNum) => {
        e.stopPropagation();
        const updated = savedPages.filter(p => p !== pageNum);
        localStorage.setItem('zad_bookmarks', JSON.stringify(updated));
        setSavedPages(updated);
    };

    if (selectedPage !== null) {
        return (
            <div className="container" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
                <QuranReader
                    startPage={selectedPage}
                    onClose={() => setSelectedPage(null)}
                />
            </div>
        );
    }

    return (
        <div className="bookmarks-page animate-slide-down container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
            <div className="text-center mb-8">
                <Bookmark size={48} className="mx-auto mb-4" style={{ color: 'var(--color-accent)' }} />
                <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-arabic-title)', color: 'var(--color-primary)' }}>
                    {lang === 'ar' ? 'المحفوظات' : 'Saved Pages'}
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>
                    {lang === 'ar' ? 'الصفحات التي حفظت علامتها من المصحف الشريف' : 'Quran pages you have bookmarked for quick access'}
                </p>
            </div>

            {savedPages.length === 0 ? (
                <div className="card text-center" style={{ padding: '4rem 2rem', border: '2px dashed var(--color-border)' }}>
                    <BookOpen size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
                        {lang === 'ar' ? 'لا توجد صفحات محفوظة' : 'No bookmarked pages'}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        {lang === 'ar'
                            ? 'أثناء قراءة القرآن، اضغط على أيقونة (حفظ العلامة) لتجد الصفحة هنا'
                            : 'While reading the Quran, click the Bookmark icon to save pages here.'}
                    </p>
                </div>
            ) : (
                <div className="bookmarks-grid">
                    {savedPages.map((pageNum) => {
                        const juzNum = getCurrentJuz(pageNum);
                        return (
                            <div
                                key={pageNum}
                                className="bookmark-card card"
                                onClick={() => setSelectedPage(pageNum)}
                            >
                                <div className="bookmark-card-icon">
                                    <Bookmark size={24} fill="currentColor" />
                                </div>
                                <div className="bookmark-card-info">
                                    <h3>{lang === 'ar' ? `الصفحة ${pageNum}` : `Page ${pageNum}`}</h3>
                                    <p>{lang === 'ar' ? `الجزء ${juzNum}` : `Juz ${juzNum}`}</p>
                                </div>
                                <button
                                    className="bookmark-delete-btn"
                                    onClick={(e) => removeBookmark(e, pageNum)}
                                    title={lang === 'ar' ? 'حذف العلامة' : 'Remove Bookmark'}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Bookmarks;
