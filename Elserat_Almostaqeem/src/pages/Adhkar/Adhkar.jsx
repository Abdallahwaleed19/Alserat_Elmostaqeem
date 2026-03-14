import React, { useState } from 'react';
import { Sun, Moon, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import AdhkarReader from '../../components/adhkar/AdhkarReader';
import './Adhkar.css';

const Adhkar = () => {
    const { lang } = useLanguage();
    const [activeCategory, setActiveCategory] = useState(null);

    if (activeCategory) {
        return (
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <AdhkarReader category={activeCategory} onClose={() => setActiveCategory(null)} />
            </div>
        );
    }

    return (
        <div className="adhkar-page animate-slide-down">
            <div className="adhkar-hero card card-glass">
                <div className="adhkar-hero-text">
                    <h1 className="adhkar-title">
                        {lang === 'ar' ? 'الأذكار' : 'Adhkar'}
                    </h1>
                    <p className="adhkar-sub">
                        {lang === 'ar'
                            ? 'اختر نوع الذكر لتصفح أذكار الصباح والمساء وما بعد الصلاة من مصادر موثوقة.'
                            : 'Choose a category to read authentic morning, evening and post‑prayer adhkar.'}
                    </p>
                </div>
            </div>

            <div className="adhkar-cards-grid">
                <button
                    type="button"
                    className="adhkar-card"
                    onClick={() => setActiveCategory('morning')}
                >
                    <div className="adhkar-card-icon-wrapper">
                        <Sun size={32} />
                    </div>
                    <div className="adhkar-card-content">
                        <h3 className="adhkar-card-title">
                            {lang === 'ar' ? 'أذكار الصباح' : 'Morning Adhkar'}
                        </h3>
                        <p className="adhkar-card-desc">
                            {lang === 'ar'
                                ? 'أذكار لبدء يومك بقلب مطمئن وذكرٍ متجدد.'
                                : 'Start your day with remembrance and tranquility.'}
                        </p>
                    </div>
                </button>

                <button
                    type="button"
                    className="adhkar-card"
                    onClick={() => setActiveCategory('evening')}
                >
                    <div className="adhkar-card-icon-wrapper">
                        <Moon size={32} />
                    </div>
                    <div className="adhkar-card-content">
                        <h3 className="adhkar-card-title">
                            {lang === 'ar' ? 'أذكار المساء' : 'Evening Adhkar'}
                        </h3>
                        <p className="adhkar-card-desc">
                            {lang === 'ar'
                                ? 'أذكار تحفظك في نهاية اليوم وتزيدك قربًا.'
                                : 'Adhkar to end your day with protection and closeness to Allah.'}
                        </p>
                    </div>
                </button>

                <button
                    type="button"
                    className="adhkar-card"
                    onClick={() => setActiveCategory('post_prayer')}
                >
                    <div className="adhkar-card-icon-wrapper">
                        <Clock size={32} />
                    </div>
                    <div className="adhkar-card-content">
                        <h3 className="adhkar-card-title">
                            {lang === 'ar' ? 'أذكار بعد الصلاة' : 'Post‑Prayer Adhkar'}
                        </h3>
                        <p className="adhkar-card-desc">
                            {lang === 'ar'
                                ? 'أذكار ما بعد الفريضة لتكميل الأجر والخشوع.'
                                : 'Adhkar after obligatory prayers to perfect your worship.'}
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Adhkar;
