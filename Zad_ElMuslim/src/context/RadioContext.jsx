import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';

// إذاعة القرآن الكريم من القاهرة - المصدر: https://www.holyquranradio.com/
// روابط البث المباشر لنفس الإذاعة (مع بدائل عند الفشل)
const RADIO_URLS = [
  'https://n02.radiojar.com/8s5u5tpdtwzuv',
  'https://n0a.radiojar.com/8s5u5tpdtwzuv',
  'https://stream.radiojar.com/8s5u5tpdtwzuv',
  'https://icecast.radiojar.com/8s5u5tpdtwzuv',
  'https://qurancairo.radioca.st/stream',
  'https://liveradio.quranradioo.com/stream',
];
export const RADIO_SOURCE_URL = 'https://www.holyquranradio.com/';

const RadioContext = createContext(null);

export function RadioProvider({ children }) {
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [radioError, setRadioError] = useState(null);

  const isActiveRef = useRef(false);
  const audioRef = useRef(null);
  const urlIndexRef = useRef(0);
  const retryTimeoutRef = useRef(null);

  const initMediaSession = useCallback((playFn, pauseFn) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: 'إذاعة القرآن الكريم',
        artist: 'القاهرة',
        album: 'بث مباشر',
        artwork: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      });
      navigator.mediaSession.setActionHandler('play', playFn);
      navigator.mediaSession.setActionHandler('pause', pauseFn);
    }
  }, []);

  const clearAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const playWithRetry = useCallback(() => {
    clearAudio();
    if (!isActiveRef.current || !audioRef.current) return;

    const url = RADIO_URLS[urlIndexRef.current];
    const a = audioRef.current;

    a.src = url;
    a.load();

    const handleErrorOrDrop = () => {
      if (!isActiveRef.current) return;

      console.warn(`Radio stream dropped on URL index ${urlIndexRef.current}. Retrying with next URL...`);
      setIsPlaying(false);

      // Move to next URL
      urlIndexRef.current = (urlIndexRef.current + 1) % RADIO_URLS.length;

      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = setTimeout(() => {
        if (isActiveRef.current) {
          playWithRetry();
        }
      }, 3000);
    };

    a.onended = handleErrorOrDrop;
    a.onerror = handleErrorOrDrop;
    a.onstalled = () => {
      console.warn('Audio stalled. Checking recovery...');
      if (isActiveRef.current) handleErrorOrDrop();
    };

    const playPromise = a.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        console.warn('Radio stream play interrupted or failed:', e);
        handleErrorOrDrop();
      });
    }
  }, [clearAudio]);

  // Watchdog timer to check if stream is frozen despite claiming to be "playing"
  useEffect(() => {
    let lastTime = -1;
    let freezeCount = 0;

    const watchdog = setInterval(() => {
      if (isActiveRef.current && isPlaying && audioRef.current) {
        const curr = audioRef.current.currentTime;
        if (curr === lastTime && curr > 0) {
          freezeCount++;
          if (freezeCount >= 5) { // 10 seconds of freeze
            console.warn('Radio watchdog detected frozen stream. Forcing reconnect...');
            clearAudio();
            // Start over aggressively
            const timer = setTimeout(() => {
              if (isActiveRef.current) {
                urlIndexRef.current = (urlIndexRef.current + 1) % RADIO_URLS.length;
                playWithRetry();
              }
            }, 1000);
            return () => clearTimeout(timer);
          }
        } else {
          freezeCount = 0;
        }
        lastTime = curr;
      } else {
        freezeCount = 0;
        lastTime = -1;
      }
    }, 2000);

    return () => clearInterval(watchdog);
  }, [isPlaying, clearAudio, playWithRetry]);

  const startRadio = useCallback(() => {
    urlIndexRef.current = 0; // Reset index on fresh start
    isActiveRef.current = true;
    setIsActive(true);
    setRadioError(null);
    playWithRetry();
  }, [playWithRetry]);

  const stopRadio = useCallback(() => {
    isActiveRef.current = false;
    setIsActive(false);
    setIsPlaying(false);
    setRadioError(null);
    clearAudio();
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'none';
    }
  }, [clearAudio]);

  // Initialize media session handlers once
  useEffect(() => {
    initMediaSession(startRadio, stopRadio);
  }, [initMediaSession, startRadio, stopRadio]);

  const togglePlayPause = useCallback(() => {
    if (isActiveRef.current) {
      stopRadio();
    } else {
      startRadio();
    }
  }, [startRadio, stopRadio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAudio();
    };
  }, [clearAudio]);

  const value = {
    isActive,
    isPlaying,
    radioError,
    startRadio,
    togglePlayPause,
    stopRadio,
  };

  return (
    <RadioContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="none"
        style={{ display: 'none' }}
        onPlay={() => {
          if (!isActiveRef.current) {
            audioRef.current?.pause();
            return;
          }
          setRadioError(null);
          setIsPlaying(true);
          if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
        }}
        onPause={() => {
          setIsPlaying(false);
          if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
        }}
        onEnded={stopRadio}
      />
    </RadioContext.Provider>
  );
}

export function useRadio() {
  return useContext(RadioContext);
}
