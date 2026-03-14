import React, { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './Tasbeeh.css';

const PHRASES = [
  { id: 'subhanallah', ar: 'سُبْحَانَ اللَّهِ', en: 'Subhan Allah' },
  { id: 'alhamdulillah', ar: 'الْحَمْدُ لِلَّهِ', en: 'Alhamdulillah' },
  { id: 'allahuakbar', ar: 'اللَّهُ أَكْبَرُ', en: 'Allahu Akbar' },
  { id: 'la_ilaha_illa_allah', ar: 'لَا إِلَهَ إِلَّا اللَّهُ', en: 'La ilaha illa Allah' },
  { id: 'astaghfirullah', ar: 'أَسْتَغْفِرُ اللَّهَ', en: 'Astaghfirullah' },
  {
    id: 'salat_alan_nabi',
    ar:'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ',
    en: 'O Allah, send prayers upon our master Muhammad',
  },
];

const Tasbeeh = () => {
  const { lang } = useLanguage();
  const [currentPhraseId, setCurrentPhraseId] = useState(PHRASES[0].id);
  const [count, setCount] = useState(0);

  const currentPhrase = PHRASES.find((p) => p.id === currentPhraseId) || PHRASES[0];

  const handleTasbeeh = () => {
    setCount((prev) => prev + 1);
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }
  };

  const resetTasbeeh = () => {
    setCount(0);
    if (navigator.vibrate) {
      navigator.vibrate([80, 40, 80]);
    }
  };

  const handleSelectPhrase = (id) => {
    setCurrentPhraseId(id);
    setCount(0);
  };

  return (
    <div className="tasbeeh-page animate-slide-down">
      <div className="tasbeeh-hero card card-glass">
        <div className="tasbeeh-hero-text">
          <h1 className="tasbeeh-title">
            {lang === 'ar' ? 'المسبحة الإلكترونية' : 'Digital Tasbeeh'}
          </h1>
          <p className="tasbeeh-sub">
            {lang === 'ar'
              ? 'اختر الذكر وابدأ العد، مع عدّاد بسيط يساعدك على تنظيم تسبيحك.'
              : 'Choose a dhikr phrase and start counting with a simple, elegant tasbeeh counter.'}
          </p>
        </div>
      </div>

      <div className="tasbeeh-layout">
        {/* Dhikr phrases pills */}
        <div className="tasbeeh-phrases card">
          <h2 className="tasbeeh-section-title">
            {lang === 'ar' ? 'اختر الذكر' : 'Select dhikr'}
          </h2>
          <div className="tasbeeh-phrases-list">
            {PHRASES.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`tasbeeh-phrase-pill ${
                  currentPhraseId === p.id ? 'active' : ''
                }`}
                onClick={() => handleSelectPhrase(p.id)}
              >
                <span className="tasbeeh-phrase-ar">{p.ar}</span>
                <span className="tasbeeh-phrase-en">{p.en}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="tasbeeh-counter card card-glass">
          <div className="tasbeeh-counter-circle" onClick={handleTasbeeh}>
            <div className="tasbeeh-counter-inner">
              <div className="tasbeeh-counter-phrase">{currentPhrase.ar}</div>
              <div className="tasbeeh-counter-number">{count}</div>
              <div className="tasbeeh-counter-hint">
                {lang === 'ar' ? 'اضغط للعد' : 'Tap to count'}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline tasbeeh-reset-btn"
            onClick={resetTasbeeh}
          >
            <RefreshCcw size={18} />
            {lang === 'ar' ? 'تصفير العداد' : 'Reset counter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tasbeeh;

