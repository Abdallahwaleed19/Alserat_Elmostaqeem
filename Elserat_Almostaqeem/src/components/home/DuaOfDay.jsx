import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { getEgyptDateString } from '../../utils/egyptTime';
import { Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { shareImageDataUrl } from '../../utils/shareImageNative';
import './ShareCard.css';

const EID_DUAS = [
    {
        ar: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ",
        en: "Allah is the Greatest, Allah is the Greatest, Allah is the Greatest, there is no god but Allah. Allah is the Greatest, Allah is the Greatest, and to Allah belongs all praise."
    },
    {
        ar: "تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ صَالِحَ الْأَعْمَالِ. كُلُّ عَامٍ وَأَنْتُمْ بِخَيْرٍ",
        en: "May Allah accept from us and you the good deeds. Happy Eid to you all."
    },
    {
        ar: "اللَّهُمَّ رَبَّنَا لَكَ الْحَمْدُ، أَنْعَمْتَ عَلَيْنَا بِتَمَامِ الصِّيَامِ وَبَلَغْتَنَا عِيدَ الْفِطْرِ، فَلَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ",
        en: "O Allah, all praise is due to You. You have blessed us with the completion of fasting and allowed us to reach Eid Al-Fitr. To You belongs much good and blessed praise."
    }
];

const DAILY_DUAS = [
    {
        ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        en: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire."
    },
    {
        ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
        en: "O Allah, I ask You for forgiveness and health in this world and the Hereafter."
    },
    {
        ar: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
        en: "O Turner of the hearts, keep my heart steadfast on Your religion."
    },
    {
        ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
        en: "O Allah, I ask You for guidance, piety, chastity and self-sufficiency."
    },
    {
        ar: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
        en: "My Lord, forgive me and accept my repentance. Indeed, You are the Accepting of repentance, the Merciful."
    },
    {
        ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
        en: "O Allah, I take refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being over powered by men."
    },
    {
        ar: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
        en: "My Lord, expand for me my breast [with assurance] and ease for me my task."
    }
];

const DuaOfDay = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const [dua, setDua] = useState(DAILY_DUAS[0]);
    const [egyptDateKey, setEgyptDateKey] = useState(() => getEgyptDateString());
    const cardRef = useRef(null);
    const [isSharing, setIsSharing] = useState(false);

    useEffect(() => {
        const key = getEgyptDateString();
        setEgyptDateKey(key);
        const interval = setInterval(() => {
            const next = getEgyptDateString();
            if (next !== key) setEgyptDateKey(next);
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (theme === 'eid-fitr') {
            const dayHash = egyptDateKey.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
            const selectedIndex = dayHash % EID_DUAS.length;
            setDua(EID_DUAS[selectedIndex]);
            return;
        }
        const dayHash = egyptDateKey.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
        const selectedIndex = dayHash % DAILY_DUAS.length;
        setDua(DAILY_DUAS[selectedIndex]);
    }, [egyptDateKey, theme]);

    const handleShare = async () => {
        if (!cardRef.current || isSharing) return;
        setIsSharing(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#C9A24D',
            });
            const dataUrl = canvas.toDataURL('image/png');
            
            if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                await shareImageDataUrl(dataUrl, 'Dua of the Day', 'Share Dua');
            } else {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], 'dua_of_the_day.png', { type: 'image/png' });

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'Dua of the Day',
                    });
                } else {
                    const link = document.createElement('a');
                    link.download = 'dua_of_the_day.png';
                    link.href = dataUrl;
                    link.click();
                }
            }
        } catch (err) {
            console.error("Share failed", err);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <>
            {/* بطاقة المشاركة المزخرفة (مخفية للتصدير فقط) */}
            <div
                ref={cardRef}
                className="share-card-export share-card-dua"
                aria-hidden
                style={{ position: 'absolute', left: '-9999px', top: 0 }}
            >
                <div className="share-card-corner-b" aria-hidden />
                <div className="share-card-corner-br" aria-hidden />
                <div className="share-card-header">
                    <h2 className="share-card-title">{lang === 'ar' ? 'دعاء اليوم' : 'Dua of the Day'}</h2>
                </div>
                <p className="share-card-body share-card-body-ar">{dua.ar}</p>
                <p className="share-card-translation">"{dua.en}"</p>
                <div className="share-card-footer">الصراط المستقيم</div>
            </div>

            <div className="card h-full flex flex-col justify-center relative overflow-hidden" style={{ minHeight: '180px' }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="absolute top-0 left-0 w-32 h-32 bg-accent rounded-full blur-3xl opacity-20 transform -translate-x-10 -translate-y-10"></div>

                    <div className="flex justify-between items-center relative z-10" style={{ marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="daily-hadith-icon" style={{ display: 'inline-flex', flexShrink: 0, color: 'var(--color-accent)' }} aria-hidden>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </span>
                            {lang === 'ar' ? 'دعاء اليوم' : 'Dua of the Day'}
                        </h3>
                    </div>

                    <p className="quran-text relative z-10 leading-loose" style={{ fontSize: '1.4rem', margin: '0 0 0.5rem 0', textAlign: 'center' }}>
                        {dua.ar}
                    </p>
                    {lang === 'en' && (
                        <p className="relative z-10" style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textAlign: 'center', margin: 0, fontStyle: 'italic' }}>
                            "{dua.en}"
                        </p>
                    )}
                </div>

                <button 
                    onClick={handleShare}
                    className="icon-btn" 
                    style={{ position: 'absolute', bottom: '1rem', left: lang === 'ar' ? '1rem' : 'auto', right: lang === 'en' ? '1rem' : 'auto', zIndex: 20, opacity: isSharing ? 0.5 : 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(4px)', border: '1px solid var(--color-border)', padding: '0.6rem', borderRadius: '50%', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                    disabled={isSharing}
                >
                    <Share2 size={18} />
                </button>
            </div>
        </>
    );
};

export default DuaOfDay;
