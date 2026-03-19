import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useHijriDate } from '../../utils/useHijriDate';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, ExternalLink, Info } from 'lucide-react';
import './HijriCalendar.css';

const HIJRI_MONTHS_AR = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

const HIJRI_MONTHS_EN = [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
];

const OCCASIONS = {
    '1-1': { ar: 'رأس السنة الهجرية', en: 'Islamic New Year' },
    '1-10': { ar: 'يوم عاشوراء', en: 'Day of Ashura' },
    '3-12': { ar: 'المولد النبوي', en: 'Mawlid an-Nabi' },
    '7-27': { ar: 'الإسراء والمعراج', en: 'Isra and Mi\'raj' },
    '8-15': { ar: 'النصف من شعبان', en: 'Mid-Sha\'ban' },
    '9-1': { ar: 'بداية شهر رمضان', en: 'Start of Ramadan' },
    '10-1': { ar: 'عيد الفطر', en: 'Eid al-Fitr' },
    '10-2': { ar: 'ثاني أيام العيد', en: 'Eid al-Fitr Day 2' },
    '10-3': { ar: 'ثالث أيام العيد', en: 'Eid al-Fitr Day 3' },
    '12-9': { ar: 'يوم عرفة', en: 'Day of Arafah' },
    '12-10': { ar: 'عيد الأضحى', en: 'Eid al-Adha' },
};

function getFirstDayWeekday(hijriYear, monthIndex1Based) {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        calendar: 'islamic-umalqura',
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const start = new Date(Date.UTC(2025, 0, 1));
    for (let d = 0; d < 800; d++) {
        const date = new Date(start);
        date.setUTCDate(date.getUTCDate() + d);
        const parts = formatter.formatToParts(date);
        const y = parseInt(parts.find((p) => p.type === 'year')?.value || '0', 10);
        const m = parseInt(parts.find((p) => p.type === 'month')?.value || '0', 10);
        if (y === hijriYear && m === monthIndex1Based) {
            return (date.getUTCDay() + 1) % 7; // إضافة يوم واحد ليتماشى مع التعديل اليدوي في egyptTime
        }
    }
    return 0;
}

