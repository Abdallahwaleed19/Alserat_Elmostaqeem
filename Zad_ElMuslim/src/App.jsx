import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import { RadioProvider } from './context/RadioContext';
import { LanguageProvider } from './context/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Quran from './pages/Quran/Quran';
import Adhkar from './pages/Adhkar/Adhkar';
import Bookmarks from './pages/Bookmarks/Bookmarks';
import Pillars from './pages/Pillars/Pillars';
import Sunnah from './pages/Sunnah/Sunnah';
import Discover from './pages/Discover/Discover';
import Reciters from './pages/Reciters/Reciters';
import Seerah from './pages/Seerah/Seerah';
import HijriCalendar from './pages/Calendar/HijriCalendar';
import Tasbeeh from './pages/Tasbeeh/Tasbeeh';
import Zakat from './pages/Zakat/Zakat';
import Wudu from './pages/Wudu/Wudu';
import IsraMiraj from './pages/IsraMiraj/IsraMiraj';
import QiblaChange from './pages/QiblaChange/QiblaChange';
import LaylatAlQadr from './pages/LaylatAlQadr/LaylatAlQadr';
import Favorites from './pages/Favorites/Favorites';
import DownloadApp from './pages/DownloadApp/DownloadApp';
import Terms from './pages/Terms/Terms';
import { useLocalAlarms } from './hooks/useLocalAlarms';
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';

function App() {
  const { scheduleOfflineAlarms, loading } = useLocalAlarms();
  const [showSplash, setShowSplash] = React.useState(true);
  const isWeb = !window.Capacitor || window.Capacitor.getPlatform() === 'web';

  React.useEffect(() => {

    const initApp = async () => {
      try {
        if (!isWeb) {
          // Native Android/iOS: Evaluate if this is a first-time user before prompting
          // We use localStorage because OS Permission Checks falsely return 'granted' on Android < 13
          // Token bumped to v7 to defeat Android 10+ Google Drive Auto-Backup silent restores during testing
          const hasLaunched = localStorage.getItem('zad_mobile_launch_v7');
          const isFirstTime = !hasLaunched;

          if (isFirstTime) {
            localStorage.setItem('zad_mobile_launch_v7', 'true');
          }

          // Pass !isFirstTime to the isSilent token. 
          // New installs (isFirstTime = true) will trigger (isSilent = false) causing the instantaneous Welcome Notification.
          await scheduleOfflineAlarms(!isFirstTime);
        }
        // Hide the native static splash immediately after logic load
        if (window.Capacitor) {
          await SplashScreen.hide();
        }
      } catch (err) {
        console.error("Failed to init background tasks", err);
      }
    };

    // Slight delay to ensure native plugins are fully initialized
    setTimeout(() => {
      initApp();
      // Wait 2.5s to play our CSS animation, then fade it out.
      setTimeout(() => setShowSplash(false), 2500);
    }, 1500);

    if (isWeb && "Notification" in window) {
      if (Notification.permission !== "granted") {
        // First-time visitor: Trigger visual prompts and final Welcome OS Notification
        const handleFirstInteraction = async () => {
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction, { passive: true });
          await scheduleOfflineAlarms(false);
        };
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction, { passive: true });
      } else {
        // Returning visitor: Silently initialize Alarms and Audio unlock in the background
        const handleSilentInit = async () => {
          document.removeEventListener('click', handleSilentInit);
          document.removeEventListener('touchstart', handleSilentInit, { passive: true });
          await scheduleOfflineAlarms(true);
        };
        document.addEventListener('click', handleSilentInit);
        document.addEventListener('touchstart', handleSilentInit, { passive: true });
      }
    }
  }, [isWeb, scheduleOfflineAlarms]);

  return (
    <>
      <div className={`splash-container ${!showSplash ? 'fade-out' : ''}`}>
        <img src="/zad_splash_logo.png" alt="Zad El Muslim Logo" className="splash-logo" />
        <h1 className="splash-title">الصراط المستقيم</h1>
      </div>

      <ErrorBoundary>
        <LanguageProvider>
          <ThemeProvider>
            <AudioProvider>
              <RadioProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="quran" element={<Quran />} />
                      <Route path="reciters" element={<Reciters />} />
                      <Route path="sunnah" element={<Sunnah />} />
                      <Route path="adhkar" element={<Adhkar />} />
                      <Route path="tasbeeh" element={<Tasbeeh />} />
                      <Route path="bookmarks" element={<Bookmarks />} />
                      <Route path="pillars" element={<Pillars />} />
                      <Route path="zakat" element={<Zakat />} />
                      <Route path="seerah" element={<Seerah />} />
                      <Route path="calendar" element={<HijriCalendar />} />
                      <Route path="discover" element={<Discover />} />
                      <Route path="discover/isra-miraj" element={<IsraMiraj />} />
                      <Route path="discover/qibla" element={<QiblaChange />} />
                      <Route path="discover/laylat-alqadr" element={<LaylatAlQadr />} />
                      <Route path="discover/favorites" element={<Favorites />} />
                      <Route path="download-app" element={<DownloadApp />} />
                      <Route path="wudu" element={<Wudu />} />
                      <Route path="terms" element={<Terms />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </RadioProvider>
            </AudioProvider>
          </ThemeProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;