import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { CapacitorMusicControls } from 'capacitor-music-controls-plugin';

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
  const mediaSessionActiveRef = useRef(false);

  const stopRadioRef = useRef(null); // To hold the stopRadio function for event listeners

  const updateMediaSession = useCallback(() => {
    if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
      const audio = audioRef.current;
      if (!audio || !isActiveRef.current) return;

      mediaSessionActiveRef.current = true;
      CapacitorMusicControls.create({
        track: 'إذاعة القرآن الكريم',
        artist: 'بث مباشر',
        cover: 'icons/icon-512x512.png',
        isPlaying: isPlaying,
        dismissable: true,
        hasPrev: false,
        hasNext: false,
        hasClose: true,
        hasScrubbing: false,
        duration: 0,
        elapsed: 0,
        playIcon: '',
        pauseIcon: '',
        closeIcon: '',
        notificationIcon: ''
      }).then(() => {
        CapacitorMusicControls.updateIsPlaying({ isPlaying: isPlaying });
      }).catch(e => console.warn('Radio MusicControls create error', e));
    } else if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: 'إذاعة القرآن الكريم',
        artist: 'القاهرة',
        album: 'بث مباشر',
        artwork: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      });
    }
  }, [isPlaying]);

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
      if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
        CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
      }

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

  const startRadio = useCallback(async () => {
    urlIndexRef.current = 0; // Reset index on fresh start
    isActiveRef.current = true;
    setIsActive(true);
    setRadioError(null);
    playWithRetry();

    // Media session is now managed by a reactive useEffect
  }, [playWithRetry]);

  const stopRadio = useCallback(async () => {
    isActiveRef.current = false;
    setIsActive(false);
    setIsPlaying(false);
    setRadioError(null);
    clearAudio();
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'none';
    }

    // Media session is now managed by a reactive useEffect
  }, [clearAudio]);

  // Store stopRadio in a ref for use in event listeners
  useEffect(() => {
    stopRadioRef.current = stopRadio;
  }, [stopRadio]);

  // Initialize media session handlers once
  useEffect(() => {
    const handleNotification = (event) => {
      let action = event;
      try {
        if (event.detail && typeof event.detail === 'string') {
          action = JSON.parse(event.detail);
        } else if (event.detail) {
          action = event.detail;
        } else if (typeof event === 'string') {
          action = JSON.parse(event);
        }
      } catch (e) {
        return;
      }

      if (!action || !action.message) return;
      const msg = action.message;

      if (msg === 'music-controls-play') {
        startRadio();
      } else if (msg === 'music-controls-pause' || msg === 'music-controls-destroy') {
        stopRadio();
      }
    };

    document.addEventListener('controlsNotification', handleNotification);
    return () => {
      document.removeEventListener('controlsNotification', handleNotification);
    };
  }, [startRadio, stopRadio]);

  useEffect(() => {
    if (isActive && isPlaying) {
      updateMediaSession();
    } else if (!isActive && mediaSessionActiveRef.current) {
      if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
        CapacitorMusicControls.destroy();
      }
      mediaSessionActiveRef.current = false;
    } else if (!isPlaying && mediaSessionActiveRef.current) {
      if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
        CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
      }
    }
  }, [isActive, isPlaying, updateMediaSession]);

  const togglePlayPause = useCallback(() => {
    if (isActiveRef.current) {
      stopRadio();
    } else {
      startRadio();
    }
  }, [startRadio, stopRadio]);

  // Web Media Session handlers (avoid undefined references inside updateMediaSession)
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.setActionHandler('play', () => startRadio());
      navigator.mediaSession.setActionHandler('pause', () => stopRadio());
      navigator.mediaSession.setActionHandler('stop', () => stopRadio());
    } catch (e) {
      // Some browsers throw if action is unsupported
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
          if (window.Capacitor && window.Capacitor.getPlatform() !== 'web') {
            CapacitorMusicControls.updateIsPlaying({ isPlaying: true });
          }
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
