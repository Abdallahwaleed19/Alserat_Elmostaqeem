import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import DailyPlanner from '../components/planner/DailyPlanner';
import HomeHero from '../components/home/HomeHero';
import DailyHadith from '../components/home/DailyHadith';
import RecitersCarousel from '../components/home/RecitersCarousel';
import PrayerTimesHome from '../components/prayer/PrayerTimesHome';

const Home = () => {
    const { theme } = useTheme();
    const { lang } = useLanguage();

    return (
        <div className="container animate-slide-down" style={{ paddingTop: '2rem' }}>
            <HomeHero />

            <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <DailyHadith />

                {/* Dynamic Auto-Playing Reciters Carousel */}
                <RecitersCarousel />
            </div>

            {/* Prayer times under daily hadith */}
            <PrayerTimesHome />

            {/* Daily planner as table under prayer times */}
            <DailyPlanner />
        </div>
    );
};

export default Home;
