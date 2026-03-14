import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, ArrowRight, Award, Lock, CheckCircle2, Star, TrendingUp, Zap, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Tracker.css';

const ACHIEVEMENT_LIST = [
    { id: 'first_task', titleAr: 'البداية الطيبة', titleEn: 'Good Start', descAr: 'أكمل أول مهمة لك في المتتبع.', descEn: 'Complete your first task in the tracker.', icon: 'Zap', requirement: { type: 'total_tasks', value: 1 } },
    { id: 'early_bird', titleAr: 'المبادر', titleEn: 'Morning Person', descAr: 'أكمل أذكار الصباح في وقتها.', descEn: 'Complete Morning Adhkar on time.', icon: 'Star', requirement: { type: 'adhkar_morning', value: 1 } },
    { id: 'prayer_streak', titleAr: 'خاشع', titleEn: 'Devout', descAr: 'أكمل جميع الصلوات الـ 5 في يوم واحد.', descEn: 'Complete all 5 prayers in a single day.', icon: 'Target', requirement: { type: 'daily_full_prayer', value: 1 } },
    { id: 'quran_reader', titleAr: 'قارئ القرآن', titleEn: 'Quran Reader', descAr: 'أكمل 10 مهام تلاوة قرآن.', descEn: 'Complete 10 Quran reading tasks.', icon: 'BookOpen', requirement: { type: 'total_quran', value: 10 } },
    { id: 'points_100', titleAr: 'المجتهد', titleEn: 'Diligent', descAr: 'جمع 100 نقطة في المتتبع.', descEn: 'Accumulate 100 points in the tracker.', icon: 'TrendingUp', requirement: { type: 'total_points', value: 100 } },
    { id: 'points_500', titleAr: 'السابقُون', titleEn: 'The Forerunners', descAr: 'جمع 500 نقطة في المتتبع.', descEn: 'Accumulate 500 points in the tracker.', icon: 'Award', requirement: { type: 'total_points', value: 500 } },
];

const Achievements = () => {
    const { lang } = useLanguage();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total_tasks: 0,
        total_points: 0,
        total_prayers: 0,
        adhkar_morning: 0,
    });

    useEffect(() => {
        const loadStats = () => {
            setStats({
                total_tasks: parseInt(localStorage.getItem('zad_tracker_total_tasks') || '0', 10),
                total_points: parseInt(localStorage.getItem('zad_tracker_total_points') || '0', 10),
                total_prayers: parseInt(localStorage.getItem('zad_tracker_total_prayers') || '0', 10),
                adhkar_morning: 0, // In a real app we'd track this over time
            });
        };
        loadStats();
    }, []);

    const isUnlocked = (achievement) => {
        const { type, value } = achievement.requirement;
        if (type === 'total_tasks') return stats.total_tasks >= value;
        if (type === 'total_points') return stats.total_points >= value;
        if (type === 'total_prayers') return stats.total_prayers >= value;
        return false;
    };

    const unlockedCount = ACHIEVEMENT_LIST.filter(isUnlocked).length;

    const renderIcon = (name) => {
        switch (name) {
            case 'Zap': return <Zap size={24} />;
            case 'Star': return <Star size={24} />;
            case 'Target': return <Target size={24} />;
            case 'Award': return <Award size={24} />;
            case 'TrendingUp': return <TrendingUp size={24} />;
            default: return <Award size={24} />;
        }
    };

    return (
        <div className="container tracker-page animate-slide-down" style={{ paddingTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/discover/tracker')} className="icon-btn" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                </button>
                <h1 style={{ margin: 0, fontSize: '1.75rem' }}>{lang === 'ar' ? 'الإنجازات والجوائز' : 'Achievements & Awards'}</h1>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--color-accent) 0%, #a47c2b 100%)', color: 'white' }}>
                <Award size={48} style={{ margin: '0 auto 1rem' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{unlockedCount} / {ACHIEVEMENT_LIST.length}</h2>
                <p style={{ margin: 0, opacity: 0.9 }}>{lang === 'ar' ? 'من الإنجازات المكتملة' : 'Achievements Unlocked'}</p>
            </div>

            <div className="achievement-grid">
                {ACHIEVEMENT_LIST.map(item => {
                    const unlocked = isUnlocked(item);
                    return (
                        <div key={item.id} className={`achievement-card ${!unlocked ? 'locked' : ''}`}>
                            <div className="achievement-icon">
                                {unlocked ? renderIcon(item.icon) : <Lock size={24} />}
                            </div>
                            <h4 className="achievement-title">{lang === 'ar' ? item.titleAr : item.titleEn}</h4>
                            <p className="achievement-desc">{lang === 'ar' ? item.descAr : item.descEn}</p>
                            {unlocked && (
                                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                    <CheckCircle2 size={16} color="var(--color-primary)" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Achievements;
