import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import DailyPlanner from '../components/planner/DailyPlanner';
import HomeHero from '../components/home/HomeHero';
import DailyHadith from '../components/home/DailyHadith';
import AyahOfDay from '../components/home/AyahOfDay';
import DuaOfDay from '../components/home/DuaOfDay';
import RecitersCarousel from '../components/home/RecitersCarousel';

import MushafHomeCard from '../components/home/MushafHomeCard';
import HomeTopBar from '../components/home/HomeTopBar';

const Home = () => {
    const { theme } = useTheme();
    const { lang } = useLanguage();

    return (
        <>
            <HomeTopBar />
            <div className="container animate-slide-down" style={{ paddingTop: '2rem' }}>
                <HomeHero />
                <MushafHomeCard />

            <div style={{ marginTop: '3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-text)' }}>
                    {lang === 'ar' ? 'إشراقات يومية' : 'Daily Inspirations'}
                </h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <AyahOfDay />
                <DailyHadith />
                <DuaOfDay />
            </div>

            <div style={{ marginTop: '2.5rem' }}>
                {/* Dynamic Auto-Playing Reciters Carousel */}
                <RecitersCarousel />
            </div>


            {/* Daily planner as table under prayer times */}
            <DailyPlanner />
        </div>
        </>
    );
};

export default Home;
