import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
const PrayerTimesHome = () => {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeToNext, setTimeToNext] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError(
        lang === 'ar'
          ? 'متصفحك لا يدعم تحديد الموقع لمواقيت الصلاة.'
          : 'Your browser does not support geolocation for prayer times.',
      );
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const date = new Date();
          const res = await fetch(
            `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() +
            1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=5`,
          );
          const data = await res.json();
          setPrayerTimes(data.data.timings);
        } catch (e) {
          console.error(e);
          setError(
            lang === 'ar'
              ? 'حدث خطأ أثناء جلب مواقيت الصلاة.'
              : 'Error fetching prayer times.',
          );
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError(
          lang === 'ar'
            ? 'يرجى السماح بالوصول إلى الموقع الجغرافي لعرض مواقيت الصلاة.'
            : 'Please allow location access to show prayer times.',
        );
        setLoading(false);
      },
    );
  }, [lang]);

  // تحديث الصلاة القادمة والعد التنازلي
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
        setTimeToNext(
          `${hh.toString().padStart(2, '0')}:${mm
            .toString()
            .padStart(2, '0')}:${ss.toString().padStart(2, '0')}`,
        );
      }

      const currentH = now.getHours().toString().padStart(2, '0');
      const currentM = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentH}:${currentM}`;
    };

    updateNextPrayer();
    const interval = setInterval(updateNextPrayer, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const prayerNamesAr = {
    Fajr: lang === 'ar' ? 'الفجر' : 'Fajr',
    Sunrise: lang === 'ar' ? 'الشروق' : 'Sunrise',
    Dhuhr: lang === 'ar' ? 'الظهر' : 'Dhuhr',
    Asr: lang === 'ar' ? 'العصر' : 'Asr',
    Maghrib: lang === 'ar' ? 'المغرب' : 'Maghrib',
    Isha: lang === 'ar' ? 'العشاء' : 'Isha',
  };

  if (loading) {
    return (
      <div style={{ marginTop: '2rem' }} className="text-center text-muted">
        {lang === 'ar' ? 'جاري تحميل مواقيت الصلاة...' : 'Loading prayer times...'}
      </div>
    );
  }

  if (error || !prayerTimes) {
    return (
      <div style={{ marginTop: '2rem' }} className="text-center text-muted">
        {error}
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: '2rem', padding: '1.75rem 1.5rem' }}>
      <div className="flex justify-between items-center flex-wrap gap-2" style={{ marginBottom: '1rem' }}>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
          <div
            key={prayer}
            className="text-center"
            style={{
              padding: '0.85rem 0.75rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            <h4
              style={{
                margin: 0,
                marginBottom: '0.35rem',
                color: 'var(--color-text)',
              }}
            >
              {prayerNamesAr[prayer]}
            </h4>
            <p
              className="quran-text"
              style={{
                margin: 0,
                fontSize: '1rem',
                color: theme === 'ramadan' ? 'var(--gold-main, #E6C87A)' : 'var(--color-primary)',
                fontWeight: theme === 'ramadan' ? '600' : '500',
              }}
            >
              {prayerTimes[prayer]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerTimesHome;

