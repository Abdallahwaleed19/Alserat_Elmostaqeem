import React from 'react';
import { Play, Pause, X } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useLanguage } from '../../context/LanguageContext';
import { SURAH_NAMES_VOWELLED } from '../../data/surahNamesVowelled';
import './AudioPlayer.css';

const AudioPlayer = () => {
    const { currentSurah, isPlaying, togglePlay, stopPlay, currentReciter, currentTime, duration, seek } = useAudio();
    const { lang } = useLanguage();

    if (!currentSurah) return null;

    const surahLabel = lang === 'ar' ? 'سورة' : 'Surah';
    const name = (currentSurah.name || '').trim();
    const nameAlreadyHasSurah = name.startsWith('سورة') || name.startsWith('Surah');
    const defaultDisplay = nameAlreadyHasSurah ? name : `${surahLabel} ${name}`;
    const surahDisplay =
        lang === 'ar' &&
            currentSurah.number >= 1 &&
            currentSurah.number <= 114 &&
            SURAH_NAMES_VOWELLED[currentSurah.number - 1]
            ? SURAH_NAMES_VOWELLED[currentSurah.number - 1]
            : defaultDisplay;
    const reciterName = lang === 'ar' ? currentReciter?.nameAr : currentReciter?.nameEn;

    const formatTime = (timeInSeconds) => {
        if (!timeInSeconds || isNaN(timeInSeconds)) return '0:00';
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        seek(time);
    };

    return (
        <div className="audio-player-container flex flex-col">
            {/* Progress Bar Area */}
            <div className="audio-progress-bar-container" style={{ width: '100%', height: '4px', background: 'var(--color-surface)', position: 'absolute', top: 0, left: 0 }}>
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime || 0}
                    onChange={handleSeek}
                    dir="ltr"
                    className="audio-timeline-slider"
                    style={{
                        position: 'absolute', width: '100%', height: '100%', top: 0, left: 0,
                        WebkitAppearance: 'none', background: 'transparent', margin: 0, outline: 'none', cursor: 'pointer', zIndex: 2
                    }}
                />
                <div
                    className="audio-timeline-fill"
                    style={{
                        height: '100%',
                        width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                        background: '#e53935',
                        position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none'
                    }}
                ></div>
            </div>

            <div className="container audio-player-content pt-2 pb-2 flex justify-between items-center" style={{ width: '100%' }}>
                <div className="audio-player-info">
                    <img
                        src={currentReciter?.image || '/images/OIP.jpg'}
                        alt=""
                        className="audio-player-reciter-img"
                    />
                    <div className="audio-player-text">
                        <p className="audio-player-surah">{surahDisplay}</p>
                        <p className="audio-player-reciter">{reciterName || currentReciter?.nameAr}</p>
                    </div>
                </div>

                <div className="audio-player-controls flex items-center gap-4">
                    <div className="audio-time-display text-sm text-muted" style={{ direction: 'ltr', fontVariantNumeric: 'tabular-nums' }}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                    <button
                        type="button"
                        onClick={togglePlay}
                        className="audio-player-btn audio-player-btn-play"
                        aria-label={isPlaying ? (lang === 'ar' ? 'إيقاف مؤقت' : 'Pause') : (lang === 'ar' ? 'تشغيل' : 'Play')}
                    >
                        {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                    </button>
                    <button
                        type="button"
                        onClick={stopPlay}
                        className="audio-player-btn audio-player-btn-close"
                        aria-label={lang === 'ar' ? 'إيقاف القراءة' : 'Stop playback'}
                    >
                        <X size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
