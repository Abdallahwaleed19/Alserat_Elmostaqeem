import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Navigation, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import './Qibla.css';

const Qibla = () => {
    const { theme } = useTheme();
    const { lang } = useLanguage();
    const [location, setLocation] = useState(null);
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [qiblaDirection, setQiblaDirection] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [nextPrayer, setNextPrayer] = useState(null);
    const [timeToNext, setTimeToNext] = useState('');

    const [deviceHeading, setDeviceHeading] = useState(0);
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
                        const ptRes = await fetch(`https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=5`);
                        const ptData = await ptRes.json();
                        setPrayerTimes(ptData.data.timings);

                        const qbRes = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
                        const qbData = await qbRes.json();
                        setQiblaDirection(qbData.data.direction);

                        setLoading(false);
                    } catch (err) {
                        setError(lang === 'ar' ? 'حدث خطأ أثناء جلب البيانات' : 'Error fetching data');
                        setLoading(false);
                    }
                },
                (err) => {
                    setError(lang === 'ar' ? 'يرجى السماح بالوصول إلى الموقع الجغرافي لمعرفة مواقيت الصلاة والقبلة.' : 'Please allow location access to show prayer times and Qibla.');
                    setLoading(false);
                }
            );
        } else {
            setError(lang === 'ar' ? 'متصفحك لا يدعم تحديد الموقع.' : 'Your browser does not support geolocation.');
            setLoading(false);
        }
    }, [lang]);

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
        };

        updateNextPrayer();
        const interval = setInterval(updateNextPrayer, 1000);
        return () => clearInterval(interval);
    }, [prayerTimes]);

    useEffect(() => {
        if (!compassActive) return;

        const handleOrientation = (event) => {
            let heading = 0;
            if (event.webkitCompassHeading) {
                heading = event.webkitCompassHeading;
            } else if (event.alpha !== null) {
                heading = 360 - event.alpha;
            }
            setDeviceHeading(heading);
        };

        window.addEventListener('deviceorientation', handleOrientation);
        if (window.DeviceOrientationEvent && !('ondeviceorientationabsolute' in window) && !('ondeviceorientation' in window)) {
             setCompassError(lang === 'ar' ? 'المستشعر غير متاح' : 'Sensor not available');
        }
        
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, [compassActive, lang]);

    const enableCompass = async () => {
        setCompassError('');
        try {
            if (typeof window.DeviceOrientationEvent !== 'undefined' && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
                const res = await window.DeviceOrientationEvent.requestPermission();
                if (res !== 'granted') {
                    setCompassError(lang === 'ar' ? 'تم رفض إذن الوصول.' : 'Permission denied.');
                    return;
                }
            }
            setCompassActive(true);
        } catch (e) {
            setCompassError(lang === 'ar' ? 'تعذر التفعيل.' : 'Activation failed.');
        }
    };

    if (loading) return <div className="container text-center" style={{ paddingTop: '5rem' }}>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>;

    if (error) return (
        <div className="container text-center" style={{ paddingTop: '5rem' }}>
            <MapPin size={48} className="mx-auto text-muted mb-4" />
            <p className="text-xl">{error}</p>
        </div>
    );

    const prayerNamesAr = {
        Fajr: lang === 'ar' ? 'الفجر' : 'Fajr',
        Sunrise: lang === 'ar' ? 'الشروق' : 'Sunrise',
        Dhuhr: lang === 'ar' ? 'الظهر' : 'Dhuhr',
        Asr: lang === 'ar' ? 'العصر' : 'Asr',
        Maghrib: lang === 'ar' ? 'المغرب' : 'Maghrib',
        Isha: lang === 'ar' ? 'العشاء' : 'Isha'
    };

    const effectiveRotation = (qiblaDirection - deviceHeading + 360) % 360;

    return (
        <div className="container animate-slide-down qibla-container" style={{ paddingTop: '2rem' }}>
            <div className="text-center mb-10">
                <Navigation size={48} className="text-primary mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'بوصلة القبلة' : 'Qibla Compass'}</h1>
                <p className="text-muted">{lang === 'ar' ? 'حدد اتجاه القبلة بدقة من موقعك الحالي.' : 'Determine Qibla direction accurately from your location.'}</p>
            </div>

            <div className="qibla-card text-center mb-10">
                <button
                    onClick={enableCompass}
                    className="btn btn-primary"
                    style={{ borderRadius: '100px', padding: '0.75rem 2rem', marginBottom: '2rem' }}
                >
                    {compassActive ? (lang === 'ar' ? 'البوصلة تعمل' : 'Compass Active') : (lang === 'ar' ? 'تفعيل البوصلة' : 'Enable Compass')}
                </button>

                <div className="qibla-compass-wrapper">
                    <div className="compass-outer-ring"></div>
                    <div className="compass-inner-ring"></div>
                    <span className="compass-direction dir-n">N</span>
                    <span className="compass-direction dir-s">S</span>
                    <span className="compass-direction dir-e">E</span>
                    <span className="compass-direction dir-w">W</span>

                    <div className="qibla-arrow-container" style={{ transform: `rotate(${effectiveRotation}deg)` }}>
                        <div className="qibla-pointer">
                            <div className="kaaba-icon-wrapper">
                                <div className="kaaba-dot"></div>
                                <Compass size={32} color="white" />
                            </div>
                            <div className="qibla-line"></div>
                        </div>
                    </div>
                </div>

                <div className="qibla-stats">
                    <div className="stat-box">
                        <div className="stat-label">{lang === 'ar' ? 'زاوية القبلة' : 'Qibla Angle'}</div>
                        <div className="stat-value">{Math.round(qiblaDirection)}°</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-label">{lang === 'ar' ? 'اتجاه هاتفك' : 'Device Heading'}</div>
                        <div className="stat-value">{Math.round(deviceHeading)}°</div>
                    </div>
                </div>

                {compassError && <p className="text-accent mt-4 text-sm">{compassError}</p>}
                
                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
                    <Info size={16} />
                    <span>{lang === 'ar' ? 'ضع الهاتف في وضع أفقي للحصول على أفضل دقة.' : 'Place phone flat for best accuracy.'}</span>
                </div>
            </div>

            <div className="card p-6">
                <h3 className="mb-6">{lang === 'ar' ? 'مواقيت الصلاة اليوم' : 'Prayer Times Today'}</h3>
                
                {nextPrayer && (
                    <div className="text-center mb-8 p-4 bg-primary-10 rounded-lg border border-primary-20">
                        <div className="text-primary font-bold text-lg">
                            {lang === 'ar' ? 'الصلاة القادمة:' : 'Next Prayer:'} {prayerNamesAr[nextPrayer]}
                        </div>
                        <div className="text-2xl font-bold mt-1" style={{ color: 'var(--color-primary)' }}>{timeToNext}</div>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
                        <div key={prayer} className={`p-4 rounded-xl border text-center ${prayer === nextPrayer ? 'border-primary bg-primary-5' : 'border-border'}`}>
                             <div className="text-sm text-muted mb-1">{prayerNamesAr[prayer]}</div>
                             <div className="text-xl font-bold text-primary">{prayerTimes[prayer]}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Qibla;
