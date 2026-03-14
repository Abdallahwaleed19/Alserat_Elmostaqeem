import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2, XCircle, Star as AwardIcon } from 'lucide-react';
import './Quiz.css';

const QUESTION_BANK = {
    quran: [
        {
            question: "كم عد سور القرآن الكريم؟",
            options: ["114", "110", "120", "100"],
            correct: 0
        },
        {
            question: "ما هي أطول سورة في القرآن الكريم؟",
            options: ["آل عمران", "البقرة", "النساء", "المائدة"],
            correct: 1
        },
        {
            question: "في أي شهر نزل القرآن الكريم؟",
            options: ["شعبان", "رمضان", "رجب", "محرم"],
            correct: 1
        },
        {
            question: "ما هي أول سورة في المصحف؟",
            options: ["الفاتحة", "البقرة", "الناس", "الإخلاص"],
            correct: 0
        },
        {
            question: "ما هي السورة التي تعدل ثلث القرآن؟",
            options: ["سورة الإخلاص", "سورة الكوثر", "سورة الفلق", "سورة الناس"],
            correct: 0
        },
        {
            question: "ما هي أطول آية في القرآن الكريم؟",
            options: ["آية الكرسي", "آية الدين", "آية النور", "آية المداينة"],
            correct: 1
        },
        {
            question: "في أي سورة توجد آية الكرسي؟",
            options: ["سورة النساء", "سورة البقرة", "سورة آل عمران", "سورة النحل"],
            correct: 1
        },
        {
            question: "ما هي السورة التي تُسمى قلب القرآن؟",
            options: ["يس", "الرحمن", "الملك", "الكهف"],
            correct: 0
        },
        {
            question: "ما هي السورة التي تبدأ بـ (طه)؟",
            options: ["سورة الأنبياء", "سورة طه", "سورة مريم", "سورة الشعراء"],
            correct: 1
        },
        {
            question: "ما هي السورة التي ذُكر فيها اسم مريم صراحةً في عنوانها؟",
            options: ["آل عمران", "مريم", "النساء", "التحريم"],
            correct: 1
        },
        {
            question: "أي سورة من السور التالية سميت باسم حيوان؟",
            options: ["الحديد", "البقرة", "النور", "العنكبوت"],
            correct: 1
        },
        {
            question: "ما أول سورة نزلت من القرآن على النبي صلى الله عليه وسلم؟",
            options: ["المدثر", "الفاتحة", "اقرأ (العلق)", "الضحى"],
            correct: 2
        },
        {
            question: "ما عدد أجزاء القرآن الكريم؟",
            options: ["20 جزءًا", "25 جزءًا", "30 جزءًا", "35 جزءًا"],
            correct: 2
        },
        {
            question: "ما هو الاسم الآخر لسورة التوبة؟",
            options: ["الفاضحة", "النور", "الإخلاص", "الفتح"],
            correct: 0
        },
        {
            question: "أي سورة تُسمى أحيانًا بسورة القتال؟",
            options: ["سورة الأنفال", "سورة محمد", "سورة الصف", "سورة التوبة"],
            correct: 1
        },
        {
            question: "في أي سورة وردت آية (اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ)؟",
            options: ["النور", "الأنعام", "يوسف", "الإسراء"],
            correct: 0
        }
    ],
    seerah: [
        {
            question: "من هو أول من آمن من الرجال؟",
            options: ["عمر بن الخطاب", "علي بن أبي طالب", "أبو بكر الصديق", "عثمان بن عفان"],
            correct: 2
        },
        {
            question: "من هو خاتم الأنبياء والمرسلين؟",
            options: ["موسى عليه السلام", "عيسى عليه السلام", "محمد صلى الله عليه وسلم", "إبراهيم عليه السلام"],
            correct: 2
        },
        {
            question: "من هو أول الأنبياء؟",
            options: ["نوح عليه السلام", "آدم عليه السلام", "إبراهيم عليه السلام", "يوسف عليه السلام"],
            correct: 1
        },
        {
            question: "في أي مدينة وُلد النبي محمد صلى الله عليه وسلم؟",
            options: ["المدينة المنورة", "مكة المكرمة", "الطائف", "بيت المقدس"],
            correct: 1
        },
        {
            question: "ما اسم جد النبي صلى الله عليه وسلم الذي تكفّل به بعد وفاة جده؟",
            options: ["عبد الله", "عبد المطلب", "أبو طالب", "حمزة"],
            correct: 2
        },
        {
            question: "ما اسم أم المؤمنين أول زوجات النبي صلى الله عليه وسلم؟",
            options: ["عائشة رضي الله عنها", "حفصة رضي الله عنها", "خديجة رضي الله عنها", "أم سلمة رضي الله عنها"],
            correct: 2
        },
        {
            question: "في أي سنة هاجر النبي صلى الله عليه وسلم من مكة إلى المدينة؟",
            options: ["السنة الأولى للبعثة", "السنة الخامسة للبعثة", "السنة العاشرة للبعثة", "السنة الثالثة عشرة للبعثة"],
            correct: 3
        },
        {
            question: "ما أول غزوة غزاها النبي صلى الله عليه وسلم؟",
            options: ["غزوة بدر", "غزوة أحد", "غزوة تبوك", "غزوة الخندق"],
            correct: 0
        },
        {
            question: "من هو الصحابي الذي لُقّب بالصديق؟",
            options: ["عمر بن الخطاب", "عثمان بن عفان", "علي بن أبي طالب", "أبو بكر رضي الله عنه"],
            correct: 3
        },
        {
            question: "ما اسم ليلة الإسراء والمعراج التي عرج فيها بالنبي صلى الله عليه وسلم إلى السماء؟",
            options: ["ليلة القدر", "ليلة الجمعة", "ليلة النصف من شعبان", "ليلة الإسراء"],
            correct: 3
        },
        {
            question: "في أي شهر كانت غزوة بدر الكبرى؟",
            options: ["في رجب", "في رمضان", "في شوال", "في ذي القعدة"],
            correct: 1
        },
        {
            question: "من هو عم النبي صلى الله عليه وسلم الذي ناصر الدعوة ولم يسلم؟",
            options: ["العباس", "حمزة", "أبو طالب", "أبو لهب"],
            correct: 2
        },
        {
            question: "ما اسم القبيلة التي ينتمي إليها النبي صلى الله عليه وسلم؟",
            options: ["تميم", "هذيل", "قريش", "الأوس"],
            correct: 2
        },
        {
            question: "ما اسم اليوم الذي فتح فيه النبي صلى الله عليه وسلم مكة؟",
            options: ["يوم عرفة", "يوم الجمعة", "يوم الفتح", "يوم النحر"],
            correct: 2
        },
        {
            question: "كم كان عمر النبي صلى الله عليه وسلم عند البعثة؟",
            options: ["30 سنة", "35 سنة", "40 سنة", "45 سنة"],
            correct: 2
        }
    ],
    fiqh: [
        {
            question: "كم عدد أركان الإسلام؟",
            options: ["3", "4", "5", "6"],
            correct: 2
        },
        {
            question: "كم عدد أركان الإيمان؟",
            options: ["4", "5", "6", "7"],
            correct: 2
        },
        {
            question: "ما هي الصلاة التي لا ركوع فيها ولا سجود؟",
            options: ["صلاة الخوف", "صلاة الكسوف", "صلاة الجنازة", "صلاة العيد"],
            correct: 2
        },
        {
            question: "كم عدد الصلوات المفروضة في اليوم والليلة؟",
            options: ["ثلاث صلوات", "أربع صلوات", "خمس صلوات", "ست صلوات"],
            correct: 2
        },
        {
            question: "ما هو الركن الرابع من أركان الإسلام؟",
            options: ["الصلاة", "الزكاة", "الصوم", "الحج"],
            correct: 2
        },
        {
            question: "ما هو الركن الخامس من أركان الإسلام؟",
            options: ["الشهادة", "الزكاة", "الصوم", "الحج"],
            correct: 3
        },
        {
            question: "أي من التالي من سنن الفطرة؟",
            options: ["قص الشارب", "ترك الصلاة", "تأخير الزكاة", "قطع الأرحام"],
            correct: 0
        },
        {
            question: "إخراج زكاة المال يكون عند بلوغ النصاب ومرور؟",
            options: ["شهر", "حول (سنة هجرية)", "أسبوع", "يوم"],
            correct: 1
        },
        {
            question: "صيام رمضان يكون من؟",
            options: ["طلوع الفجر إلى غروب الشمس", "الظهر إلى العشاء", "العصر إلى الفجر", "المغرب إلى الفجر"],
            correct: 0
        },
        {
            question: "كم نصاب الزكاة في النقود يُقاس غالبًا على؟",
            options: ["نصاب الإبل", "نصاب الغنم", "نصاب الذهب أو الفضة", "نصاب الحبوب"],
            correct: 2
        },
        {
            question: "في أي شهر يجب صيام رمضان؟",
            options: ["شعبان", "رمضان", "رجب", "ذي الحجة"],
            correct: 1
        },
        {
            question: "من شروط وجوب الحج؟",
            options: ["المرض", "الاستطاعة", "السفر للعلم", "الصغر"],
            correct: 1
        },
        {
            question: "ما حكم ترك الصلاة عمدًا مع إنكار وجوبها؟",
            options: ["مكروه", "محرم معصية كبيرة", "كفر أكبر مخرج من الملة", "لا شيء عليه"],
            correct: 2
        },
        {
            question: "الطهارة من الحدث الأصغر تكون بـ؟",
            options: ["الغسل", "الوضوء", "التيمم فقط", "الاغتسال بالماء والملح"],
            correct: 1
        },
        {
            question: "ما أول ما يُحاسب عليه العبد يوم القيامة؟",
            options: ["الزكاة", "الصوم", "الصلاة", "الحج"],
            correct: 2
        }
    ]
};

