/**
 * التوقيت المصري (Africa/Cairo) — جميع الحسابات تعتمد على التوقيت الرسمي لمصر.
 */
const EGYPT_TZ = 'Africa/Cairo';

export function getEgyptDateParts(date = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: EGYPT_TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    if (formatter.formatToParts) {
      const parts = formatter.formatToParts(date);
      const get = (type) => parts.find((p) => p.type === type)?.value || '';
      return { year: get('year'), month: get('month'), day: get('day') };
    }
    // Fallback if formatToParts is unavailable
    const formatted = formatter.format(date); // YYYY-MM-DD
    const [year, month, day] = formatted.split('-');
    return { year, month, day };
  } catch (err) {
    // Ultimate fallback using standard Date getters (Device Local Time)
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return { year, month, day };
  }
}

/** تاريخ اليوم بتوقيت مصر YYYY-MM-DD */
export function getEgyptDateString(date = new Date()) {
  const { year, month, day } = getEgyptDateParts(date);
  return `${year}-${month}-${day}`;
}

function daysSinceEpoch(y, m, d) {
  const year = parseInt(y, 10);
  const month = parseInt(m, 10);
  const day = parseInt(d, 10);
  const isLeap = (yy) => (yy % 4 === 0 && yy % 100 !== 0) || yy % 400 === 0;
  const daysInMonth = (yy, mm) => {
    if (mm === 2) return isLeap(yy) ? 29 : 28;
    if ([4, 6, 9, 11].includes(mm)) return 30;
    return 31;
  };
  let total = 0;
  for (let i = 1970; i < year; i++) total += isLeap(i) ? 366 : 365;
  for (let i = 1; i < month; i++) total += daysInMonth(year, i);
  total += day;
  return total;
}

/** رقم اليوم المتسلسل بتوقيت مصر (لاختيار حديث اليوم) */
export function getEgyptEpochDay(date = new Date()) {
  const { year, month, day } = getEgyptDateParts(date);
  return daysSinceEpoch(year, month, day);
}

/** أجزاء التاريخ الهجري الحالي بتوقيت مصر: { day, monthIndex, year } (monthIndex 0–11) */
export function getEgyptHijriDateParts(date = new Date()) {
  const adjustedDate = new Date(date.getTime() - 1 * 24 * 60 * 60 * 1000); // إرجاع التاريخ الهجري يوماً واحداً لضبطه ليكون 27 رمضان
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: EGYPT_TZ,
      calendar: 'islamic-umalqura',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    if (formatter.formatToParts) {
      const parts = formatter.formatToParts(adjustedDate);
      const get = (type) => parts.find((p) => p.type === type)?.value || '0';
      return { day: parseInt(get('day'), 10), monthIndex: parseInt(get('month'), 10) - 1, year: parseInt(get('year'), 10) };
    }
    // basic fallback
    return { day: 1, monthIndex: 0, year: 1447 };
  } catch (err) {
    // If islamic calendar unsupported
    return { day: 1, monthIndex: 0, year: 1447 }; // fallback
  }
}

const HIJRI_MONTHS_EN = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
  'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
];

/** التاريخ الهجري بتوقيت مصر (قصير) */
export function getEgyptHijriShort(date = new Date(), lang = 'ar') {
  const adjustedDate = new Date(date.getTime() - 1 * 24 * 60 * 60 * 1000); // إرجاع التاريخ الهجري يوماً واحداً لضبطه ليكون 27 رمضان
  try {
    if (lang === 'ar') {
      return new Intl.DateTimeFormat('ar-EG', {
        timeZone: EGYPT_TZ,
        calendar: 'islamic-umalqura',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(adjustedDate);
    } else {
      // Manually construct English date to fix the Intl "September" browser bug for Islamic calendars
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: EGYPT_TZ,
        calendar: 'islamic-umalqura',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      const parts = formatter.formatToParts(adjustedDate);
      const get = (type) => parts.find((p) => p.type === type)?.value || '1';

      const day = get('day');
      const year = get('year');
      // month is 1-indexed from formatter
      const monthIndex = parseInt(get('month'), 10) - 1;
      const monthName = HIJRI_MONTHS_EN[monthIndex] || `Month ${monthIndex + 1}`;

      return `${monthName} ${day}, ${year} AH`;
    }
  } catch (err) {
    return lang === 'ar' ? 'التقويم الهجري غير مدعوم' : 'Hijri Calendar Unsupported';
  }
}

/** الميلي ثانية حتى منتصف الليل بتوقيت مصر */
export function getMsUntilEgyptMidnight(now = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: EGYPT_TZ,
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      second: '2-digit',
    });
    let h = 0, m = 0, s = 0;
    if (formatter.formatToParts) {
      const parts = formatter.formatToParts(now);
      const get = (t) => parts.find((p) => p.type === t)?.value || '0';
      h = parseInt(get('hour'), 10);
      m = parseInt(get('minute'), 10);
      s = parseInt(get('second'), 10);
    } else {
      h = now.getHours();
      m = now.getMinutes();
      s = now.getSeconds();
    }
    const msElapsed = (h * 3600 + m * 60 + s) * 1000;
    return 24 * 60 * 60 * 1000 - msElapsed;
  } catch (err) {
    // fallback to local device midnight
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  }
}
