import React, { useState } from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';

export const AdminFleetHubScreen: React.FC = () => {
  const { telemetry, triggerPushNotification, inspectEncryption, stops, resetShiftDemo } = useDelivery();
  const { user, switchRole } = useAuth();

  const [activeApiTab, setActiveApiTab] = useState<'status' | 'manifest' | 'telemetry' | 'push'>('status');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [isCallingApi, setIsCallingApi] = useState(false);
  const [customPushText, setCustomPushText] = useState('Traffic slowdown on Parkes Way. Rerouting via Belconnen Way.');
  const [customPushTitle, setCustomPushTitle] = useState('Central Dispatch Advisory');

  const fleetVans = [
    { id: 'VAN-01', model: 'Ford Transit 350', driver: 'Michael Chen', status: 'ACTIVE_EN_ROUTE', speed: `${telemetry.speedKmh} km/h`, stops: '3/5', fuel: '78%' },
    { id: 'VAN-02', model: 'Mercedes Sprinter', driver: 'David Vance', status: 'STANDBY_DEPOT', speed: '0 km/h', stops: '0/6', fuel: '92%' },
    { id: 'VAN-03', model: 'Iveco Daily', driver: 'Alex Rivera', status: 'ACTIVE_DELIVERING', speed: '24 km/h', stops: '6/7', fuel: '65%' }
  ];

  const handleTestApi = async (endpoint: string, method: string = 'GET', body?: unknown) => {
    setIsCallingApi(true);
    setApiResponse(null);
    setApiStatus(null);

    const startTime = performance.now();
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await res.json();
      const elapsed = Math.round(performance.now() - startTime);
      setApiStatus(res.status);
      setApiResponse(JSON.stringify(data, null, 2) + `\n\n// Response Time: ${elapsed}ms\n// Status: ${res.status} OK`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setApiStatus(500);
      setApiResponse(`// Error connecting to backend: ${msg}`);
    } finally {
      setIsCallingApi(false);
    }
  };

  const handleBroadcastPush = () => {
    triggerPushNotification(customPushTitle, customPushText, 'DISPATCH');
    apiClient.sendPushNotification({
      title: customPushTitle,
      message: customPushText,
      recipientType: 'ALL_FLEET'
    });
  };

  return (
    <div className="flex flex-col w-full pb-28 max-w-md mx-auto px-4 pt-20">
      <div className="space-y-4">
        {/* Admin Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 tracking-wider">
                Admin Fleet Console
              </span>
              <span className="px-2 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                Tier 3 Dispatch
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Canberra Central Depot Hub
            </h2>
          </div>

          <button
            onClick={() => switchRole('DRIVER')}
            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>Driver Mode</span>
          </button>
        </div>

        {/* Fleet KPIs */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Fleet Units</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
              3 Active
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">• 100% Online</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Deliveries</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
              18 / 20
            </span>
            <span className="text-[10px] text-slate-400 font-mono">90% Done</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Security Wire</span>
            <span className="text-xl font-bold font-mono text-emerald-600 mt-0.5 block">
              TLS 1.3
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">AES-256 OK</span>
          </div>
        </div>

        {/* Fleet Vehicles Status Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-600 text-[20px]">
                local_shipping
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Active Fleet Units
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Depot: FL-AU-409</span>
          </div>

          <div className="space-y-2">
            {fleetVans.map(van => (
              <div
                key={van.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {van.id}
                    </span>
                    <span className="text-slate-400">· {van.model}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Driver: <strong className="text-slate-700 dark:text-slate-200">{van.driver}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      van.status === 'ACTIVE_EN_ROUTE'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : van.status === 'STANDBY_DEPOT'
                        ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    {van.status}
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {van.speed} · {van.stops} Stops
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Integration RESTful API Hub */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider">
              Mobile Integration Hub
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              RESTful Backend API Test Console
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Live HTTP REST endpoints for native iOS/Android mobile fleet apps.
            </p>
          </div>

          {/* Endpoint selector buttons */}
          <div className="grid grid-cols-2 gap-1.5 text-xs font-mono font-semibold">
            <button
              onClick={() => {
                setActiveApiTab('status');
                handleTestApi('/api/fleet/status', 'GET');
              }}
              className={`p-2 rounded-lg text-left transition-all ${
                activeApiTab === 'status'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              GET /api/fleet/status
            </button>

            <button
              onClick={() => {
                setActiveApiTab('manifest');
                handleTestApi('/api/manifest/today', 'GET');
              }}
              className={`p-2 rounded-lg text-left transition-all ${
                activeApiTab === 'manifest'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              GET /api/manifest/today
            </button>

            <button
              onClick={() => {
                setActiveApiTab('telemetry');
                handleTestApi('/api/telemetry/location', 'POST', {
                  vanId: 'VAN-01',
                  lat: telemetry.currentLocation.lat,
                  lng: telemetry.currentLocation.lng,
                  speed: telemetry.speedKmh
                });
              }}
              className={`p-2 rounded-lg text-left transition-all ${
                activeApiTab === 'telemetry'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              POST /api/telemetry
            </button>

            <button
              onClick={() => {
                setActiveApiTab('push');
                handleTestApi('/api/notifications/push', 'POST', {
                  title: 'Dispatched from Hub',
                  message: 'Automated test alert',
                  recipient: 'DRV-4092'
                });
              }}
              className={`p-2 rounded-lg text-left transition-all ${
                activeApiTab === 'push'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              POST /api/push
            </button>
          </div>

          {/* Response Viewer */}
          <div className="relative rounded-xl bg-slate-950 p-3 text-emerald-400 font-mono text-[11px] border border-slate-800 max-h-52 overflow-y-auto">
            {isCallingApi ? (
              <div className="flex items-center gap-2 py-4 justify-center text-slate-400">
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                <span>Executing HTTP Request...</span>
              </div>
            ) : apiResponse ? (
              <pre className="whitespace-pre-wrap">{apiResponse}</pre>
            ) : (
              <span className="text-slate-500">Tap an endpoint above to execute live REST call.</span>
            )}
          </div>
        </div>

        {/* Automated Push Broadcaster Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600 text-[20px]">
                campaign
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Automated Push Broadcaster
              </h3>
            </div>
            <span className="text-[10px] font-bold text-purple-600">FCM / WebPush Ready</span>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={customPushTitle}
              onChange={e => setCustomPushTitle(e.target.value)}
              placeholder="Notification Title"
              className="w-full h-9 px-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
            />
            <textarea
              value={customPushText}
              onChange={e => setCustomPushText(e.target.value)}
              rows={2}
              placeholder="Push payload text..."
              className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 resize-none"
            />
          </div>

          <button
            onClick={handleBroadcastPush}
            className="w-full h-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
            <span>Broadcast Push to Drivers &amp; Customers</span>
          </button>
        </div>

        {/* Demonstration Control */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
          <span className="text-slate-500">Reset Shift Simulation Data:</span>
          <button
            onClick={resetShiftDemo}
            className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 transition-colors"
          >
            Reset Demo State
          </button>
        </div>
      </div>
    </div>
  );
};
