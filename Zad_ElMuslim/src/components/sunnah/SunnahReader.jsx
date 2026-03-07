import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, ArrowLeft, Heart, Share2, Copy, Check, Search, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Map our collection IDs to hadith-api editions (Arabic text)
const EDITION_MAP = {
    bukhari: 'ara-bukhari',
    // For Sahih Muslim, use the diacritics-stripped edition for better consistency
    muslim: 'ara-muslim1',
    tirmidzi: 'ara-tirmidhi',
    abudaud: 'ara-abudawud',
};

const SunnahReader = ({ collectionId, collectionName, sourceUrl, shamelaUrl, onClose }) => {
    const { lang } = useLanguage();
    const [allHadiths, setAllHadiths] = useState([]);
    const [hadiths, setHadiths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [copiedId, setCopiedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const limit = 20;

    // Load Favorites
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('zad_hadith_favs') || '[]');
        setFavorites(saved);
    }, []);

    // Fetch all hadiths for the selected collection from hadith-api (cdn)
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError(null);
            setAllHadiths([]);
            setHadiths([]);
            setPage(1);
            try {
                const edition = EDITION_MAP[collectionId];
                if (!edition) {
                    throw new Error('Unsupported collection');
                }
                const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${edition}.min.json`;
                const res = await fetch(url);
                if (!res.ok) throw new Error('API Error');
                const data = await res.json();
                const list = data.hadiths || data.data?.hadiths || [];
                setAllHadiths(list);
                setHadiths(list.slice(0, limit));
            } catch (err) {
                console.error(err);
                setError(lang === 'ar' ? 'حدث خطأ في جلب الأحاديث' : 'Error fetching hadiths');
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [collectionId, lang]);

    // Helper to get Arabic text from different API structures (Bukhari, Muslim, etc.)
    const getArabicText = (h) => {
        if (!h) return '';
        const raw = h.arab ?? h.arabic ?? (typeof h.text === 'string' ? h.text : null) ?? h.text?.arabic ?? h.text?.ar ?? h.text?.arab ?? '';
        return typeof raw === 'string' ? raw : '';
    };

    // قائمة الأحاديث ذات النص فقط (تجنب صفحات فارغة وأحاديث غير ظاهرة)
    const validHadiths = useMemo(() => {
        return allHadiths.filter((h) => getArabicText(h).trim() !== '');
    }, [allHadiths]);

    // المصدر للعرض والترقيم: إما كل الصالحة أو نتائج البحث منها
    const sourceList = useMemo(() => {
        if (!searchQuery.trim()) return validHadiths;
        const q = searchQuery.trim();
        return validHadiths.filter((h) => {
            const text = getArabicText(h);
            const num = (h.number || h.hadithnumber || '').toString();
            return text.includes(q) || num.includes(q);
        });
    }, [validHadiths, searchQuery]);

    // Reset to page 1 when search query changes
    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    // Update current page slice when page or sourceList changes
    useEffect(() => {
        if (!sourceList.length) {
            setHadiths([]);
            return;
        }
        const start = (page - 1) * limit;
        const end = start + limit;
        setHadiths(sourceList.slice(start, end));
    }, [page, sourceList]);

    const toggleFavorite = (hadith) => {
        let saved = [...favorites];
        const exists = saved.find(h => h.number === hadith.number && h.collection === collectionId);
        if (exists) {
            saved = saved.filter(h => !(h.number === hadith.number && h.collection === collectionId));
        } else {
            saved.push({ ...hadith, collection: collectionId, colName: collectionName });
        }
        setFavorites(saved);
        localStorage.setItem('zad_hadith_favs', JSON.stringify(saved));
    };

    const isFavorite = (number) => favorites.some(h => h.number === number && h.collection === collectionId);

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const shareHadith = (text) => {
        if (navigator.share) {
            navigator.share({
                title: 'Hadith',
                text: `${text}\n\n- ${collectionName} | As-Sirat Al-Mustaqeem`
            }).catch(console.error);
        } else {
            copyToClipboard(text, 'share');
        }
    };

    const displayedHadiths = hadiths;
    const totalPages = Math.max(1, Math.ceil(sourceList.length / limit));

    return (
        <div className="sunnah-reader animate-slide-down">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="btn btn-outline flex items-center p-2 rounded-full z-10 hover:bg-primary hover:text-white transition">
                        {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                    </button>
                    <div>
                        <h2 style={{ margin: 0 }} className="text-xl sm:text-2xl font-bold">{collectionName}</h2>
                        <span className="text-sm text-primary">
                            {lang === 'ar' ? 'جميع الأحاديث — تصفح بالرقم أو البحث' : 'All hadiths — browse by number or search'}
                            {!loading && sourceList.length > 0 && (
                                <span style={{ marginInlineStart: '0.35rem', color: 'var(--color-text-muted)' }}>
                                    ({sourceList.length} {lang === 'ar' ? 'حديث' : 'hadiths'})
                                </span>
                            )}
                        </span>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {shamelaUrl && (
                                <a
                                    href={shamelaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium transition hover:underline"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    <ExternalLink size={14} />
                                    {lang === 'ar' ? 'المكتبة الشاملة (شاملة)' : 'Shamela Library'}
                                </a>
                            )}
                            {sourceUrl && (
                                <a
                                    href={sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium transition hover:underline"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    <ExternalLink size={14} />
                                    {lang === 'ar' ? 'حديث الرسول' : 'Hadith Prophet'}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder={lang === 'ar' ? "ابحث في جميع الأحاديث..." : "Search all hadiths..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control pl-10 pr-4 py-2 w-full rounded-full border border-border bg-surface-hover focus:border-primary transition"
                        style={{ paddingInlineStart: '2.5rem' }}
                    />
                    <Search size={18} className="absolute top-1/2 -translate-y-1/2 text-muted" style={{ [lang === 'ar' ? 'right' : 'left']: '1rem' }} />
                </div>
            </div>

            {error ? (
                <div className="card text-center text-error p-6 border border-error/20 bg-error/5">{error}</div>
            ) : loading ? (
                <div className="text-center p-12">
                    <div className="animate-glow mx-auto mb-4" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                    <p className="text-muted font-medium">{lang === 'ar' ? 'جاري تحميل الأحاديث...' : 'Loading Hadiths...'}</p>
                </div>
            ) : (
                <>
                    {displayedHadiths.length === 0 && (searchQuery || sourceList.length === 0) ? (
                        <div className="text-center p-12 text-muted bg-surface-hover rounded-xl border border-border">
                            {searchQuery
                                ? (lang === 'ar' ? 'لا توجد نتائج مطابقة للبحث في جميع الأحاديث.' : 'No matching results in all hadiths.')
                                : (lang === 'ar' ? 'لا توجد أحاديث.' : 'No hadiths.')}
                        </div>
                    ) : (
                        <div className="hadiths-list flex flex-col gap-6">
                            {displayedHadiths.map((h, idx) => {
                                const start = (page - 1) * limit;
                                const displayNum = collectionId === 'muslim' ? start + idx + 1 : (h.number || h.hadithnumber);
                                const hadithId = collectionId === 'muslim' ? displayNum : (h.number || h.hadithnumber);
                                return (
                                    <div key={collectionId === 'muslim' ? `muslim-${displayNum}` : h.number} className="card p-6 border border-border hover:border-primary/30 transition-colors" style={{ backgroundColor: 'var(--color-surface)' }}>
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="badge font-bold" style={{ backgroundColor: 'var(--color-primary-10)', color: 'var(--color-primary)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                                                {lang === 'ar' ? `حديث رقم ${displayNum}` : `Hadith ${displayNum}`}
                                            </span>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => copyToClipboard(getArabicText(h), hadithId)}
                                                    className="icon-btn hover:bg-surface-hover p-2 rounded-full transition" title={lang === 'ar' ? "نسخ" : "Copy"}
                                                    style={{ color: copiedId === hadithId ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                                                >
                                                    {copiedId === hadithId ? <Check size={18} /> : <Copy size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => shareHadith(getArabicText(h))}
                                                    className="icon-btn hover:bg-surface-hover p-2 rounded-full transition" title={lang === 'ar' ? "مشاركة" : "Share"}
                                                >
                                                    <Share2 size={18} className="text-muted hover:text-primary transition" />
                                                </button>
                                                <button
                                                    onClick={() => toggleFavorite({ ...h, number: hadithId, arab: getArabicText(h) })}
                                                    className="icon-btn hover:bg-surface-hover p-2 rounded-full transition" title={lang === 'ar' ? "مفضلة" : "Favorite"}
                                                >
                                                    <Heart size={18}
                                                        fill={isFavorite(hadithId) ? 'var(--color-error)' : 'none'}
                                                        className={isFavorite(hadithId) ? 'text-error animate-pop' : 'text-muted hover:text-error transition'}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="quran-text" style={{ fontSize: '1.5rem', lineHeight: '2.4', textAlign: 'justify', direction: 'rtl', margin: 0, color: 'var(--color-foreground)' }}>
                                            {getArabicText(h)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {allHadiths.length > 0 && (
                        <div className="flex justify-between items-center mt-10 p-4 card border border-border" style={{ backgroundColor: 'var(--color-surface-hover)' }}>
                            <button
                                className="btn btn-outline"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                {lang === 'ar' ? 'الصفحة السابقة' : 'Previous Page'}
                            </button>

                            <div className="flex gap-2 font-bold px-4 py-2 bg-surface rounded-md border border-border">
                                <span>{lang === 'ar' ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}</span>
                                {searchQuery && (
                                    <span style={{ color: 'var(--color-text-muted)', fontWeight: 'normal' }}>
                                        ({sourceList.length} {lang === 'ar' ? 'نتيجة' : 'results'})
                                    </span>
                                )}
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page >= totalPages}
                            >
                                {lang === 'ar' ? 'الصفحة التالية' : 'Next Page'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SunnahReader;
