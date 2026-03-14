import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import PillarDetail from '../../components/pillars/PillarDetail';
import './Pillars.css';

const pillarsData = [
    {
        id: 'shahada',
        title: 'الشهادتان', titleEn: 'The Shahada (Faith)',
        desc: 'الإقرار بأنه لا إله إلا الله وأن محمداً رسول الله.', descEn: 'Declaration of faith in the oneness of Allah and the messengership of Muhammad ﷺ.',
        icon: '☝️',
        details: {
            meaning: 'الشهادتان هما مفتاح الدخول في الإسلام، وتعنيان الإقرار بالقلب والنطق باللسان بأن الله وحده المستحق للعبادة، وأن محمداً صلى الله عليه وسلم هو خاتم النبيين والمرسلين للناس كافة.',
            meaningEn: 'The Shahada is the key to entering Islam. It means attesting with the heart and testifying with the tongue that Allah alone is worthy of worship, and that Muhammad ﷺ is the final prophet and messenger to all mankind.',
            evidence: 'شَهِدَ اللَّهُ أَنَّهُ لا إِلَهَ إِلا هُوَ وَالْمَلائِكَةُ وَأُولُو الْعِلْمِ قَائِماً بِالْقِسْطِ',
            evidenceSource: 'آل عمران: 18',
            evidenceSourceEn: 'Al Imran: 18',
            steps: ['اليقين الجازم بمعناهما', 'العمل بمقتضاهما ظاهراً وباطناً', 'محبتهما ومحبة أهلهما'],
            stepsEn: ['Firm conviction in their meaning', 'Acting upon their requirements outwardly and inwardly', 'Loving them and loving those who uphold them']
        }
    },
    {
        id: 'salah',
        title: 'الصلاة', titleEn: 'Salah (Prayer)',
        desc: 'إقام الصلاة خمس مرات في اليوم والليلة.', descEn: 'Establishing the five daily prayers.',
        icon: '🕌',
        details: {
            meaning: 'الصلاة هي عماد الدين والصلة المباشرة بين العبد وربه. فُرضت ليلة الإسراء والمعراج في السماء مما يدل على عظم منزلتها. تأدية الصلوات الخمس في أوقاتها من أحب الأعمال إلى الله.',
            meaningEn: 'Salah is the pillar of the religion and the direct connection between a servant and their Lord. It was obligated during the Night Journey (Isra and Mi\'raj) in heaven, showing its immense status.',
            evidence: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا',
            evidenceSource: 'النساء: 103',
            evidenceSourceEn: 'An-Nisa: 103',
            steps: ['الوضوء الصحيح', 'استقبال القبلة', 'أداء الصلوات الخمس (الفجر، الظهر، العصر، المغرب، العشاء) في المسجد للرجال وفي البيت للنساء بخشوع وطمأنينة'],
            stepsEn: ['Proper Wudu (Ablution)', 'Facing the Qibla', 'Praying the five daily prayers with Khushu (humility) and tranquility']
        }
    },
    {
        id: 'zakah',
        title: 'الزكاة', titleEn: 'Zakah (Charity)',
        desc: 'إيتاء الزكاة لمستحقيها من المال البالغ للنصاب.', descEn: 'Giving charity to those in need from qualifying wealth.',
        icon: '💰',
        details: {
            meaning: 'الزكاة طهرة للمال والنفس، ومواساة للفقراء والمحتاجين. وهي حق معلوم في أموال الأغنياء لمن حددهم الشرع من الأصناف الثمانية.',
            meaningEn: 'Zakah is an obligatory purification of wealth and soul, and a support for the poor and needy. It is a recognized right in the wealth of the rich for the eight categories specified in Islamic law.',
            evidence: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ',
            evidenceSource: 'البقرة: 43',
            evidenceSourceEn: 'Al-Baqarah: 43',
            steps: ['بلوغ المال النصاب', 'حولان الحول القمري على المال', 'إخراج 2.5% من المال المدخر وتوزيعه على مستحقيه'],
            stepsEn: ['Wealth reaching the Nisab (minimum threshold)', 'A full lunar year passing over the wealth', 'Paying 2.5% of saved wealth and distributing it to the eligible']
        }
    },
    {
        id: 'sawm',
        title: 'الصوم', titleEn: 'Sawm (Fasting)',
        desc: 'صيام شهر رمضان المبارك.', descEn: 'Fasting during the blessed month of Ramadan.',
        icon: '🌙',
        details: {
            meaning: 'الصيام هو الإمساك عن المفطرات من طلوع الفجر إلى غروب الشمس بنية التعبد. وهو شهر تُصفد فيه الشياطين وتُفتح أبواب الجنان وتُضاعف فيه الحسنات.',
            meaningEn: 'Fasting is refraining from food, drink, and intimacy from dawn to sunset with the intention of worship. It is a month where devils are chained, gates of Paradise opened, and good deeds multiplied.',
            evidence: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ ۚ فَمَن شَهِدَ مِنكُمُ الشَّهْرَ فَلْيَصُمْهُ',
            evidenceSource: 'البقرة: 185',
            evidenceSourceEn: 'Al-Baqarah: 185',
            steps: ['النية من الليل', 'الإمساك عن الطعام والشراب والشهوات', 'حفظ الجوارح عن المعاصي كالكذب والغيبة'],
            stepsEn: ['Making intention at night', 'Refraining from food, drink, and desires during the day', 'Guarding limbs and tongue from sins like lying and backbiting']
        }
    },
    {
        id: 'hajj',
        title: 'الحج', titleEn: 'Hajj (Pilgrimage)',
        desc: 'حج بيت الله الحرام لمن استطاع إليه سبيلاً.', descEn: 'Pilgrimage to the House of Allah for those who are able.',
        icon: '🕋',
        details: {
            meaning: 'الحج هو القصد إلى مكة المكرمة لأداء مناسك مخصوصة في وقت مخصوص. وهو فرض العمر مرة واحدة لمن ملك الزاد والراحلة والصحة.',
            meaningEn: 'Hajj is making the journey to Makkah to perform specific rituals during a specific time. It is an obligation once in a lifetime for those who possess the physical and financial ability.',
            evidence: 'وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا',
            evidenceSource: 'آل عمران: 97',
            evidenceSourceEn: 'Al Imran: 97',
            steps: ['الإحرام في الميقات', 'الوقوف بعرفة (ركن الحج الأعظم)', 'طواف الإفاضة والسعي بين الصفا والمروة'],
            stepsEn: ['Ihram from the Miqat', 'Standing at Arafah (the greatest pillar of Hajj)', 'Tawaf Al-Ifadah and Sa\'i between Safa and Marwah']
        }
    }
];

