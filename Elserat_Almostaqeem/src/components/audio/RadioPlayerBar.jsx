import React, { useState } from 'react';
import { Play, Pause, X, Radio, Moon } from 'lucide-react';
import { useRadio, RADIO_SOURCE_URL } from '../../context/RadioContext';
import { useLanguage } from '../../context/LanguageContext';
import './RadioPlayerBar.css';

export default function RadioPlayerBar() {
  const radio = useRadio();
  const { lang } = useLanguage();
  const [showTimerMenu, setShowTimerMenu] = useState(false);

  if (!radio || !radio.isActive) return null;

  const { isPlaying, radioError, togglePlayPause, stopRadio } = radio;

  return (
    <div className="radio-player-bar">
      <div className="container radio-player-content">
        <div className="radio-player-info">
          <div className="radio-player-icon">
            <Radio size={24} />
          </div>
          <div className="radio-player-text">
            <p className="radio-player-title">
              {lang === 'ar' ? 'إذاعة القرآن الكريم' : 'Quran Radio (Cairo)'}
            </p>
            {radioError && (
              <p className="radio-player-error">
                {lang === 'ar' ? 'تعذّر التشغيل' : 'Playback failed'}
                {' '}
                <a href={RADIO_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="radio-error-link">
                  {lang === 'ar' ? 'فتح الموقع' : 'Open site'}
                </a>
              </p>
            )}
            <p className="radio-player-sub" style={{ display: 'flex', alignItems: 'center' }}>
              {lang === 'ar' ? 'بث مباشر' : 'Live'}
              {isPlaying && (
                  <span className="audio-live-waves">
                      <span className="wave"></span>
                      <span className="wave"></span>
                      <span className="wave"></span>
                      <span className="wave"></span>
                  </span>
              )}
            </p>
          </div>
        </div>

        <div className="radio-player-controls">
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowTimerMenu(!showTimerMenu)}
              className={`radio-player-btn radio-player-btn-secondary ${radio.sleepTimerMinutes > 0 ? 'active' : ''}`}
              title={lang === 'ar' ? 'مؤقت النوم' : 'Sleep Timer'}
            >
              <Moon size={20} />
              {radio.sleepTimerMinutes > 0 && <span className="timer-badge">{radio.sleepTimerMinutes}</span>}
            </button>
            {showTimerMenu && (
              <div className="timer-menu">
                <button type="button" onClick={() => { radio.setSleepTimer(15); setShowTimerMenu(false); }}>15 {lang === 'ar' ? 'دقيقة' : 'm'}</button>
                <button type="button" onClick={() => { radio.setSleepTimer(30); setShowTimerMenu(false); }}>30 {lang === 'ar' ? 'دقيقة' : 'm'}</button>
                <button type="button" onClick={() => { radio.setSleepTimer(60); setShowTimerMenu(false); }}>60 {lang === 'ar' ? 'دقيقة' : 'm'}</button>
                <button type="button" onClick={() => { radio.setSleepTimer(0); setShowTimerMenu(false); }}>{lang === 'ar' ? 'إيقاف' : 'Off'}</button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={togglePlayPause}
            className="radio-player-btn radio-player-btn-play"
            aria-label={isPlaying ? (lang === 'ar' ? 'إيقاف مؤقت' : 'Pause') : (lang === 'ar' ? 'تشغيل' : 'Play')}
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button
            type="button"
            onClick={stopRadio}
            className="radio-player-btn radio-player-btn-close"
            aria-label={lang === 'ar' ? 'إيقاف الإذاعة' : 'Stop radio'}
          >
            <X size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
