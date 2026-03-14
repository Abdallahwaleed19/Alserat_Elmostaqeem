import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const adhkarData = {
    morning: {
        title: 'أذكار الصباح',
        titleEn: 'Morning Adhkar',
        items: [
            { id: 1, text: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ.', textEn: 'Ayatul Kursi: Allah – there is no deity except Him, the Ever-Living, the Sustainer of all existence...', count: 1 },
            { id: 2, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ هُوَ اللَّهُ أَحَدٌ. اللَّهُ الصَّمَدُ. لَمْ يَلِدْ وَلَمْ يُولَدْ. وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ.\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ. مِن شَرِّ مَا خَلَقَ. وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ. وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ. وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ.\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ. مَلِكِ النَّاسِ. إِلَٰهِ النَّاسِ. مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ. الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ. مِنَ الْجِنَّةِ وَالنَّاسِ.', textEn: 'Surah Al-Ikhlas, Al-Falaq, An-Nas (3 times)', count: 3 },
            { id: 3, text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ، وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.', textEn: 'We have reached the morning and at this very time unto Allah belongs all sovereignty...', count: 1 }
        ]
    },
    evening: {
        title: 'أذكار المساء',
        titleEn: 'Evening Adhkar',
        items: [
            { id: 1, text: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ.', textEn: 'Ayatul Kursi: Allah – there is no deity except Him, the Ever-Living, the Sustainer of all existence...', count: 1 },
            { id: 2, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ هُوَ اللَّهُ أَحَدٌ. اللَّهُ الصَّمَدُ. لَمْ يَلِدْ وَلَمْ يُولَدْ. وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ.\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ. مِن شَرِّ مَا خَلَقَ. وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ. وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ. وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ.\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ. قُلْ أَعُوذُ بِرَبِّ النَّاسِ. مَلِكِ النَّاسِ. إِلَٰهِ النَّاسِ. مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ. الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ. مِنَ الْجِنَّةِ وَالنَّاسِ.', textEn: 'Surah Al-Ikhlas, Al-Falaq, An-Nas (3 times)', count: 3 },
            { id: 3, text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ، وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.', textEn: 'We have reached the evening and at this very time unto Allah belongs all sovereignty...', count: 1 }
        ]
    },
    post_prayer: {
        title: 'أذكار بعد الصلاة',
        titleEn: 'Post-Prayer Adhkar',
        items: [
            { id: 1, text: 'أَسْتَغْفِرُ اللَّهَ (ثَلَاثاً). اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.', textEn: 'I ask Allah for forgiveness (three times). O Allah, You are As-Salam, from You is peace. Blessed are You, O Possessor of majesty and honour.', count: 1 },
            { id: 2, text: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ.', textEn: 'O Allah, help me remember You, thank You, and worship You excellently.', count: 1 },
            { id: 3, text: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ. اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ.', textEn: 'Ayatul Kursi (full): Allah – there is no deity except Him, the Ever-Living, the Sustainer of all existence...', count: 1 },
            { id: 4, text: 'سُبْحَانَ اللَّهِ (٣٣) وَالْحَمْدُ لِلَّهِ (٣٣) وَاللَّهُ أَكْبَرُ (٣٣).', textEn: 'SubhanAllah (33), Alhamdulillah (33), Allahu Akbar (33).', count: 99 },
            { id: 5, text: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهو عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ.', textEn: 'None has the right to be worshipped except Allah alone, with no partner. To Him belongs sovereignty and to Him is praise, and He is over all things competent.', count: 1 }
        ]
    }
};

const AdhkarReader = ({ category, onClose }) => {
    const { lang } = useLanguage();
    const data = adhkarData[category];
    const [counts, setCounts] = useState({});

    // Initialize counts
    useEffect(() => {
        const initialCounts = {};
        if (data && data.items) {
            data.items.forEach(item => {
                initialCounts[item.id] = 0;
            });
        }
        setCounts(initialCounts);
    }, [data]);

    if (!data) return null;

    const handleCount = (id, target) => {
        if (counts[id] < target) {
            setCounts(prev => ({ ...prev, [id]: prev[id] + 1 }));
            if (navigator.vibrate) navigator.vibrate(20);
        } else {
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Done target
        }
    };

    const resetAll = () => {
        const initialCounts = {};
        data.items.forEach(item => {
            initialCounts[item.id] = 0;
        });
        setCounts(initialCounts);
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const totalTarget = data.items.reduce((acc, curr) => acc + curr.count, 0);
    const currentTotal = Object.values(counts).reduce((acc, curr) => acc + curr, 0);
    const progressPercent = totalTarget > 0 ? Math.round((currentTotal / totalTarget) * 100) : 0;

    return (
        <div className="adhkar-reader animate-slide-down">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="btn btn-outline flex items-center p-2 rounded-full z-10">
                        {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                    </button>
                    <h2 style={{ margin: 0 }}>{lang === 'ar' ? data.title : data.titleEn}</h2>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={resetAll}
                        className="btn btn-outline flex items-center gap-2"
                        style={{ padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)' }}
                        title={lang === 'ar' ? 'إعادة تعيين العداد' : 'Reset Counters'}
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            {/* Overall Progress */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2 text-sm text-muted">
                    <span>{lang === 'ar' ? 'نسبة الإنجاز' : 'Overall Progress'}</span>
                    <span>{progressPercent}%</span>
                </div>
                <div style={{ width: '100%', backgroundColor: 'var(--color-border)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${progressPercent}%`,
                        backgroundColor: 'var(--color-primary)',
                        height: '100%',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
            </div>

            {/* Adhkar List */}
            <div className="flex flex-col gap-6">
                {data.items.map((item) => {
                    const cnt = counts[item.id] || 0;
                    const isDone = cnt >= item.count;

                    return (
                        <div
                            key={item.id}
                            className="card p-6"
                            style={{
                                backgroundColor: isDone ? 'var(--color-primary-10)' : 'var(--color-surface)',
                                borderColor: isDone ? 'var(--color-primary)' : 'var(--color-border)',
                                transition: 'all 0.3s ease',
                                cursor: isDone ? 'default' : 'pointer'
                            }}
                            onClick={() => handleCount(item.id, item.count)}
                        >
                            <p className="quran-text" style={{ fontSize: '1.4rem', lineHeight: '2.2', textAlign: 'center', marginBottom: '1.5rem', opacity: isDone ? 0.7 : 1, whiteSpace: 'pre-line' }}>
                                {lang === 'ar' ? item.text : item.textEn}
                            </p>

                            {/* Counter UI inside Card */}
                            <div className="flex justify-center items-center gap-4">
                                <div
                                    style={{
                                        width: '60px', height: '60px',
                                        borderRadius: '30px',
                                        backgroundColor: isDone ? 'var(--gold-main, #D4AF37)' : 'var(--color-surface-hover)',
                                        color: isDone ? '#1a1a1a' : 'var(--gold-main, #D4AF37)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.2rem', fontWeight: 'bold'
                                    }}
                                >
                                    {cnt} / {item.count}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {progressPercent === 100 && (
                <div className="text-center animate-slide-down mt-8 p-4 bg-primary-10 rounded-lg" style={{ color: 'var(--color-primary)' }}>
                    <h3 style={{ margin: 0 }}>{lang === 'ar' ? 'تبارك الله، أتممت الأذكار!' : 'MashaAllah, you completed the Adhkar!'}</h3>
                </div>
            )}
        </div>
    );
};

export default AdhkarReader;
