import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { CapacitorMusicControls } from 'capacitor-music-controls-plugin';
import { SURAH_NAMES_VOWELLED } from '../data/surahNamesVowelled';
import audioCoordinator from '../services/audioCoordinator';
import { cacheLastQuranTrack } from '../services/audioCache';
import mediaNotificationManager from '../services/mediaNotificationManager';

const AudioContext = createContext();

// مصادر متعددة: mp3quran.net (الأولوية)، ثم CDN، ثم آية-بآية من api.alquran.cloud
const CDN_BASE = 'https://cdn.islamic.network/quran/audio-surah/128';
const AYAH_API = 'https://api.alquran.cloud/v1/surah';

export const RECITERS = [
    // ========== القراء المصريون - Egyptian Reciters ==========
    // محمد صديق المنشاوي
    { id: 'ar.minshawi', nameAr: 'محمد صديق المنشاوي - مجوّد', nameEn: 'Al-Minshawy (Mujawwad)', category: 'egyptian', style: 'مجوّد', styleEn: 'Mujawwad', image: '/images/minshawi.jpg', mp3quranId: 'minsh', dynamicUrl: 'https://server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad/{n3}.mp3', serverUrl: 'https://server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad/', audioId: 'ar.muhammadsiddiqalminshawimujawwad' },
    { id: 'ar.minshawi.murattal', nameAr: 'محمد صديق المنشاوي - مرتّل', nameEn: 'Al-Minshawy (Murattal)', category: 'egyptian', style: 'مرتّل', styleEn: 'Murattal', image: '/images/minshawi.jpg', mp3quranId: 'minsh', dynamicUrl: 'https://server10.mp3quran.net/minsh/{n3}.mp3', serverUrl: 'https://server10.mp3quran.net/minsh/' },

    // عبد الباسط عبد الصمد
    { id: 'ar.abdulbasitmurattal', nameAr: 'عبد الباسط عبد الصمد - مرتّل', nameEn: 'Abdul Basit (Murattal)', category: 'egyptian', style: 'مرتّل', styleEn: 'Murattal', image: '/images/abdulbasit.jpg', mp3quranId: 'basit', dynamicUrl: 'https://server7.mp3quran.net/basit/{n3}.mp3', serverUrl: 'https://server7.mp3quran.net/basit/', audioId: 'ar.abdulbasitmurattal' },
    { id: 'ar.abdulbasit.mujawwad', nameAr: 'عبد الباسط عبد الصمد - مجوّد', nameEn: 'Abdul Basit (Mujawwad)', category: 'egyptian', style: 'مجوّد', styleEn: 'Mujawwad', image: '/images/abdulbasit.jpg', mp3quranId: 'basit', dynamicUrl: 'https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/{n3}.mp3', serverUrl: 'https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/', audioId: 'ar.abdulbasitmujawwad' },

    // محمود خليل الحصري - مرتل (مصدر: surahquran.com/mp3/Al-Hussary/ + احتياطي tvquran حفص)
    { id: 'ar.husary', nameAr: 'محمود خليل الحصري - مرتّل', nameEn: 'Al-Husary (Murattal)', category: 'egyptian', style: 'مرتّل', styleEn: 'Murattal', image: '/images/maxresdefault.jpg', mp3quranId: 'husr', dynamicUrl: 'https://server13.mp3quran.net/husr/{n3}.mp3', serverUrl: 'https://server13.mp3quran.net/husr/', serverUrlFallback: 'https://download.tvquran.com/download/TvQuran.com__Al-Hussary/' },
    // محمود خليل الحصري - مجود (مصدر: surahquran.com/mp3/Al-Hussary-Mujawwad/)
    { id: 'ar.husary.mujawwad', nameAr: 'محمود خليل الحصري - مجوّد', nameEn: 'Al-Husary (Mujawwad)', category: 'egyptian', style: 'مجوّد', styleEn: 'Mujawwad', image: '/images/maxresdefault.jpg', mp3quranId: 'husr', dynamicUrl: 'https://server13.mp3quran.net/husr/Almusshaf-Al-Mojawwad/{n3}.mp3', serverUrl: 'https://server13.mp3quran.net/husr/Almusshaf-Al-Mojawwad/' },

    // محمد رفعت - المصحف المجود (مصدر: surahquran.com/quran-mp3-qari-47.html + tvquran.com - نفس السور المتوفرة)
    { id: 'ar.muhammadrefat', nameAr: 'محمد رفعت - مجوّد', nameEn: 'Muhammad Refat (Mujawwad)', category: 'egyptian', style: 'مجوّد', styleEn: 'Mujawwad', image: '/images/R.jpg', mp3quranId: 'refat', dynamicUrl: 'https://download.tvquran.com/download/recitations/314/221/{n3}.mp3', serverUrl: 'https://download.tvquran.com/download/recitations/314/221/', availableSurahs: [1, 2, 10, 11, 12, 17, 18, 19, 20, 48, 54, 55, 56, 69, 72, 73, 75, 76, 77, 78, 79, 81, 82, 83, 85, 86, 87, 88, 89, 96, 98, 100] },

    // محمود علي البنا - مرتّل (مصدر: surahquran.com/mp3/Mahmoud-El-Banna/)
    { id: 'ar.albanna', nameAr: 'محمود علي البنا - مرتّل', nameEn: 'Al-Banna (Murattal)', category: 'egyptian', style: 'مرتّل', styleEn: 'Murattal', image: '/images/artworks-gd2VK9TkQ11WYC4l-66KqcQ-t1080x1080.jpg', mp3quranId: 'bna', dynamicUrl: 'https://server8.mp3quran.net/bna/{n3}.mp3', serverUrl: 'https://server8.mp3quran.net/bna/', audioId: 'ar.mahmoudalialbanna' },

    // مصطفى إسماعيل - مجوّد (مصدر: surahquran.com/sheikh-qari-129.html)
    { id: 'ar.mustafaismail', nameAr: 'مصطفى إسماعيل - مجوّد', nameEn: 'Mustafa Ismail (Mujawwad)', category: 'egyptian', style: 'مجوّد', styleEn: 'Mujawwad', image: '/images/41e55ea6e5e5d70798320e94d447cdb7.jpg', mp3quranId: 'mustafa/Almusshaf-Al-Mojawwad', dynamicUrl: 'https://ia801002.us.archive.org/14/items/golmami2005_yahoo_002_20180409_1406/{n3}.mp3', serverUrl: 'https://server8.mp3quran.net/mustafa/Almusshaf-Al-Mojawwad/', audioId: 'ar.mustafaismail' },

    // محمود الطبلاوي - مجوّد (مصدر: surahquran.com/English/Tablawi/ - alkabbah.com)
    { id: 'ar.tablawi', nameAr: 'محمود الطبلاوي - مجوّد', nameEn: 'Mahmoud Al-Tablawi (Mujawwad)', category: 'egyptian', style: 'مجوّد', styleEn: 'Mujawwad', image: '/images/maxresdefault%20(1).jpg', mp3quranId: 'tblawi', dynamicUrl: 'https://server12.mp3quran.net/tblawi/{n3}.mp3', serverUrl: 'https://server12.mp3quran.net/tblawi/', audioId: null },

    // السيد سعيد - مجوّد (مصدر: surahquran.com/quran-mp3-qari-7.html - archive.org)
    { id: 'ar.sayyidsaeed', nameAr: 'السيد سعيد - مجوّد', nameEn: 'Al-Sayyid Saeed (Mujawwad)', category: 'egyptian', style: 'مجوّد', styleEn: 'Mujawwad', image: '/images/1071822.png.webp', mp3quranId: 'sayyidsaeed', dynamicUrl: 'https://ia601502.us.archive.org/10/items/019_20221105/{n3}.mp3', serverUrl: 'https://ia601502.us.archive.org/10/items/019_20221105/', availableSurahs: [1, 2, 3, 4, 5, 6, 12, 14, 17, 18, 19, 20, 23, 25, 30, 32, 33, 35, 36, 39, 49, 50, 55, 59, 66, 69, 73, 85, 86, 87, 89, 90, 91, 92, 93, 97, 98, 99, 108] },


    // ========== القراء السعوديون - Saudi Reciters ==========
    // مشاري راشد العفاسي - مرتّل (مصدر: surahquran.com/mp3/Alafasi/)
    { id: 'ar.alafasy', nameAr: 'مشاري راشد العفاسي - مرتّل', nameEn: 'Mishary Alafasy (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/artworks-000177619242-tedo9r-t500x500.jpg', mp3quranId: 'afs', dynamicUrl: 'https://server8.mp3quran.net/afs/{n3}.mp3', serverUrl: 'https://server8.mp3quran.net/afs/', audioId: 'ar.alafasy' },

    // ماهر المعيقلي - مرتّل (مصدر: surahquran.com/mp3/maher/)
    { id: 'ar.mahermuaiqly', nameAr: 'ماهر المعيقلي - مرتّل', nameEn: 'Maher Al-Muaiqly (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/profile.jpg', mp3quranId: 'maher', dynamicUrl: 'https://server12.mp3quran.net/maher/{n3}.mp3', serverUrl: 'https://server12.mp3quran.net/maher/' },

    // عبدالرحمن السديس - مرتّل (مصدر: surahquran.com/mp3/Alsudaes/)
    { id: 'ar.sudais', nameAr: 'عبدالرحمن السديس - مرتّل', nameEn: 'Abdur-Rahman As-Sudais (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/OIP.jpg', mp3quranId: 'sds', dynamicUrl: 'https://server11.mp3quran.net/sds/{n3}.mp3', serverUrl: 'https://server11.mp3quran.net/sds/' },

    // سعود الشريم - مرتّل (مصدر: surahquran.com/mp3/Al-Shuraim/)
    { id: 'ar.shuraym', nameAr: 'سعود الشريم - مرتّل', nameEn: 'Saud Ash-Shuraym (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/OIP2.jpg', mp3quranId: 'shur', dynamicUrl: 'https://server7.mp3quran.net/shur/{n3}.mp3', serverUrl: 'https://server7.mp3quran.net/shur/' },

    // ياسر الدوسري - مرتّل (مصدر: surahquran.com/mp3/Al-Dosari/)
    { id: 'ar.yasserdossary', nameAr: 'ياسر الدوسري - مرتّل', nameEn: 'Yasser Al-Dosari (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/OIP3.jpg', mp3quranId: 'yasser', dynamicUrl: 'https://server11.mp3quran.net/yasser/{n3}.mp3', serverUrl: 'https://server11.mp3quran.net/yasser/' },

    // بندر بليلة
    { id: 'ar.bandarbaleela', nameAr: 'بندر بليلة - مرتّل', nameEn: 'Bandar Baleela (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/الشيخ-بندر-بليلة-1691504353-0.jpg', mp3quranId: 'balilah', dynamicUrl: 'https://server6.mp3quran.net/balilah/{n3}.mp3', serverUrl: 'https://server6.mp3quran.net/balilah/' },

    // سعد الغامدي - مرتّل (مصدر: surahquran.com/mp3/Al-Ghamdi/)
    { id: 'ar.saadalghamdi', nameAr: 'سعد الغامدي - مرتّل', nameEn: 'Saad Al-Ghamdi (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/1200x1200bf-60.jpg', mp3quranId: 's_gmd', dynamicUrl: 'https://server7.mp3quran.net/s_gmd/{n3}.mp3', serverUrl: 'https://server7.mp3quran.net/s_gmd/' },

    // بدر التركي - مرتّل (مصدر: https://surahquran.com/mp3/badr-alturki/)
    { id: 'ar.badralturki', nameAr: 'بدر التركي - مرتّل', nameEn: 'Badr Al-Turki (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/OIP.webp', mp3quranId: 'bader', dynamicUrl: 'https://server10.mp3quran.net/bader/Rewayat-Hafs-A-n-Assem/{n3}.mp3', serverUrl: 'https://server10.mp3quran.net/bader/Rewayat-Hafs-A-n-Assem/' }
];


