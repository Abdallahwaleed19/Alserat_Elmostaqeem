import { Home, BookOpen, Heart, Grid } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRadio } from '../../context/RadioContext';
import './FloatingNavbar.css';

const FloatingNavbar = () => {
    const { lang } = useLanguage();
    const { isPlaying, togglePlayPause } = useRadio();

    return (
        <nav className="floating-navbar-container">
            <div className="floating-navbar">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Home className="nav-icon" />
                    <span className="nav-label">{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
                </NavLink>

                <NavLink to="/quran" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <BookOpen className="nav-icon" />
                    <span className="nav-label">{lang === 'ar' ? 'القرآن' : 'Quran'}</span>
                </NavLink>

                <button 
                    onClick={togglePlayPause} 
                    className={`nav-item radio-center-btn ${isPlaying ? 'playing' : ''}`}
                >
                    <div className="radio-waves-container">
                        <span className="wave w1"></span>
                        <span className="wave w2"></span>
                        <span className="wave w3"></span>
                        <span className="wave w4"></span>
                    </div>
                    <span className="nav-label">{lang === 'ar' ? 'البث المباشر' : 'Live Radio'}</span>
                </button>

                <NavLink to="/adhkar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Heart className="nav-icon" />
                    <span className="nav-label">{lang === 'ar' ? 'الأذكار' : 'Adhkar'}</span>
                </NavLink>

                <NavLink to="/discover" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Grid className="nav-icon" />
                    <span className="nav-label">{lang === 'ar' ? 'المزيد' : 'More'}</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default FloatingNavbar;
