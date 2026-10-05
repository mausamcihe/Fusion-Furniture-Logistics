import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  DeliveryStop,
  ShiftLog,
  TelemetryState,
  PushNotification,
  ChatMessage,
  EncryptedPayloadView
} from '../types';
import {
  INITIAL_STOPS,
  INITIAL_SHIFT_LOGS,
  INITIAL_TELEMETRY,
  INITIAL_NOTIFICATIONS,
  INITIAL_CHAT_MESSAGES,
  CANBERRA_ROUTES
} from '../services/mockStore';
import { encryptPayload, computeProofOfDeliveryHash } from '../services/encryption';
import { apiClient } from '../services/api';

interface DeliveryContextType {
  stops: DeliveryStop[];
  activeStopId: string;
  activeStop: DeliveryStop | undefined;
  telemetry: TelemetryState;
  shiftLogs: ShiftLog[];
  notifications: PushNotification[];
  chatMessages: ChatMessage[];
  depotChecked: boolean;
  isShiftCompleted: boolean;
  currentEncryptedPayload: EncryptedPayloadView | null;
  trafficSwapApplied: boolean;
  activeRouteWaypoints: { lat: number; lng: number }[];
  setActiveStopId: (id: string) => void;
  markArrivedAtStop: (stopId: string) => Promise<void>;
  toggleItemCheck: (stopId: string, itemId: string) => void;
  completeHandover: (
    stopId: string,
    signatureData: string,
    photoUrl: string,
    recipientName: string
  ) => Promise<{ nextStop: DeliveryStop | null }>;
  reportIssue: (stopId: string, reason: string, note: string, photoUrl?: string) => Promise<void>;
  moveStop: (stopId: string, direction: 'up' | 'down') => void;
  autoOptimizeRoute: () => void;
  applySuggestedSwap: () => void;
  sendChatMessage: (text: string, sender?: 'DRIVER' | 'CUSTOMER') => void;
  triggerPushNotification: (
    title: string,
    message: string,
    type?: PushNotification['type'],
    actionText?: string,
    actionScreen?: string
  ) => void;
  dismissNotification: (id: string) => void;
  toggleDepotCheck: () => void;
  clockOutShift: () => void;
  resetShiftDemo: () => void;
  inspectEncryption: (data: unknown) => Promise<void>;
  closeEncryptionInspector: () => void;
  toggleSimulation: () => void;
  toggleRealGps: (enabled: boolean) => void;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const DeliveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stops, setStops] = useState<DeliveryStop[]>(() => {
    const saved = localStorage.getItem('fusion_stops_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_STOPS;
  });

  const [activeStopId, setActiveStopId] = useState<string>('3');
  const [telemetry, setTelemetry] = useState<TelemetryState>(INITIAL_TELEMETRY);
  const [shiftLogs, setShiftLogs] = useState<ShiftLog[]>(INITIAL_SHIFT_LOGS);
  const [notifications, setNotifications] = useState<PushNotification[]>(INITIAL_NOTIFICATIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [depotChecked, setDepotChecked] = useState<boolean>(true);
  const [isShiftCompleted, setIsShiftCompleted] = useState<boolean>(false);
  const [trafficSwapApplied, setTrafficSwapApplied] = useState<boolean>(false);
  const [currentEncryptedPayload, setCurrentEncryptedPayload] = useState<EncryptedPayloadView | null>(null);

  // Simulation route waypoint progress tracker
  const waypointIndexRef = useRef<number>(1);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('fusion_stops_v2', JSON.stringify(stops));
  }, [stops]);

  const activeStop = stops.find(s => s.id === activeStopId) || stops[2];

  // Compute active route path in Canberra for the current stop
  const routeWaypoints = CANBERRA_ROUTES[activeStopId] || [
    { lat: telemetry.currentLocation.lat, lng: telemetry.currentLocation.lng, instruction: 'En route in Canberra ACT', distanceM: 500 },
    { lat: activeStop.location.lat, lng: activeStop.location.lng, instruction: `Arriving at ${activeStop.address}`, distanceM: 0 }
  ];

  // Real-time live navigation loop: drives along Canberra roads
  useEffect(() => {
    if (telemetry.useRealGps) return; // handled by navigator.geolocation
    if (!telemetry.isSimulating) return;

    const interval = setInterval(() => {
      setTelemetry(prev => {
        if (prev.isStationary) {
          return { ...prev, speedKmh: 0 };
        }

        const currentRoute = CANBERRA_ROUTES[activeStopId] || routeWaypoints;
        const totalPoints = currentRoute.length;
        let currIdx = waypointIndexRef.current;

        // If reached end of route, linger at destination with stationary status
        if (currIdx >= totalPoints - 1) {
          const dest = currentRoute[totalPoints - 1];
          return {
            ...prev,
            currentLocation: { lat: dest.lat, lng: dest.lng },
            distanceRemainingMeters: 0,
            nextDistanceMeters: 0,
            speedKmh: Math.max(0, prev.speedKmh - 8),
            isStationary: prev.speedKmh <= 5,
            nextInstruction: dest.instruction,
            geofenceStatus: 'At Destination Loading Bay'
          };
        }

        // Advance towards next waypoint
        const targetWp = currentRoute[currIdx];
        const step = 0.35; // smooth interpolation speed
        const dLat = (targetWp.lat - prev.currentLocation.lat) * step;
        const dLng = (targetWp.lng - prev.currentLocation.lng) * step;

        const nextLat = prev.currentLocation.lat + dLat;
        const nextLng = prev.currentLocation.lng + dLng;

        // Calculate heading (bearing) towards target waypoint
        const y = Math.sin(targetWp.lng - prev.currentLocation.lng) * Math.cos(targetWp.lat);
        const x =
          Math.cos(prev.currentLocation.lat) * Math.sin(targetWp.lat) -
          Math.sin(prev.currentLocation.lat) * Math.cos(targetWp.lat) * Math.cos(targetWp.lng - prev.currentLocation.lng);
        let brng = (Math.atan2(y, x) * 180) / Math.PI;
        brng = (brng + 360) % 360;

        // Check if close enough to increment waypoint
        const distToWp = Math.hypot(targetWp.lat - nextLat, targetWp.lng - nextLng);
        if (distToWp < 0.0004) {
          waypointIndexRef.current = Math.min(totalPoints - 1, currIdx + 1);
        }

        // Realistic driving speed variation
        const speedFluctuation = Math.floor(Math.random() * 5) - 2;
        const targetSpeed = targetWp.distanceM < 150 ? 24 : 48;
        const newSpeed = Math.max(18, Math.min(58, targetSpeed + speedFluctuation));

        const distRem = targetWp.distanceM;
        const timeRem = Math.max(1, Math.ceil(distRem / 650));

        return {
          ...prev,
          currentLocation: { lat: nextLat, lng: nextLng },
          heading: Math.round(brng || prev.heading),
          speedKmh: newSpeed,
          distanceRemainingMeters: distRem,
          timeRemainingMinutes: timeRem,
          nextInstruction: targetWp.instruction,
          nextDistanceMeters: Math.min(distRem, Math.round(distRem * 0.45)),
          geofenceStatus: distRem <= 150 ? '100m Arrival Zone Near' : 'En Route Zone 4-B'
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [activeStopId, telemetry.isSimulating, telemetry.useRealGps, routeWaypoints]);

  // Real device GPS toggle
  const toggleRealGps = (enabled: boolean) => {
    if (enabled && 'geolocation' in navigator) {
      setTelemetry(prev => ({ ...prev, useRealGps: true, isSimulating: false }));
      const id = navigator.geolocation.watchPosition(
        pos => {
          setTelemetry(prev => ({
            ...prev,
            currentLocation: { lat: pos.coords.latitude, lng: pos.coords.longitude },
            speedKmh: Math.round((pos.coords.speed || 0) * 3.6) || 45,
            heading: Math.round(pos.coords.heading || prev.heading),
            gpsLock: true
          }));
        },
        err => {
          console.warn('Geolocation error, fallback to Canberra route', err);
          setTelemetry(prev => ({ ...prev, useRealGps: false, isSimulating: true }));
        },
        { enableHighAccuracy: true }
      );
      watchIdRef.current = id;
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setTelemetry(prev => ({ ...prev, useRealGps: false, isSimulating: true }));
    }
  };

  const toggleSimulation = () => {
    setTelemetry(prev => ({ ...prev, isSimulating: !prev.isSimulating }));
  };

  const inspectEncryption = async (data: unknown) => {
    const encrypted = await encryptPayload(data);
    setCurrentEncryptedPayload(encrypted);
  };

  const closeEncryptionInspector = () => {
    setCurrentEncryptedPayload(null);
  };

  const triggerPushNotification = useCallback(
    (
      title: string,
      message: string,
      type: PushNotification['type'] = 'INFO',
      actionText?: string,
      actionScreen?: string
    ) => {
      const newNotif: PushNotification = {
        id: 'notif-' + Date.now(),
        title,
        message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type,
        read: false,
        actionText,
        actionScreen
      };
      setNotifications(prev => [newNotif, ...prev]);

      apiClient.sendPushNotification({
        title,
        message,
        recipientType: 'DRIVER_AND_ADMIN'
      });
    },
    []
  );

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markArrivedAtStop = async (stopId: string) => {
    setTelemetry(prev => ({
      ...prev,
      speedKmh: 0,
      isStationary: true,
      geofenceStatus: 'At Destination Loading Dock'
    }));

    triggerPushNotification(
      'Arrival Confirmed',
      `Van 01 has arrived at Stop #${stopId} (${activeStop?.address}, ${activeStop?.suburb}). Vehicle stationary.`,
      'SUCCESS'
    );
  };

  const toggleItemCheck = (stopId: string, itemId: string) => {
    setStops(prev =>
      prev.map(stop => {
        if (stop.id !== stopId) return stop;
        return {
          ...stop,
          items: stop.items.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          )
        };
      })
    );
  };

  // AUTOMATIC NEXT DELIVERY PROGRESSION
  // Completes current stop (e.g. Stop 3 DLV-1049) and promotes next pending stop (e.g. Stop 4 DLV-1050) to ACTIVE
  const completeHandover = async (
    stopId: string,
    signatureData: string,
    photoUrl: string,
    recipientName: string
  ): Promise<{ nextStop: DeliveryStop | null }> => {
    const timestamp =
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' AEST';
    const hash = await computeProofOfDeliveryHash(stopId, timestamp, recipientName);

    // 1. Identify current stop index and find next upcoming stop in sequence synchronously
    const currentIdx = stops.findIndex(s => s.id === stopId);
    const candidate =
      stops.slice(currentIdx + 1).find(s => s.status === 'UPCOMING') ||
      stops.find(s => s.id !== stopId && s.status === 'UPCOMING') ||
      null;

    const nextPromotedStop: DeliveryStop | null = candidate ? { ...candidate, status: 'ACTIVE' as const } : null;

    // 2. Update stops array synchronously
    const updatedStops = stops.map(s => {
      if (s.id === stopId) {
        return {
          ...s,
          status: 'DELIVERED' as const,
          completedTime: timestamp,
          proofOfDelivery: {
            signatureData,
            photoUrl,
            timestamp,
            signedBy: recipientName,
            verifiedHash: hash,
            isEncrypted: true
          }
        };
      }
      if (nextPromotedStop && s.id === nextPromotedStop.id) {
        return nextPromotedStop;
      }
      return s;
    });

    setStops(updatedStops);
    try {
      localStorage.setItem('fusion_stops_v2', JSON.stringify(updatedStops));
    } catch {}

    // 3. Advance active stop state directly to next stop (e.g. Stop 4: Olivia Martin, 25 Simpson St, Watson ACT)
    if (nextPromotedStop) {
      const nextId = nextPromotedStop.id;
      setActiveStopId(nextId);
      waypointIndexRef.current = 0; // reset route waypoint pointer for next stop

      // Set initial vehicle coordinates for the next route
      const nextRoute = CANBERRA_ROUTES[nextId];
      const startLoc = nextRoute && nextRoute.length > 0
        ? { lat: nextRoute[0].lat, lng: nextRoute[0].lng }
        : { lat: -35.2858, lng: 149.1362 };

      const firstWp = nextRoute && nextRoute[0];

      setTelemetry(prev => ({
        ...prev,
        isStationary: false,
        speedKmh: 48,
        currentLocation: startLoc,
        distanceRemainingMeters: firstWp ? firstWp.distanceM : 7200,
        timeRemainingMinutes: 9,
        nextInstruction: firstWp ? firstWp.instruction : `Depart towards ${nextPromotedStop.address}, ${nextPromotedStop.suburb}`,
        nextDistanceMeters: 450,
        geofenceStatus: `En Route to Stop #${nextPromotedStop.sequenceNumber} (${nextPromotedStop.suburb})`
      }));

      triggerPushNotification(
        'Stop Completed & Routed Next',
        `Stop #${stopId} completed. Automatically routing to Stop #${nextPromotedStop.sequenceNumber}: ${nextPromotedStop.customerName} (${nextPromotedStop.address}, ${nextPromotedStop.suburb})!`,
        'SUCCESS',
        'Open Live Route',
        'MAP'
      );
    } else {
      // All stops finished!
      setIsShiftCompleted(true);
      triggerPushNotification(
        'All Deliveries Completed',
        'All 5 stops delivered successfully! Route cleared for depot handover.',
        'SUCCESS',
        'View Shift Summary',
        'SUMMARY'
      );
    }

    return { nextStop: nextPromotedStop };
  };

  const reportIssue = async (stopId: string, reason: string, note: string, photoUrl?: string) => {
    const currentIdx = stops.findIndex(s => s.id === stopId);
    const candidate =
      stops.slice(currentIdx + 1).find(s => s.status === 'UPCOMING') ||
      stops.find(s => s.id !== stopId && s.status === 'UPCOMING') ||
      null;

    const nextPromotedStop: DeliveryStop | null = candidate ? { ...candidate, status: 'ACTIVE' as const } : null;

    const updatedStops = stops.map(s => {
      if (s.id === stopId) {
        return {
          ...s,
          status: 'RESCHEDULED' as const,
          exceptionReason: reason,
          exceptionNote: note,
          exceptionPhotoUrl: photoUrl
        };
      }
      if (nextPromotedStop && s.id === nextPromotedStop.id) {
        return nextPromotedStop;
      }
      return s;
    });

    setStops(updatedStops);
    try {
      localStorage.setItem('fusion_stops_v2', JSON.stringify(updatedStops));
    } catch {}

    if (nextPromotedStop) {
      const nextId = nextPromotedStop.id;
      setActiveStopId(nextId);
      waypointIndexRef.current = 0;
      const nextRoute = CANBERRA_ROUTES[nextId];
      const startLoc = nextRoute && nextRoute.length > 0
        ? { lat: nextRoute[0].lat, lng: nextRoute[0].lng }
        : { lat: -35.2858, lng: 149.1362 };

      setTelemetry(prev => ({
        ...prev,
        isStationary: false,
        speedKmh: 42,
        currentLocation: startLoc,
        geofenceStatus: `En Route to Stop #${nextPromotedStop.sequenceNumber} (${nextPromotedStop.suburb})`
      }));
    }

    triggerPushNotification(
      'Issue Logged & Dispatched',
      `Stop #${stopId} marked as Rescheduled: "${reason}". Automatically routing to next stop.`,
      'SECURITY',
      'View Route',
      'MAP'
    );
  };

  const moveStop = (stopId: string, direction: 'up' | 'down') => {
    setStops(prev => {
      const index = prev.findIndex(s => s.id === stopId);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 2 || targetIndex >= prev.length) return prev;

      const updated = [...prev];
      const [removed] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, removed);
      return updated.map((s, idx) => ({ ...s, sequenceNumber: idx + 1 }));
    });
  };

  const applySuggestedSwap = () => {
    setStops(prev => {
      const idx3 = prev.findIndex(s => s.id === '3');
      const idx4 = prev.findIndex(s => s.id === '4');
      if (idx3 === -1 || idx4 === -1) return prev;

      const updated = [...prev];
      const stop4 = updated[idx4];
      updated.splice(idx4, 1);
      updated.splice(idx3, 0, stop4);
      return updated.map((s, idx) => ({ ...s, sequenceNumber: idx + 1 }));
    });

    setTrafficSwapApplied(true);
    triggerPushNotification(
      'AI Recommendation Applied',
      'Parkes Way bypass applied: Stop #4 moved before Stop #3 (-22 min delay saved).',
      'TRAFFIC'
    );
  };

  const autoOptimizeRoute = () => {
    applySuggestedSwap();
    triggerPushNotification(
      'Route Fully Optimized',
      'Telemetry recalculated via Google Maps Route API: Saved 14 km and 22 mins.',
      'SUCCESS'
    );
  };

  const sendChatMessage = (text: string, sender: 'DRIVER' | 'CUSTOMER' = 'DRIVER') => {
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender,
      senderName: sender === 'DRIVER' ? 'Michael Chen (Van 01)' : 'James Wilson',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);

    if (sender === 'DRIVER') {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'CUSTOMER',
          senderName: activeStop?.customerName || 'James Wilson',
          text: 'Thanks Michael! Gate buzzer is ready and service elevator is cleared.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(curr => [...curr, reply]);
      }, 2500);
    }
  };

  const toggleDepotCheck = () => {
    setDepotChecked(prev => !prev);
  };

  const clockOutShift = () => {
    setIsShiftCompleted(true);
    triggerPushNotification(
      'Shift Successfully Closed',
      'Van 01 returned to Bay 4. All fuel, telemetry, and PODs synchronized with Central Depot.',
      'SUCCESS'
    );
  };

  const resetShiftDemo = () => {
    setStops(INITIAL_STOPS);
    setActiveStopId('3');
    setTelemetry(INITIAL_TELEMETRY);
    setIsShiftCompleted(false);
    setTrafficSwapApplied(false);
    waypointIndexRef.current = 1;
    localStorage.removeItem('fusion_stops_v2');
  };

  return (
    <DeliveryContext.Provider
      value={{
        stops,
        activeStopId,
        activeStop,
        telemetry,
        shiftLogs,
        notifications,
        chatMessages,
        depotChecked,
        isShiftCompleted,
        currentEncryptedPayload,
        trafficSwapApplied,
        activeRouteWaypoints: routeWaypoints.map(w => ({ lat: w.lat, lng: w.lng })),
        setActiveStopId,
        markArrivedAtStop,
        toggleItemCheck,
        completeHandover,
        reportIssue,
        moveStop,
        autoOptimizeRoute,
        applySuggestedSwap,
        sendChatMessage,
        triggerPushNotification,
        dismissNotification,
        toggleDepotCheck,
        clockOutShift,
        resetShiftDemo,
        inspectEncryption,
        closeEncryptionInspector,
        toggleSimulation,
        toggleRealGps
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (!context) throw new Error('useDelivery must be used within DeliveryProvider');
  return context;
};
