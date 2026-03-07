import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Calculator,
  Info,
  Coins,
  RefreshCw,
  AlertCircle,
  Users,
  BookOpen,
} from 'lucide-react';
import {
  getZakatPrices,
  fetchZakatPrices,
  NISAB_GOLD_GRAMS,
  NISAB_SILVER_GRAMS,
  ZAKAT_RATE,
} from '../../services/zakatPrices';
import './Zakat.css';

const ZAKAT_FITR_EGP_PER_PERSON = 65; // قيمة تقريبية في مصر - يُحدَّث حسب السوق

const MASARIF = [
  { key: 'fuqara', ar: 'الْفُقَرَاءِ', en: 'The poor' },
  { key: 'masakin', ar: 'الْمَسَاكِينِ', en: 'The needy' },
  { key: 'amilin', ar: 'الْعَامِلِينَ عَلَيْهَا', en: 'Those employed to collect' },
  { key: 'muallafa', ar: 'الْمُؤَلَّفَةِ قُلُوبُهُمْ', en: 'Those whose hearts are to be reconciled' },
  { key: 'riqab', ar: 'الرِّقَابِ', en: 'Freeing slaves' },
  { key: 'gharimin', ar: 'الْغَارِمِينَ', en: 'Those in debt' },
  { key: 'sabilillah', ar: 'فِي سَبِيلِ اللَّهِ', en: 'In the cause of Allah' },
  { key: 'ibn sabil', ar: 'ابْنِ السَّبِيلِ', en: 'The wayfarer' },
];

