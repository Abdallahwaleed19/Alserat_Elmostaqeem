/**
 * Zakat prices for Egypt (EGP) - Gold 21k & Silver per gram.
 * Uses localStorage cache; can be extended with API.
 */
const CACHE_KEY = 'zakat_prices_eg';
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// Fallback: متوسط تقريبي لسعر الذهب عيار 21 والفضة في مصر (يُحدَّث عند فشل المصدر)
const DEFAULT_GOLD_21_EGP_PER_GRAM = 6480;
const DEFAULT_SILVER_EGP_PER_GRAM = 45;

export function getCachedPrices() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && data.timestamp && Date.now() - data.timestamp < CACHE_MAX_AGE_MS) {
      return {
        gold21PerGram: data.gold21PerGram ?? DEFAULT_GOLD_21_EGP_PER_GRAM,
        silverPerGram: data.silverPerGram ?? DEFAULT_SILVER_EGP_PER_GRAM,
        lastUpdated: new Date(data.timestamp),
      };
    }
  } catch (e) {
    console.warn('Zakat prices cache read failed', e);
  }
  return null;
}

export function setCachedPrices(gold21PerGram, silverPerGram) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        gold21PerGram: gold21PerGram ?? DEFAULT_GOLD_21_EGP_PER_GRAM,
        silverPerGram: silverPerGram ?? DEFAULT_SILVER_EGP_PER_GRAM,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.warn('Zakat prices cache write failed', e);
  }
}

export function getDefaultPrices() {
  return {
    gold21PerGram: DEFAULT_GOLD_21_EGP_PER_GRAM,
    silverPerGram: DEFAULT_SILVER_EGP_PER_GRAM,
    lastUpdated: null,
  };
}

/**
 * Fetch prices from external source. Replace URL with your API.
 * On failure, returns cached or default prices.
 */
export async function fetchZakatPrices() {
  const cached = getCachedPrices();
  try {
    // Example: replace with a real Egypt gold/silver API when available
    // const res = await fetch('https://your-api.com/gold-egp');
    // const data = await res.json();
    // setCachedPrices(data.gold21PerGram, data.silverPerGram);
    // return { ...data, lastUpdated: new Date() };
    return cached || { ...getDefaultPrices(), lastUpdated: null };
  } catch (e) {
    console.warn('Zakat price fetch failed', e);
  }
  return cached || { ...getDefaultPrices(), lastUpdated: null };
}

/**
 * Get prices for calculator: cache first, then default.
 */
export function getZakatPrices() {
  const cached = getCachedPrices();
  if (cached) return cached;
  const def = getDefaultPrices();
  setCachedPrices(def.gold21PerGram, def.silverPerGram);
  return {
    gold21PerGram: def.gold21PerGram,
    silverPerGram: def.silverPerGram,
    lastUpdated: null,
  };
}

// Nisab constants (Islamic standard)
export const NISAB_GOLD_GRAMS = 85;   // 85 جرام ذهب عيار 21
export const NISAB_SILVER_GRAMS = 595; // 595 جرام فضة
export const ZAKAT_RATE = 0.025;       // 2.5%
