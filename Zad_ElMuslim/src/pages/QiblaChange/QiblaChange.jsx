import React from 'react';
import { ArrowLeft, ArrowRight, Compass, MapPin, Heart, BookOpen, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import '../Discover/Article.css';

const QiblaChange = () => {
    const { lang } = useLanguage();
    const navigate = useNavigate();

    const sections = [
        {
            id: 'intro',
            icon: Compass,
            titleAr: 'ما هو حدث تحويل القبلة؟',
            titleEn: 'What is the Change of Qibla?',
            contentAr: 'يعتبر تحويل القبلة من أعظم الأحداث في تاريخ الفقه الإسلامي وسيرة النبي ﷺ، حيث تحولت قبلة المسلمين في صلاتهم من المسجد الأقصى في بيت المقدس إلى الكعبة المشرفة في مكة المكرمة.',
            contentEn: 'The Change of Qibla is one of the most significant events in Islamic jurisprudence and the Prophet\'s biography, where the direction of prayer was changed from Al-Aqsa Mosque in Jerusalem to the honorable Kaaba in Mecca.'
        },
        {
            id: 'al-aqsa',
            icon: MapPin,
            titleAr: 'القبلة الأولى: بيت المقدس',
            titleEn: 'The First Qibla: Jerusalem',
            contentAr: 'بعد الهجرة إلى المدينة المنورة، ظل النبي ﷺ والمسلمون يصلون باتجاه المسجد الأقصى لمدة تقارب 16 أو 17 شهراً، لحكمة إلهية ولتأليف قلوب أهل الكتاب.',
            contentEn: 'Following the migration to Medina, the Prophet ﷺ and the Muslims prayed facing Al-Aqsa Mosque for about 16 or 17 months. This was by divine wisdom and to soften the hearts of the People of the Book.'
        },
        {
            id: 'longing',
            icon: Heart,
            titleAr: 'شوق النبي ﷺ لمكة',
            titleEn: 'The Prophet\'s Longing for Mecca',
            contentAr: 'كان قلب النبي ﷺ متعلقاً بالكعبة، قبلة أبيه إبراهيم عليه السلام. وكان يكثر من النظر إلى السماء منتظراً ومترقباً نزول الوحي بأمره بالتوجه نحو المسجد الحرام.',
            contentEn: 'The Prophet\'s ﷺ heart was deeply attached to the Kaaba, the Qibla of his forefather Ibrahim (Abraham). He would frequently turn his face towards the sky, anticipating revelation instructing him to face the Sacred Mosque.'
        },
        {
            id: 'revelation',
            icon: Sun,
            titleAr: 'الوحي الرباني بالاستجابة',
            titleEn: 'The Divine Response',
            contentAr: 'نزل الوحي بالاستجابة لأمنية النبي الآية الكريمة: "قَدْ نَرَىٰ تَقَلُّبَ وَجْهِكَ فِي السَّمَاءِ ۖ فَلَنُوَلِّيَنَّكَ قِبْلَةً تَرْضَاهَا ۚ فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ"، وذلك في منتصف شهر شعبان في السنة الثانية للهجرة.',
            contentEn: 'Revelation granted the Prophet\'s wish with the verse: "We have certainly seen the turning of your face toward the heaven, and We will surely turn you to a qiblah with which you will be pleased. So turn your face toward al-Masjid al-Haram." This happened in mid-Sha\'ban in the 2nd year of Hijrah.'
        },
        {
            id: 'lessons',
            icon: BookOpen,
            titleAr: 'الدروس والعبر',
            titleEn: 'Lessons and Reflections',
            contentAr: 'يبرز هذا الحدث مكانة النبي ﷺ عند ربه، وسرعة استجابة الصحابة وتسليمهم لأمر الله دون تردد حين غيروا اتجاههم وهم في منتصف الصلاة (في مسجد القبلتين)، كما يرسخ استقلالية الأمة الإسلامية وتميزها.',
            contentEn: 'This event highlights the Prophet\'s esteemed rank with Allah, the Companions\' immediate submission to Allah\'s command without hesitation (changing direction mid-prayer exactly in the Mosque of the Two Qiblas), and establishes the independence and distinct identity of the Muslim Ummah.'
        }
    ];

    return (
        <div className="article-page animate-slide-down">
            <div className="article-hero" style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)' }}>
                <div className="container relative z-10">
                    <button onClick={() => navigate(-1)} className="back-button">
                        {lang === 'ar' ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
                        <span>{lang === 'ar' ? 'عودة' : 'Back'}</span>
                    </button>
                    <h1>{lang === 'ar' ? 'قصة تحويل القبلة' : 'The Change of Qibla'}</h1>
                    <p className="article-subtitle">
                        {lang === 'ar'
                            ? 'الحدث العظيم الذي رسّخ استقلالية الأمة ولبّى رغبة قلب النبي ﷺ.'
                            : 'The monumental event that established the Ummah\'s independence and fulfilled the desire of the Prophet\'s heart.'}
                    </p>
                </div>
                <div className="hero-decorations">
                    <Compass className="decor-icon moon1" size={120} />
                    <Sun className="decor-icon star1" size={80} />
                    <Compass className="decor-icon star2" size={40} />
                </div>
            </div>

            <div className="container article-content-wrapper">
                <div className="article-timeline">
                    {sections.map((sec, index) => {
                        const Icon = sec.icon;
                        return (
                            <div key={sec.id} className="timeline-item" style={{ animationDelay: `${index * 0.15}s` }}>
                                <div className="timeline-icon" style={{ backgroundColor: '#0EA5E9' }}>
                                    <Icon size={24} color="white" />
                                </div>
                                <div className="timeline-content card glass-card">
                                    <h2>{lang === 'ar' ? sec.titleAr : sec.titleEn}</h2>
                                    <p>{lang === 'ar' ? sec.contentAr : sec.contentEn}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default QiblaChange;
