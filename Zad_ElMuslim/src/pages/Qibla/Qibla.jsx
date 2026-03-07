import React, { useState, useEffect, useRef } from 'react';
import { Compass, MapPin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const Qibla = () => {
    const { theme } = useTheme();
    const { t, lang } = useLanguage();
    const [location, setLocation] = useState(null);
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [qiblaDirection, setQiblaDirection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Enhancements
    const [nextPrayer, setNextPrayer] = useState(null);
    const [timeToNext, setTimeToNext] = useState('');

    // Device compass
    const [deviceHeading, setDeviceHeading] = useState(null); // 0–360: اتجاه الجهاز نحو الشمال
    const [compassActive, setCompassActive] = useState(false);
    const [compassError, setCompassError] = useState('');

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });

                    try {
                        const date = new Date();
                        // 1. Fetch Prayer Times
                        const ptRes = await fetch(`https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=5`);
                        const ptData = await ptRes.json();
                        setPrayerTimes(ptData.data.timings);

                        // 2. Fetch Qibla Direction
                        const qbRes = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
                        const qbData = await qbRes.json();
                        setQiblaDirection(qbData.data.direction);

                        setLoading(false);
                    } catch (err) {
                        setError('حدث خطأ أثناء جلب البيانات');
                        setLoading(false);
                    }
                },
                (err) => {
                    setError('يرجى السماح بالوصول إلى الموقع الجغرافي لمعرفة مواقيت الصلاة والقبلة.');
                    setLoading(false);
                }
            );
        } else {
            setError('متصفحك لا يدعم تحديد الموقع.');
            setLoading(false);
        }
    }, []);

    // Countdown Logic for Next Prayer
    useEffect(() => {
        if (!prayerTimes) return;

        const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

        const updateNextPrayer = () => {
            const now = new Date();
            let foundNext = false;
            let nPrayer = null;
            let targetDate = null;

            for (const p of prayers) {
                const timeStr = prayerTimes[p];
                if (!timeStr) continue;
                const [h, m] = timeStr.split(':');
                const pDate = new Date();
                pDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);

                if (pDate > now) {
                    nPrayer = p;
                    targetDate = pDate;
                    foundNext = true;
                    break;
                }
            }

            // If all prayers passed today, next is Fajr tomorrow
            if (!foundNext) {
                nPrayer = 'Fajr';
                const [h, m] = prayerTimes['Fajr'].split(':');
                targetDate = new Date();
                targetDate.setDate(targetDate.getDate() + 1);
                targetDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
            }

            setNextPrayer(nPrayer);

            const diff = targetDate - now;
            if (diff > 0) {
                const hh = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const mm = Math.floor((diff / 1000 / 60) % 60);
                const ss = Math.floor((diff / 1000) % 60);
                setTimeToNext(`${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`);
            }

            const currentH = now.getHours().toString().padStart(2, '0');
            const currentM = now.getMinutes().toString().padStart(2, '0');
        };

        updateNextPrayer();
        const interval = setInterval(updateNextPrayer, 1000);
        return () => clearInterval(interval);
    }, [prayerTimes]);

    // Listen to device orientation when compass is active
    useEffect(() => {
        if (!compassActive) return;

        const handleOrientation = (event) => {
            // alpha: rotation around Z‑axis (0–360, relative للشمال تقريبًا على أغلب الأجهزة)
            if (event.alpha != null) {
                setDeviceHeading(event.alpha);
            }
        };

        window.addEventListener('deviceorientation', handleOrientation);
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, [compassActive]);

    const enableCompass = async () => {
        setCompassError('');
        try {
            if (typeof window === 'undefined' || typeof window.DeviceOrientationEvent === 'undefined') {
                setCompassError(lang === 'ar' ? 'متصفحك لا يدعم مستشعر البوصلة.' : 'Your browser does not support device orientation.');
                return;
            }

            // iOS requires explicit permission
            if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
                const res = await window.DeviceOrientationEvent.requestPermission();
                if (res !== 'granted') {
                    setCompassError(lang === 'ar' ? 'تم رفض إذن الوصول إلى مستشعر البوصلة.' : 'Compass permission was denied.');
                    return;
                }
            }

            setCompassActive(true);
        } catch (e) {
            console.error(e);
            setCompassError(lang === 'ar' ? 'تعذر تفعيل البوصلة في هذا الجهاز.' : 'Could not enable compass on this device.');
        }
    };

    if (loading) {
        return <div className="container text-center" style={{ paddingTop: '2rem' }}>جاري تحديد الموقع...</div>;
    }

    if (error) {
        return (
            <div className="container text-center" style={{ paddingTop: '2rem' }}>
                <MapPin size={48} className="mx-auto" style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
                <p>{error}</p>
            </div>
        );
    }

    const prayerNamesAr = {
        Fajr: lang === 'ar' ? 'الفجر' : 'Fajr',
        Sunrise: lang === 'ar' ? 'الشروق' : 'Sunrise',
        Dhuhr: lang === 'ar' ? 'الظهر' : 'Dhuhr',
        Asr: lang === 'ar' ? 'العصر' : 'Asr',
        Maghrib: lang === 'ar' ? 'المغرب' : 'Maghrib',
        Isha: lang === 'ar' ? 'العشاء' : 'Isha'
    };

    // If we have both qibla direction and device heading, نوجّه السهم حسب وضع الجهاز
    const effectiveRotation = qiblaDirection != null
        ? ((qiblaDirection - (deviceHeading ?? 0) + 360) % 360)
        : 0;

    return (
        <div className="container animate-slide-down" style={{ paddingTop: '2rem' }}>
            <h1 className="text-center" style={{ marginBottom: '2rem' }}>{t('qibla')}</h1>

            {/* Qibla Compass Simulation */}
            <div className="card text-center" style={{ marginBottom: '2rem', padding: '3rem 1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>{lang === 'ar' ? 'اتجاه القبلة' : 'Qibla Direction'}</h3>
                <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    {lang === 'ar'
                        ? 'اضغط على زر تفعيل البوصلة ليتم ضبط المؤشر مع حركة هاتفك، ثم وجِّه أعلى الهاتف إلى الأمام.'
                        : 'Tap “Enable compass” so the arrow follows your phone movement, then point the top of the phone forward.'}
                </p>
                <button
                    type="button"
                    onClick={enableCompass}
                    className="btn btn-outline"
                    style={{ borderRadius: 'var(--radius-full)', marginBottom: '1.5rem' }}
                >
                    {lang === 'ar'
                        ? (compassActive ? 'البوصلة مفعّلة' : 'تفعيل البوصلة')
                        : (compassActive ? 'Compass enabled' : 'Enable compass')}
                </button>
                <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
                    {/* Compass Background */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        border: '4px solid var(--color-primary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{ position: 'absolute', top: '10px', fontWeight: 'bold' }}>N</span>
                        <span style={{ position: 'absolute', bottom: '10px', fontWeight: 'bold' }}>S</span>
                        <span style={{ position: 'absolute', right: '10px', fontWeight: 'bold' }}>E</span>
                        <span style={{ position: 'absolute', left: '10px', fontWeight: 'bold' }}>W</span>
                    </div>

                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        transform: `rotate(${effectiveRotation}deg)`,
                        transition: 'transform 0.5s ease-out',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        paddingTop: '20px'
                    }}>
                        <Compass size={48} style={{ color: 'var(--color-accent)' }} className={theme === 'ramadan' ? 'animate-glow' : ''} />
                    </div>
                </div>
                <p style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    {lang === 'ar' ? 'زاوية القبلة عن الشمال الحقيقي:' : 'Qibla bearing from true north:'} {Math.round(qiblaDirection)}°
                </p>
                {deviceHeading != null && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        {lang === 'ar'
                            ? `اتجاه هاتفك الحالي عن الشمال: ${Math.round(deviceHeading)}°`
                            : `Your phone heading from north: ${Math.round(deviceHeading)}°`}
                    </p>
                )}
                {compassError && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginTop: '0.5rem' }}>
                        {compassError}
                    </p>
                )}
            </div>

            {/* Prayer Times List */}
            <div className="card" style={{ marginTop: '2rem', padding: '1.75rem 1.5rem' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>
                        {lang === 'ar' ? 'مواقيت الصلاة اليوم' : 'Prayer Times Today'}
                    </h3>
                </div>

                {nextPrayer && (
                    <div
                        className="text-center"
                        style={{
                            marginBottom: '1.25rem',
                            color: theme === 'ramadan' ? 'var(--gold-main, #E6C87A)' : 'var(--color-primary)',
                            fontSize: '1.05rem',
                            fontWeight: 'bold',
                        }}
                    >
                        {lang === 'ar' ? 'الصلاة القادمة:' : 'Next Prayer:'}{' '}
                        {prayerNamesAr[nextPrayer]} - <span style={{ color: theme === 'ramadan' ? 'var(--gold-main, #E6C87A)' : 'inherit' }}>{timeToNext}</span>
                    </div>
                )}

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: '1rem',
                    }}
                >
                    {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => {
                        const isNext = prayer === nextPrayer;
                        return (
                            <div
                                key={prayer}
                                className={`text-center qibla-time-card ${isNext ? 'animate-glow' : ''}`}
                                style={{
                                    padding: '0.9rem 0.75rem',
                                    borderRadius: 'var(--radius-lg)',
                                    border: isNext
                                        ? '2px solid var(--color-primary)'
                                        : '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-surface)',
                                    transform: isNext ? 'scale(1.03)' : 'none',
                                    transition: 'all 0.25s',
                                }}
                            >
                                <h4
                                    style={{
                                        margin: 0,
                                        marginBottom: '0.4rem',
                                        color: isNext
                                            ? (theme === 'ramadan' ? 'var(--gold-main, #E6C87A)' : 'var(--color-primary)')
                                            : 'var(--color-text)',
                                    }}
                                >
                                    {prayerNamesAr[prayer]}
                                </h4>
                                <p
                                    className="quran-text"
                                    style={{
                                        margin: 0,
                                        fontSize: '1.1rem',
                                        color: theme === 'ramadan' ? 'var(--gold-main, #E6C87A)' : 'var(--color-primary)',
                                        fontWeight: theme === 'ramadan' ? '600' : '500',
                                    }}
                                >
                                    {prayerTimes[prayer]}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Qibla;
