import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { useDelivery } from '../context/DeliveryContext';
import { ScreenType } from '../components/BottomNav';

interface CustomerTrackingScreenProps {
  onOpenChat: () => void;
  onNavigate: (screen: ScreenType) => void;
}

function CustomerMapFollower({
  vanLocation,
  destination
}: {
  vanLocation: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
}) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const win = window as unknown as {
      google?: {
        maps?: {
          LatLngBounds: new () => {
            extend: (p: { lat: number; lng: number }) => void;
          };
        };
      };
    };
    if (!win.google || !win.google.maps) return;
    const bounds = new win.google.maps.LatLngBounds();
    bounds.extend(vanLocation);
    if (destination) bounds.extend(destination);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.fitBounds(bounds as any, {
      top: 30,
      bottom: 30,
      left: 30,
      right: 30
    });
  }, [map, vanLocation.lat, vanLocation.lng, destination?.lat, destination?.lng]);
  return null;
}

export const CustomerTrackingScreen: React.FC<CustomerTrackingScreenProps> = ({
  onOpenChat,
  onNavigate
}) => {
  const { activeStop, telemetry } = useDelivery();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBbGkv9-u2F5_Sx_4yeGqmxzw_rft5RPDs';

  const stages = [
    { label: 'Order Picked & Inspected', time: '08:15 AM', done: true },
    { label: 'Dispatched from Canberra Depot', time: '08:45 AM', done: true },
    { label: 'Van 01 In Transit (Live)', time: activeStop?.eta || '11:15 AM', done: false, active: true },
    { label: 'Dock Offloading & Handover', time: 'Est 11:20 AM', done: false },
    { label: 'Delivered & Digitally Signed', time: 'Pending', done: false }
  ];

  return (
    <div className="flex flex-col w-full pb-28 max-w-md mx-auto px-4 pt-20">
      <div className="space-y-4">
        {/* Customer Header Ribbon */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider">
              Customer Live Tracker
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Package Delivery #{activeStop?.orderId || 'DLV-1049'}
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live On Map
          </span>
        </div>

        {/* Live Delivery Map Box */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
          <APIProvider apiKey={apiKey} libraries={['marker']}>
            <Map
              defaultCenter={telemetry.currentLocation}
              defaultZoom={14}
              mapId="DEMO_MAP_ID"
              disableDefaultUI={true}
              internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
              className="w-full h-full"
            >
              {/* Auto bounds follower */}
              <CustomerMapFollower
                vanLocation={telemetry.currentLocation}
                destination={activeStop?.location}
              />

              {/* Van Marker */}
              <AdvancedMarker position={telemetry.currentLocation}>
                <div className="relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-orange-500/30 animate-ping absolute"></div>
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white shadow-lg flex items-center justify-center border-2 border-white">
                    <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  </div>
                </div>
              </AdvancedMarker>

              {/* Destination Marker */}
              {activeStop && (
                <AdvancedMarker position={activeStop.location}>
                  <Pin background="#2563eb" glyphColor="#ffffff" borderColor="#1e3a8a">
                    <span className="material-symbols-outlined text-[14px]">home</span>
                  </Pin>
                </AdvancedMarker>
              )}
            </Map>
          </APIProvider>

          {/* Floating Driver ETA Pill */}
          <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200/80 dark:border-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Van 01 is {telemetry.timeRemainingMinutes} mins away ({telemetry.speedKmh} km/h)
            </span>
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-mono flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-emerald-400">lock</span>
            <span>TLS 1.3 Telematics Encrypted</span>
          </div>
        </div>

        {/* Driver Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-extrabold text-base flex items-center justify-center border-2 border-orange-500">
                  MC
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Michael Chen
                  </h3>
                  <span className="text-[11px] text-amber-500 font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    4.96
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Van 01 (Ford Transit) · 1,420 Safe Deliveries
                </p>
              </div>
            </div>

            {/* Live Chat & Call buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenChat}
                className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 flex items-center justify-center active:scale-95 transition-all shadow-xs"
                title="Live Chat with Driver"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
              </button>
              <a
                href="tel:+61400123456"
                className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center active:scale-95 transition-all shadow-xs"
                title="Call Driver Directly"
              >
                <span className="material-symbols-outlined text-[20px]">call</span>
              </a>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="text-slate-500">Destination:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate ml-2">
              {activeStop?.address}, {activeStop?.suburb}
            </span>
          </div>
        </div>

        {/* Delivery Progress Timeline */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Delivery Lifecycle Progress
          </h3>

          <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
            {stages.map((stage, idx) => (
              <div key={idx} className="relative">
                <span
                  className={`absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                    stage.done
                      ? 'bg-emerald-500'
                      : stage.active
                      ? 'bg-orange-500 ring-4 ring-orange-200 dark:ring-orange-950 animate-pulse'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                ></span>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`font-semibold ${
                      stage.active
                        ? 'text-orange-600 dark:text-orange-400 font-bold'
                        : stage.done
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{stage.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cargo Load in this Delivery */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Shipment Items (2 pkgs)
            </h3>
            <span className="text-[11px] text-orange-600 font-bold">White Glove Room Drop</span>
          </div>

          <div className="space-y-2">
            {activeStop?.items.map(item => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-orange-600 text-[20px]">
                    {item.category === 'mattress' ? 'bed' : 'inventory_2'}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-[11px] text-slate-500">{item.description}</p>
                  </div>
                </div>
                <span className="font-mono text-slate-600 dark:text-slate-300 font-bold">
                  {item.weight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Automated Push Notifications Subscription Toggle */}
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-orange-600 text-[20px]">
              notifications_active
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Live Status Push Alerts
              </p>
              <p className="text-[11px] text-slate-500">SMS &amp; In-app alerts when driver is near</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              notificationsEnabled ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>
      </div>
    </div>
  );
};
