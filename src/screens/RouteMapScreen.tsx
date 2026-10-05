import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { useDelivery } from '../context/DeliveryContext';
import { ScreenType } from '../components/BottomNav';

interface RouteMapScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenChat: () => void;
}

interface GMapPolyline {
  setPath: (p: { lat: number; lng: number }[]) => void;
  setMap: (m: unknown) => void;
}

// Controller that automatically keeps Canberra route properly bounded and camera centered
function NavigationRouteController({
  vanLocation,
  destinationLocation,
  destinationAddress,
  waypoints,
  isTracking,
  activeStopId
}: {
  vanLocation: { lat: number; lng: number };
  destinationLocation: { lat: number; lng: number };
  destinationAddress: string;
  waypoints: { lat: number; lng: number }[];
  isTracking: boolean;
  activeStopId: string;
}) {
  const map = useMap();
  const polylineRef = useRef<GMapPolyline | null>(null);
  const initialFitDoneRef = useRef<string | null>(null);

  // 1. Initial fitBounds when active stop changes so the map frames the van and destination (e.g. 25 Simpson St, Watson)
  useEffect(() => {
    if (!map) return;
    const win = window as unknown as {
      google?: {
        maps?: {
          LatLngBounds: new () => {
            extend: (p: { lat: number; lng: number }) => void;
          };
          Polyline: new (opts: unknown) => GMapPolyline;
          DirectionsService?: new () => {
            route: (req: unknown, cb: (res: unknown, status: string) => void) => void;
          };
        };
      };
    };

    if (!win.google || !win.google.maps) return;

    // Fit bounds to show van + destination + all waypoints
    const bounds = new win.google.maps.LatLngBounds();
    bounds.extend(vanLocation);
    bounds.extend(destinationLocation);
    waypoints.forEach(wp => bounds.extend(wp));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.fitBounds(bounds as any, {
      top: 70,
      bottom: 70,
      left: 40,
      right: 40
    });
    initialFitDoneRef.current = activeStopId;
  }, [map, activeStopId, destinationLocation.lat, destinationLocation.lng]);

  // 2. Smooth camera follow van when tracking is active
  useEffect(() => {
    if (!map || !isTracking) return;
    map.panTo(vanLocation);
  }, [map, vanLocation, isTracking]);

  // 3. Render glowing polyline along Canberra streets
  useEffect(() => {
    const win = window as unknown as {
      google?: {
        maps?: {
          Polyline: new (opts: unknown) => GMapPolyline;
        };
      };
    };

    if (!map || !win.google || !win.google.maps) return;

    if (!polylineRef.current) {
      polylineRef.current = new win.google.maps.Polyline({
        strokeColor: '#f97316',
        strokeOpacity: 0.95,
        strokeWeight: 6,
        map
      });
    }

    const fullPath = [vanLocation, ...waypoints, destinationLocation];
    polylineRef.current.setPath(fullPath);

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, vanLocation, waypoints, destinationLocation]);

  return null;
}

