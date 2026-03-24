import { Workbox } from 'workbox-window';

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() !== 'web') return;

  const wb = new Workbox('/sw.js');

  wb.addEventListener('waiting', async () => {
    try {
      await wb.messageSkipWaiting();
    } catch (_) {}
  });

  wb.addEventListener('controlling', () => {
    window.location.reload();
  });

  wb.register().catch(() => {});
}
