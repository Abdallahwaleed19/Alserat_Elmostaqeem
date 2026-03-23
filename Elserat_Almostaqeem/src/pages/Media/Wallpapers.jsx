import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Download, Image as ImageIcon } from 'lucide-react';
import './Wallpapers.css';

const WALLPAPERS = [
    {
        id: 'grand_mosque',
        titleAr: 'المسجد العظيم',
        titleEn: 'Grand Mosque',
        categoryAr: 'مساجد',
        categoryEn: 'Architecture',
        url: '/wallpapers/wp_mosque.png'
    },
    {
        id: 'islamic_geometric',
        titleAr: 'نقوش إسلامية مذهبة',
        titleEn: 'Golden Geometric',
        categoryAr: 'فن وتصميم',
        categoryEn: 'Islamic Art',
        url: '/wallpapers/wp_geometric.png'
    },
    {
        id: 'spiritual_lantern',
        titleAr: 'فانوس روحاني',
        titleEn: 'Spiritual Lantern',
        categoryAr: 'روحانيات',
        categoryEn: 'Atmosphere',
        url: '/wallpapers/wp_lantern.png'
    }
];

const Wallpapers = () => {
    const { lang } = useLanguage();

    const handleDownload = (url, title) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container animate-slide-down wallpapers-container" style={{ paddingTop: '2rem' }}>
            <div className="text-center mb-10">
                <ImageIcon size={48} className="text-primary mb-4 mx-auto" />
                <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'خلفيات إسلامية' : 'Islamic Wallpapers'}</h1>
                <p className="text-muted">{lang === 'ar' ? 'مجموعة من الخلفيات عالية الدقة لهاتفك.' : 'A colletion of high-quality wallpapers for your phone.'}</p>
            </div>

            <div className="wallpapers-grid">
                {WALLPAPERS.map((wp) => (
                    <div key={wp.id} className="wallpaper-card">
                        <div className="wallpaper-image-wrapper">
                            <img src={wp.url} alt={wp.titleEn} className="wallpaper-img" loading="lazy" />
                            <div className="wallpaper-overlay">
                                <div className="wallpaper-info">
                                    <div className="wallpaper-title">{lang === 'ar' ? wp.titleAr : wp.titleEn}</div>
                                    <div className="wallpaper-category">{lang === 'ar' ? wp.categoryAr : wp.categoryEn}</div>
                                </div>
                                <button 
                                    className="download-btn" 
                                    onClick={() => handleDownload(wp.url, wp.id)}
                                    title={lang === 'ar' ? 'تحميل' : 'Download'}
                                >
                                    <Download size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wallpapers;
