import React, { useState } from 'react';
import { Book, Star, FileText, BookOpen, Sparkles } from 'lucide-react';
import SunnahReader from '../../components/sunnah/SunnahReader';
import { useLanguage } from '../../context/LanguageContext';
import './Sunnah.css';

const collections = [
    {
        id: 'bukhari',
        name: 'صحيح البخاري',
        nameEn: 'Sahih Al-Bukhari',
        description: 'الجامع المسند الصحيح المختصر — جميع الأحاديث',
        descEn: 'The Authentic Collection — all hadiths',
        icon: BookOpen,
        color: '#1B4332',
        gradient: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
        sourceUrl: 'https://hadithprophet.com/hadith-book-3.html',
        shamelaUrl: 'https://shamela.ws/index.php/book/1681',
    },
    {
        id: 'muslim',
        name: 'صحيح مسلم',
        nameEn: 'Sahih Muslim',
        description: 'المسند الصحيح المختصر — جميع الأحاديث',
        descEn: 'The Authentic Collection — all hadiths',
        icon: Book,
        color: '#0F766E',
        gradient: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
        sourceUrl: 'https://hadithprophet.com/hadith-book-7.html',
        shamelaUrl: 'https://shamela.ws/index.php/book/1727',
    },
    { 
        id: 'tirmidzi', 
        name: 'سنن الترمذي', 
        nameEn: 'Jami\' At-Tirmidhi', 
        description: 'الجامع المختصر', 
        descEn: 'The Comprehensive Collection', 
        icon: FileText,
        color: '#C9A227',
        gradient: 'linear-gradient(135deg, #C9A227 0%, #E3C04C 100%)'
    },
    { 
        id: 'abudaud', 
        name: 'سنن أبي داود', 
        nameEn: 'Sunan Abi Dawud', 
        description: 'كتاب السنن', 
        descEn: 'The Book of Sunan', 
        icon: Star,
        color: '#D97706',
        gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)'
    }
];

const Sunnah = () => {
    const { lang, t } = useLanguage();
    const [selectedCollection, setSelectedCollection] = useState(null);

    return (
        <div className="sunnah-page animate-slide-down">
            {selectedCollection ? (
                <SunnahReader
                    collectionId={selectedCollection.id}
                    collectionName={lang === 'ar' ? selectedCollection.name : selectedCollection.nameEn}
                    sourceUrl={selectedCollection.sourceUrl}
                    shamelaUrl={selectedCollection.shamelaUrl}
                    onClose={() => setSelectedCollection(null)}
                />
            ) : (
                <>
                    {/* Hero Section */}
                    <div className="sunnah-hero card card-glass">
                        <div className="sunnah-hero-icon">
                            <Sparkles size={32} />
                        </div>
                        <div className="sunnah-hero-text">
                            <h1 className="sunnah-hero-title">
                                {lang === 'ar' ? 'السنة النبوية' : 'The Prophetic Sunnah'}
                            </h1>
                            <p className="sunnah-hero-sub">
                                {lang === 'ar'
                                    ? 'تصفّح أهم كتب الحديث النبوي الشريف واقرأ جميع أحاديث صحيح البخاري وصحيح مسلم. مرجع الترقيم: المكتبة الشاملة (شاملة).'
                                    : 'Browse the most important Hadith collections. Full Sahih Al-Bukhari and Sahih Muslim. Reference: Shamela Library.'}
                            </p>
                        </div>
                    </div>

                    {/* Collections Grid */}
                    <div className="sunnah-collections-grid">
                        {collections.map((collection, index) => {
                            const Icon = collection.icon;
                            return (
                                <button
                                    key={collection.id}
                                    type="button"
                                    className="sunnah-collection-card"
                                    onClick={() => setSelectedCollection(collection)}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="sunnah-card-icon-wrapper" style={{ background: collection.gradient }}>
                                        <Icon size={28} />
                                    </div>
                                    <div className="sunnah-card-content">
                                        <h3 className="sunnah-card-title">
                                            {lang === 'ar' ? collection.name : collection.nameEn}
                                        </h3>
                                        <p className="sunnah-card-desc">
                                            {lang === 'ar' ? collection.description : collection.descEn}
                                        </p>
                                    </div>
                                    <div className="sunnah-card-arrow">
                                        {lang === 'ar' ? '→' : '←'}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default Sunnah;
