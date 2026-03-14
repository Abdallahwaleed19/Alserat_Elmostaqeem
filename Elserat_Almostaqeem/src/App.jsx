import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import { RadioProvider } from './context/RadioContext';
import { LanguageProvider } from './context/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Quran from './pages/Quran/Quran';
import Khatma from './pages/Khatma/Khatma';
import KhatmaDeceased from './pages/Khatma/KhatmaDeceased';
import KhatmaGroup from './pages/Khatma/KhatmaGroup';
import Adhkar from './pages/Adhkar/Adhkar';
import Bookmarks from './pages/Bookmarks/Bookmarks';
import Pillars from './pages/Pillars/Pillars';
import Sunnah from './pages/Sunnah/Sunnah';
import Discover from './pages/Discover/Discover';
import GreetingCards from './pages/Media/GreetingCards';
import Reciters from './pages/Reciters/Reciters';
import Seerah from './pages/Seerah/Seerah';
import HijriCalendar from './pages/Calendar/HijriCalendar';
import Tasbeeh from './pages/Tasbeeh/Tasbeeh';
import WorshipTracker from './pages/Tracker/WorshipTracker';
import Achievements from './pages/Tracker/Achievements';
import Wallpapers from './pages/Media/Wallpapers';
import NearestMosque from './pages/Mosques/NearestMosque';
import Quiz from './pages/Quiz/Quiz';
import Zakat from './pages/Zakat/Zakat';
import Wudu from './pages/Wudu/Wudu';
import IsraMiraj from './pages/IsraMiraj/IsraMiraj';
import Qibla from './pages/Qibla/Qibla';
import QiblaChange from './pages/QiblaChange/QiblaChange';
import LaylatAlQadr from './pages/LaylatAlQadr/LaylatAlQadr';
import Favorites from './pages/Favorites/Favorites';
import DownloadApp from './pages/DownloadApp/DownloadApp';
import Terms from './pages/Terms/Terms';
import { useLocalAlarms } from './hooks/useLocalAlarms';
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { LocalNotifications } from '@capacitor/local-notifications';

function App() {
  const { scheduleOfflineAlarms, loading } = useLocalAlarms();
  const [showSplash, setShowSplash] = React.useState(true);
  const isWeb = !window.Capacitor || window.Capacitor.getPlatform() === 'web';

  React.useEffect(() => {

    const initApp = async () => {
      try {
        if (!isWeb) {
          // Hide the native static splash early so permission dialogs can attach reliably
          if (window.Capacitor) {
            await SplashScreen.hide();
            // Give Android OS time to transition from splash to main activity.
            // Without this, the first permission dialog can be missed on some OEM ROMs.
            await new Promise(r => setTimeout(r, 1000));
          }

          // Native Android/iOS: Evaluate if this is a first-time user before prompting
          // We use localStorage because OS Permission Checks falsely return 'granted' on Android < 13
          // Token bumped to v12 to defeat Android 10+ Google Drive Auto-Backup silent restores during testing
          const hasLaunched = localStorage.getItem('zad_mobile_launch_v12');
          const isFirstTime = !hasLaunched;

          // Check actual notification permission status natively
          const permStatus = await LocalNotifications.checkPermissions();
          const needsPrompt = permStatus.display !== 'granted';

          if (isFirstTime) {
            localStorage.setItem('zad_mobile_launch_v12', 'true');
          }

          // scheduleOfflineAlarms chains: Notification prompt first, then Location prompt.
          await scheduleOfflineAlarms(!needsPrompt && !isFirstTime);

          // Battery Optimization Check (Samsung specific hint)
          const ua = navigator.userAgent.toLowerCase();
          const isSamsungOrXiaomi = ua.includes('samsung') || ua.includes('xiaomi') || ua.includes('redmi');
          if (isSamsungOrXiaomi && !localStorage.getItem('zad_battery_hint_shown')) {
            setTimeout(() => {
              alert(
                lang === 'ar'
                  ? 'لضمان عمل الأذان في موعده بدقة على جهازك، يرجى استثناء التطبيق من "تحسين البطارية" (Battery Optimization) من إعدادات الهاتف، خصوصاً على أجهزة سامسونج وريدمي/شاومي.'
                  : 'To ensure Adhan works accurately on your device, please disable "Battery Optimization" for this app in your phone settings (especially on Samsung and Xiaomi/Redmi).'
              );
              localStorage.setItem('zad_battery_hint_shown', 'true');
            }, 5000);
          }
        }
      } catch (err) {
        console.error("Failed to init background tasks", err);
      }
    };

    // Slight delay to ensure native plugins are fully initialized
    setTimeout(() => {
      initApp().then(() => {
        // Only hide the JS-side splash after logic and permission chain starts
        setTimeout(() => setShowSplash(false), 500);
      });
    }, 1000);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWeb]);
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
                      <Route index element={<Navigate to="/home" replace />} />
                      <Route path="home" element={<Home />} />
                      <Route path="quran" element={<Quran />} />
                      <Route path="khatma" element={<Khatma />} />
                      <Route path="khatma/deceased" element={<KhatmaDeceased />} />
                      <Route path="khatma/group" element={<KhatmaGroup />} />
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
                      <Route path="discover/greeting-cards" element={<GreetingCards />} />
                      <Route path="discover/wallpapers" element={<Wallpapers />} />
                      <Route path="discover/tracker" element={<WorshipTracker />} />
                      <Route path="discover/achievements" element={<Achievements />} />
                      <Route path="discover/isra-miraj" element={<IsraMiraj />} />
                      <Route path="discover/qibla" element={<QiblaChange />} />
                      <Route path="discover/compass" element={<Qibla />} />
                      <Route path="discover/mosques" element={<NearestMosque />} />
                      <Route path="discover/quiz" element={<Quiz />} />
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