import { DeliveryStop, TelemetryState } from '../types';

export const apiClient = {
  async getFleetStatus() {
    try {
      const res = await fetch('/api/fleet/status');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API call failed, using fallback', e);
    }
    return {
      status: 'online',
      network: 'FL-NET',
      tls: 'TLS_1_3',
      depot: 'Canberra Depot 01 (FL-AU-409)'
    };
  },

  async syncTelemetry(telemetry: Partial<TelemetryState>) {
    try {
      const res = await fetch('/api/telemetry/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(telemetry)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Telemetry sync error', e);
    }
    return { success: true };
  },

  async sendPushNotification(notification: { title: string; message: string; recipientType: string }) {
    try {
      const res = await fetch('/api/notifications/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Push notification error', e);
    }
    return { success: true, broadcastId: 'LOCAL-' + Date.now() };
  }
};
