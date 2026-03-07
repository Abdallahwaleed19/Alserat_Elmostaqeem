const fs = require('fs');

const content = fs.readFileSync('src/context/AudioContext.jsx.bak', 'utf-8');

// The new RECITERS with serverUrls
const updatedReciters = `
export const RECITERS = [
    // ========== القراء المصريون - Egyptian Reciters ==========
    // محمد صديق المنشاوي
    { id: 'ar.minshawi', nameAr: 'محمد صديق المنشاوي - مجوّد', nameEn: 'Al-Minshawy (Mujawwad)', category: 'egyptian', style: 'مجوّد', styleEn: 'Mujawwad', image: '/images/minshawi.jpg', mp3quranId: 'minsh', serverUrl: 'https://server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad/', audioId: 'ar.muhammadsiddiqalminshawimujawwad' },
    { id: 'ar.minshawi.murattal', nameAr: 'محمد صديق المنشاوي - مرتّل', nameEn: 'Al-Minshawy (Murattal)', category: 'egyptian', style: 'مرتّل', styleEn: 'Murattal', image: '/images/minshawi.jpg', mp3quranId: 'minsh', serverUrl: 'https://server10.mp3quran.net/minsh/', verseByVerseId: 'ar.minshawi' },

    // عبد الباسط عبد الصمد
    { id: 'ar.abdulbasitmurattal', nameAr: 'عبد الباسط عبد الصمد - مرتّل', nameEn: 'Abdul Basit (Murattal)', category: 'egyptian', style: 'مرتّل', styleEn: 'Murattal', image: '/images/abdulbasit.jpg', mp3quranId: 'basit', serverUrl: 'https://server7.mp3quran.net/basit/', audioId: 'ar.abdulbasitmurattal' },
    { id: 'ar.abdulbasit.mujawwad', nameAr: 'عبد الباسط عبد الصمد - مجوّد', nameEn: 'Abdul Basit (Mujawwad)', category: 'egyptian', style: 'مجوّد', styleEn: 'Mujawwad', image: '/images/abdulbasit.jpg', mp3quranId: 'basit', serverUrl: 'https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/', audioId: 'ar.abdulbasitmujawwad' },

    // محمود خليل الحصري
    { id: 'ar.husary', nameAr: 'محمود خليل الحصري - مرتّل', nameEn: 'Al-Husary (Murattal)', category: 'egyptian', style: 'مرتّل', styleEn: 'Murattal', image: '/images/maxresdefault.jpg', mp3quranId: 'husr', serverUrl: 'https://server13.mp3quran.net/husr/', verseByVerseId: 'ar.husary' },
    { id: 'ar.husary.mujawwad', nameAr: 'محمود خليل الحصري - مجوّد', nameEn: 'Al-Husary (Mujawwad)', category: 'egyptian', style: 'مجوّد', styleEn: 'Mujawwad', image: '/images/maxresdefault.jpg', mp3quranId: 'husr', serverUrl: 'https://server13.mp3quran.net/husr/Almusshaf-Al-Mojawwad/', verseByVerseId: 'ar.husarymujawwad' },

    // محمد رفعت - استخدام الحصري مرتّل كبديل
    { id: 'ar.muhammadrefat', nameAr: 'محمد رفعت - مجوّد', nameEn: 'Muhammad Refat (Mujawwad)', category: 'egyptian', style: 'مجوّد', styleEn: 'Mujawwad', image: '/images/R.jpg', mp3quranId: 'refat', serverUrl: 'https://server14.mp3quran.net/refat/', verseByVerseId: 'ar.husarymujawwad' },

    // محمود علي البنا
    { id: 'ar.albanna', nameAr: 'محمود علي البنا - مرتّل', nameEn: 'Al-Banna (Murattal)', category: 'egyptian', style: 'مرتّل', styleEn: 'Murattal', image: '/images/artworks-gd2VK9TkQ11WYC4l-66KqcQ-t1080x1080.jpg', mp3quranId: 'bna', serverUrl: 'https://server8.mp3quran.net/bna/', audioId: 'ar.mahmoudalialbanna' },

    // أبو العينين شعيشع
    { id: 'ar.shuaisha', nameAr: 'أبو العينين شعيشع - مجوّد', nameEn: 'Abu Al-Ainain Shuaisha (Mujawwad)', category: 'egyptian', style: 'مجوّد', styleEn: 'Mujawwad', image: '/images/R (1).jpg', mp3quranId: 'shuaisha', audioId: 'ar.abdulbasitmujawwad' },

    // مصطفى إسماعيل - يستخدم مسار خاص
    { id: 'ar.mustafaismail', nameAr: 'مصطفى إسماعيل - مجوّد', nameEn: 'Mustafa Ismail (Mujawwad)', category: 'egyptian', style: 'مجوّد', styleEn: 'Mujawwad', image: '/images/41e55ea6e5e5d70798320e94d447cdb7.jpg', mp3quranId: 'mustafa/Almusshaf-Al-Mojawwad', serverUrl: 'https://server8.mp3quran.net/mustafa/Almusshaf-Al-Mojawwad/', audioId: 'ar.mustafaismail' },

    // أحمد نعينع
    { id: 'ar.ahmad_nawina', nameAr: 'أحمد نعينع - مرتّل', nameEn: 'Ahmed Naina (Murattal)', category: 'egyptian', style: 'مرتّل', styleEn: 'Murattal', image: '/images/OIP4.webp', mp3quranId: 'ahmad_nu', serverUrl: 'https://server11.mp3quran.net/ahmad_nu/', verseByVerseId: 'ar.husary' },

    // السيد سعيد
    { id: 'ar.sayed_saeed', nameAr: 'السيد سعيد - مجوّد', nameEn: 'Al-Sayed Saeed (Mujawwad)', category: 'egyptian', style: 'مجوّد', styleEn: 'Mujawwad', image: '/images/1071822.png.webp', mp3quranId: 'sayed', serverUrl: 'https://server12.mp3quran.net/sayed/', verseByVerseId: 'ar.minshawimujawwad' },

    // ========== القراء السعوديون - Saudi Reciters ==========
    // مشاري العفاسي
    { id: 'ar.alafasy', nameAr: 'مشاري راشد العفاسي - مرتّل', nameEn: 'Mishary Alafasy (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/artworks-000177619242-tedo9r-t500x500.jpg', mp3quranId: 'afs', serverUrl: 'https://server8.mp3quran.net/afs/', audioId: 'ar.alafasy' },

    // ماهر المعيقلي
    { id: 'ar.mahermuaiqly', nameAr: 'ماهر المعيقلي - مرتّل', nameEn: 'Maher Al-Muaiqly (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/profile.jpg', mp3quranId: 'maher', serverUrl: 'https://server12.mp3quran.net/maher/', verseByVerseId: 'ar.mahermuaiqly' },

    // عبدالرحمن السديس
    { id: 'ar.sudais', nameAr: 'عبدالرحمن السديس - مرتّل', nameEn: 'Abdur-Rahman As-Sudais (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/OIP.jpg', mp3quranId: 'sds', serverUrl: 'https://server11.mp3quran.net/sds/', verseByVerseId: 'ar.abdurrahmaansudais' },

    // سعود الشريم
    { id: 'ar.shuraym', nameAr: 'سعود الشريم - مرتّل', nameEn: 'Saud Ash-Shuraym (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/OIP2.jpg', mp3quranId: 'shur', serverUrl: 'https://server7.mp3quran.net/shur/', verseByVerseId: 'ar.saoodshuraym' },

    // ياسر الدوسري
    { id: 'ar.yasserdossary', nameAr: 'ياسر الدوسري - مرتّل', nameEn: 'Yasser Al-Dosari (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/OIP3.jpg', mp3quranId: 'yasser', serverUrl: 'https://server11.mp3quran.net/yasser/', audioId: 'ar.yasseraldossari' },

    // بندر بليلة
    { id: 'ar.bandarbaleela', nameAr: 'بندر بليلة - مرتّل', nameEn: 'Bandar Baleela (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/الشيخ-بندر-بليلة-1691504353-0.jpg', mp3quranId: 'balilah', serverUrl: 'https://server6.mp3quran.net/balilah/', audioId: 'ar.bandarbalila' },

    // سعد الغامدي
    { id: 'ar.saadalghamdi', nameAr: 'سعد الغامدي - مرتّل', nameEn: 'Saad Al-Ghamdi (Murattal)', category: 'saudi', style: 'مرتّل', styleEn: 'Murattal', image: '/images/1200x1200bf-60.jpg', mp3quranId: 's_gmd', serverUrl: 'https://server7.mp3quran.net/s_gmd/', verseByVerseId: 'ar.saoodshuraym' }
];`.trim();

