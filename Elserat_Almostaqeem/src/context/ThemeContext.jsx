<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEgyptHijriDateParts } from '../utils/egyptTime';
import { usePrayer } from './PrayerContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { prayerTimes } = usePrayer();
  const [themePreference, setThemePreference] = useState(() => {
    const saved = localStorage.getItem('zad_theme_pref');
    if (saved === 'default' || saved === 'auto') return saved;
    return 'auto';
  });

  const [theme, setTheme] = useState(() => {
    try {
      const { day: hijriDay, monthIndex } = getEgyptHijriDateParts(new Date(), 0);
      const hijriMonth = monthIndex + 1;

      // Arafah & Eid al-Adha (Dhul-Hijjah) ONLY
      if (hijriMonth === 12 && hijriDay === 9) return 'arafah';
      if (hijriMonth === 12 && hijriDay >= 10 && hijriDay <= 13) return 'eid-adha';

      return 'default';
    } catch (e) {
      return 'default';
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

      if (hijriMonth === 12 && hijriDay === 9) {
        effectiveTheme = 'arafah';
      } else if (hijriMonth === 12 && hijriDay >= 10 && hijriDay <= 13) {
        effectiveTheme = 'eid-adha';
      } else {
        effectiveTheme = (themePreference === 'auto') ? 'default' : themePreference;
      }
    } catch (e) {
      effectiveTheme = (themePreference === 'auto') ? 'default' : themePreference;
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
    setThemePreference('default');
  };

  return (
    <ThemeContext.Provider value={{ theme, themePreference, cycleThemePreference, setThemePreference, setRamadanMode, colorMode, toggleColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
=======
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEgyptHijriDateParts } from '../utils/egyptTime';
import { usePrayer } from './PrayerContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { prayerTimes } = usePrayer();
  const [themePreference, setThemePreference] = useState(() => {
    const saved = localStorage.getItem('zad_theme_pref');
    if (saved === 'default' || saved === 'auto') return saved;
    return 'auto';
  });

  const [theme, setTheme] = useState(() => {
    try {
      const { day: hijriDay, monthIndex } = getEgyptHijriDateParts(new Date(), 0);
      const hijriMonth = monthIndex + 1;

      // Arafah & Eid al-Adha (Dhul-Hijjah) ONLY
      if (hijriMonth === 12 && hijriDay === 9) return 'arafah';
      if (hijriMonth === 12 && hijriDay >= 10 && hijriDay <= 13) return 'eid-adha';

      return 'default';
    } catch (e) {
      return 'default';
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

      if (hijriMonth === 12 && hijriDay === 9) {
        effectiveTheme = 'arafah';
      } else if (hijriMonth === 12 && hijriDay >= 10 && hijriDay <= 13) {
        effectiveTheme = 'eid-adha';
      } else {
        effectiveTheme = (themePreference === 'auto') ? 'default' : themePreference;
      }
    } catch (e) {
      effectiveTheme = (themePreference === 'auto') ? 'default' : themePreference;
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
    setThemePreference('default');
  };

  return (
    <ThemeContext.Provider value={{ theme, themePreference, cycleThemePreference, setThemePreference, setRamadanMode, colorMode, toggleColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
>>>>>>> 19f58ce (update the app and add new widget)
