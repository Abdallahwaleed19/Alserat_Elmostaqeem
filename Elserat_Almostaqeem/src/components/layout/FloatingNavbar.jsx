import { Home, BookOpen, Heart, Compass, Grid } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './FloatingNavbar.css';

const FloatingNavbar = () => {
    const { t, lang } = useLanguage();

    const navItems = [
        { path: '/', label: lang === 'ar' ? 'الرئيسية' : 'Home', icon: Home },
        { path: '/quran', label: lang === 'ar' ? 'القرآن' : 'Quran', icon: BookOpen },
        { path: '/adhkar', label: lang === 'ar' ? 'الأذكار' : 'Adhkar', icon: Heart },
        { path: '/sunnah', label: lang === 'ar' ? 'السنة' : 'Sunnah', icon: BookOpen },
        { path: '/discover', label: lang === 'ar' ? 'المزيد' : 'More', icon: Grid },
    ];

    return (
        <nav className="floating-navbar-container">
            <div className="floating-navbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default FloatingNavbar;
