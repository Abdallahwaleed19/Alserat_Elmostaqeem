import { get, set, del } from 'idb-keyval';

const KEYS = {
  QURAN_LAST_TRACK: 'audio:quran:lastTrack',
  RADIO_LAST_URL: 'audio:radio:lastUrl'
};

export async function cacheLastQuranTrack(track) {
  try {
    await set(KEYS.QURAN_LAST_TRACK, {
      ...track,
      savedAt: Date.now()
    });
  } catch (_) {}
}

export async function getLastQuranTrack() {
  try {
    return (await get(KEYS.QURAN_LAST_TRACK)) || null;
  } catch (_) {
    return null;
  }
}

export async function clearLastQuranTrack() {
  try {
    await del(KEYS.QURAN_LAST_TRACK);
  } catch (_) {}
}

export async function cacheLastRadioUrl(url) {
  try {
    await set(KEYS.RADIO_LAST_URL, { url, savedAt: Date.now() });
  } catch (_) {}
}

export async function getLastRadioUrl() {
  try {
    const data = await get(KEYS.RADIO_LAST_URL);
    return data?.url || null;
  } catch (_) {
    return null;
  }
}
