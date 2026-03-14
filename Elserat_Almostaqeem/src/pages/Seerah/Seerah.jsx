import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Shield, ChevronDown, ChevronUp, MapPin, Calendar, Star } from 'lucide-react';
import './Seerah.css';

// Seerah Data (Bilingual)
const timelineStages = [
    {
        id: 'birth',
        title: 'الميلاد والنشأة', titleEn: 'Birth & Childhood',
        icon: <Star size={24} />,
        period: '570 م', periodEn: '570 CE',
        desc: 'ولد النبي محمد ﷺ في عام الفيل بمكة يتيم الأب، ثم توفيت أمه آمنة بنت وهب وهو في السادسة من عمره. تربى في بيت جده عبد المطلب ثم عند عمه أبي طالب، واشتهر بين الناس بالصدق والأمانة ولقبوه بالصادق الأمين.',
        descEn: 'The Prophet Muhammad ﷺ was born in the Year of the Elephant in Makkah as an orphan to his father. His mother Aminah died when he was six. He was raised by his grandfather Abdul-Muttalib and later his uncle Abu Talib. He became known among his people as “Al-Sadiq Al-Amin” (the truthful and trustworthy).'
    },
    {
        id: 'revelation',
        title: 'البعثة والوحي', titleEn: 'Revelation',
        icon: <BookOpen size={24} />,
        period: '610 م', periodEn: '610 CE',
        desc: 'اعتاد النبي ﷺ الخلوة والتعبد في غار حراء، وهناك نزل عليه جبريل لأول مرة بسورة العلق وهو في الأربعين من عمره. استمرت الدعوة سرًا في مكة نحو ثلاث سنوات، ثم جهر بالدعوة فاشتد أذى قريش بالمؤمنين.',
        descEn: 'The Prophet ﷺ would seclude himself in the Cave of Hira for worship until Jibril came with the first revelation (Surah Al-‘Alaq) when he was forty. The call to Islam remained secret in Makkah for about three years, then it was made public, and Quraysh intensified their persecution of the believers.'
    },
    {
        id: 'migration',
        title: 'الهجرة إلى المدينة', titleEn: 'Migration to Madinah',
        icon: <MapPin size={24} />,
        period: '622 م (1 هـ)', periodEn: '622 CE (1 AH)',
        desc: 'بعد سنوات من الأذى والمقاطعة، أُذن للنبي ﷺ بالهجرة إلى يثرب حيث بايعه الأنصار على النصرة. خرج مع أبي بكر الصديق رضي الله عنه، واختبأ في غار ثور أيامًا ثم واصل السير حتى وصل المدينة فاستقبلته بفرح عظيم، وبنى هناك المسجد النبوي والمؤاخاة بين المهاجرين والأنصار.',
        descEn: 'After years of persecution and a harsh boycott, the Prophet ﷺ was given permission to migrate to Yathrib, whose people (the Ansar) pledged to support him. He left with Abu Bakr, stayed in the Cave of Thawr for several days, then continued the journey until reaching Madinah where he was warmly welcomed. He built the Prophet’s Mosque and established brotherhood between the Migrants and the Helpers.'
    },
    {
        id: 'madinah',
        title: 'تأسيس الدولة في المدينة', titleEn: 'Establishing the State',
        icon: <Calendar size={24} />,
        period: '1 - 10 هـ', periodEn: '1 - 10 AH',
        desc: 'وضع النبي ﷺ وثيقة المدينة التي نظمت العلاقة بين المسلمين واليهود وغيرهم، وأرست مبدأ المواطنة والعدل. في هذه الفترة شُرعت معظم العبادات كالصلاة والزكاة والصيام والحج، وقام النبي ﷺ بتربية جيل الصحابة على الإيمان والأخلاق والجهاد في سبيل الله.',
        descEn: 'The Prophet ﷺ drafted the Constitution of Madinah, regulating relations between Muslims, Jews, and other communities, and establishing principles of justice and shared citizenship. During this period most major acts of worship—prayer, zakah, fasting, and Hajj—were legislated, and the Prophet ﷺ nurtured a generation of companions grounded in faith, character, and striving in the path of Allah.'
    },
    {
        id: 'passing',
        title: 'حجّة الوداع ووفاة النبي ﷺ', titleEn: 'Farewell Hajj & Passing of the Prophet ﷺ',
        icon: <Calendar size={24} />,
        period: '10 - 11 هـ', periodEn: '10 - 11 AH',
        desc: 'أدّى النبي ﷺ حجّة الوداع في السنة العاشرة للهجرة، وخطب في الناس خطبته الجامعة التي قرر فيها حرمة الدماء والأموال والأعراض، ووصّى بالنساء والتمسك بكتاب الله وسنته. بعد عودته إلى المدينة بأشهر، مرض ﷺ مرضه الأخير، وتوفي يوم الاثنين 12 ربيع الأول في بيت عائشة رضي الله عنها ورأسه على صدرها. صُلِّي عليه ثم دُفن في الحجرة نفسها إلى جوار المسجد النبوي، وبوفاته انقطعت النبوة وبقيت رسالته حيّة في قلوب المؤمنين.',
        descEn: 'In the tenth year after Hijrah, the Prophet ﷺ performed his Farewell Hajj and delivered a comprehensive sermon in which he emphasized the sanctity of life, wealth, and honor, advised kind treatment of women, and urged adherence to the Book of Allah and his Sunnah. A few months after returning to Madinah, he fell ill and passed away on Monday, 12th of Rabi‘ al-Awwal, in the room of ‘Aishah with his head resting on her chest. He was prayed over and buried there beside the Prophet’s Mosque. With his passing, prophethood came to an end, while his message remains alive in the hearts of the believers.'
    }
];

