import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Download, Share2, Copy, Check, Smartphone, Monitor } from 'lucide-react';
import { Share } from '@capacitor/share';
import './DownloadApp.css'; // We'll create a minimal CSS file for this or inline most of it

const DownloadApp = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const [copied, setCopied] = useState(false);

    const isRamadan = theme === 'ramadan';
    const accentColor = isRamadan ? 'var(--gold-main)' : 'var(--color-primary)';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.origin);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        const isWeb = !window.Capacitor || window.Capacitor.getPlatform() === 'web';
        try {
            if (!isWeb) {
                await Share.share({
                    title: lang === 'ar' ? 'تطبيق زاد المسلم' : 'Zad Al-Muslim App',
                    text: lang === 'ar' ? 'الرفيق الإيماني اليومي. قرآءة، استماع، أذكار، ومواقيت الصلاة.' : 'Your daily spiritual companion. Quran, Adhkar, and Prayer Times.',
                    url: window.location.origin,
                });
            } else if (navigator.share) {
                await navigator.share({
                    title: lang === 'ar' ? 'تطبيق زاد المسلم' : 'Zad Al-Muslim App',
                    text: lang === 'ar' ? 'الرفيق الإيماني اليومي. قرآءة، استماع، أذكار، ومواقيت الصلاة.' : 'Your daily spiritual companion. Quran, Adhkar, and Prayer Times.',
                    url: window.location.origin,
                });
            } else {
                handleCopyLink();
            }
        } catch (err) {
            console.log('Error sharing:', err);
        }
    };

    return (
        <div className="container animate-slide-down" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '800px' }}>

            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: isRamadan ? 'linear-gradient(135deg, var(--gold-main) 0%, var(--lantern) 100%)' : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                    marginBottom: '1.5rem',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <Download size={40} color="white" />
                </div>
                <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>
                    {lang === 'ar' ? 'تثبيت التطبيق' : 'Install Application'}
                </h1>
                <p style={{ color: 'var(--text-sub)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    {lang === 'ar'
                        ? 'احصل على تجربة أفضل بملء الشاشة، واستمتع بالوصول السريع إلى الأذكار والقرآن الكريم مباشرة من شاشة هاتفك الرئيسية.'
                        : 'Get a better full-screen experience and enjoy quick access to Adhkar and the Quran directly from your home screen.'}
                </p>
            </div>

            {/* Installation Instructions */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: accentColor, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Smartphone size={24} />
                    {lang === 'ar' ? 'خطوات التثبيت على الهاتف' : 'Installation Steps (Mobile)'}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* iOS */}
                    <div style={{ padding: '1.5rem', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)' }}>
                        <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 'bold' }}>iPhone / iPad (Safari)</span>
                        </h4>
                        <ol style={{ margin: 0, paddingInlineStart: '1.5rem', color: 'var(--text-sub)', lineHeight: '1.8' }}>
                            <li>{lang === 'ar' ? 'افحص القائمة السفلية واضغط على أيقونةالمشاركة (مربع يخرج منه سهم).' : 'Tap the Share icon at the bottom of the screen.'}</li>
                            <li>{lang === 'ar' ? 'مرر للأسفل واختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).' : 'Scroll down and select "Add to Home Screen".'}</li>
                            <li>{lang === 'ar' ? 'اضغط على "إضافة" (Add) في الزاوية العلوية.' : 'Tap "Add" in the top corner.'}</li>
                        </ol>
                    </div>

                    {/* Android */}
                    <div style={{ padding: '1.5rem', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)' }}>
                        <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 'bold' }}>Android (Chrome)</span>
                        </h4>
                        <ol style={{ margin: 0, paddingInlineStart: '1.5rem', color: 'var(--text-sub)', lineHeight: '1.8' }}>
                            <li>{lang === 'ar' ? 'اضغط على قائمة المتصفح (الثلاث نقاط في الأعلى).' : 'Tap the browser menu (three dots at the top).'}</li>
                            <li>{lang === 'ar' ? 'اختر "التثبيت كتطبيق" أو "إضافة إلى الشاشة الرئيسية".' : 'Select "Install app" or "Add to Home screen".'}</li>
                            <li>{lang === 'ar' ? 'أكد عبر الضغط على "تثبيت" (Install).' : 'Confirm by tapping "Install".'}</li>
                        </ol>
                    </div>

                </div>
            </div>

            {/* Desktop Instructions */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: accentColor, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Monitor size={24} />
                    {lang === 'ar' ? 'تثبيت البرنامج على الكمبيوتر' : 'Installation (Desktop)'}
                </h2>
                <p style={{ color: 'var(--text-sub)', lineHeight: '1.8', margin: 0 }}>
                    {lang === 'ar'
                        ? 'إذا كنت تستخدم متصفح Chrome أو Edge، ستجد أيقونة تثبيت صغيرة في شريط العنوان بالأعلى (بجوار علامة النجمة). اضغط عليها لتحميل الموقع كبرنامج مستقل على جهازك.'
                        : 'If using Chrome or Edge, click the install icon in the address bar (near the bookmark star) to run the app in its own window.'}
                </p>
            </div>

            {/* Share / Copy Action */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center', background: isRamadan ? 'rgba(230, 200, 122, 0.05)' : 'var(--color-primary-5)' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>
                    {lang === 'ar' ? 'أو شارك الموقع ليُنشر الأجر' : 'Or share the website for reward'}
                </h3>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleShare}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: accentColor, border: 'none' }}
                    >
                        <Share2 size={18} />
                        {lang === 'ar' ? 'مشاركة الرابط' : 'Share Link'}
                    </button>

                    <button
                        onClick={handleCopyLink}
                        className="btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderColor: accentColor, color: accentColor }}
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ الرابط' : 'Copy Link')}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default DownloadApp;
