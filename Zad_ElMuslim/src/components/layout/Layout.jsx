import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Heart, Compass, Moon, Sun, Menu, X, Globe, Sparkles, Circle, Star, Map, Bookmark } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import AudioPlayer from '../audio/AudioPlayer';
import RadioPlayerBar from '../audio/RadioPlayerBar';
import { useHijriDate } from '../../utils/useHijriDate';
import { useSoftProtection } from '../../hooks/useSoftProtection';
import NotificationPrompt from '../NotificationPrompt';
import './Layout.css';

const Layout = () => {
    const { theme, themePreference, setRamadanMode, colorMode, toggleColorMode } = useTheme();
    const isRamadanOn = theme === 'ramadan';
    const { lang, toggleLanguage, t } = useLanguage();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { hijriShort: hijriDateStr } = useHijriDate(lang);

    // Apply soft protection globally
    useSoftProtection();

    const navItems = [
        { path: '/', label: t('home'), icon: Home },
        { path: '/quran', label: t('quran'), icon: BookOpen },
        { path: '/bookmarks', label: t('bookmarks'), icon: Bookmark },
        { path: '/reciters', label: t('reciters'), icon: BookOpen },
        { path: '/sunnah', label: t('sunnah'), icon: BookOpen },
        { path: '/adhkar', label: t('adhkar'), icon: Heart },
        { path: '/tasbeeh', label: t('tasbeeh'), icon: Sparkles },
        { path: '/pillars', label: t('pillars'), icon: BookOpen },
        { path: '/discover/favorites', label: t('favorites'), icon: Heart },
        { path: '/discover', label: t('discover'), icon: Star },
    ];

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="layout-wrapper">
            {/* Header / Top Navigation */}
            <header className="header">
                <div className="container header-content">
                    <Link to="/" className="logo">
                        <img
                            src={`/icons/icon-${isRamadanOn ? 'ramadan' : colorMode}.svg`}
                            alt="Logo"
                            className="nav-logo-icon"
                        />
                        <span className="logo-text logo-text-arabic">{t('zadTitle')}</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="desktop-nav">
                        <ul className="desktop-nav-list">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={item.path}>
                                        <Link to={item.path} className={`desktop-nav-link ${isActive ? 'active' : ''}`}>
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Controls (Theme, Lang, Mobile Menu Toggle) */}
                    <div className="header-controls">
                        <button
                            onClick={toggleLanguage}
                            className="icon-btn"
                            aria-label="Toggle Language"
                            title={t('language')}
                        >
                            <Globe size={16} />
                            <span className="lang-text" style={{ fontSize: '0.7rem', marginInlineStart: '0.2rem' }}>
                                {lang.toUpperCase()}
                            </span>
                        </button>

                        {/* Light / Dark toggle */}
                        <button
                            onClick={toggleColorMode}
                            className="icon-btn"
                            aria-label={lang === 'ar' ? 'تغيير وضع الإضاءة' : 'Toggle light / dark mode'}
                            title={
                                lang === 'ar'
                                    ? colorMode === 'light'
                                        ? 'التبديل إلى الوضع الداكن'
                                        : 'التبديل إلى الوضع الفاتح'
                                    : colorMode === 'light'
                                        ? 'Switch to dark mode'
                                        : 'Switch to light mode'
                            }
                        >
                            {colorMode === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                        </button>

                        {/* Ramadan / Eid mode logic */}
                        {theme === 'eid-fitr' ? (
                            <div className="badge badge-accent" style={{ fontWeight: 'bold' }}>
                                {lang === 'ar' ? 'عيد الفطر' : 'Eid Al-Fitr'}
                            </div>
                        ) : (
                            <button
                                type="button"
                                role="switch"
                                aria-checked={isRamadanOn}
                                aria-label={lang === 'ar' ? (isRamadanOn ? 'وضع رمضان مفعّل' : 'وضع رمضان غير مفعّل') : (isRamadanOn ? 'Ramadan mode on' : 'Ramadan mode off')}
                                title={lang === 'ar' ? (isRamadanOn ? 'إيقاف وضع رمضان' : 'تفعيل وضع رمضان') : (isRamadanOn ? 'Turn off Ramadan mode' : 'Turn on Ramadan mode')}
                                className="ramadan-switch"
                                data-active={isRamadanOn}
                                onClick={() => setRamadanMode(!isRamadanOn)}
                            >
                                <span className="ramadan-switch-track">
                                    <span className="ramadan-switch-thumb">
                                        {isRamadanOn ? <Moon size={10} /> : <Circle size={10} />}
                                    </span>
                                </span>
                            </button>
                        )}

                        <button
                            className="mobile-menu-toggle icon-btn"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle Menu"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Full-Screen Menu */}
            <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav">
                    <ul className="mobile-nav-list">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path} className="mobile-nav-item">
                                    <Link to={item.path} className={`mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                                        <Icon size={24} className={isActive && theme === 'ramadan' ? 'animate-glow' : ''} />
                                        <span className="mobile-nav-label">{item.label}</span>
                                    </Link>
                                    <div className="nav-divider"></div>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>

            {/* Eid Banner */}
            {theme === 'eid-fitr' && (
                <div className="eid-banner">
                    <div className="eid-banner-content container">
                        <h2 className="eid-banner-title">
                            <Sparkles size={20} />
                            {lang === 'ar' ? 'عيد فطر مبارك' : 'Eid Mubarak'}
                            <Sparkles size={20} />
                        </h2>
                        <p className="eid-banner-subtitle">
                            {lang === 'ar'
                                ? 'تقبل الله منا ومنكم صالح الأعمال. صلاة عيد الفطر بتوقيت مصر المحروسة في تمام الساعة 5:59 صباحاً'
                                : 'May Allah accept from us and you. Eid Prayer in Egypt is at 5:59 AM'}
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="main-content">
                <Outlet />
            </main>

            <AudioPlayer />
            <RadioPlayerBar />

            {/* Global footer */}
            <footer className="site-footer">
                <div className="container site-footer-inner">
                    <div className="site-footer-date">
                        {lang === 'ar' ? 'التاريخ الهجري:' : 'Hijri date:'} {hijriDateStr}
                    </div>
                    <div className="site-footer-credit">
                        {lang === 'ar' ? (
                            <>
                                Created by <span className="site-footer-name">Abdallah Waleed Kamal</span> – جميع الحقوق محفوظة 2026<br />
                                <Link to="/terms" style={{ color: 'var(--color-accent)', fontSize: '0.9rem', marginTop: '0.5rem', display: 'inline-block' }}>سياسة الاستخدام وحقوق النشر</Link>
                            </>
                        ) : (
                            <>
                                Created by <span className="site-footer-name">Abdallah Waleed Kamal</span> – All rights reserved 2026<br />
                                <Link to="/terms" style={{ color: 'var(--color-accent)', fontSize: '0.9rem', marginTop: '0.5rem', display: 'inline-block' }}>Terms of Use & Copyright</Link>
                            </>
                        )}
                    </div>
                    <div className="site-footer-socials" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                        <a href="https://www.facebook.com/abdallah.waleed.kamal" target="_blank" rel="noopener noreferrer" className="social-link" style={{ color: 'var(--color-accent)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </a>
                        <a href="https://www.linkedin.com/in/abdallah-waleed-885089293/" target="_blank" rel="noopener noreferrer" className="social-link" style={{ color: 'var(--color-accent)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </a>
                    </div>
                </div>
            </footer>

            {/* Ramadan Decorations Overlay */}
            {theme === 'ramadan' && (
                <div className="ramadan-decorations pointer-events-none">
                    <div className="lantern lantern-left animate-sway"></div>
                    <div className="lantern lantern-right animate-sway" style={{ animationDelay: '1s' }}></div>
                </div>
            )}

            {/* Eid Decorations Overlay */}
            {theme === 'eid-fitr' && (
                <div className="eid-decorations hidden-mobile">
                    <div className="eid-balloon gold"></div>
                    <div className="eid-balloon"></div>
                    <div className="eid-balloon red"></div>
                    <div className="eid-balloon"></div>
                    <div className="eid-balloon gold"></div>
                </div>
            )}
        </div>
    );
};

export default Layout;