// Construct new URL functions
const newFunctions = `
function getMp3QuranUrl(reciter, surahNumber) {
    if (!reciter.serverUrl) return null;
    const surahStr = String(surahNumber).padStart(3, '0');
    return \`\${reciter.serverUrl}\${surahStr}.mp3\`;
}

function getAudioEdition(reciter) {
    return reciter.audioId || reciter.id;
}
`.trim();

let newContent = content;

// Replace MP3QURAN_SERVERS and AYAH API
newContent = newContent.replace(
    /\/\/ مصادر متعددة: mp3quran\.net.*\n\/\/ mp3quran\.net يستخدم خوادم متعددة.*\nconst MP3QURAN_SERVERS = \[[\s\S]*?\];\nconst CDN_BASE = 'https:\/\/cdn\.islamic\.network\/quran\/audio-surah\/128';\nconst AYAH_API = 'https:\/\/api\.alquran\.cloud\/v1\/surah';/,
    `// مصادر متعددة: mp3quran.net (الأولوية)، ثم CDN، ثم آية-بآية من api.alquran.cloud
const CDN_BASE = 'https://cdn.islamic.network/quran/audio-surah/128';
const AYAH_API = 'https://api.alquran.cloud/v1/surah';`
);

// Replace RECITERS
newContent = newContent.replace(/export const RECITERS = \[[\s\S]*?\];/, updatedReciters);

