import { useState, useEffect } from 'react';
import { getEgyptHijriDateParts, getEgyptHijriShort, getMsUntilEgyptMidnight } from './egyptTime';

export function useHijriDate(lang = 'ar', theme = 'default') {
    const isEid = theme === 'eid-fitr';
    
    // During Eid mode, we remove the -1 day lag to show 1 Shawwal
    const getParts = () => getEgyptHijriDateParts(new Date(), isEid ? 0 : -1);
    const getShort = () => getEgyptHijriShort(new Date(), lang, isEid ? 0 : -1);

    const [hijriParts, setHijriParts] = useState(() => getParts());
    const [hijriShort, setHijriShort] = useState(() => getShort());
    const [currentWeekday, setCurrentWeekday] = useState(() => new Date().getDay());

    useEffect(() => {
        let timeout;
        const updateDate = () => {
            setHijriParts(getParts());
            setHijriShort(getShort());
            setCurrentWeekday(new Date().getDay());

            // Schedule next update right after next midnight
            const ms = getMsUntilEgyptMidnight();
            timeout = setTimeout(updateDate, ms + 1000);
        };

        // Schedule first update
        const ms = getMsUntilEgyptMidnight();
        timeout = setTimeout(updateDate, ms + 1000);

        // Update short format if language changes
        setHijriShort(getEgyptHijriShort(new Date(), lang));

        // Fallback safety interval to catch drifts
        const interval = setInterval(() => {
            const nowParts = getEgyptHijriDateParts();
            setHijriParts(prev => {
                if (prev.day !== nowParts.day || prev.monthIndex !== nowParts.monthIndex || prev.year !== nowParts.year) {
                    setHijriShort(getEgyptHijriShort(new Date(), lang));
                    setCurrentWeekday(new Date().getDay());
                    return nowParts;
                }
                return prev;
            });
        }, 60000 * 5); // check every 5 mins just in case

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [lang]);

    return { hijriParts, hijriShort, currentWeekday };
}
