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
import { usePushNotifications } from './hooks/usePushNotifications';

function App() {
  usePushNotifications();

  return (
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
  );
}

export default App;