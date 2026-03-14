import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, ArrowRight, Check, Award, BookOpen, Clock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getEgyptDateString } from '../../utils/egyptTime';
import './Tracker.css';

const DEFAULT_TASKS = [
    { id: 'fajr', labelAr: 'صلاة الفجر', labelEn: 'Fajr Prayer', category: 'prayer', points: 10 },
    { id: 'dhuhr', labelAr: 'صلاة الظهر', labelEn: 'Dhuhr Prayer', category: 'prayer', points: 10 },
    { id: 'asr', labelAr: 'صلاة العصر', labelEn: 'Asr Prayer', category: 'prayer', points: 10 },
    { id: 'maghrib', labelAr: 'صلاة المغرب', labelEn: 'Maghrib Prayer', category: 'prayer', points: 10 },
    { id: 'isha', labelAr: 'صلاة العشاء', labelEn: 'Isha Prayer', category: 'prayer', points: 10 },
    { id: 'quran', labelAr: 'تلاوة ورد القرآن', labelEn: 'Read Quran Portion', category: 'quran', points: 20 },
    { id: 'adhkar_m', labelAr: 'أذكار الصباح', labelEn: 'Morning Adhkar', category: 'adhkar', points: 15 },
    { id: 'adhkar_e', labelAr: 'أذكار المساء', labelEn: 'Evening Adhkar', category: 'adhkar', points: 15 },
    { id: 'sunnah', labelAr: 'السنن والرواتب', labelEn: 'Sunnah Prayers', category: 'sunnah', points: 20 }
];

const WorshipTracker = () => {
    const { lang } = useLanguage();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState({});
    const [totalPoints, setTotalPoints] = useState(0);
    const dateKey = getEgyptDateString();

    useEffect(() => {
        const loadData = () => {
            const storedDate = localStorage.getItem(`zad_tracker_${dateKey}`);
            if (storedDate) {
                try {
                    setTasks(JSON.parse(storedDate));
                } catch (e) {
                    setTasks({});
                }
            } else {
                setTasks({});
            }

            const storedPoints = localStorage.getItem('zad_tracker_total_points');
            if (storedPoints) {
                setTotalPoints(parseInt(storedPoints, 10));
            }
        };
        loadData();
    }, [dateKey]);

    const toggleTask = (task) => {
        const isCompleted = !!tasks[task.id];
        const newTasks = { ...tasks, [task.id]: !isCompleted };
        setTasks(newTasks);
        localStorage.setItem(`zad_tracker_${dateKey}`, JSON.stringify(newTasks));

        // Update global points
        const pointChange = isCompleted ? -task.points : task.points;
        const newTotal = Math.max(0, totalPoints + pointChange);
        setTotalPoints(newTotal);
        localStorage.setItem('zad_tracker_total_points', newTotal.toString());

        // Also track total tasks completed for achievements
        if (!isCompleted) {
            const totalTasksEver = parseInt(localStorage.getItem('zad_tracker_total_tasks') || '0', 10) + 1;
            localStorage.setItem('zad_tracker_total_tasks', totalTasksEver.toString());
            
            // Track specific categories for specific achievements (e.g., total prayers)
            if (task.category === 'prayer') {
                const totalPrayers = parseInt(localStorage.getItem('zad_tracker_total_prayers') || '0', 10) + 1;
                localStorage.setItem('zad_tracker_total_prayers', totalPrayers.toString());
            }

            if (navigator.vibrate) navigator.vibrate(20);
        }
    };

    const completedToday = Object.values(tasks).filter(Boolean).length;
    const progressToday = Math.round((completedToday / DEFAULT_TASKS.length) * 100);

    const renderCategory = (category, titleAr, titleEn, IconStr) => {
        const catTasks = DEFAULT_TASKS.filter(t => t.category === category);
        return (
            <div className="tracker-section">
                <h3 className="tracker-section-title">
                    {IconStr === 'Clock' && <Clock size={24} />}
                    {IconStr === 'BookOpen' && <BookOpen size={24} />}
                    {IconStr === 'Heart' && <Heart size={24} />}
                    {lang === 'ar' ? titleAr : titleEn}
                </h3>
                {catTasks.map(task => (
                    <div 
                        key={task.id} 
                        className={`tracker-item ${tasks[task.id] ? 'completed' : ''}`}
                        onClick={() => toggleTask(task)}
                    >
                        <div className="tracker-item-info">
                            <div className="check-circle">
                                <Check size={16} />
                            </div>
                            <span className="tracker-item-name">{lang === 'ar' ? task.labelAr : task.labelEn}</span>
                        </div>
                        <span className="tracker-item-points">+{task.points}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container tracker-page animate-slide-down" style={{ paddingTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/discover')} className="icon-btn" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                        {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                    </button>
                    <h1 style={{ margin: 0, fontSize: '1.75rem' }}>{lang === 'ar' ? 'متتبع العبادات' : 'Worship Tracker'}</h1>
                </div>
                <button onClick={() => navigate('/discover/achievements')} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '100px', padding: '0.5rem 1rem' }}>
                    <Award size={18} color="var(--color-accent)" />
                    <span className="hidden sm:inline">{lang === 'ar' ? 'الإنجازات' : 'Achievements'}</span>
                </button>
            </div>

            <div className="tracker-hero">
                <h2 className="tracker-title">
                    {lang === 'ar' ? 'الجدول اليومي' : 'Daily Schedule'}
                </h2>
                <p className="tracker-sub">
                    {lang === 'ar' ? dateKey : dateKey}
                </p>
            </div>

            <div className="progress-summary">
                <div className="progress-stat">
                    <span className="progress-stat-value">{totalPoints}</span>
                    <span className="progress-stat-label">{lang === 'ar' ? 'إجمالي النقاط' : 'Total Points'}</span>
                </div>
                <div className="progress-stat">
                    <span className="progress-stat-value" style={{ color: 'var(--color-accent)' }}>{progressToday}%</span>
                    <span className="progress-stat-label">{lang === 'ar' ? 'إنجاز اليوم' : 'Today\'s Progress'}</span>
                </div>
                <div className="progress-stat">
                    <span className="progress-stat-value" style={{ color: 'var(--color-text)' }}>{completedToday}/{DEFAULT_TASKS.length}</span>
                    <span className="progress-stat-label">{lang === 'ar' ? 'المهام المنجزة' : 'Completed Tasks'}</span>
                </div>
            </div>

            <div className="tracker-grid">
                {renderCategory('prayer', 'الصلوات المفروضة', 'Obligatory Prayers', 'Clock')}
                {renderCategory('quran', 'القرآن الكريم', 'Holy Quran', 'BookOpen')}
                {renderCategory('adhkar', 'الأذكار', 'Adhkar', 'Heart')}
                {renderCategory('sunnah', 'السنن و النوافل', 'Sunnah & Nawafil', 'Clock')}
            </div>
        </div>
    );
};

export default WorshipTracker;
