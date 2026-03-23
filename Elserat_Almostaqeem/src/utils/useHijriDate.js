import { useState, useEffect } from 'react';
import { getEgyptHijriDateParts, getEgyptHijriShort, getMsUntilEgyptMidnight } from './egyptTime';

export function useHijriDate(lang = 'ar', theme = 'default') {
    const isEid = theme === 'eid-fitr';
    
    // Use 0 day lag for accuracy during Eid, otherwise use -1 if required by sighting
    const getParts = () => getEgyptHijriDateParts(new Date(), 0);
    const getShort = () => getEgyptHijriShort(new Date(), lang, 0);

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
        setHijriShort(getEgyptHijriShort(new Date(), lang, 0));

        // Fallback safety interval to catch drifts
        const interval = setInterval(() => {
            const nowParts = getEgyptHijriDateParts(new Date(), 0);
            setHijriParts(prev => {
                if (prev.day !== nowParts.day || prev.monthIndex !== nowParts.monthIndex || prev.year !== nowParts.year) {
                    setHijriShort(getEgyptHijriShort(new Date(), lang, 0));
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