const ghazawat = [
    {
        year: '2 هـ',
        yearEn: '2 AH',
        name: 'غزوة بدر الكبرى',
        nameEn: 'Battle of Badr',
        desc: 'أول معركة فاصلة بين المسلمين والمشركين، خرج النبي ﷺ لاعتراض قافلة قريش فانقلب الأمر إلى مواجهة عسكرية.',
        descEn:
            'The first decisive battle between Muslims and Quraysh. The Prophet ﷺ initially set out to intercept a caravan, but circumstances led to a full-scale battle.',
        detailsAr: [
            'كان عدد المسلمين قرابة ٣١٣ رجلاً مقابل ما يزيد على ألف من قريش مزودين بالسلاح والخيول.',
            'نصر الله المؤمنين رغم قلة عددهم، وقُتل من صناديد قريش أبو جهل وأمية بن خلف وغيرهما.',
            'أثبتت بدر أن قوة الإيمان والطاعة لله ورسوله تغلب كثرة العدد والعدة.'
        ],
        detailsEn: [
            'Muslims numbered around 313 men, facing over 1000 Quraysh fighters equipped with cavalry and arms.',
            'Allah granted victory to the believers; several key Quraysh leaders such as Abu Jahl and Umayyah ibn Khalaf were killed.',
            'Badr showed that faith, discipline, and obedience to the Prophet ﷺ can overcome numerical superiority.'
        ]
    },
    {
        year: '3 هـ',
        yearEn: '3 AH',
        name: 'غزوة أحد',
        nameEn: 'Battle of Uhud',
        desc: 'خرج المسلمون للدفاع عن المدينة بعد أن أرادت قريش الثأر لهزيمتها في بدر.',
        descEn:
            'Muslims went out to defend Madinah when Quraysh marched to avenge their defeat at Badr.',
        detailsAr: [
            'وضع النبي ﷺ الرماة على جبل عينين وأمرهم بعدم ترك مواقعهم مهما كانت نتيجة القتال.',
            'عندما رأى بعض الرماة الغنائم تركوا أماكنهم، فالتف خالد بن الوليد رضي الله عنه بالمشركين وضربوا المسلمين من الخلف.',
            'أصيب كثير من الصحابة واستشهد حمزة بن عبد المطلب رضي الله عنه، وتعلم المسلمون خطورة مخالفة أوامر القيادة.'
        ],
        detailsEn: [
            'The Prophet ﷺ stationed archers on Mount Aynayn and strictly ordered them not to leave their posts.',
            'When some archers left to collect spoils, Khalid ibn al-Walid (then still with Quraysh) led a cavalry charge from behind.',
            'Many companions were wounded, including the Prophet ﷺ himself, and Hamzah was martyred. Muslims learned the consequences of disobeying clear commands.'
        ]
    },
    {
        year: '5 هـ',
        yearEn: '5 AH',
        name: 'غزوة الخندق (الأحزاب)',
        nameEn: 'Battle of the Trench',
        desc: 'تحزبت قبائل العرب واليهود لحصار المدينة في أكبر تحالف معادٍ للمسلمين.',
        descEn:
            'Arab tribes and Jewish factions formed a large confederation to besiege Madinah in the largest coalition against the Muslims.',
        detailsAr: [
            'أشار سلمان الفارسي رضي الله عنه بحفر خندق يحول دون اقتحام الخيل والرجال، وهي فكرة لم تكن معروفة للعرب من قبل.',
            'اشتد الخوف والجوع على المسلمين، لكن ثباتهم وإيمانهم كان سببًا في أن صرف الله عنهم الأحزاب بريح وجند لم يروهم.',
            'انتهت المعركة دون مواجهة مباشرة كبيرة، لكنها أنهت خطر قريش العسكري على المدينة.'
        ],
        detailsEn: [
            'Salman al-Farsi suggested digging a trench around the exposed side of Madinah, a tactic unfamiliar to the Arabs.',
            'Muslims faced intense fear and hunger, yet their patience and trust in Allah remained firm.',
            'Allah sent a violent wind and discord among the confederates, leading them to withdraw without major direct combat. The military threat of Quraysh was effectively broken.'
        ]
    },
    {
        year: '6 هـ',
        yearEn: '6 AH',
        name: 'صلح الحديبية',
        nameEn: 'Treaty of Hudaybiyyah',
        desc: 'خرج النبي ﷺ مع الصحابة مُحرِمين للعمرة، فمنعتهم قريش عند الحديبية فعُقدت معاهدة سلام.',
        descEn:
            'The Prophet ﷺ and his companions set out in ihram to perform Umrah, but Quraysh blocked them at Hudaybiyyah, leading to a peace treaty.',
        detailsAr: [
            'تضمّن الصلح بنودًا ظاهِرُها في صالح قريش، كرجوع المسلمين ذلك العام دون عمرة ومنع من يأتي مسلمًا من قريش إلى المدينة.',
            'رغم الاعتراضات، قبل النبي ﷺ الصلح لأنه يحقق مصلحة عليا للدعوة ويوقف الحرب مؤقتًا.',
            'في ظل الهدنة دخل الناس في الإسلام أفواجًا، وكان الصلح تمهيدًا لفتح مكة، ولذلك سماه الله \"فَتْحًا مُّبِينًا\".'
        ],
        detailsEn: [
            'The treaty included terms that outwardly seemed in Quraysh’s favor, such as Muslims returning without Umrah that year and certain return clauses.',
            'The Prophet ﷺ accepted the terms because they secured a crucial strategic pause and opened doors for da‘wah.',
            'During the truce, many people embraced Islam, and the treaty paved the way for the Conquest of Makkah — hence it was called a “clear victory”.'
        ]
    },
    {
        year: '8 هـ',
        yearEn: '8 AH',
        name: 'فتح مكة',
        nameEn: 'Conquest of Makkah',
        desc: 'نقضت قريش العهد مع المسلمين، فسار النبي ﷺ بجيش عظيم لاستعادة مكة من غير إراقة دماء تُذكر.',
        descEn:
            'When Quraysh violated the treaty, the Prophet ﷺ marched with a large army to reclaim Makkah with minimal bloodshed.',
        detailsAr: [
            'دخل النبي ﷺ مكة في عشرة آلاف من الصحابة، وأمرهم بعدم القتال إلا عند الضرورة القصوى.',
            'طاف بالكعبة وحطم الأصنام وهو يتلو \"جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ\".',
            'أعلن عفوًا عامًا عن أهل مكة قائلاً \"اذهبوا فأنتم الطلقاء\" فدخل كثير منهم في الإسلام عن قناعة.'
        ],
        detailsEn: [
            'The Prophet ﷺ entered Makkah with around ten thousand companions, instructing them to avoid fighting unless forced.',
            'He circumambulated the Ka‘bah and destroyed the idols while reciting “Truth has come and falsehood has vanished”.',
            'He declared a general amnesty, saying “Go, for you are free,” which deeply touched the people of Makkah and led many to accept Islam.'
        ]
    },
    {
        year: '9 هـ',
        yearEn: '9 AH',
        name: 'غزوة تبوك',
        nameEn: 'Battle of Tabuk',
        desc: 'آخر غزوة قادها النبي ﷺ في حياته، خرج فيها لتهييب الروم وحلفائهم في شمال الجزيرة.',
        descEn:
            'The final expedition personally led by the Prophet ﷺ, aimed at deterring the Byzantines and their allies in the north.',
        detailsAr: [
            'كانت في حر شديد ومسافة طويلة، فسميت \"ساعة العسرة\"، وتبرع الصحابة بأموالهم لتجهيز الجيش.',
            'وصل الجيش إلى تبوك دون أن يلقى جيوش الروم، فكان مجرد خروجهم إظهارًا لقوة الدولة الإسلامية.',
            'كشفت الغزوة أحوال المنافقين وتخلّفهم، وبيّن القرآن صفاتهم في سورتي التوبة وغيرها.'
        ],
        detailsEn: [
            'The expedition occurred in extreme heat over a long distance, known as the “Hour of Difficulty”, and many companions donated generously to equip the army.',
            'The Muslims reached Tabuk without engaging the Byzantine army; their mere arrival demonstrated the strength of the Islamic state.',
            'The event exposed the attitudes of the hypocrites who stayed behind, and the Qur’an described their traits in Surah At-Tawbah and elsewhere.'
        ]
    }
];

