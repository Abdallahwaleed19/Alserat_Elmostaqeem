import React, { createContext, useContext, useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { Preferences } from '@capacitor/preferences';
import { formatCountdown, getLocalizedDates, getNextPrayer } from '../utils/prayerRuntime';
import { getIslamicContext } from '../utils/islamicContext';

const PrayerContext = createContext();

export const PrayerProvider = ({ children }) => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ latitude: 30.0444, longitude: 31.2357 }); // Default Cairo
  const [city, setCity] = useState('');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const updateWidget = async (pTimesObj, at = new Date()) => {
        try {
          const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
          const prayerNamesAr = { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
          const nowDate = at;
          let nextP = 'Fajr';
          let nextTimeStr = pTimesObj['Fajr'];
          for (const p of prayers) {
            if (!pTimesObj[p]) continue;
            const [h, m] = pTimesObj[p].split(':');
            const pDate = new Date();
            pDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
            if (pDate > nowDate) {
              nextP = p;
              nextTimeStr = pTimesObj[p];
              break;
            }
          }
          await Preferences.set({ key: 'widget_prayer_name', value: prayerNamesAr[nextP] });
          await Preferences.set({ key: 'widget_prayer_time', value: nextTimeStr });
          
          const dhikrs = ["سُبْحَانَ اللَّهِ", "الْحَمْدُ لِلَّهِ", "لا إِلَهَ إِلا اللَّهُ", "اللَّهُ أَكْبَرُ", "أَسْتَغْفِرُ اللَّهَ"];
          const todayDhikr = dhikrs[new Date().getDay() % dhikrs.length];
          await Preferences.set({ key: 'widget_dhikr', value: todayDhikr });

          try {
              const gregorianOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
              const hijriOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', calendar: 'islamic-umalqura' };
              const gregorianDateStr = new Intl.DateTimeFormat('ar-EG', gregorianOptions).format(nowDate);
              const hijriDateStr = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', hijriOptions).format(nowDate);
              
              const widgetData = {
                  prayers: pTimesObj,
                  nextPrayer: nextP,
                  hijriDate: hijriDateStr,
                  gregorianDate: gregorianDateStr
              };
              await Preferences.set({ key: 'widget_data_v2', value: JSON.stringify(widgetData) });
          } catch(err) { console.warn("Failed formats for widget dates", err); }

          if (window.Capacitor && window.Capacitor.isNativePlatform()) {
            // Trigger Android home screen widget refresh via native Capacitor plugin
            await window.Capacitor.Plugins.WidgetPlugin?.update();
          }
        } catch(e) { console.error('Widget update error', e); }
    };

    const fetchPrayerTimes = async () => {

      if (!navigator.geolocation) {
        setError("Geolocation not supported");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          try {
            // Fetch City
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ar`);
            const geoData = await geoRes.json();
            setCity(geoData.city || geoData.locality || '');

            // First attempt: Fetch from Aladhan API
            const date = new Date();
            const res = await fetch(
              `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=5`
            );
            const data = await res.json();
            if (data.code === 200) {
              setPrayerTimes(data.data.timings);
              updateWidget(data.data.timings, new Date());
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn("API Fetch failed, falling back to local adhan library", e);
          }

          // Fallback: Local adhan library
          const coords = new Coordinates(latitude, longitude);
          const params = CalculationMethod.Egyptian();
          const pTimes = new PrayerTimes(coords, new Date(), params);
          
          const format = (d) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
          
          const timesObj = {
            Fajr: format(pTimes.fajr),
            Sunrise: format(pTimes.sunrise),
            Dhuhr: format(pTimes.dhuhr),
            Asr: format(pTimes.asr),
            Maghrib: format(pTimes.maghrib),
            Isha: format(pTimes.isha),
          };
          setPrayerTimes(timesObj);
          updateWidget(timesObj, new Date());
          setLoading(false);
        },
        () => {
          setError("Location access denied");
          setLoading(false);
        }
      );
    };

    const minuteTimer = setInterval(() => setNow(new Date()), 60 * 1000);
    fetchPrayerTimes();
    return () => clearInterval(minuteTimer);
  }, []);

  useEffect(() => {
    if (!prayerTimes) return;
    // Keep widget date + next prayer + dua fresh without reopening app.
    const refresh = async () => {
      try {
        const n = getNextPrayer(prayerTimes, now);
        const dates = getLocalizedDates(now);
        const context = getIslamicContext(now);
        const prayerNamesAr = { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
        await Preferences.set({ key: 'widget_prayer_name', value: prayerNamesAr[n?.prayer || 'Fajr'] || 'الفجر' });
        await Preferences.set({ key: 'widget_prayer_time', value: prayerTimes[n?.prayer || 'Fajr'] || '--:--' });
        await Preferences.set({ key: 'widget_dhikr', value: context.dua.ar });
        await Preferences.set({
          key: 'widget_data_v2',
          value: JSON.stringify({
            prayers: prayerTimes,
            nextPrayer: n?.prayer || 'Fajr',
            hijriDate: dates.hijri,
            gregorianDate: dates.gregorian
          })
        });
        if (window.Capacitor && window.Capacitor.isNativePlatform()) {
          await window.Capacitor.Plugins.WidgetPlugin?.update();
        }
      } catch (err) {
        console.warn('widget auto refresh failed', err);
      }
    };

    refresh();
  }, [prayerTimes, now]);

  const nextPrayer = getNextPrayer(prayerTimes, now);
  const countdown = formatCountdown(nextPrayer?.at, now);
  const dates = getLocalizedDates(now);
  const islamicContext = getIslamicContext(now);

  return (
    <PrayerContext.Provider value={{ prayerTimes, loading, error, location, city, now, nextPrayer, countdown, dates, islamicContext }}>
      {children}
    </PrayerContext.Provider>
  );
};

export const usePrayer = () => useContext(PrayerContext);
