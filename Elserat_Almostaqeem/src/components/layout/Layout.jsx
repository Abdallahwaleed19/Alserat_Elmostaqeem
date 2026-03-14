import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Heart, Compass, Moon, Sun, Menu, X, Globe, Sparkles, Circle, Star, Map, Bookmark } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import AudioPlayer from '../audio/AudioPlayer';
import RadioPlayerBar from '../audio/RadioPlayerBar';
import FloatingNavbar from './FloatingNavbar';
import { useHijriDate } from '../../utils/useHijriDate';
import { useSoftProtection } from '../../hooks/useSoftProtection';
import IslamicAssistantSidebar from '../assistant/IslamicAssistantSidebar';
import './Layout.css';

const Layout = () => {
    const { theme } = useTheme();
    const isRamadanOn = theme === 'ramadan';
    const { lang } = useLanguage();
    const { hijriShort: hijriDateStr } = useHijriDate(lang);

    // Apply soft protection globally
    useSoftProtection();


    return (
        <div className="layout-wrapper">


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
                    <div className="ramadan-garlands"></div>
                    <div className="lantern lantern-left animate-sway"></div>
                    <div className="lantern lantern-right animate-sway" style={{ animationDelay: '1s' }}></div>
                    <div className="crescent-moon"></div>
                </div>
            )}

            {/* Eid al-Fitr Decorations Overlay */}
            {theme === 'eid-fitr' && (
                <div className="eid-decorations hidden-mobile">
                    <div className="eid-balloon gold"></div>
                    <div className="eid-balloon"></div>
                    <div className="eid-balloon red"></div>
                    <div className="eid-balloon"></div>
                    <div className="eid-balloon gold"></div>
                </div>
            )}

            {/* Arafah & Eid al-Adha Decorations */}
            {theme === 'arafah' && (
                <div className="hajj-decorations pointer-events-none">
                    <div className="hajj-mountain"></div>
                    <div className="hajj-moon"></div>
                </div>
            )}

            {theme === 'eid-adha' && (
                <div className="eid-adha-decorations hidden-mobile">
                    <div className="eid-adha-arc"></div>
                    <div className="eid-adha-stars"></div>
                </div>
            )}

            <IslamicAssistantSidebar />
            <FloatingNavbar />
        </div>
    );
};

export default Layout;