const Seerah = () => {
    const { lang } = useLanguage();
    const [openStage, setOpenStage] = useState('birth');

    return (
        <div className="container animate-slide-down" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-primary mb-2">{lang === 'ar' ? 'السيرة النبوية' : 'Prophetic Seerah'}</h1>
                <p className="text-muted max-w-2xl mx-auto leading-loose">
                    {lang === 'ar'
                        ? 'رحلة عبر المحطات الرئيسية في حياة أعظم إنسان وُلد على وجه الأرض، محمد ﷺ، منذ ولادته وحتى استقرار دعوة التوحيد.'
                        : 'A journey through the key milestones in the life of the greatest human being, Muhammad ﷺ, from birth to the establishment of Tawhid.'}
                </p>
            </div>

            {/* Timeline Stages */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span style={{ width: '4px', height: '24px', backgroundColor: 'var(--color-primary)', display: 'inline-block', borderRadius: '4px' }}></span>
                    {lang === 'ar' ? 'مراحل السيرة' : 'Biography Stages'}
                </h2>

                <div className="seerah-stages">
                    {timelineStages.map(stage => {
                        const isOpen = openStage === stage.id;
                        return (
                            <div
                                key={stage.id}
                                className={`card seerah-stage-card ${isOpen ? 'open' : ''}`}
                            >
                                <button
                                    className="w-full text-start seerah-stage-header"
                                    onClick={() => setOpenStage(isOpen ? null : stage.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`seerah-stage-icon ${isOpen ? 'active' : ''}`}>
                                            {stage.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg m-0 text-foreground">{lang === 'ar' ? stage.title : stage.titleEn}</h3>
                                            <span className="text-sm text-muted">{lang === 'ar' ? stage.period : stage.periodEn}</span>
                                        </div>
                                    </div>
                                    {isOpen ? <ChevronUp className="text-muted" /> : <ChevronDown className="text-muted" />}
                                </button>

                                {isOpen && (
                                    <div className="seerah-stage-body animate-slide-down">
                                        {lang === 'ar' ? stage.desc : stage.descEn}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Ghazawat (Battles) */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span style={{ width: '4px', height: '24px', backgroundColor: 'var(--color-primary)', display: 'inline-block', borderRadius: '4px' }}></span>
                    {lang === 'ar' ? 'أبرز الغزوات (التسلسل الزمني)' : 'Major Battles (Timeline)'}
                </h2>

                <div className="card p-6 border-l-4 border-l-primary relative">
                    <div className="absolute top-0 bottom-0 left-[22px] w-[2px] bg-border z-0 hidden sm:block"></div>

                    <div className="flex flex-col gap-8 relative z-10">
                        {ghazawat.map((ghazwa, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-4 sm:gap-6 group">
                                <div className="flex items-center sm:items-start gap-4 sm:w-1/4">
                                    <div className="w-10 h-10 rounded-full bg-surface-hover border-2 border-primary flex items-center justify-center text-primary z-10 transition group-hover:bg-primary group-hover:text-white">
                                        <Shield size={20} />
                                    </div>
                                    <div className="font-bold text-lg text-primary pt-1 shrink-0">{lang === 'ar' ? ghazwa.year : ghazwa.yearEn}</div>
                                </div>
                                <div className="sm:w-3/4 pb-4 border-b border-border last:border-0 pl-14 sm:pl-0">
                                    <h3 className="font-bold text-xl mb-2">{lang === 'ar' ? ghazwa.name : ghazwa.nameEn}</h3>
                                    <p className="text-muted leading-relaxed mb-2">
                                        {lang === 'ar' ? ghazwa.desc : ghazwa.descEn}
                                    </p>
                                    <ul className="seerah-battle-list">
                                        {(lang === 'ar' ? ghazwa.detailsAr : ghazwa.detailsEn).map(
                                            (item, i) => (
                                                <li key={i}>{item}</li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Seerah;