export default function Zakat() {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const [prices, setPrices] = useState(() => getZakatPrices());
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [calc, setCalc] = useState({
    cash: '',
    bank: '',
    goldGrams: '',
    silverGrams: '',
    trade: '',
  });
  const [fitrCount, setFitrCount] = useState(1);

  useEffect(() => {
    setPrices(getZakatPrices());
  }, []);

  const refreshPrices = async () => {
    setLoadingPrices(true);
    const next = await fetchZakatPrices();
    setPrices(next);
    setLoadingPrices(false);
  };

  const nisabByGold = useMemo(
    () => (prices.gold21PerGram || 0) * NISAB_GOLD_GRAMS,
    [prices.gold21PerGram]
  );
  const nisabBySilver = useMemo(
    () => (prices.silverPerGram || 0) * NISAB_SILVER_GRAMS,
    [prices.silverPerGram]
  );
  const nisabEGP = useMemo(
    () => nisabByGold,
    [nisabByGold]
  );

  const totalWealth = useMemo(() => {
    const n = (v) => (v === '' || v === null || v === undefined) ? 0 : Number(v) || 0;
    const cash = n(calc.cash);
    const bank = n(calc.bank);
    const goldVal = n(calc.goldGrams) * (prices.gold21PerGram || 0);
    const silverVal = n(calc.silverGrams) * (prices.silverPerGram || 0);
    const trade = n(calc.trade);
    return cash + bank + goldVal + silverVal + trade;
  }, [calc, prices]);

  const aboveNisab = totalWealth >= nisabEGP && nisabEGP > 0;
  const zakatAmount = aboveNisab ? totalWealth * ZAKAT_RATE : 0;

  const fitrTotal = fitrCount * ZAKAT_FITR_EGP_PER_PERSON;

  const updateCalc = (field, value) => {
    setCalc((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="zakat-page">
      <div className="zakat-hero card">
        <div className="zakat-hero-icon">
          <Coins size={32} />
        </div>
        <div className="zakat-hero-text">
          <h1 className="zakat-title">
            {isAr ? 'الزكاة' : 'Zakat'}
          </h1>
          <p className="zakat-subtitle">
            {isAr
              ? 'شرح مبسط وحاسبة زكاة وفق جمهورية مصر العربية وتحديث تلقائي لأسعار الذهب والفضة'
              : 'Simple guide and Zakat calculator for Egypt with auto-updated gold & silver prices'}
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="zakat-disclaimer card">
        <AlertCircle size={20} />
        <p>
          {isAr
            ? 'هذا الحساب تقديري ولا يغني عن الاستفتاء. النصاب والحساب معتمد على أسعار الذهب عيار ٢١ والفضة في مصر.'
            : 'This calculation is an estimate and is not a fatwa. Nisab is based on gold 21k and silver prices in Egypt.'}
        </p>
      </div>

      {/* 1. Definition */}
      <section className="zakat-section card">
        <h2 className="zakat-section-title">
          <BookOpen size={24} />
          {isAr ? '١. تعريف الزكاة' : '1. Definition of Zakat'}
        </h2>
        <div className="zakat-content">
          <h3>{isAr ? 'ما هي الزكاة؟' : 'What is Zakat?'}</h3>
          <p>
            {isAr
              ? 'الزكاة ركن من أركان الإسلام الخمسة، وهي حق واجب في المال عند بلوغ النصاب وحولان الحول.'
              : 'Zakat is one of the five pillars of Islam—a mandatory duty on wealth when the nisab is reached and one lunar year has passed.'}
          </p>
          <h3>{isAr ? 'حكمها' : 'Ruling'}</h3>
          <p>
            {isAr ? 'فرض بإجماع المسلمين. قال تعالى: وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ.' : 'Obligatory by consensus. Allah says: Establish prayer and give Zakat.'}
          </p>
          <h3>{isAr ? 'على من تجب؟' : 'Upon whom is it obligatory?'}</h3>
          <p>
            {isAr
              ? 'على المسلم الحر البالغ العاقل الذي يملك النصاب (ما يعادل ٨٥ جرام ذهب عيار ٢١ أو ٥٩٥ جرام فضة) وحال عليه الحول.'
              : 'On a free, adult, sane Muslim who owns the nisab (equivalent to 85g gold 21k or 595g silver) and a full lunar year has passed.'}
          </p>
          <h3>{isAr ? 'الحكمة من الزكاة' : 'Wisdom behind Zakat'}</h3>
          <p>
            {isAr
              ? 'تطهير النفس من البخل، وإغناء الفقراء، وتحقيق التكافل في المجتمع.'
              : 'Purifying the soul from stinginess, enriching the poor, and achieving solidarity in society.'}
          </p>
        </div>
      </section>

      {/* 2. Types */}
      <section className="zakat-section card">
        <h2 className="zakat-section-title">
          <Info size={24} />
          {isAr ? '٢. أنواع الزكاة' : '2. Types of Zakat'}
        </h2>
        <ul className="zakat-types-list">
          <li>{isAr ? 'زكاة المال (النقد، الذهب، الفضة، عروض التجارة)' : 'Zakat on wealth (cash, gold, silver, trade goods)'}</li>
          <li>{isAr ? 'زكاة الذهب والفضة' : 'Zakat on gold and silver'}</li>
          <li>{isAr ? 'زكاة التجارة' : 'Zakat on trade'}</li>
          <li>{isAr ? 'زكاة الزروع والثمار (نصف العشر أو العشر حسب السقي)' : 'Zakat on crops and fruits (half or full tenth depending on irrigation)'}</li>
          <li>{isAr ? 'زكاة الفطر (قسم خاص أدناه)' : 'Zakat al-Fitr (dedicated section below)'}</li>
        </ul>
      </section>

      {/* 3. Calculator */}
      <section className="zakat-section card zakat-calc-section">
        <h2 className="zakat-section-title">
          <Calculator size={24} />
          {isAr ? '٣. حاسبة الزكاة (مصر - جنيه مصري)' : '3. Zakat Calculator (Egypt - EGP)'}
        </h2>

        <div className="zakat-prices-bar">
          <div className="zakat-prices-info">
            <span>
              {isAr ? 'سعر الذهب عيار ٢١:' : 'Gold 21k:'} <strong>{Number(prices.gold21PerGram || 0).toLocaleString('ar-EG')} ج.م/جرام</strong>
            </span>
            <span>
              {isAr ? 'الفضة:' : 'Silver:'} <strong>{Number(prices.silverPerGram || 0).toLocaleString('ar-EG')} ج.م/جرام</strong>
            </span>
            <span className="zakat-nisab">
              {isAr ? 'النصاب (٨٥ جرام ذهب عيار ٢١):' : 'Nisab (85g gold 21k):'} <strong>{Math.round(nisabEGP).toLocaleString('ar-EG')} ج.م</strong>
            </span>
          </div>
          <button
            type="button"
            className="zakat-refresh-btn"
            onClick={refreshPrices}
            disabled={loadingPrices}
            title={isAr ? 'تحديث الأسعار' : 'Refresh prices'}
          >
            <RefreshCw size={18} className={loadingPrices ? 'spin' : ''} />
            {isAr ? 'تحديث' : 'Refresh'}
          </button>
        </div>
        {prices.lastUpdated && (
          <p className="zakat-last-updated">
            {isAr ? 'آخر تحديث:' : 'Last updated:'} {prices.lastUpdated.toLocaleString(isAr ? 'ar-EG' : 'en-US', { dateStyle: 'short', timeStyle: 'short' })}
          </p>
        )}

        <div className="zakat-calc-grid">
          <label className="zakat-label">
            {isAr ? 'النقد (جنيه مصري)' : 'Cash (EGP)'}
            <input
              type="number"
              min="0"
              step="1"
              value={calc.cash}
              onChange={(e) => updateCalc('cash', e.target.value)}
              placeholder="0"
            />
          </label>
          <label className="zakat-label">
            {isAr ? 'الحسابات البنكية (ج.م)' : 'Bank accounts (EGP)'}
            <input
              type="number"
              min="0"
              step="1"
              value={calc.bank}
              onChange={(e) => updateCalc('bank', e.target.value)}
              placeholder="0"
            />
          </label>
          <label className="zakat-label">
            {isAr ? 'الذهب (جرام عيار ٢١)' : 'Gold (grams, 21k)'}
            <input
              type="number"
              min="0"
              step="0.1"
              value={calc.goldGrams}
              onChange={(e) => updateCalc('goldGrams', e.target.value)}
              placeholder="0"
            />
          </label>
          <label className="zakat-label">
            {isAr ? 'الفضة (جرام)' : 'Silver (grams)'}
            <input
              type="number"
              min="0"
              step="0.1"
              value={calc.silverGrams}
              onChange={(e) => updateCalc('silverGrams', e.target.value)}
              placeholder="0"
            />
          </label>
          <label className="zakat-label">
            {isAr ? 'عروض التجارة (ج.م)' : 'Trade goods (EGP)'}
            <input
              type="number"
              min="0"
              step="1"
              value={calc.trade}
              onChange={(e) => updateCalc('trade', e.target.value)}
              placeholder="0"
            />
          </label>
        </div>

        <div className="zakat-result card">
          <div className="zakat-result-row">
            <span>{isAr ? 'إجمالي المال:' : 'Total wealth:'}</span>
            <strong>{Math.round(totalWealth).toLocaleString('ar-EG')} ج.م</strong>
          </div>
          <div className="zakat-result-row">
            <span>{isAr ? 'بلغ النصاب؟' : 'Above nisab?'}</span>
            <strong className={aboveNisab ? 'text-success' : 'text-muted'}>
              {aboveNisab ? (isAr ? 'نعم ✅' : 'Yes ✅') : (isAr ? 'لا ❌' : 'No ❌')}
            </strong>
          </div>
          {aboveNisab && (
            <>
              <div className="zakat-result-row zakat-result-main">
                <span>{isAr ? 'مقدار الزكاة (٢.٥٪):' : 'Zakat due (2.5%):'}</span>
                <strong className="zakat-amount">{Math.round(zakatAmount).toLocaleString('ar-EG')} ج.م</strong>
              </div>
              <p className="zakat-result-desc">
                {isAr ? '٢.٥٪ من إجمالي المال بعد مرور الحول. هذا تقدير ولا يغني عن الاستفتاء.' : '2.5% of total wealth after one lunar year. This is an estimate, not a fatwa.'}
              </p>
            </>
          )}
        </div>
      </section>

      {/* 4. Zakat al-Fitr */}
      <section className="zakat-section card">
        <h2 className="zakat-section-title">
          <Users size={24} />
          {isAr ? '٤. زكاة الفطر' : '4. Zakat al-Fitr'}
        </h2>
        <p className="zakat-fitr-desc">
          {isAr
            ? 'تُخرج قبل صلاة العيد عن كلّ نفس. القيمة التقريبية في مصر (قيمة صاع من الطعام السائد).'
            : 'Given before Eid prayer for each person. Approximate value in Egypt (value of one sa\' of staple food).'}
        </p>
        <div className="zakat-fitr-calc">
          <label className="zakat-label">
            {isAr ? 'عدد الأفراد' : 'Number of people'}
            <input
              type="number"
              min="1"
              max="99"
              value={fitrCount}
              onChange={(e) => setFitrCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
            />
          </label>
          <div className="zakat-fitr-result">
            <span>{isAr ? 'قيمة تقريبية للفرد:' : 'Approx. per person:'}</span>
            <strong>{ZAKAT_FITR_EGP_PER_PERSON} ج.م</strong>
          </div>
          <div className="zakat-fitr-result zakat-fitr-total">
            <span>{isAr ? 'إجمالي زكاة الفطر:' : 'Total Zakat al-Fitr:'}</span>
            <strong>{fitrTotal.toLocaleString('ar-EG')} ج.م</strong>
          </div>
        </div>
      </section>

      {/* 5. Masarif */}
      <section className="zakat-section card">
        <h2 className="zakat-section-title">
          <Coins size={24} />
          {isAr ? '٥. مصارف الزكاة' : '5. Recipients of Zakat'}
        </h2>
        <blockquote className="zakat-verse">
          إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ ۖ فَرِيضَةً مِّنَ اللَّهِ ۗ وَاللَّهُ عَلِيمٌ حَكِيمٌ
        </blockquote>
        <p className="zakat-verse-ref">{isAr ? 'سورة التوبة، الآية ٦٠' : 'Surah At-Tawbah, 60'}</p>
        <div className="zakat-masarif-grid">
          {MASARIF.map((m) => (
            <div key={m.key} className="zakat-masarif-card card">
              <span className="zakat-masarif-ar">{m.ar}</span>
              <span className="zakat-masarif-en">{m.en}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