const HijriCalendar = () => {
    const { lang } = useLanguage();
    const { theme } = useTheme();
    const { hijriParts: todayDate, currentWeekday } = useHijriDate(lang, theme);

    const [currentMonthIndex, setCurrentMonthIndex] = useState(() => todayDate.monthIndex);
    const [currentYear, setCurrentYear] = useState(() => todayDate.year);

    const handlePrevMonth = () => {
        if (currentMonthIndex === 0) {
            setCurrentMonthIndex(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonthIndex(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonthIndex === 11) {
            setCurrentMonthIndex(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonthIndex(prev => prev + 1);
        }
    };

    const daysInMonth = (currentMonthIndex % 2 === 0) ? 30 : 29;
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const firstDayWeekday = useMemo(
        () => getFirstDayWeekday(currentYear, currentMonthIndex + 1),
        [currentYear, currentMonthIndex]
    );
    const monthName = lang === 'ar' ? HIJRI_MONTHS_AR[currentMonthIndex] : HIJRI_MONTHS_EN[currentMonthIndex];

    const upcomingEvents = useMemo(() => {
        return Object.entries(OCCASIONS)
            .map(([key, value]) => {
                const [m, d] = key.split('-').map(Number);
                return { month: m, day: d, ...value };
            })
            .filter(e => e.month >= currentMonthIndex + 1)
            .sort((a, b) => a.month === b.month ? a.day - b.day : a.month - b.month)
            .slice(0, 4);
    }, [currentMonthIndex]);

    return (
        <div className="container animate-slide-down hijri-calendar-page" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
            <div className="calendar-hero">
                <CalendarIcon size={48} className="text-primary mb-4 mx-auto" />
                <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'التقويم الهجري المتقدم' : 'Advanced Hijri Calendar'}</h1>
                <p className="text-muted">{lang === 'ar' ? 'تابع المناسبات الإسلامية وأيام الصيام المستحبة.' : 'Track Islamic events and recommended fasting days.'}</p>
            </div>

            <div className="hijri-calendar-card">
                <div className="hijri-calendar-header">
                    <button onClick={handlePrevMonth} className="icon-btn">
                        {lang === 'ar' ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                    </button>

                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-primary m-0">{monthName}</h2>
                        <span className="text-muted font-medium">{currentYear} {lang === 'ar' ? 'هـ' : 'AH'}</span>
                    </div>

                    <button onClick={handleNextMonth} className="icon-btn">
                        {lang === 'ar' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                    </button>
                </div>

                <div className="hijri-calendar-grid">
                    {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((d, i) => {
                        const isCurrentDay = i === currentWeekday;
                        return (
                            <div key={i} className={`text-center font-bold text-sm ${isCurrentDay ? 'current-weekday-header' : 'text-muted'}`} style={{ padding: isCurrentDay ? '0.5rem 0' : '0.5rem 0' }}>
                                {lang === 'ar' ? d : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
                            </div>
                        );
                    })}

                    {Array.from({ length: firstDayWeekday }, (_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {daysArray.map(day => {
                        const isToday = todayDate && day === todayDate.day && currentMonthIndex === todayDate.monthIndex && currentYear === todayDate.year;
                        const occasionKey = `${currentMonthIndex + 1}-${day}`;
                        const hasOccasion = OCCASIONS[occasionKey];
                        const weekday = (firstDayWeekday + (day - 1)) % 7;
                        
                        // Sunnah Fasting logic
                        const isWhiteDay = [13, 14, 15].includes(day);
                        const isMonThu = [1, 4].includes(weekday);
                        const isSunnahFast = isWhiteDay || isMonThu || (currentMonthIndex === 8); // Ramadan already handled but visually nice

                        return (
                            <div
                                key={day}
                                className={`hijri-day-cell ${isToday ? 'hijri-day-today' : ''} ${hasOccasion ? 'hijri-day-occasion' : ''} ${weekday === 6 ? 'hijri-day-saturday' : ''}`}
                            >
                                <span className="hijri-day-number">{day}</span>
                                {isToday && <span className="hijri-today-badge">{lang === 'ar' ? 'اليوم' : 'Today'}</span>}
                                
                                {isSunnahFast && !hasOccasion && (
                                    <div className="sunnah-fasting-dot" title={lang === 'ar' ? 'صيام سنة' : 'Sunnah Fast'} />
                                )}

                                {hasOccasion && (
                                    <div className="hijri-occasion">
                                        <span className="hijri-occasion-text">{lang === 'ar' ? hasOccasion.ar : hasOccasion.en}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 bg-surface-hover border-t border-border flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-primary"></div> {lang === 'ar' ? 'اليوم' : 'Today'}</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-accent"></div> {lang === 'ar' ? 'مناسبة' : 'Occasion'}</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary"></div> {lang === 'ar' ? 'صيام سنة' : 'Sunnah Fast'}</div>
                </div>
            </div>

            <div className="upcoming-events-section">
                <h3 className="flex items-center gap-2 mb-4 text-xl">
                    <Info size={20} className="text-accent" />
                    {lang === 'ar' ? 'المناسبات القادمة' : 'Upcoming Events'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingEvents.map((event, idx) => (
                        <div key={idx} className="upcoming-event-card">
                            <div className="event-date-box">
                                <span className="event-day">{event.day}</span>
                                <span className="event-month">{lang === 'ar' ? HIJRI_MONTHS_AR[event.month - 1] : HIJRI_MONTHS_EN[event.month - 1]}</span>
                            </div>
                            <div className="event-info">
                                <div className="event-name">{lang === 'ar' ? event.ar : event.en}</div>
                                <div className="event-hijri">{event.day} {lang === 'ar' ? HIJRI_MONTHS_AR[event.month - 1] : HIJRI_MONTHS_EN[event.month - 1]} {currentYear}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HijriCalendar;

