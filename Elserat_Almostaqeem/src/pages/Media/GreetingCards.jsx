import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useHijriDate } from '../../utils/useHijriDate';
import { ArrowLeft, ArrowRight, Download, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { shareImageDataUrl, saveImageDataUrlToDevice } from '../../utils/shareImageNative';
import './GreetingCards.css';

const TEMPLATES = [
    {
        id: 'eid',
        className: 'template-eid',
        titleEn: 'Eid Mubarak',
        titleAr: 'عيد مبارك',
        duaAr: 'تقبّل الله منا ومنكم صالح الأعمال، وجعل أيامكم كلها أعيادًا وفرحًا وطاعة.',
        duaEn: 'May Allah accept from us and you, and make all your days filled with joy, blessings, and obedience to Him.'
    },
    {
        id: 'ramadan',
        className: 'template-ramadan',
        titleEn: 'Ramadan Kareem',
        titleAr: 'رمضان كريم',
        duaAr: 'اللهم تقبّل صيامكم وقيامكم، واجعل هذا الشهر سببًا لمغفرة الذنوب ورفعة الدرجات.',
        duaEn: 'May Allah accept your fasting and prayers, and make this month a means for forgiveness and elevation in ranks.'
    },
    {
        id: 'jummah',
        className: 'template-jummah',
        titleEn: 'Jummah Mubarak',
        titleAr: 'جمعة مباركة',
        duaAr: 'أسأل الله أن يجعل هذه الجمعة نورًا لقلوبكم، وبركةً في أعماركم، وقبولًا لأعمالكم.',
        duaEn: 'I ask Allah to make this Friday a light for your heart, a blessing in your life, and a means for your deeds to be accepted.'
    }
];

const GreetingCards = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const { currentWeekday } = useHijriDate(lang);
    const navigate = useNavigate();
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [sender, setSender] = useState('');
    const [recipient, setRecipient] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const cardRef = useRef(null);

    const visibleTemplates = useMemo(() => {
        const isFriday = currentWeekday === 5; // Friday
        const isRamadan = theme === 'ramadan';
        const isEid = theme === 'eid-fitr';

        const filtered = TEMPLATES.filter((t) => {
            if (t.id === 'ramadan') return isRamadan;
            if (t.id === 'eid') return isEid;
            if (t.id === 'jummah') return isFriday;
            return true;
        });

        // Fallback: لو مفيش مناسبة حالياً، نعرض كل القوالب بدل ما الصفحة تبقى فاضية
        return filtered.length > 0 ? filtered : TEMPLATES;
    }, [theme, currentWeekday]);

    useEffect(() => {
        // حافظ إن التمبلت المختار دايماً من ضمن الظاهر حاليًا
        if (!visibleTemplates.find(t => t.id === selectedTemplate.id)) {
            setSelectedTemplate(visibleTemplates[0]);
        }
    }, [visibleTemplates, selectedTemplate.id]);

    const generateImage = async () => {
        if (!cardRef.current) return null;
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 3, // High quality
                useCORS: true,
                backgroundColor: null,
            });
            return canvas.toDataURL('image/png');
        } catch (err) {
            console.error("Error generating image:", err);
            return null;
        }
    };

    const handleShare = async () => {
        setIsGenerating(true);
        const dataUrl = await generateImage();
        setIsGenerating(false);

        if (!dataUrl) return;

        try {
            if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                await shareImageDataUrl(
                    dataUrl,
                    lang === 'ar' ? 'بطاقة تهنئة' : 'Greeting Card',
                    lang === 'ar' ? 'مشاركة البطاقة' : 'Share Card'
                );
            } else {
                // Web Fallback if share API supports files
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], 'greeting_card.png', { type: blob.type });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'Greeting Card'
                    });
                } else {
                    const link = document.createElement('a');
                    link.download = `zad_${selectedTemplate.id}.png`;
                    link.href = dataUrl;
                    link.click();
                }
            }
        } catch (e) {
            console.error("Share failed", e);
            const link = document.createElement('a');
            link.download = `zad_${selectedTemplate.id}.png`;
            link.href = dataUrl;
            link.click();
        }
    };

    const handleDownloadClick = async () => {
        setIsGenerating(true);
        const dataUrl = await generateImage();
        setIsGenerating(false);
        if (!dataUrl) return;
        try {
            if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                await saveImageDataUrlToDevice(
                    dataUrl,
                    `zad_${selectedTemplate.id}.png`,
                    lang === 'ar' ? 'حفظ الصورة' : 'Save image'
                );
            } else {
                const link = document.createElement('a');
                link.download = `zad_${selectedTemplate.id}.png`;
                link.href = dataUrl;
                link.click();
            }
        } catch (e) {
            console.error('Download failed', e);
        }
    };

    return (
        <div className="container greeting-cards-page animate-slide-down" style={{ paddingTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/discover')} className="icon-btn" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                </button>
                <h1 style={{ margin: 0, fontSize: '1.75rem' }}>{lang === 'ar' ? 'بطاقات التهنئة' : 'Greeting Cards'}</h1>
            </div>

            <div className="cards-hero">
                <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', fontFamily: 'var(--font-arabic-title)' }}>
                    {lang === 'ar' ? 'صمم بطاقتك الخاصة' : 'Design Your Card'}
                </h2>
                <p style={{ margin: 0, opacity: 0.9 }}>
                    {lang === 'ar' ? 'خلفيات إسلامية رائعة بلمستك المميزة.' : 'Beautiful Islamic templates with your personal touch.'}
                </p>
            </div>

            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>
                    {lang === 'ar' ? 'اختر التصميم المناسب للمناسبة الحالية' : 'Choose the template for the current occasion'}
                </h3>
                <div className="template-grid">
                    {visibleTemplates.map(t => (
                        <div 
                            key={t.id} 
                            className={`template-option ${t.className} ${selectedTemplate.id === t.id ? 'selected' : ''}`}
                            onClick={() => setSelectedTemplate(t)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontFamily: 'var(--font-arabic-title)', padding: '1rem', textAlign: 'center' }}
                        >
                            {lang === 'ar' ? t.titleAr : t.titleEn}
                        </div>
                    ))}
                </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {lang === 'ar' ? 'إلى (اسم المستلم)' : 'To (Recipient)'}
                        </label>
                        <input
                            type="text"
                            dir={lang === 'ar' ? 'rtl' : 'ltr'}
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder={lang === 'ar' ? 'مثال: أخي الغالي...' : 'e.g. My dear brother...'}
                            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', background: 'var(--color-background)', fontSize: '1rem', color: 'var(--color-text)', fontFamily: 'var(--font-arabic-title, inherit)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {lang === 'ar' ? 'من (اسم المرسل)' : 'From (Sender)'}
                        </label>
                        <input
                            type="text"
                            dir={lang === 'ar' ? 'rtl' : 'ltr'}
                            value={sender}
                            onChange={(e) => setSender(e.target.value)}
                            placeholder={lang === 'ar' ? 'مثال: عائلة فلان...' : 'e.g. Ali family...'}
                            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', background: 'var(--color-background)', fontSize: '1rem', color: 'var(--color-text)', fontFamily: 'var(--font-arabic-title, inherit)' }}
                        />
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <h3 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>{lang === 'ar' ? 'المعاينة' : 'Preview'}</h3>
            <div className="card-preview-container">
                <div 
                    ref={cardRef} 
                    className={`card-canvas ${selectedTemplate.className}`}
                >
                    {recipient && (
                        <div className="card-text-to">
                            <span className="card-text-label">{lang === 'ar' ? 'إلى' : 'To'}</span>
                            <span className="card-text-name">{recipient}</span>
                        </div>
                    )}
                    <div className="card-text-main">
                        {lang === 'ar' ? selectedTemplate.titleAr : selectedTemplate.titleEn}
                    </div>
                    <div className="card-text-dua">
                        {lang === 'ar' ? selectedTemplate.duaAr : selectedTemplate.duaEn}
                    </div>
                    {sender && (
                        <div className="card-text-from">
                            <span className="card-text-label">{lang === 'ar' ? 'مع تحيات' : 'From'}</span>
                            <span className="card-text-name">{sender}</span>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                    onClick={handleShare} 
                    disabled={isGenerating}
                    className="btn btn-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '100px', flex: 1, justifyContent: 'center' }}
                >
                    <Share2 size={20} />
                    {isGenerating ? (lang === 'ar' ? 'جاري التجهيز...' : 'Generating...') : (lang === 'ar' ? 'مشاركة البطاقة' : 'Share Card')}
                </button>
                <button 
                    onClick={handleDownloadClick} 
                    disabled={isGenerating}
                    className="btn btn-outline" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '100px' }}
                >
                    <Download size={20} />
                    {lang === 'ar' ? 'حفظ الصـورة' : 'Save Image'}
                </button>
            </div>
        </div>
    );
};

export default GreetingCards;
