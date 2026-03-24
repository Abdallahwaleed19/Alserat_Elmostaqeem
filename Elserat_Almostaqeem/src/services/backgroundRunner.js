export async function initBackgroundRunner() {
  try {
    if (!window.Capacitor || window.Capacitor.getPlatform() === 'web') return;
    const runner = window.Capacitor?.Plugins?.BackgroundRunner;
    if (!runner) return;

    if (typeof runner.checkPermissions === 'function') {
      const p = await runner.checkPermissions();
      if (p?.background !== 'granted' && typeof runner.requestPermissions === 'function') {
        await runner.requestPermissions();
      }
    }
  } catch (err) {
    console.warn('BackgroundRunner init skipped', err);
  }
}
