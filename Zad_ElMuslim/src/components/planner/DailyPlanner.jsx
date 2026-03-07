import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getEgyptDateString } from '../../utils/egyptTime';

const initialTasks = [
    // Prayers (بالترتيب الصحيح)
    { id: 'fajr', label: 'صلاة الفجر', category: 'prayers', completed: false },
    { id: 'dhuhr', label: 'صلاة الظهر', category: 'prayers', completed: false },
    { id: 'asr', label: 'صلاة العصر', category: 'prayers', completed: false },
    { id: 'maghrib', label: 'صلاة المغرب', category: 'prayers', completed: false },
    { id: 'isha', label: 'صلاة العشاء', category: 'prayers', completed: false },

    // Daily worship
    { id: 'quran', label: 'ورد القرآن الكريم', category: 'worship', completed: false },
    { id: 'morning_adhkar', label: 'أذكار الصباح', category: 'adhkar', completed: false },
    { id: 'evening_adhkar', label: 'أذكار المساء', category: 'adhkar', completed: false },

    // Family & social worship
    { id: 'silat_arrahim', label: 'صلة الرحم (الاتصال أو زيارة الأهل)', category: 'family', completed: false },
    { id: 'sadaqah', label: 'صدقة اليوم (ولو قليلة)', category: 'charity', completed: false },
    { id: 'zakah_check', label: 'مراجعة الزكاة (إن وجبت)', category: 'charity', completed: false },
];

const getOrderedTasks = (theme) => {
    if (theme === 'ramadan') {
        const tasks = [...initialTasks];
        // Insert Qiyam before Fajr (index 0)
        tasks.splice(0, 0, { id: 'qiyam', label: 'قيام الليل', category: 'ramadan', completed: false });

        // Find Isha index and insert Taraweeh after it
        const ishaIndex = tasks.findIndex(t => t.id === 'isha');
        if (ishaIndex !== -1) {
            tasks.splice(ishaIndex + 1, 0, { id: 'taraweeh', label: 'صلاة التراويح', category: 'ramadan', completed: false });
        }
        return tasks;
    }
    return [...initialTasks];
};

