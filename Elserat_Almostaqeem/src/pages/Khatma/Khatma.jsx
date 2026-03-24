import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Users, Heart } from 'lucide-react';
import './Khatma.css';

const Khatma = () => {
    const { lang } = useLanguage();

    return (
        <div className="container khatma-page animate-slide-down" style={{ paddingTop: '2rem' }}>
            <div className="khatma-hero card" style={{ borderRadius: 'var(--radius-xl)' }}>
                <h1 className="khatma-title">
                    {lang === 'ar' ? 'الخَتَمات' : 'Khatma'}
                </h1>
                <p className="khatma-sub">
                    {lang === 'ar'
                        ? 'شارك في ختمات جماعية أو أهدِ ثواب ختمة لمن تحب.'
                        : 'Participate in Group Khatma or dedicate a Khatma to a loved one.'}
                </p>
            </div>

            <div className="khatma-cards-grid">
                <Link to="/khatma/deceased" className="khatma-card">
                    <div className="khatma-card-icon-wrapper">
                        <Heart size={32} />
                    </div>
                    <div className="khatma-card-content">
                        <h3 className="khatma-card-title">
                            {lang === 'ar' ? 'ختمة المتوفى' : 'Khatma for the Deceased'}
                        </h3>
                        <p className="khatma-card-desc">
                            {lang === 'ar'
                                ? 'أنشئ ختمة بنية إهداء ثوابها لشخص متوفى، وشارك الرابط مع العائلة والأصدقاء لقراءة الأجزاء.'
                                : 'Create a Khatma in memory of a deceased person and share it with friends and family.'}
                        </p>
                    </div>
                </Link>

                <Link to="/khatma/group" className="khatma-card">
                    <div className="khatma-card-icon-wrapper">
                        <Users size={32} />
                    </div>
                    <div className="khatma-card-content">
                        <h3 className="khatma-card-title">
                            {lang === 'ar' ? 'ختمة جماعية' : 'Group Khatma'}
                        </h3>
                        <p className="khatma-card-desc">
                            {lang === 'ar'
                                ? 'شارك في ختمة جماعية، اختر الجزء الذي تود قراءته وساهم في ختم القرآن الكريم مع الآخرين.'
                                : 'Join a group Khatma, pick the Juz you want to read, and complete the Quran with others.'}
                        </p>
                    </div>
                </Link>

                <Link to="/khatma/plans" className="khatma-card">
                    <div className="khatma-card-icon-wrapper">
                        <BookOpen size={32} />
                    </div>
                    <div className="khatma-card-content">
                        <h3 className="khatma-card-title">
                            {lang === 'ar' ? 'ختمة شخصية' : 'Personal Khatma'}
                        </h3>
                        <p className="khatma-card-desc">
                            {lang === 'ar'
                                ? 'عد إلى القراءة من حيث توقفت وتابع ختمتك الشخصية.'
                                : 'Resume reading where you left off and track your personal Khatma.'}
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Khatma;
