import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themePreference, setThemePreference] = useState(() => {
    const saved = localStorage.getItem('zad_theme_pref');
    if (saved === 'ramadan' || saved === 'default' || saved === 'auto') return saved;
    return 'default';
  });

  const [theme, setTheme] = useState(() => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', { month: 'numeric', day: 'numeric' });
      const parts = formatter.formatToParts(new Date());
      const hijriMonth = parseInt(parts.find(p => p.type === 'month')?.value || '1', 10);
      const hijriDay = parseInt(parts.find(p => p.type === 'day')?.value || '1', 10);

      // Force Eid al-Fitr during Shawwal 1-3
      if (hijriMonth === 10 && hijriDay <= 3) return 'eid-fitr';

      // Arafah & Eid al-Adha (Dhul-Hijjah)
      if (hijriMonth === 12 && hijriDay === 9) return 'arafah';
      if (hijriMonth === 12 && hijriDay >= 10 && hijriDay <= 13) return 'eid-adha';

      if (themePreference === 'auto') {
        return hijriMonth === 9 ? 'ramadan' : 'default';
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
      const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', { month: 'numeric', day: 'numeric' });
      const parts = formatter.formatToParts(new Date());
      const hijriMonth = parseInt(parts.find(p => p.type === 'month')?.value || '1', 10);
      const hijriDay = parseInt(parts.find(p => p.type === 'day')?.value || '1', 10);

      if (hijriMonth === 10 && hijriDay <= 3) {
        effectiveTheme = 'eid-fitr';
      } else if (hijriMonth === 12 && hijriDay === 9) {
        effectiveTheme = 'arafah';
      } else if (hijriMonth === 12 && hijriDay >= 10 && hijriDay <= 13) {
        effectiveTheme = 'eid-adha';
      } else if (themePreference === 'auto') {
        effectiveTheme = hijriMonth === 9 ? 'ramadan' : 'default';
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
  }, [themePreference, colorMode]);

  const cycleThemePreference = () => {
    setThemePreference((prev) => {
      if (prev === 'auto') return 'ramadan';
      if (prev === 'ramadan') return 'default';
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