const Pillars = () => {
    const { lang } = useLanguage();
    const [selectedPillar, setSelectedPillar] = useState(null);

    if (selectedPillar) {
        return (
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <PillarDetail pillar={selectedPillar} onClose={() => setSelectedPillar(null)} />
            </div>
        );
    }

    return (
        <div className="pillars-page animate-slide-down">
            <div className="pillars-hero card card-glass">
                <div className="pillars-hero-text">
                    <h1 className="pillars-title">
                        {lang === 'ar' ? 'أركان الإسلام' : 'Pillars of Islam'}
                    </h1>
                    <p className="pillars-sub">
                        {lang === 'ar'
                            ? 'تعرّف على أركان الإسلام الخمسة ومعانيها بإيجاز، ثم اضغط على أي ركن للتفاصيل.'
                            : 'Learn the five pillars of Islam at a glance and tap any pillar to see more details.'}
                    </p>
                </div>
            </div>

            <div className="pillars-list">
                {pillarsData.map((pillar, index) => (
                    <button
                        key={pillar.id}
                        type="button"
                        className="pillar-card"
                        onClick={() => setSelectedPillar(pillar)}
                    >
                        <div className="pillar-icon-wrapper">
                            <span className="pillar-step-number">{index + 1}</span>
                            <span className="pillar-emoji">{pillar.icon}</span>
                        </div>
                        <div className="pillar-text">
                            <h2 className="pillar-title">
                                {lang === 'ar' ? pillar.title : pillar.titleEn}
                            </h2>
                            <p className="pillar-desc">
                                {lang === 'ar' ? pillar.desc : pillar.descEn}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Pillars;
