import React from 'react';
import { ArrowLeft, ArrowRight, Star, Moon, Cloud, Heart, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import '../Discover/Article.css';

const IsraMiraj = () => {
    const { lang } = useLanguage();
    const navigate = useNavigate();

    const sections = [
        {
            id: 'intro',
            icon: Star,
            titleAr: 'ما هي معجزة الإسراء والمعراج؟',
            titleEn: 'What is the Miracle of Isra and Mi\'raj?',
            contentAr: 'الإسراء والمعراج هي إحدى أعظم المعجزات التي أيد الله بها نبيه محمداً ﷺ. حدثت هذه الرحلة ليلاً لتسرية قلب النبي بعد "عام الحزن" الذي فقد فيه زوجته خديجة وعمه أبا طالب.',
            contentEn: 'Isra and Mi\'raj is one of the greatest miracles bestowed upon Prophet Muhammad ﷺ. This night journey occurred to comfort the Prophet\'s heart after the "Year of Sorrow" in which he lost his wife Khadijah and his uncle Abu Talib.'
        },
        {
            id: 'isra',
            icon: Moon,
            titleAr: 'رحلة الإسراء (إلى المسجد الأقصى)',
            titleEn: 'Al-Isra (The Journey to Al-Aqsa)',
            contentAr: 'تبدأ الرحلة بانتقال النبي ﷺ بصحبة جبريل عليه السلام على ظهر دابة تُسمى "البُراق" من المسجد الحرام بمكة إلى المسجد الأقصى بالقدس في جزء من الليل. وفي المسجد الأقصى، صلى النبي إماماً بجميع الأنبياء والمرسلين.',
            contentEn: 'The journey began when the Prophet ﷺ, accompanied by Jibreel (Gabriel), traveled on a heavenly mount called "Al-Buraq" from Al-Haram in Mecca to Al-Aqsa Mosque in Jerusalem in a fraction of a night. There, he led all the prophets in prayer.'
        },
        {
            id: 'miraj',
            icon: Cloud,
            titleAr: 'رحلة المعراج (إلى السماوات العُلى)',
            titleEn: 'Al-Mi\'raj (Ascension to the Heavens)',
            contentAr: 'بعد الإسراء، عُرج بالنبي ﷺ من بيت المقدس إلى السماوات السبع، حيث التقى بعدد من الأنبياء في كل سماء والتقى بإبراهيم وموسى وعيسى وغيرهم عليهم السلام، وصولاً إلى "سدرة المنتهى"، وهناك كلّمه الله عز وجل بغير حجاب.',
            contentEn: 'Following Al-Isra, the Prophet ﷺ ascended from Jerusalem through the seven heavens, meeting various prophets including Ibrahim, Musa, and Isa, until reaching "Sidrat al-Muntaha" (The Lote Tree of the Utmost Boundary), where he spoke directly to Allah.'
        },
        {
            id: 'prayers',
            icon: Heart,
            titleAr: 'هدية الصلاة (الصلوات الخمس)',
            titleEn: 'The Gift of Prayer (5 Daily Prayers)',
            contentAr: 'في هذه الليلة العظيمة، فُرضت الصلاة مباشرة من الله عز وجل على أمة محمد ﷺ، وكانت في البداية 50 صلاة، ثم خُففت بطلب من النبي ﷺ حتى أصبحت 5 صلوات في اليوم والليلة، بأجر 50 صلاة.',
            contentEn: 'On this monumental night, the daily prayers were ordained directly by Allah upon the Ummah. Initially 50 prayers, it was reduced at the Prophet\'s ﷺ request to 5 daily prayers, yet carrying the reward of fifty.'
        },
        {
            id: 'lessons',
            icon: BookOpen,
            titleAr: 'الدروس والعبر المستفادة',
            titleEn: 'Lessons and Reflections',
            contentAr: 'أظهرت الرحلة مكانة المسجد الأقصى، وأهمية الثبات على الحق رغم المحن، وأثبتت أن بعد العسر يسراً، وأن الصلاة هي معراج المؤمن اليومي لربه وملاذه الأول في كل ضيق.',
            contentEn: 'The journey highlights the significance of Al-Aqsa, the importance of steadfastness during trials, proves that hardship is followed by ease, and establishes that prayer is the believer\'s daily ascension and ultimate refuge.'
        }
    ];

    return (
        <div className="article-page animate-slide-down">
            <div className="article-hero" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)' }}>
                <div className="container relative z-10">
                    <button onClick={() => navigate(-1)} className="back-button">
                        {lang === 'ar' ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
                        <span>{lang === 'ar' ? 'عودة' : 'Back'}</span>
                    </button>
                    <h1>{lang === 'ar' ? 'رحلة الإسراء والمعراج' : 'The Journey of Isra and Mi\'raj'}</h1>
                    <p className="article-subtitle">
                        {lang === 'ar'
                            ? 'أعظم رحلة في تاريخ البشرية، من المسجد الحرام إلى المسجد الأقصى ثم إلى سدرة المنتهى.'
                            : 'The greatest journey in human history, from the Sacred Mosque to Al-Aqsa, then to Sidrat Al-Muntaha.'}
                    </p>
                </div>
                <div className="hero-decorations">
                    <Moon className="decor-icon moon1" size={120} />
                    <Star className="decor-icon star1" size={80} />
                    <Star className="decor-icon star2" size={40} />
                </div>
            </div>

            <div className="container article-content-wrapper">
                <div className="article-timeline">
                    {sections.map((sec, index) => {
                        const Icon = sec.icon;
                        return (
                            <div key={sec.id} className="timeline-item" style={{ animationDelay: `${index * 0.15}s` }}>
                                <div className="timeline-icon" style={{ backgroundColor: '#F59E0B' }}>
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

export default IsraMiraj;
