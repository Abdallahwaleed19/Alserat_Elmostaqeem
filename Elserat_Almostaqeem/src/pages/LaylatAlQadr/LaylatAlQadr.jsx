import React from 'react';
import { ArrowLeft, ArrowRight, Moon, Star, Sparkles, BookOpen, AlertCircle, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import '../Discover/Article.css';

const LaylatAlQadr = () => {
    const { lang } = useLanguage();
    const navigate = useNavigate();

    const sections = [
        {
            id: 'intro',
            icon: Moon,
            titleAr: 'ما هي ليلة القدر؟',
            titleEn: 'What is Laylat al-Qadr?',
            contentAr: 'ليلة القدر هي أفضل ليالي السنة، فيها أُنزل القرآن الكريم كاملاً من اللوح المحفوظ إلى السماء الدنيا. وسُميت بليلة القدر لعظم قدرها وشرفها الديني، ولأن الله يقدر فيها الأقوال والأفعال والأرزاق للعام القادم.',
            contentEn: 'Laylat al-Qadr (The Night of Decree) is the best night of the year, during which the Holy Quran was revealed from the Preserved Tablet to the lowest heaven. It is named so due to its immense value, and because Allah decrees the events and provisions for the coming year.'
        },
        {
            id: 'virtues',
            icon: Star,
            titleAr: 'فضائل ليلة القدر',
            titleEn: 'Virtues of the Night',
            contentAr: 'قال تعالى: "لَيْلَةُ الْقَدْرِ خَيْرٌ มِّنْ أَلْفِ شَهْرٍ"، أي أن العبادة فيها أفضل من عبادة أكثر من 83 سنة متواصلة خالية منها. وفيها تتنزل الملائكة وجبريل عليه السلام بالرحمة والبركة والسلام.',
            contentEn: 'Allah says: "The Night of Decree is better than a thousand months." Worship during this night is vastly more rewarding than 83 years of continuous worship. Angels, including Jibreel, descend bringing immense mercy, blessings, and peace.'
        },
        {
            id: 'signs',
            icon: Sparkles,
            titleAr: 'علامات ليلة القدر',
            titleEn: 'Signs of Laylat al-Qadr',
            contentAr: 'تكون في العشر الأواخر من رمضان، وفي الأوتار منها، ولكنها مخفية ليجتهد المؤمن في سائر الليالي. من علاماتها الصباحية: أن تطلع الشمس صبيحتها لا شعاع لها، حمراء ضعيفة. وفي ليلتها تكون معتدلة، لا حارة ولا باردة، تسكن فيها الرياح، وينشرح فيها صدر المؤمن.',
            contentEn: 'It occurs in the last 10 days of Ramadan, typically on odd nights. It is hidden so believers exert effort every night. Signs include: a tranquil, moderate night (neither hot nor cold), and the sun rising the following morning reddish and weak without rays.'
        },
        {
            id: 'dua',
            icon: Heart,
            titleAr: 'ماذا أدعو في ليلة القدر؟',
            titleEn: 'Recommended Supplication',
            contentAr: 'أرشد النبي ﷺ عائشة رضي الله عنها حين سألته ماذا تقول إذا وافقت ليلة القدر قائلًا: "قولي: اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي"، فهو أعظم دعاء ليلة القدر ويرتبط بغاية ما يتمناه العبد وهو عفو الله ومغفرته الشاملة.',
            contentEn: 'The Prophet ﷺ taught Aisha (RA) what to say if she encounters it: "Allahumma innaka \'afuwwun tuhibbul-\'afwa fa\'fu \'anni" (O Allah, You are Forgiving and love forgiveness, so forgive me). It is the greatest supplication, seeking Allah\'s ultimate pardon.'
        },
        {
            id: 'worship',
            icon: BookOpen,
            titleAr: 'كيف أُحيي ليلة القدر؟',
            titleEn: 'How to Observe It',
            contentAr: 'بقيام الليل، وقراءة القرآن بخشوع، وكثرة الدعاء والإستغفار، وإخراج الصدقات، وتجنب الخصام، والتوبة النصوح، واعتزال الملهيات عن ذكر الله واستثمار كل دقيقة من غروب شمسها حتى مطلع الفجر.',
            contentEn: 'By praying Qiyam al-Layl, reciting the Quran with reflection, abundant supplications and repentance, giving charity, avoiding disputes, sincere Tawbah, and isolating oneself from distractions to invest every minute from sunset to dawn.'
        }
    ];

    return (
        <div className="article-page animate-slide-down">
            <div className="article-hero" style={{ background: 'linear-gradient(135deg, #1B4332 0%, #064E3B 100%)' }}>
                <div className="container relative z-10">
                    <button onClick={() => navigate(-1)} className="back-button">
                        {lang === 'ar' ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
                        <span>{lang === 'ar' ? 'عودة' : 'Back'}</span>
                    </button>
                    <h1>{lang === 'ar' ? 'ليلة القدر' : 'Laylat al-Qadr'}</h1>
                    <p className="article-subtitle">
                        {lang === 'ar'
                            ? 'ليلة خيرٌ من ألف شهر، تتنزل فيها الملائكة ويُكتب فيها القدر.'
                            : 'A night better than a thousand months, where angels descend and destinies are decreed.'}
                    </p>
                </div>
                <div className="hero-decorations">
                    <Moon className="decor-icon moon1" size={120} />
                    <Sparkles className="decor-icon star1" size={80} />
                    <Star className="decor-icon star2" size={40} />
                </div>
            </div>

            <div className="container article-content-wrapper">
                <div className="article-timeline">
                    {sections.map((sec, index) => {
                        const Icon = sec.icon;
                        return (
                            <div key={sec.id} className="timeline-item" style={{ animationDelay: `${index * 0.15}s` }}>
                                <div className="timeline-icon" style={{ backgroundColor: '#059669' }}>
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

export default LaylatAlQadr;
