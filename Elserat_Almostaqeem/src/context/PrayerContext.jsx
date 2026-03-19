import React, { createContext, useContext, useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

const PrayerContext = createContext();

export const PrayerProvider = ({ children }) => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ latitude: 30.0444, longitude: 31.2357 }); // Default Cairo
  const [city, setCity] = useState('');

  useEffect(() => {
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
          
          setPrayerTimes({
            Fajr: format(pTimes.fajr),
            Sunrise: format(pTimes.sunrise),
            Dhuhr: format(pTimes.dhuhr),
            Asr: format(pTimes.asr),
            Maghrib: format(pTimes.maghrib),
            Isha: format(pTimes.isha),
          });
          setLoading(false);
        },
        (err) => {
          setError("Location access denied");
          setLoading(false);
        }
      );
    };

    fetchPrayerTimes();
  }, []);

  return (
    <PrayerContext.Provider value={{ prayerTimes, loading, error, location, city }}>
      {children}
    </PrayerContext.Provider>
  );
};

export const usePrayer = () => useContext(PrayerContext);
