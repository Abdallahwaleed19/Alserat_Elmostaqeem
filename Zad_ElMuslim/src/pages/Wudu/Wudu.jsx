import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Droplets } from 'lucide-react';
import './Wudu.css';

const Wudu = () => {
    const { lang } = useLanguage();

    const fardAr = [
        'غَسْلُ الوَجْهِ',
        'غَسْلُ اليَدَيْنِ إِلَى المِرْفَقَيْنِ',
        'مَسْحُ رَأْسٍ (أَوْ بَعْضِهِ)',
        'غَسْلُ الرِّجْلَيْنِ إِلَى الكَعْبَيْنِ'
    ];
    const fardEn = [
        'Washing the face',
        'Washing the arms up to the elbows',
        'Wiping the head (or part of it)',
        'Washing the feet up to the ankles'
    ];

    const sunanAr = [
        'التَّسْمِيَةُ في أَوَّلِ الوُضُوءِ',
        'غَسْلُ الكَفَّيْنِ قَبْلَ إدْخَالِهِما في الإناء',
        'المَضْمَضَةُ وَالاِسْتِنْشَاقُ',
        'مَسْحُ الأُذُنَيْنِ',
        'تَخْلِيلُ أَصَابِعِ اليَدَيْنِ وَالرِّجْلَيْنِ',
        'التَّيَمُّنُ (البدء باليمين)',
        'ثَلاثَةُ مَرَّاتٍ لِكُلِّ عُضْوٍ',
        'الوُضُوءُ بِوَفْرِ الماءِ دون إسراف'
    ];
    const sunanEn = [
        'Saying Bismillah at the start',
        'Washing the hands before putting them in the water',
        'Rinsing the mouth and nose',
        'Wiping the ears',
        'Running fingers through the toes and fingers',
        'Starting with the right side',
        'Washing each part three times',
        'Using sufficient water without waste'
    ];

    const invalidateAr = [
        'خُرُوجُ شَيْءٍ مِنَ القُبُلِ أَوِ الدُّبُرِ',
        'خُرُوجُ النَّوْمِ المُغْلَقِ',
        'زَوَالُ العَقْلِ (إِغْمَاءٌ أَوْ سُكْرٌ)',
        'مُلامَسَةُ الرَّجُلِ لِامْرَأَتِهِ بِشَهْوَةٍ'
    ];
    const invalidateEn = [
        'Anything exiting from the private parts',
        'Deep sleep',
        'Loss of consciousness',
        'Skin contact between spouses with desire'
    ];

    return (
        <div className="wudu-page animate-slide-down">
            <div className="container">
                <div className="wudu-hero card card-glass">
                    <div className="wudu-hero-icon">
                        <Droplets size={40} />
                    </div>
                    <h1 className="wudu-hero-title">
                        {lang === 'ar' ? 'أحكام الوضوء' : 'Rules of Wudu'}
                    </h1>
                    <p className="wudu-hero-sub">
                        {lang === 'ar'
                            ? 'فروض الوضوء وسننه وما يبطله'
                            : 'Obligatory acts, sunnah, and what invalidates wudu.'}
                    </p>
                </div>

                <section className="wudu-section card">
                    <h2 className="wudu-section-title">
                        {lang === 'ar' ? 'فروض الوضوء' : 'Obligatory Acts (Fard)'}
                    </h2>
                    <ul className="wudu-list">
                        {(lang === 'ar' ? fardAr : fardEn).map((item, i) => (
                            <li key={i} className="wudu-list-item">
                                <span className="wudu-num">{i + 1}</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="wudu-section card">
                    <h2 className="wudu-section-title">
                        {lang === 'ar' ? 'سنن الوضوء' : 'Recommended (Sunnah)'}
                    </h2>
                    <ul className="wudu-list">
                        {(lang === 'ar' ? sunanAr : sunanEn).map((item, i) => (
                            <li key={i} className="wudu-list-item">
                                <span className="wudu-num">{i + 1}</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="wudu-section card">
                    <h2 className="wudu-section-title">
                        {lang === 'ar' ? 'ما يبطل الوضوء' : 'What Invalidates Wudu'}
                    </h2>
                    <ul className="wudu-list">
                        {(lang === 'ar' ? invalidateAr : invalidateEn).map((item, i) => (
                            <li key={i} className="wudu-list-item invalidate">
                                <span className="wudu-num">{i + 1}</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Wudu;