const DailyPlanner = ({ onClose }) => {
    const { theme } = useTheme();
    const { lang } = useLanguage();
    const [view, setView] = useState('daily'); // 'daily', 'weekly', or 'notes'
    const [note, setNote] = useState('');
    const [history, setHistory] = useState({}); // { '2023-10-01': 80, ... }

    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('zad_daily_tasks');
        const egyptToday = getEgyptDateString();
        const savedDate = localStorage.getItem('zad_daily_tasks_date');

        if (saved && savedDate === egyptToday) {
            try {
                return JSON.parse(saved);
            } catch (_) { }
        }

        localStorage.setItem('zad_daily_tasks_date', egyptToday);
        return getOrderedTasks(theme);
    });

    useEffect(() => {
        localStorage.setItem('zad_daily_tasks', JSON.stringify(tasks));

        const egyptToday = getEgyptDateString();
        const completedCount = tasks.filter(t => t.completed).length;
        const progressPercent = Math.round((completedCount / tasks.length) * 100);

        const hist = JSON.parse(localStorage.getItem('zad_planner_history') || '{}');
        hist[egyptToday] = progressPercent;
        setHistory(hist);
        localStorage.setItem('zad_planner_history', JSON.stringify(hist));
    }, [tasks]);

    useEffect(() => {
        const egyptToday = getEgyptDateString();
        const savedDate = localStorage.getItem('zad_daily_tasks_date');
        if (savedDate !== egyptToday) return;

        const base = getOrderedTasks(theme);
        setTasks((prev) => {
            const prevMap = new Map(prev.map((t) => [t.id, t]));
            return base.map((task) => prevMap.get(task.id) || task);
        });
    }, [theme]);

    useEffect(() => {
        const egyptToday = getEgyptDateString();
        const notesObj = JSON.parse(localStorage.getItem('zad_planner_notes') || '{}');
        setNote(notesObj[egyptToday] || '');
    }, []);

    // عند تغيّر اليوم بتوقيت مصر (بعد منتصف الليل): تصفير المهام وتحميل نوتة اليوم الجديد
    useEffect(() => {
        const checkNewDay = () => {
            const egyptToday = getEgyptDateString();
            const savedDate = localStorage.getItem('zad_daily_tasks_date');
            if (savedDate && savedDate !== egyptToday) {
                localStorage.setItem('zad_daily_tasks_date', egyptToday);
                setTasks(getOrderedTasks(theme));
                const notesObj = JSON.parse(localStorage.getItem('zad_planner_notes') || '{}');
                setNote(notesObj[egyptToday] || '');
            }
        };
        checkNewDay();
        const interval = setInterval(checkNewDay, 60 * 1000);
        return () => clearInterval(interval);
    }, [theme]);

    const saveNote = (newNote) => {
        setNote(newNote);
        const egyptToday = getEgyptDateString();
        const notesObj = JSON.parse(localStorage.getItem('zad_planner_notes') || '{}');
        notesObj[egyptToday] = newNote;
        localStorage.setItem('zad_planner_notes', JSON.stringify(notesObj));
    };

    const toggleTask = (taskId) => {
        setTasks(tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        ));

        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const progressPercent = Math.round((completedCount / tasks.length) * 100);

    const getLast7Days = () => {
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = getEgyptDateString(d);
            const dayName = d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short' });
            result.push({ date: dateStr, name: dayName, progress: history[dateStr] || 0 });
        }
        return result;
    };

    const isModal = typeof onClose === 'function';

    const getNotesHistory = () => {
        const notesObj = JSON.parse(localStorage.getItem('zad_planner_notes') || '{}');
        // Filter out empty notes and sort by date descending (newest first)
        return Object.entries(notesObj)
            .filter(([_, content]) => content && content.trim().length > 0)
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .map(([date, content]) => {
                // Format the date nicely
                const d = new Date(date);
                const formatter = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                return {
                    date: date,
                    formattedDate: isNaN(d) ? date : formatter.format(d),
                    content: content
                };
            });
    };

    // Disable category sorting to depend purely on the injected array structure
    const orderedTasks = [...tasks];

    return (
        <div className={isModal ? 'planner-overlay' : ''}>
            <div className={`card planner-card ${isModal ? 'planner-modal' : ''}`} style={!isModal ? { padding: '1.5rem', marginTop: '2rem' } : undefined}>
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>{lang === 'ar' ? 'النوتة اليومية' : 'Daily Planner'}</h3>

                    {isModal && (
                        <button
                            className="planner-close-btn"
                            type="button"
                            onClick={onClose}
                        >
                            {lang === 'ar' ? 'إغلاق' : 'Close'}
                        </button>
                    )}

                    <div className="flex bg-surface-hover rounded-md overflow-hidden" style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                        <button
                            className={`px-3 py-1 text-sm ${view === 'daily' ? 'bg-primary text-white' : 'text-muted'}`}
                            style={{ backgroundColor: view === 'daily' ? 'var(--color-primary)' : 'transparent', color: view === 'daily' ? '#fff' : 'inherit', border: 'none', padding: '0.4rem 1rem' }}
                            onClick={() => setView('daily')}
                        >
                            {lang === 'ar' ? 'يومي' : 'Daily'}
                        </button>
                        <button
                            className={`px-3 py-1 text-sm ${view === 'weekly' ? 'bg-primary text-white' : 'text-muted'}`}
                            style={{ backgroundColor: view === 'weekly' ? 'var(--color-primary)' : 'transparent', color: view === 'weekly' ? '#fff' : 'inherit', border: 'none', padding: '0.4rem 1rem' }}
                            onClick={() => setView('weekly')}
                        >
                            {lang === 'ar' ? 'أسبوعي' : 'Weekly'}
                        </button>
                        <button
                            className={`px-3 py-1 text-sm ${view === 'notes' ? 'bg-primary text-white' : 'text-muted'}`}
                            style={{ backgroundColor: view === 'notes' ? 'var(--color-primary)' : 'transparent', color: view === 'notes' ? '#fff' : 'inherit', border: 'none', padding: '0.4rem 1rem' }}
                            onClick={() => setView('notes')}
                        >
                            {lang === 'ar' ? 'سجل الخواطر' : 'Notes'}
                        </button>
                    </div>
                </div>

                {view === 'daily' ? (
                    <>
                        {/* Progress Bar */}
                        <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                            <span>{lang === 'ar' ? 'الإنجاز اليومي' : 'Daily Progress'}</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div style={{ width: '100%', backgroundColor: 'var(--color-border)', height: '8px', borderRadius: '4px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                            <div style={{
                                width: `${progressPercent}%`,
                                backgroundColor: theme === 'ramadan' ? 'var(--color-accent)' : 'var(--color-primary)',
                                height: '100%',
                                borderRadius: '4px',
                                transition: 'width 0.5s ease-out'
                            }}></div>
                        </div>

                        {/* Task List */}
                        <div className="flex flex-col gap-2 mb-6">
                            {orderedTasks.map(task => (
                                <label key={task.id} className="flex items-center gap-4 planner-task-row">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTask(task.id)}
                                        style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--color-primary)' }}
                                    />
                                    <span style={{
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        color: task.completed ? 'var(--color-text-muted)' : 'var(--color-text)',
                                        transition: 'all 0.2s'
                                    }}>
                                        {task.label}
                                    </span>
                                    {task.category === 'ramadan' && <span style={{ marginRight: 'auto', fontSize: '0.8rem', color: 'var(--color-accent)' }}>🌙</span>}
                                </label>
                            ))}
                        </div>

                        {/* Reflection Notes */}
                        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                                {lang === 'ar' ? 'ملاحظات وتأملات اليوم' : 'Daily Reflections & Notes'}
                            </h4>
                            <textarea
                                value={note}
                                onChange={(e) => saveNote(e.target.value)}
                                placeholder={lang === 'ar' ? 'اكتب خواطرك الإيمانية، ما تعلمته اليوم، أو دعاء تود حفظه...' : 'Write your spiritual reflections, what you learned today, or a dua...'}
                                className="form-control"
                                style={{
                                    width: '100%',
                                    minHeight: '80px',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-surface-hover)',
                                    color: 'var(--color-text)',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        {progressPercent === 100 && (
                            <div className="text-center animate-slide-down" style={{ marginTop: '1rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                {lang === 'ar' ? 'ما شاء الله! أتممت جميع مهامك اليوم. تقبل الله طاعتك. 🎉' : 'MashaAllah! You completed all tasks today. May Allah accept. 🎉'}
                            </div>
                        )}
                    </>
                ) : view === 'weekly' ? (
                    <div className="weekly-view animate-slide-down">
                        <p style={{ textAlign: 'center', marginBottom: '1.25rem', color: 'var(--color-text-muted)' }}>
                            {lang === 'ar' ? 'معدل إنجازك خلال الأيام السبعة الماضية' : 'Your progress over the last 7 days'}
                        </p>
                        <div className="planner-weekly-table">
                            {getLast7Days().map((day, idx) => (
                                <div key={idx} className="planner-weekly-row">
                                    <span className="planner-weekly-day">{day.name}</span>
                                    <div className="planner-weekly-bar-bg">
                                        <div
                                            className="planner-weekly-bar-fill"
                                            style={{ width: `${day.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="planner-weekly-percent">{day.progress}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="notes-view animate-slide-down">
                        <p style={{ textAlign: 'center', marginBottom: '1.25rem', color: 'var(--color-text-muted)' }}>
                            {lang === 'ar' ? 'سجل تأملاتك وخواطرك السابقة' : 'Your past reflections and notes'}
                        </p>
                        <div className="notes-history-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            {getNotesHistory().length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '2rem 0' }}>
                                    {lang === 'ar' ? 'لا توجد خواطر مسجلة بعد.' : 'No notes recorded yet.'}
                                </p>
                            ) : (
                                getNotesHistory().map((noteItem, idx) => (
                                    <div key={idx} style={{
                                        backgroundColor: 'var(--color-surface)',
                                        padding: '1.25rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)',
                                        borderLeft: lang !== 'ar' ? '4px solid var(--color-primary)' : undefined,
                                        borderRight: lang === 'ar' ? '4px solid var(--color-primary)' : undefined,
                                    }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                            {noteItem.formattedDate}
                                        </div>
                                        <div style={{ color: 'var(--color-text)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                            {noteItem.content}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyPlanner;