const Quiz = () => {
    const { lang } = useLanguage();
    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0); // 0: start, 1: quiz, 2: result
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleStart = (categoryKey) => {
        const pool = QUESTION_BANK[categoryKey] || [];
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        const limit = Math.min(15, shuffled.length);
        setQuestions(shuffled.slice(0, limit));
        setSelectedCategory(categoryKey);
        setCurrentStep(1);
        setCurrentQuestion(0);
        setScore(0);
        setSelectedOption(null);
        setIsAnswered(false);
    };

    const handleOptionSelect = (index) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);
        if (index === questions[currentQuestion].correct) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setCurrentStep(2);
        }
    };

    const handleRestart = () => {
        setCurrentStep(0);
    };

    return (
        <div className="container animate-slide-down quiz-container" style={{ paddingTop: '2rem' }}>
            {currentStep === 0 && (
                <div className="quiz-card text-center">
                    <Sparkles size={64} className="text-primary mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">{lang === 'ar' ? 'اختبار المعلومات الإسلامية' : 'Islamic Knowledge Quiz'}</h1>
                    <p className="text-muted mb-8">
                        {lang === 'ar' 
                            ? 'اختر نوع الاختبار الذي ترغب فيه: قرآن، سيرة نبوية، أو فقه وأحكام.' 
                            : 'Choose the type of quiz you want: Quran, Seerah, or Fiqh.'}
                    </p>
                    <div className="options-grid">
                        <button
                            onClick={() => handleStart('quran')}
                            className="btn btn-primary w-full py-3 text-lg"
                            style={{ borderRadius: '100px' }}
                        >
                            {lang === 'ar' ? 'اختبار القرآن الكريم' : 'Quran Quiz'}
                        </button>
                        <button
                            onClick={() => handleStart('seerah')}
                            className="btn btn-primary w-full py-3 text-lg"
                            style={{ borderRadius: '100px' }}
                        >
                            {lang === 'ar' ? 'اختبار السيرة النبوية' : 'Seerah Quiz'}
                        </button>
                        <button
                            onClick={() => handleStart('fiqh')}
                            className="btn btn-primary w-full py-3 text-lg"
                            style={{ borderRadius: '100px' }}
                        >
                            {lang === 'ar' ? 'اختبار الفقه والأحكام' : 'Fiqh Quiz'}
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 1 && (
                <div className="quiz-card">
                    <div className="quiz-header">
                        <span className="text-sm font-bold text-primary">
                            {lang === 'ar' ? `السؤال ${currentQuestion + 1} من ${questions.length}` : `Question ${currentQuestion + 1} of ${questions.length}`}
                        </span>
                        <span className="badge">{lang === 'ar' ? 'نقاط:' : 'Score:'} {score}</span>
                    </div>

                    <div className="quiz-progress">
                        <div className="quiz-progress-bar" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
                    </div>

                    <div className="question-text">
                        {questions[currentQuestion].question}
                    </div>

                    <div className="options-grid">
                        {questions[currentQuestion].options.map((option, index) => {
                            let className = "option-btn";
                            if (isAnswered) {
                                if (index === questions[currentQuestion].correct) className += " correct";
                                else if (index === selectedOption) className += " wrong";
                                else className += " disabled";
                            } else if (selectedOption === index) {
                                className += " selected";
                            }

                            return (
                                <button
                                    key={index}
                                    className={className}
                                    onClick={() => handleOptionSelect(index)}
                                    disabled={isAnswered}
                                >
                                    {option}
                                    {isAnswered && index === questions[currentQuestion].correct && (
                                        <CheckCircle2 size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                                    )}
                                    {isAnswered && index === selectedOption && index !== questions[currentQuestion].correct && (
                                        <XCircle size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {isAnswered && (
                        <div className="quiz-footer">
                            <button onClick={handleNext} className="btn btn-primary flex items-center gap-2" style={{ borderRadius: '100px', padding: '0.75rem 2rem' }}>
                                {currentQuestion === questions.length - 1 ? (lang === 'ar' ? 'النتيجة' : 'Result') : (lang === 'ar' ? 'التالي' : 'Next')}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {currentStep === 2 && (
                <div className="quiz-card result-card">
                    <AwardIcon size={64} className="text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">{lang === 'ar' ? 'انتهى الاختبار!' : 'Quiz Finished!'}</h2>
                    
                    <div className="score-circle">
                        <div className="score-value">{score}/{questions.length}</div>
                        <div className="score-label">{lang === 'ar' ? 'إجمالي النقاط' : 'Total Score'}</div>
                    </div>

                    <p className="text-muted mb-8">
                        {score === questions.length 
                            ? (lang === 'ar' ? 'أحسنت! معلوماتك ممتازة.' : 'Well done! Your knowledge is excellent.')
                            : (lang === 'ar' ? 'عمل جيد، حاول تحسين معلوماتك أكثر.' : 'Good job, keep learning more.')}
                        <br />
                        {lang === 'ar'
                            ? 'يمكنك إعادة الاختبار لتحصل على أسئلة جديدة عشوائية في كل مرة.'
                            : 'You can retake the quiz to get a new random set of questions each time.'}
                    </p>

                    <button onClick={handleRestart} className="btn btn-primary w-full py-4 text-lg flex items-center justify-center gap-2" style={{ borderRadius: '100px' }}>
                        <RotateCcw size={20} />
                        {lang === 'ar' ? 'إعادة الاختبار' : 'Restart Quiz'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