export const RouteMapScreen: React.FC<RouteMapScreenProps> = ({ onNavigate, onOpenChat }) => {
  const {
    activeStop,
    activeStopId,
    telemetry,
    markArrivedAtStop,
    activeRouteWaypoints,
    toggleSimulation,
    toggleRealGps
  } = useDelivery();

  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [isMuted, setIsMuted] = useState(false);
  const [compassHeading, setCompassHeading] = useState(-28);
  const [isArrived, setIsArrived] = useState(telemetry.isStationary);
  const [isTrackingVehicle, setIsTrackingVehicle] = useState(true);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBbGkv9-u2F5_Sx_4yeGqmxzw_rft5RPDs';

  const handleRecenter = () => {
    setIsTrackingVehicle(true);
  };

  const handleCompassClick = () => {
    setCompassHeading(prev => (prev === -28 ? 0 : -28));
  };

  const handleArrival = async () => {
    setIsArrived(true);
    if (activeStop) {
      await markArrivedAtStop(activeStop.id);
    }
    setTimeout(() => {
      onNavigate('ARRIVAL');
    }, 450);
  };

  const currentDestination = activeStop?.location || { lat: -35.2348, lng: 149.1556 };
  const currentDestinationAddress = activeStop
    ? `${activeStop.address}, ${activeStop.suburb}`
    : '25 Simpson St, Watson ACT 2602';

  return (
    <div className="flex flex-col w-full pb-28 max-w-md mx-auto pt-16 select-none">
      {/* Operational Status Ribbon with Canberra Depot branding */}
      <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold uppercase text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            Van 01 Live
          </span>
          <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px] font-bold uppercase truncate max-w-[170px]">
            {activeStop?.orderId || 'DLV-1050'} · {activeStop?.suburb || 'Watson ACT'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined text-[16px] text-emerald-500">wifi</span>
          <span className="font-mono text-[11px] font-semibold">
            {telemetry.useRealGps ? 'Device GPS' : 'Canberra GPS Lock'}
          </span>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative w-full h-[380px] bg-slate-200 dark:bg-slate-900 overflow-hidden">
        {/* Google Maps Platform API Provider */}
        <APIProvider apiKey={apiKey} libraries={['places', 'marker']}>
          <Map
            defaultCenter={telemetry.currentLocation}
            defaultZoom={15}
            mapTypeId={mapType}
            mapId="DEMO_MAP_ID"
            disableDefaultUI={true}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            onDragstart={() => setIsTrackingVehicle(false)}
            className="w-full h-full"
          >
            {/* Live Route & Camera Bounds Controller */}
            <NavigationRouteController
              vanLocation={telemetry.currentLocation}
              destinationLocation={currentDestination}
              destinationAddress={currentDestinationAddress}
              waypoints={activeRouteWaypoints || []}
              isTracking={isTrackingVehicle}
              activeStopId={activeStopId}
            />

            {/* Moving Van Marker with Heading Direction */}
            <AdvancedMarker position={telemetry.currentLocation}>
              <div className="relative flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-orange-500/25 animate-ping absolute"></div>
                <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 shadow-xl border-2 border-orange-600 flex items-center justify-center z-10">
                  <span
                    className="material-symbols-outlined text-orange-600 text-[20px] transition-transform duration-300"
                    style={{ transform: `rotate(${telemetry.heading}deg)` }}
                  >
                    navigation
                  </span>
                </div>
              </div>
            </AdvancedMarker>

            {/* Destination Marker Pin in Canberra ACT (e.g. 25 Simpson St, Watson) */}
            {activeStop && (
              <AdvancedMarker position={activeStop.location}>
                <div className="relative flex flex-col items-center">
                  <Pin background="#ff7700" glyphColor="#ffffff" borderColor="#9b4600">
                    <span className="font-bold text-[10px] text-white">
                      #{activeStop.sequenceNumber}
                    </span>
                  </Pin>
                  <div className="px-2 py-0.5 mt-0.5 rounded bg-slate-900/90 text-white font-mono text-[9px] font-bold shadow-md whitespace-nowrap">
                    {activeStop.address}
                  </div>
                </div>
              </AdvancedMarker>
            )}
          </Map>
        </APIProvider>

        {/* Top Floating Turn Prompt HUD */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-20">
          <div className="pointer-events-auto flex items-center gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 max-w-[75%]">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">
                {telemetry.distanceRemainingMeters <= 50 ? 'flag' : 'turn_slight_right'}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-[13px] font-bold text-slate-900 dark:text-white block leading-tight truncate">
                {telemetry.distanceRemainingMeters > 0
                  ? `In ${telemetry.nextDistanceMeters} m`
                  : 'Arrived at Loading Bay'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                {telemetry.nextInstruction}
              </span>
            </div>
          </div>

          {/* Speed Gauge Badge */}
          <div className="pointer-events-auto flex flex-col items-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800">
            <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 flex items-center justify-center">
              <span className="text-[11px] font-bold text-red-600 dark:text-red-400 font-mono">
                60
              </span>
            </div>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="text-[15px] font-bold text-slate-900 dark:text-white font-mono leading-none">
                {telemetry.speedKmh}
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-semibold">km/h</span>
            </div>
          </div>
        </div>

        {/* Floating Interactive Controls (GPS, Compass, Satellite, Audio, Recenter) */}
        <div className="absolute right-3 bottom-3 flex flex-col gap-2 z-20">
          {/* Live Navigation Drive Toggle (Simulate Driving / Pause) */}
          <button
            onClick={toggleSimulation}
            className={`w-10 h-10 rounded-xl shadow-md flex items-center justify-center border transition-all active:scale-95 ${
              telemetry.isSimulating
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
            title={telemetry.isSimulating ? 'Pause Live Route' : 'Resume Live Drive'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {telemetry.isSimulating ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Device Real GPS Toggle */}
          <button
            onClick={() => toggleRealGps(!telemetry.useRealGps)}
            className={`w-10 h-10 rounded-xl shadow-md flex items-center justify-center border transition-all active:scale-95 ${
              telemetry.useRealGps
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle Real Device Location GPS"
          >
            <span className="material-symbols-outlined text-[20px]">gps_fixed</span>
          </button>

          {/* Compass Rotate */}
          <button
            onClick={handleCompassClick}
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md flex items-center justify-center border border-slate-200 dark:border-slate-700 active:scale-95 transition-transform"
            title="Rotate Heading"
          >
            <span
              className="material-symbols-outlined text-[20px] text-orange-600 dark:text-orange-400 transition-transform"
              style={{ transform: `rotate(${compassHeading}deg)` }}
            >
              navigation
            </span>
          </button>

          {/* Satellite Layer */}
          <button
            onClick={() => setMapType(prev => (prev === 'roadmap' ? 'satellite' : 'roadmap'))}
            className={`w-10 h-10 rounded-xl shadow-md flex items-center justify-center border transition-colors active:scale-95 ${
              mapType === 'satellite'
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle Satellite Imagery"
          >
            <span className="material-symbols-outlined text-[20px]">layers</span>
          </button>

          {/* Audio Guidance Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md flex items-center justify-center border border-slate-200 dark:border-slate-700 active:scale-95 transition-colors"
            title={isMuted ? 'Unmute Audio Guidance' : 'Mute Guidance'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>

          {/* Recenter Camera on Van */}
          <button
            onClick={handleRecenter}
            className={`w-10 h-10 rounded-xl shadow-md flex items-center justify-center active:scale-95 transition-transform ${
              isTrackingVehicle
                ? 'bg-orange-600 text-white'
                : 'bg-white dark:bg-slate-800 text-orange-600 border border-slate-200 dark:border-slate-700'
            }`}
            title="Lock Camera & Follow Van"
          >
            <span className="material-symbols-outlined text-[20px]">my_location</span>
          </button>
        </div>

        {/* Geofence Proximity Pill */}
        <div className="absolute left-3 bottom-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 z-20">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
          <span className="text-[11px] font-bold text-slate-900 dark:text-white">
            {telemetry.geofenceStatus}
          </span>
        </div>
      </div>

      {/* Dispatch Bottom Sheet / Customer Delivery Profile */}
      <div className="p-4 space-y-3.5 bg-slate-50 dark:bg-slate-950">
        {/* Recipient Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border-2 border-orange-500">
                <img
                  src={
                    activeStop?.customerAvatar ||
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={activeStop?.customerName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {activeStop?.customerName}
                  </h2>
                  <span className="material-symbols-outlined text-blue-500 text-[18px]">
                    verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-mono">
                  Order #{activeStop?.orderId} · {activeStop?.deliveryWindow}
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 text-[11px] font-bold uppercase tracking-wider shrink-0">
              Stop {activeStop?.sequenceNumber} of 5
            </span>
          </div>

          {/* Operational ETA Banner (Live Calculated) */}
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">ETA</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                {activeStop?.eta || '01:30 PM'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Drive Time</span>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400 font-mono">
                {telemetry.timeRemainingMinutes} mins
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                {(telemetry.distanceRemainingMeters / 1000).toFixed(1)} km
              </span>
            </div>
          </div>

          {/* Address & Security Instructions */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200">
              <span className="material-symbols-outlined text-orange-600 text-[18px] shrink-0">
                location_on
              </span>
              <span className="font-bold truncate text-sm">
                {activeStop?.address}, {activeStop?.suburb}
              </span>
            </div>

            {/* Access Pill with dynamic gate code */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <span className="material-symbols-outlined text-[16px]">vpn_key</span>
                <span className="font-mono font-bold truncate">
                  Gate Code: {activeStop?.gateCode || 'None Required'}
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold shrink-0">
                {activeStop?.keybox ? `Box: ${activeStop.keybox}` : 'Direct Dock Access'}
              </span>
            </div>

            {activeStop?.intercomNote && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic px-1">
                Note: {activeStop.intercomNote}
              </p>
            )}
          </div>
        </div>

        {/* Navigation & Contact Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <a
            href={`https://waze.com/ul?q=${encodeURIComponent(
              (activeStop?.address || '') + ' ' + (activeStop?.suburb || 'Canberra ACT')
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-blue-500">explore</span>
            <span>Waze</span>
          </a>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(
              (activeStop?.address || '') + ' ' + (activeStop?.suburb || 'Canberra ACT')
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-emerald-500">map</span>
            <span>Google Maps</span>
          </a>

          <button
            onClick={onOpenChat}
            className="h-11 px-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Message</span>
          </button>
        </div>

        {/* Dynamic Cargo Inspection Tile for Current Active Stop */}
        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXYX3CP-EcR7R9gXgHc2i2PU1cpQzWrpOv4W1ViTMpk7u6sVQMqU6GJbcxbUWwEXdKd--ykwuudIUK5o5AJU36E4RyQjyBXTXeShtwh4QsWHMLc-1tirr5ba9MF1sawtWYEyQUeKZAH0JJwfNxPRDrxWpJ9rzJRtZXCd2BShCSmyXUKVnjD9cemXcdVbqYArqnqtqujgCetYxHkEyq8JKuLcpVs2_TZZZ9YuSpWzey6UqD35u7iDia"
                alt="Cargo package"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-xs text-slate-900 dark:text-white truncate block">
                {activeStop?.items.length}x Furniture Load (
                {activeStop?.items.map(i => `${i.name} ${i.weight}`).join(', ')})
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                Fragile Heavy Load · Inspection verified before dispatch
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-[20px]">
            qr_code_scanner
          </span>
        </div>

        {/* Heavy Primary CTA: Mark Arrived */}
        <button
          onClick={handleArrival}
          className={`w-full min-h-[52px] rounded-xl font-bold text-sm shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isArrived
              ? 'bg-emerald-600 text-white'
              : 'bg-orange-600 hover:bg-orange-500 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">
            {isArrived ? 'verified' : 'done_all'}
          </span>
          <span>
            {isArrived
              ? `Arrival Confirmed · At Stop #${activeStop?.sequenceNumber}`
              : `Mark Arrived at Stop #${activeStop?.sequenceNumber} Location ✓`}
          </span>
        </button>
      </div>
    </div>
  );
};
