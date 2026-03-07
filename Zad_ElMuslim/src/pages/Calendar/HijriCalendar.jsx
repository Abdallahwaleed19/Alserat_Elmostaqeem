import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useHijriDate } from '../../utils/useHijriDate';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

// Hardcoded reference since doing complex Hijri math on client without a major date library is bulky
// For this app's scale, we'll demonstrate a functional monthly view that allows toggling months.
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
    '12-9': { ar: 'يوم عرفة', en: 'Day of Arafah' },
    '12-10': { ar: 'عيد الأضحى', en: 'Eid al-Adha' },
};

/** يوم الأسبوع لأول يوم من الشهر الهجري (0 = أحد، 6 = سبت) */
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
            return date.getUTCDay();
        }
    }
    return 0;
}

const HijriCalendar = () => {
    const { lang } = useLanguage();

    const { hijriParts: todayDate, currentWeekday } = useHijriDate(lang);

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

    return (
        <div className="container animate-slide-down" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
            <div className="text-center mb-10 text-primary flex flex-col items-center">
                <CalendarIcon size={48} className="mb-4 text-primary" />
                <h1 className="text-3xl font-bold mb-2 text-foreground">{lang === 'ar' ? 'التقويم الهجري' : 'Hijri Calendar'}</h1>
            </div>

            <div className="card max-w-4xl mx-auto overflow-hidden hijri-calendar-card">
                {/* Header controls */}
                <div className="bg-primary/10 p-4 sm:p-6 flex items-center justify-between border-b border-border hijri-calendar-header">
                    <button onClick={handlePrevMonth} className="btn btn-outline p-2 rounded-full hover:bg-primary hover:text-white transition">
                        {lang === 'ar' ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                    </button>

                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-primary m-0">{monthName}</h2>
                        <span className="text-muted font-medium">{currentYear} {lang === 'ar' ? 'هـ' : 'AH'}</span>
                    </div>

                    <button onClick={handleNextMonth} className="btn btn-outline p-2 rounded-full hover:bg-primary hover:text-white transition">
                        {lang === 'ar' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                    </button>
                </div>

                {/* Grid as table-like month view */}
                <div className="p-4 sm:p-6 bg-surface hijri-calendar-body">
                    <div className="grid grid-cols-7 gap-2 sm:gap-3 hijri-calendar-grid">
                        {/* Days of week header — تمييز عمود السبت وتمييز اليوم الحالي */}
                        {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((d, i) => {
                            const isThisWeekday = i === currentWeekday;
                            return (
                                <div
                                    key={i}
                                    className={`text-center font-bold text-sm pb-2 border-b border-border/50 ${i === 6 ? 'hijri-col-saturday' : ''} ${isThisWeekday ? 'text-primary' : 'text-muted'}`}
                                    style={isThisWeekday ? { backgroundColor: 'var(--color-primary-light)', color: 'var(--color-on-primary)', borderRadius: 'var(--radius-sm)' } : {}}
                                >
                                    {lang === 'ar' ? d : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
                                </div>
                            );
                        })}

                        {/* فراغات حتى يقع أول الشهر تحت يوم الأسبوع الصحيح */}
                        {Array.from({ length: firstDayWeekday }, (_, i) => (
                            <div key={`empty-${i}`} className="hijri-empty-slot" />
                        ))}

                        {daysArray.map(day => {
                            const isToday =
                                todayDate &&
                                day === todayDate.day &&
                                currentMonthIndex === todayDate.monthIndex &&
                                currentYear === todayDate.year;
                            const occasionKey = `${currentMonthIndex + 1}-${day}`;
                            const hasOccasion = OCCASIONS[occasionKey];
                            const columnIndex = (firstDayWeekday + (day - 1)) % 7;
                            const isSaturday = columnIndex === 6;

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    className={`
                                        hijri-day-cell
                                        ${isToday ? 'hijri-day-today' : ''}
                                        ${hasOccasion ? 'hijri-day-occasion' : ''}
                                        ${isSaturday ? 'hijri-day-saturday' : ''}
                                    `}
                                >
                                    <span className="hijri-day-number">{day}</span>

                                    {isToday && (
                                        <span className="hijri-today-badge">
                                            {lang === 'ar' ? 'اليوم' : 'Today'}
                                        </span>
                                    )}

                                    {hasOccasion && (
                                        <div className="hijri-occasion">
                                            <span
                                                className="hijri-occasion-text"
                                                title={lang === 'ar' ? hasOccasion.ar : hasOccasion.en}
                                            >
                                                {lang === 'ar' ? hasOccasion.ar : hasOccasion.en}
                                            </span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-surface-hover p-4 border-t border-border flex flex-wrap gap-4 items-center text-sm text-muted hijri-legend">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-primary/20 border-2 border-primary"></div>
                        {lang === 'ar' ? 'اليوم' : 'Today'}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-amber-400/20 border-2 border-amber-400"></div>
                        {lang === 'ar' ? 'مناسبة إسلامية' : 'Islamic Occasion'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HijriCalendar;