function getMp3QuranUrl(reciter, surahNumber, useFallback) {
    // 1. Dynamic scalable {n} and {n3} URL pattern matching (NEW LOGIC)
    if (reciter.dynamicUrl && !useFallback) {
        let url = reciter.dynamicUrl;
        // {n} -> 1, 2, ..., 114
        url = url.replace('{n}', surahNumber);
        // {n3} -> 001, 002, ..., 114
        url = url.replace('{n3}', String(surahNumber).padStart(3, '0'));
        return url;
    }

    // 2. Original Fallback & standard Server URL logic
    const base = useFallback ? reciter.serverUrlFallback : reciter.serverUrl;
    if (!base) return null;
    const surahStr = String(surahNumber).padStart(3, '0');
    return `${base}${surahStr}.mp3`;
}

function getAudioEdition(reciter) {
    return reciter.audioId || reciter.id;
}

export const AudioProvider = ({ children }) => {
    const [currentSurah, setCurrentSurah] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentReciter, setCurrentReciter] = useState(RECITERS[0]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const mediaSessionActiveRef = useRef(false);

    const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'one', 'all'
    const repeatModeRef = useRef('off');
    useEffect(() => { repeatModeRef.current = repeatMode; }, [repeatMode]);

    const [sleepTimerMinutes, setSleepTimerMinutes] = useState(0);
    const sleepTimerRef = useRef(null);

    const audioRef = useRef(new Audio());
    const verseQueueRef = useRef([]);
    const verseIndexRef = useRef(0);
    const lastSingleSurahRef = useRef(null); // { reciter, surahNumber } عند تشغيل سورة كاملة (غير آية بآية)

    const currentSurahRef = useRef(null);
    const playSurahRef = useRef(null);

    useEffect(() => {
        currentSurahRef.current = currentSurah;
    }, [currentSurah]);

    /** إيقاف القراءة بالكامل وإخفاء الشريط */
    const stopPlay = React.useCallback(() => {
        audioRef.current.pause();
        audioRef.current.src = '';
        setCurrentTime(0);
        setDuration(0);
        verseQueueRef.current = [];
        verseIndexRef.current = 0;
        setCurrentSurah(null);
        setIsPlaying(false);

        if (sleepTimerRef.current) {
            clearTimeout(sleepTimerRef.current);
            sleepTimerRef.current = null;
        }
        setSleepTimerMinutes(0);

        if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
            CapacitorMusicControls.destroy();
            mediaNotificationManager.clearQuran();
        }
    }, []);

    useEffect(() => {
        const audio = audioRef.current;

        const setTime = () => {
            setCurrentTime(audio.currentTime);
            try {
                if (mediaSessionActiveRef.current) {
                    CapacitorMusicControls.updateElapsed({
                        elapsed: Math.floor(audio.currentTime * 1000),
                        isPlaying: !audio.paused
                    });
                }
            } catch (e) { }
        };

        const setAudioDuration = () => {
            const newDur = audio.duration;
            setDuration(newDur);
            if (currentSurah && currentReciter && !audio.paused) {
                updateMediaSession(currentSurah.name, currentReciter.nameAr);
            }
        };

        audio.addEventListener('timeupdate', setTime);
        audio.addEventListener('loadedmetadata', setAudioDuration);
        audio.addEventListener('durationchange', () => {
            setAudioDuration();
            // Trigger a refresh of the media session once duration is known
            if (currentSurah && currentReciter && !audio.paused) {
                updateMediaSession(currentSurah.name, currentReciter.nameAr);
            }
        });

        // Native OS Music Controls Event Listener - Handle events from the document bridge
        const handleNotification = (event) => {
            let action = event;
            try {
                // If it's a CustomEvent, the data is in event.detail
                // If it came from triggerJSEvent, it's often a stringified JSON
                if (event.detail && typeof event.detail === 'string') {
                    action = JSON.parse(event.detail);
                } else if (event.detail) {
                    action = event.detail;
                } else if (typeof event === 'string') {
                    action = JSON.parse(event);
                }
            } catch (e) {
                console.error('Media control action parse error', e);
                return;
            }

            if (!action || !action.message) return;
            const msg = action.message;

            if (msg === 'music-controls-play') {
                audio.play().catch(e => console.warn('Native play failed:', e));
                setIsPlaying(true);
                if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
                    CapacitorMusicControls.updateIsPlaying({ isPlaying: true });
                }
            } else if (msg === 'music-controls-pause') {
                audio.pause();
                setIsPlaying(false);
                if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
                    CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
                }
            } else if (msg === 'music-controls-destroy') {
                // Background Quran fix: Stop button = pause only
                audio.pause();
                setIsPlaying(false);
                if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
                    CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
                }
            } else if (msg === 'music-controls-seek-to') {
                const seekMs = action.position;
                if (typeof seekMs === 'number') {
                    const seekSec = seekMs / 1000;
                    audio.currentTime = Math.min(seekSec, audio.duration || 0);
                    setCurrentTime(audio.currentTime);
                }
            }
        };

        document.addEventListener('controlsNotification', handleNotification);

        const handleExternalMedia = () => {
            if (!audio.paused) {
                audio.pause();
                setIsPlaying(false);
                if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
                    CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
                }
            }
        };

        window.addEventListener(audioCoordinator.events.ADHAN_STARTED, handleExternalMedia);
        window.addEventListener(audioCoordinator.events.RADIO_STARTED, handleExternalMedia);
        window.addEventListener(audioCoordinator.events.STOP_QURAN, handleExternalMedia);
        window.addEventListener(audioCoordinator.events.STOP_ALL, handleExternalMedia);

        return () => {
            audio.removeEventListener('timeupdate', setTime);
            audio.removeEventListener('loadedmetadata', setAudioDuration);
            audio.removeEventListener('durationchange', setAudioDuration);
            document.removeEventListener('controlsNotification', handleNotification);
            window.removeEventListener(audioCoordinator.events.ADHAN_STARTED, handleExternalMedia);
            window.removeEventListener(audioCoordinator.events.RADIO_STARTED, handleExternalMedia);
            window.removeEventListener(audioCoordinator.events.STOP_QURAN, handleExternalMedia);
            window.removeEventListener(audioCoordinator.events.STOP_ALL, handleExternalMedia);
        };
    }, [stopPlay, currentSurah, currentReciter]);

    const updateMediaSession = (surahName, reciterName) => {
        if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
            const audio = audioRef.current;
            if (!audio || !surahName) return;

            mediaSessionActiveRef.current = true;
            CapacitorMusicControls.create({
                track: `📿 سورة ${surahName}`,
                artist: `🎙 ${reciterName}`,
                cover: currentReciter?.image ? currentReciter.image.replace(/^\//, '') : 'icons/icon-512x512.png',
                duration: audio.duration && !isNaN(audio.duration) ? Math.floor(audio.duration * 1000) : 0,
                elapsed: Math.floor(audio.currentTime * 1000) || 0,
                isPlaying: !audio.paused,
                dismissable: false, // Prevent OS from swiping it away completely on pause
                hasPrev: false,
                hasNext: false,
                hasClose: false, // Remove the X button so the user can only pause/resume

                hasScrubbing: true,
                playIcon: '',
                pauseIcon: '',
                closeIcon: '',
                notificationIcon: ''
            }).then(() => {
                CapacitorMusicControls.updateIsPlaying({ isPlaying: !audio.paused });
            }).catch(e => console.warn('MusicControls create error', e));
        }
    };

    // Reactive Synchronization: Ensure Media Session is always in sync with state
    useEffect(() => {
        if (isPlaying && currentSurah && currentReciter) {
            updateMediaSession(currentSurah.name, currentReciter.nameAr);
            mediaNotificationManager.showQuran({ surahName: currentSurah.name, reciterName: currentReciter.nameAr });
        } else if (!isPlaying && mediaSessionActiveRef.current) {
            if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
                CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
            }
        }
    }, [isPlaying, currentSurah, currentReciter, audioRef.current?.src]);

    useEffect(() => {
        const savedReciterId = localStorage.getItem('zad_reciter');
        if (savedReciterId) {
            const r = RECITERS.find(x => x.id === savedReciterId);
            if (r) setCurrentReciter(r);
        }
    }, []);

    const changeReciter = (reciterId) => {
        const r = RECITERS.find(x => x.id === reciterId);
        if (r) {
            setCurrentReciter(r);
            localStorage.setItem('zad_reciter', r.id);
            verseQueueRef.current = [];
            if (currentSurah) {
                const wasPlaying = isPlaying;
                audioRef.current.pause();
                if (r.verseByVerseId) {
                    fetch(`${AYAH_API}/${currentSurah.number}/${r.verseByVerseId}`)
                        .then((res) => res.json())
                        .then((data) => {
                            const urls = (data.data?.ayahs || []).map((a) => a.audio).filter(Boolean);
                            if (urls.length && wasPlaying) {
                                verseQueueRef.current = urls;
                                verseIndexRef.current = 0;
                                audioRef.current.src = urls[0];
                                audioRef.current.play().catch(() => setIsPlaying(false));
                            }
                        })
                        .catch(() => { });
                } else {
                    // جرب mp3quran.net أولاً، ثم CDN
                    const mp3quranUrl = getMp3QuranUrl(r, currentSurah.number);
                    const cdnUrl = `${CDN_BASE}/${getAudioEdition(r)}/${currentSurah.number}.mp3`;
                    const audioUrl = mp3quranUrl || cdnUrl;
                    audioRef.current.src = audioUrl;

                    if (wasPlaying) {
                        const playPromise = audioRef.current.play();
                        if (playPromise && typeof playPromise.catch === 'function') {
                            playPromise.catch((e) => {
                                console.warn('Audio play failed:', audioUrl, e);
                                const fallbackMp3 = r.serverUrlFallback ? getMp3QuranUrl(r, currentSurah.number, true) : null;
                                if (fallbackMp3) {
                                    audioRef.current.src = fallbackMp3;
                                    audioRef.current.play().catch(() => setIsPlaying(false));
                                    return;
                                }
                                if (mp3quranUrl && !r.verseByVerseId) {
                                    audioRef.current.src = cdnUrl;
                                    audioRef.current.play().catch(() => setIsPlaying(false));
                                } else {
                                    setIsPlaying(false);
                                }
                            });
                        }
                    }
                }
            }
        }
    };

    const playVerseQueue = (urls, surahNumber, surahName) => {
        if (!urls.length) return;
        verseQueueRef.current = urls;
        verseIndexRef.current = 0;
        lastSingleSurahRef.current = null;
        setCurrentSurah({ number: surahNumber, name: surahName });
        setIsPlaying(true);
        updateMediaSession(surahName, currentReciter.nameAr);
        audioRef.current.src = urls[0];
        audioRef.current.play().catch(() => setIsPlaying(false));
        cacheLastQuranTrack({
            surahNumber,
            surahName,
            reciterId: currentReciter?.id || null,
            audioUrl: urls[0],
            mode: 'verse'
        });

        if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
            CapacitorMusicControls.updateIsPlaying({ isPlaying: true });
        }
        audioCoordinator.startQuran({ source: 'quran-player' });
    };

    /**
     * تشغيل سورة (اختياري: تمرير القارئ لاستخدامه فوراً بدل انتظار تحديث الحالة)
     * @param {number} surahNumber
     * @param {string} surahName
     * @param {object} [reciterOverride] - إن وُجد يُستخدم للتشغيل ويُحفظ كقارئ حالي
     */
    const playSurah = (surahNumber, surahName, reciterOverride) => {
        const reciter = reciterOverride || currentReciter;
        if (reciterOverride) {
            setCurrentReciter(reciterOverride);
            if (typeof localStorage !== 'undefined') localStorage.setItem('zad_reciter', reciterOverride.id);
        }

        if (currentSurah?.number === surahNumber && !reciterOverride) {
            if (isPlaying) {
                audioRef.current.pause();
                verseQueueRef.current = [];
                setIsPlaying(false);
                if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
                    CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
                }
            } else {
                if (verseQueueRef.current.length) {
                    audioRef.current.play().catch(() => setIsPlaying(false));
                    if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
                        CapacitorMusicControls.updateIsPlaying({ isPlaying: true });
                    }
                } else if (reciter.verseByVerseId) {
                    fetch(`${AYAH_API}/${surahNumber}/${reciter.verseByVerseId}`)
                        .then((res) => res.json())
                        .then((data) => {
                            const urls = (data.data?.ayahs || []).map((a) => a.audio).filter(Boolean);
                            if (urls.length) playVerseQueue(urls, surahNumber, surahName);
                        })
                        .catch(() => setIsPlaying(false));
                } else {
                    audioRef.current.play().catch(() => setIsPlaying(false));
                    if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
                        CapacitorMusicControls.updateIsPlaying({ isPlaying: true });
                    }
                }
            }
            return;
        }

        verseQueueRef.current = [];

        if (reciter.verseByVerseId) {
            fetch(`${AYAH_API}/${surahNumber}/${reciter.verseByVerseId}`)
                .then((res) => res.json())
                .then((data) => {
                    const urls = (data.data?.ayahs || []).map((a) => a.audio).filter(Boolean);
                    if (urls.length) playVerseQueue(urls, surahNumber, surahName);
                    else setIsPlaying(false);
                })
                .catch(() => setIsPlaying(false));
            return;
        }

        // جرب mp3quran.net أولاً، ثم CDN
        const mp3quranUrl = getMp3QuranUrl(reciter, surahNumber);
        const cdnUrl = `${CDN_BASE}/${getAudioEdition(reciter)}/${surahNumber}.mp3`;
        const audioUrl = mp3quranUrl || cdnUrl;

        audioRef.current.src = audioUrl;
        setCurrentSurah({ number: surahNumber, name: surahName });
        verseQueueRef.current = [];
        lastSingleSurahRef.current = { reciter, surahNumber };

        const playPromise = audioRef.current.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch((e) => {
                console.warn('Audio play failed:', audioUrl, e);
                const fallbackMp3 = reciter.serverUrlFallback ? getMp3QuranUrl(reciter, surahNumber, true) : null;
                if (fallbackMp3) {
                    audioRef.current.src = fallbackMp3;
                    audioRef.current.play().catch(() => setIsPlaying(false));
                    return;
                }
                if (mp3quranUrl && !reciter.verseByVerseId) {
                    audioRef.current.src = cdnUrl;
                    audioRef.current.play().catch(() => setIsPlaying(false));
                } else {
                    setIsPlaying(false);
                }
            });
        }
        setIsPlaying(true);
        audioCoordinator.startQuran({ source: 'quran-player' });
        cacheLastQuranTrack({
            surahNumber,
            surahName,
            reciterId: reciter?.id || null,
            audioUrl,
            mode: 'surah'
        });
    };

    playSurahRef.current = playSurah;

    const togglePlay = () => {
        if (!currentSurah) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            const p = audioRef.current.play();
            if (p && typeof p.catch === 'function') {
                p.catch(() => {
                    setIsPlaying(false);
                });
            }
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        const onPlay = () => {
            if (!currentSurahRef.current) return;
            const p = audioRef.current.play();
            setIsPlaying(true);
            if (p && typeof p.catch === 'function') {
                p.catch(() => setIsPlaying(false));
            }
        };
        const onPause = () => {
            audioRef.current.pause();
            setIsPlaying(false);
        };
        const onStop = () => stopPlay();

        window.addEventListener('audio-action-quran-play', onPlay);
        window.addEventListener('audio-action-quran-pause', onPause);
        window.addEventListener('audio-action-quran-stop', onStop);
        return () => {
            window.removeEventListener('audio-action-quran-play', onPlay);
            window.removeEventListener('audio-action-quran-pause', onPause);
            window.removeEventListener('audio-action-quran-stop', onStop);
        };
    }, [stopPlay]);

    // Handle audio end: إما انتهت السورة أو ننتقل للآية التالية (آية بآية)
    useEffect(() => {
        const audio = audioRef.current;

        const moveToNextSurah = () => {
            const surah = currentSurahRef.current;
            if (surah && surah.number < 114) {
                const nextNum = surah.number + 1;
                if (playSurahRef.current) {
                    playSurahRef.current(nextNum, SURAH_NAMES_VOWELLED[nextNum - 1]);
                }
            } else if (surah && surah.number === 114 && repeatModeRef.current === 'all') {
                if (playSurahRef.current) {
                    playSurahRef.current(1, SURAH_NAMES_VOWELLED[0]);
                }
            } else {
                verseQueueRef.current = [];
                setIsPlaying(false);
            }
        };

        const handleEnded = () => {
            const queue = verseQueueRef.current;
            if (queue.length > 0) {
                verseIndexRef.current += 1;
                const next = verseIndexRef.current;
                if (next < queue.length) {
                    audio.src = queue[next];
                    audio.play().catch(() => setIsPlaying(false));
                } else {
                    if (repeatModeRef.current === 'one') {
                        verseIndexRef.current = 0;
                        audio.src = queue[0];
                        audio.play().catch(() => setIsPlaying(false));
                    } else {
                        moveToNextSurah();
                    }
                }
            } else {
                if (repeatModeRef.current === 'one') {
                    audio.currentTime = 0;
                    audio.play().catch(() => setIsPlaying(false));
                } else {
                    moveToNextSurah();
                }
            }
        };
        const handleError = () => {
            const queue = verseQueueRef.current;
            if (queue.length > 0 && verseIndexRef.current < queue.length - 1) {
                verseIndexRef.current += 1;
                audio.src = queue[verseIndexRef.current];
                audio.play().catch(() => setIsPlaying(false));
            } else {
                const last = lastSingleSurahRef.current;
                const fallbackUrl = last?.reciter?.serverUrlFallback ? getMp3QuranUrl(last.reciter, last.surahNumber, true) : null;
                if (fallbackUrl) {
                    lastSingleSurahRef.current = null;
                    audio.src = fallbackUrl;
                    audio.play().catch(() => setIsPlaying(false));
                    return;
                }
                verseQueueRef.current = [];
                setIsPlaying(false);
            }
        };
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
        };
    }, []);

    const seek = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const setSleepTimer = (minutes) => {
        setSleepTimerMinutes(minutes);
        if (sleepTimerRef.current) {
            clearTimeout(sleepTimerRef.current);
            sleepTimerRef.current = null;
        }
        if (minutes > 0) {
            sleepTimerRef.current = setTimeout(() => {
                stopPlay();
                setSleepTimerMinutes(0);
            }, minutes * 60 * 1000);
        }
    };

    const toggleRepeatMode = () => {
        setRepeatMode(prev => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off');
    };

    return (
        <AudioContext.Provider value={{
            currentSurah,
            isPlaying,
            playSurah,
            togglePlay,
            stopPlay,
            currentReciter,
            changeReciter,
            RECITERS,
            currentTime,
            duration,
            seek,
            repeatMode,
            toggleRepeatMode,
            sleepTimerMinutes,
            setSleepTimer
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
