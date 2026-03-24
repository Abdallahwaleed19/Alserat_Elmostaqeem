const AUDIO_EVENTS = {
  QURAN_STARTED: 'media-started-quran',
  RADIO_STARTED: 'media-started-radio',
  ADHAN_STARTED: 'media-started-adhan',
  STOP_QURAN: 'audio-stop-quran',
  STOP_RADIO: 'audio-stop-radio',
  STOP_ALL: 'audio-stop-all'
};

function dispatch(name, detail = {}) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export const audioCoordinator = {
  events: AUDIO_EVENTS,

  startQuran(meta = {}) {
    dispatch(AUDIO_EVENTS.STOP_RADIO, { reason: 'quran-started' });
    dispatch(AUDIO_EVENTS.QURAN_STARTED, meta);
  },

  startRadio(meta = {}) {
    dispatch(AUDIO_EVENTS.STOP_QURAN, { reason: 'radio-started' });
    dispatch(AUDIO_EVENTS.RADIO_STARTED, meta);
  },

  startAdhan(meta = {}) {
    dispatch(AUDIO_EVENTS.STOP_ALL, { reason: 'adhan-started' });
    dispatch(AUDIO_EVENTS.ADHAN_STARTED, meta);
  }
};

export default audioCoordinator;
