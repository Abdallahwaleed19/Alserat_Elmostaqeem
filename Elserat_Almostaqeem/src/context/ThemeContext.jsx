import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEgyptHijriDateParts } from '../utils/egyptTime';
import { usePrayer } from './PrayerContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { prayerTimes } = usePrayer();
  const [themePreference, setThemePreference] = useState(() => {
    const saved = localStorage.getItem('zad_theme_pref');
    if (saved === 'ramadan' || saved === 'default' || saved === 'auto') return saved;
    // أول تشغيل: نستخدم "auto" ليتم اختيار رمضان/العيد/العادي تلقائياً حسب التاريخ الهجري
    return 'auto';
  });

  const [theme, setTheme] = useState(() => {
    try {
      const { day: hijriDay, monthIndex } = getEgyptHijriDateParts(new Date(), 0); // Use 0 offset to match user's "Today is 1 Shawwal"
      const hijriMonth = monthIndex + 1;

      // Force Eid al-Fitr during Shawwal 1-3
      if (hijriMonth === 10 && hijriDay <= 3) return 'eid-fitr';

      // Arafah & Eid al-Adha (Dhul-Hijjah)
      if (hijriMonth === 12 && hijriDay === 9) return 'arafah';
      if (hijriMonth === 12 && hijriDay >= 10 && hijriDay <= 13) return 'eid-adha';

      if (themePreference === 'auto') {
        return 'default';
      }
      return themePreference;
    } catch (e) {
      return themePreference === 'auto' ? 'default' : themePreference;
    }
  });

  // Light / Dark color mode (independent from Ramadan mode)
  const [colorMode, setColorMode] = useState(() => {
    const saved = localStorage.getItem('zad_color_mode');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('zad_theme_pref', themePreference);
    localStorage.setItem('zad_color_mode', colorMode);

    let effectiveTheme = themePreference;

    try {
      const { day: hijriDay, monthIndex } = getEgyptHijriDateParts(new Date(), 0);
      const hijriMonth = monthIndex + 1;

      const isEidFitrRange = (hijriMonth === 10 && hijriDay <= 3);
      
      // Check for Eid Eve transition (Ramadan 29/30 after Maghrib + 30 mins)
      let isEidEveTransition = false;
      if (hijriMonth === 9 && hijriDay >= 29 && prayerTimes?.Maghrib) {
        const [h, m] = prayerTimes.Maghrib.split(':');
        const maghrib = new Date();
        maghrib.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
        if (new Date().getTime() > maghrib.getTime() + 30 * 60 * 1000) {
          isEidEveTransition = true;
        }
      }

      if (isEidFitrRange || isEidEveTransition) {
        effectiveTheme = 'eid-fitr';
      } else if (hijriMonth === 12 && hijriDay === 9) {
        effectiveTheme = 'arafah';
      } else if (hijriMonth === 12 && hijriDay >= 10 && hijriDay <= 13) {
        effectiveTheme = 'eid-adha';
      } else if (themePreference === 'auto') {
        effectiveTheme = 'default';
      }
    } catch (e) {
      if (themePreference === 'auto') effectiveTheme = 'default';
    }

    setTheme(effectiveTheme);

    const root = document.documentElement;
    root.removeAttribute('data-theme');

    // expose current color mode as a separate attribute for fine-grained theming
    root.setAttribute('data-color-mode', colorMode);

    if (effectiveTheme === 'ramadan') {
      root.setAttribute('data-theme', 'ramadan');
    } else if (effectiveTheme === 'eid-fitr') {
      root.setAttribute('data-theme', 'eid-fitr');
    } else if (effectiveTheme === 'arafah') {
      root.setAttribute('data-theme', 'arafah');
    } else if (effectiveTheme === 'eid-adha') {
      root.setAttribute('data-theme', 'eid-adha');
    } else if (colorMode === 'dark') {
      root.setAttribute('data-theme', 'dark');
    }
  }, [themePreference, colorMode, prayerTimes]);

  const cycleThemePreference = () => {
    setThemePreference((prev) => {
      if (prev === 'auto') return 'default';
      return 'auto';
    });
  };

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setRamadanMode = (on) => {
    setThemePreference(on ? 'ramadan' : 'default');
  };

  return (
    <ThemeContext.Provider value={{ theme, themePreference, cycleThemePreference, setThemePreference, setRamadanMode, colorMode, toggleColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
