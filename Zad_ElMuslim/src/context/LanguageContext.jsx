import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
    ar: {
        home: 'الرئيسية',
        quran: 'القرآن',
        reciters: 'القرّاء',
        sunnah: 'السنة',
        adhkar: 'الأذكار',
        tasbeeh: 'المسبحة',
        bookmarks: 'المحفوظات',
        pillars: 'أركان الإسلام',
        planner: 'النوتة اليومية',
        zadTitle: 'الصِّرَاطُ الْمُسْتَقِيمُ',
        discover: 'المزيد',
        islamicWorldMap: 'خريطة العالم الإسلامي',
        zakat: 'الزكاة',
        favorites: 'المفضلة',
        language: 'English',
    },
    en: {
        home: 'Home',
        quran: 'Quran',
        reciters: 'Reciters',
        sunnah: 'Sunnah',
        adhkar: 'Adhkar',
        tasbeeh: 'Tasbeeh',
        bookmarks: 'Saved Pages',
        pillars: 'Pillars',
        planner: 'Planner',
        zadTitle: 'As-Sirat Al-Mustaqeem',
        discover: 'Discover',
        islamicWorldMap: 'Islamic World Map',
        zakat: 'Zakat',
        favorites: 'Favorites',
        language: 'العربية',
    }
};

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('zad_lang') || 'ar';
    });

    useEffect(() => {
        localStorage.setItem('zad_lang', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }, [lang]);

    const toggleLanguage = () => {
        setLang(prevLang => prevLang === 'ar' ? 'en' : 'ar');
    };

    const t = (key) => translations[lang][key] || key;

    return (
        <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
