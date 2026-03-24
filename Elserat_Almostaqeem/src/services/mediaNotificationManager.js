import { LocalNotifications } from '@capacitor/local-notifications';

const MEDIA_CHANNEL_ID = 'media_channel_v1';
const QURAN_NOTIFICATION_ID = 70001;
const RADIO_NOTIFICATION_ID = 70002;

let channelReady = false;
let activeType = null;

async function ensureChannel() {
  if (channelReady) return;
  if (!window.Capacitor || window.Capacitor.getPlatform() === 'web') return;
  try {
    await LocalNotifications.createChannel({
      id: MEDIA_CHANNEL_ID,
      name: 'Media Playback',
      description: 'Quran and Radio playback controls',
      importance: 4,
      visibility: 1,
      vibration: false,
      sound: 'chime2.wav'
    });
    channelReady = true;
  } catch (_) {}
}

async function showOnce(notification) {
  if (!window.Capacitor || window.Capacitor.getPlatform() === 'web') return;
  await ensureChannel();
  try {
    await LocalNotifications.schedule({ notifications: [notification] });
  } catch (_) {}
}

export const mediaNotificationManager = {
  ids: {
    quran: QURAN_NOTIFICATION_ID,
    radio: RADIO_NOTIFICATION_ID
  },

  async showQuran({ surahName, reciterName }) {
    if (activeType === 'quran') return;
    await this.clearRadio();
    await showOnce({
      id: QURAN_NOTIFICATION_ID,
      title: `📿 سورة ${surahName}`,
      body: `🎙 ${reciterName}`,
      channelId: MEDIA_CHANNEL_ID,
      ongoing: true,
      autoCancel: false,
      actionTypeId: 'MEDIA_QURAN_ACTIONS',
      sound: 'chime2.wav',
      smallIcon: 'ic_quran',
      largeIcon: 'ic_quran'
    });
    activeType = 'quran';
  },

  async showRadio() {
    if (activeType === 'radio') return;
    await this.clearQuran();
    await showOnce({
      id: RADIO_NOTIFICATION_ID,
      title: '📡 إذاعة القرآن الكريم',
      body: '🟢 بث مباشر',
      channelId: MEDIA_CHANNEL_ID,
      ongoing: true,
      autoCancel: false,
      actionTypeId: 'MEDIA_RADIO_ACTIONS',
      sound: 'chime2.wav',
      smallIcon: 'ic_star',
      largeIcon: 'ic_star'
    });
    activeType = 'radio';
  },

  async clearQuran() {
    if (!window.Capacitor || window.Capacitor.getPlatform() === 'web') return;
    try {
      await LocalNotifications.cancel({ notifications: [{ id: QURAN_NOTIFICATION_ID }] });
      if (activeType === 'quran') activeType = null;
    } catch (_) {}
  },

  async clearRadio() {
    if (!window.Capacitor || window.Capacitor.getPlatform() === 'web') return;
    try {
      await LocalNotifications.cancel({ notifications: [{ id: RADIO_NOTIFICATION_ID }] });
      if (activeType === 'radio') activeType = null;
    } catch (_) {}
  },

  async clearAll() {
    await this.clearQuran();
    await this.clearRadio();
    activeType = null;
  }
};

export default mediaNotificationManager;