// Replace getMp3QuranUrls logic
newContent = newContent.replace(/function getMp3QuranUrl\([\s\S]*?function getAudioEdition/g, getMp3QuranUrlReplacer);

function getMp3QuranUrlReplacer(match) {
    return `${newFunctions}\n\nfunction getAudioEdition`;
}

newContent = newContent.replace(/function getMp3QuranUrl\(reciter, surahNumber\) {[\s\S]*?function getAudioEdition/, newFunctions + "\n\nfunction getAudioEdition");


// Replace changeReciter's CDN fallback tryPlayAudio block
const oldPlayBlock1 = `                    if (wasPlaying) {
                        const tryPlayAudio = (url, fallbackUrls = []) => {
                            audioRef.current.src = url;
                            const playPromise = audioRef.current.play();
                            if (playPromise && typeof playPromise.catch === 'function') {
                                playPromise.catch((e) => {
                                    if (fallbackUrls.length > 0) {
                                        tryPlayAudio(fallbackUrls[0], fallbackUrls.slice(1));
                                    } else if (mp3quranUrl && !r.verseByVerseId) {
                                        const cdnUrl = \`\${CDN_BASE}/\${getAudioEdition(r)}/\${currentSurah.number}.mp3\`;
                                        audioRef.current.src = cdnUrl;
                                        audioRef.current.play().catch(() => setIsPlaying(false));
                                    } else {
                                        setIsPlaying(false);
                                    }
                                });
                            }
                        };
                        
                        if (mp3quranUrl) {
                            const allUrls = getMp3QuranUrls(r, currentSurah.number);
                            tryPlayAudio(mp3quranUrl, allUrls.filter(u => u !== mp3quranUrl));
                        } else {
                            tryPlayAudio(audioUrl);
                        }
                    }`;

const newPlayBlock1 = `                    if (wasPlaying) {
                        const playPromise = audioRef.current.play();
                        if (playPromise && typeof playPromise.catch === 'function') {
                            playPromise.catch((e) => {
                                console.warn('Audio play failed:', audioUrl, e);
                                if (mp3quranUrl && !r.verseByVerseId) {
                                    const cdnUrl = \`\${CDN_BASE}/\${getAudioEdition(r)}/\${currentSurah.number}.mp3\`;
                                    audioRef.current.src = cdnUrl;
                                    audioRef.current.play().catch(() => setIsPlaying(false));
                                } else {
                                    setIsPlaying(false);
                                }
                            });
                        }
                    }`;

newContent = newContent.replace(oldPlayBlock1, newPlayBlock1);

// Replace playSurah's fallback block
const oldPlayBlock2 = `        // جرب mp3quran.net أولاً، ثم CDN
        const mp3quranUrl = getMp3QuranUrl(reciter, surahNumber);
        const audioUrl = mp3quranUrl || \`\${CDN_BASE}/\${getAudioEdition(reciter)}/\${surahNumber}.mp3\`;
        audioRef.current.src = audioUrl;
        setCurrentSurah({ number: surahNumber, name: surahName });
        verseQueueRef.current = [];
        
        // معالجة الأخطاء: إذا فشل mp3quran.net، جرب خوادم أخرى أو CDN
        const tryPlayAudio = (url, fallbackUrls = []) => {
            audioRef.current.src = url;
            const playPromise = audioRef.current.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch((e) => {
                    console.warn('Audio play failed:', url, e);
                    // إذا فشل، جرب خوادم أخرى من mp3quran.net
                    if (fallbackUrls.length > 0) {
                        tryPlayAudio(fallbackUrls[0], fallbackUrls.slice(1));
                    } else if (mp3quranUrl && !reciter.verseByVerseId) {
                        // إذا فشلت جميع خوادم mp3quran.net، جرب CDN
                        const cdnUrl = \`\${CDN_BASE}/\${getAudioEdition(reciter)}/\${surahNumber}.mp3\`;
                        audioRef.current.src = cdnUrl;
                        audioRef.current.play().catch(() => setIsPlaying(false));
                    } else {
                        setIsPlaying(false);
                    }
                });
            }
        };
        
        if (mp3quranUrl) {
            const allUrls = getMp3QuranUrls(reciter, surahNumber);
            tryPlayAudio(mp3quranUrl, allUrls.filter(u => u !== mp3quranUrl));
        } else {
            tryPlayAudio(audioUrl);
        }
        setIsPlaying(true);`;

const newPlayBlock2 = `        // جرب mp3quran.net أولاً، ثم CDN
        const mp3quranUrl = getMp3QuranUrl(reciter, surahNumber);
        const cdnUrl = \`\${CDN_BASE}/\${getAudioEdition(reciter)}/\${surahNumber}.mp3\`;
        const audioUrl = mp3quranUrl || cdnUrl;
        
        audioRef.current.src = audioUrl;
        setCurrentSurah({ number: surahNumber, name: surahName });
        verseQueueRef.current = [];
        
        const playPromise = audioRef.current.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch((e) => {
                console.warn('Audio play failed:', audioUrl, e);
                if (mp3quranUrl && !reciter.verseByVerseId) {
                    audioRef.current.src = cdnUrl;
                    audioRef.current.play().catch(() => setIsPlaying(false));
                } else {
                    setIsPlaying(false);
                }
            });
        }
        setIsPlaying(true);`;

newContent = newContent.replace(oldPlayBlock2, newPlayBlock2);

fs.writeFileSync('src/context/AudioContext.jsx', newContent);
console.log("Successfully patched AudioContext.jsx");
