import { registerPlugin } from '@capacitor/core';

interface StartStopResult {
  started?: boolean;
  stopped?: boolean;
}

interface OpenBatterySettingsResult {
  opened: boolean;
  error?: string;
}

export interface PersistentAdhanPlugin {
  startForegroundService(): Promise<StartStopResult>;
  stopForegroundService(): Promise<StartStopResult>;
  openBatteryOptimizationSettings(): Promise<OpenBatterySettingsResult>;
}

export const PersistentAdhan = registerPlugin<PersistentAdhanPlugin>('PersistentAdhan', {
  web: () => ({
    // No-op implementations for web to avoid runtime errors
    async startForegroundService() {
      return { started: false };
    },
    async stopForegroundService() {
      return { stopped: false };
    },
    async openBatteryOptimizationSettings() {
      return { opened: false };
    },
  } as PersistentAdhanPlugin),
});

