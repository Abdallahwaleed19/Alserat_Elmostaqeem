const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export function parsePrayerDate(timeStr, baseDate = new Date()) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const clean = timeStr.split(' ')[0];
  const [h, m] = clean.split(':').map((n) => Number(n));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
}

export function getNextPrayer(prayerTimes, now = new Date()) {
  if (!prayerTimes) return null;

  for (const prayer of PRAYER_ORDER) {
    const t = parsePrayerDate(prayerTimes[prayer], now);
    if (t && t > now) {
      return { prayer, at: t };
    }
  }

  const fajr = parsePrayerDate(prayerTimes.Fajr, now);
  if (!fajr) return null;
  fajr.setDate(fajr.getDate() + 1);
  return { prayer: 'Fajr', at: fajr };
}

export function formatCountdown(target, now = new Date()) {
  if (!target) return '--:--:--';
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return '00:00:00';
  const totalSec = Math.floor(diff / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getLocalizedDates(now = new Date()) {
  const gregorian = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(now);

  const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(now);

  return { gregorian, hijri };
}
