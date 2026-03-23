import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Download, Image as ImageIcon } from 'lucide-react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
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

    const handleDownload = async (url, title) => {
        if (Capacitor.isNativePlatform()) {
            try {
                // Request permissions first
                const perm = await Filesystem.checkPermissions();
                if (perm.publicStorage !== 'granted') {
                    const req = await Filesystem.requestPermissions();
                    if (req.publicStorage !== 'granted') {
                        alert(lang === 'ar' ? 'الرجاء منح صلاحيات التخزين لحفظ الصورة' : 'Please grant storage permission');
                        return;
                    }
                }

                alert(lang === 'ar' ? 'جاري التحميل...' : 'Downloading...');
                const response = await fetch(url);
                const blob = await response.blob();
                
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64data = reader.result;
                    const base64String = base64data.split(',')[1];
                    
                    try {
                        const result = await Filesystem.writeFile({
                            path: `ZadElMuslim_${title}.png`,
                            data: base64String,
                            directory: Directory.Documents,
                        });
                        alert((lang === 'ar' ? 'تم الحفظ في المستندات (Documents): ' : 'Saved to Documents: ') + result.uri);
                    } catch (e) {
                        alert(lang === 'ar' ? 'فشل الحفظ: ' + e.message : 'Save failed: ' + e.message);
                    }
                };
                reader.readAsDataURL(blob);
            } catch (err) {
                alert(lang === 'ar' ? 'حدث خطأ: ' + err.message : 'Error: ' + err.message);
            }
        } else {
            const link = document.createElement('a');
            link.href = url;
            link.download = `${title}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
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
