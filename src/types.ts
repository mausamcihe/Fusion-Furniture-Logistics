export type UserRole = 'DRIVER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  vehicleId?: string;
  depot: string;
  avatarUrl?: string;
  badgeNumber?: string;
}

export interface CargoItem {
  id: string;
  name: string;
  description: string;
  weight: string;
  checked: boolean;
  category: 'furniture' | 'mattress' | 'box';
}

export type DeliveryStatus = 'DELIVERED' | 'ACTIVE' | 'UPCOMING' | 'RESCHEDULED';

export interface DeliveryStop {
  id: string;
  sequenceNumber: number;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  address: string;
  suburb: string;
  status: DeliveryStatus;
  eta: string;
  deliveryWindow: string;
  completedTime?: string;
  priority?: 'HIGH' | 'NORMAL';
  gateCode?: string;
  keybox?: string;
  intercomNote?: string;
  loadingBayNote?: string;
  conciergeName?: string;
  conciergePhone?: string;
  gatePhotoUrl?: string;
  items: CargoItem[];
  location: { lat: number; lng: number };
  proofOfDelivery?: {
    signatureData?: string;
    photoUrl?: string;
    timestamp?: string;
    signedBy?: string;
    verifiedHash?: string;
    isEncrypted?: boolean;
  };
  exceptionReason?: string;
  exceptionNote?: string;
  exceptionPhotoUrl?: string;
  deliveryInstruction?: string;
}

export interface ShiftLog {
  id: string;
  date: string;
  displayDate: string;
  vehicle: string;
  stopsCompleted: number;
  stopsTotal: number;
  duration: string;
  mileage: string;
  status: 'All Complete' | '1 Rescheduled' | 'In Progress';
  podsCount: number;
  notes: string;
  depot: string;
  verifiedPODsSnippet?: string[];
}

export interface TelemetryState {
  speedKmh: number;
  heading: number;
  odometer: number;
  fuelPercent: number;
  networkStatus: string;
  encryptionStatus: string;
  geofenceStatus: string;
  currentLocation: { lat: number; lng: number };
  gpsLock: boolean;
  isStationary: boolean;
  distanceRemainingMeters: number;
  timeRemainingMinutes: number;
  nextInstruction: string;
  nextDistanceMeters: number;
  isSimulating: boolean;
  useRealGps: boolean;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'INFO' | 'TRAFFIC' | 'DISPATCH' | 'SUCCESS' | 'SECURITY';
  read: boolean;
  actionText?: string;
  actionScreen?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'DRIVER' | 'CUSTOMER' | 'DISPATCH';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface EncryptedPayloadView {
  iv: string;
  algorithm: string;
  ciphertext: string;
  authTag: string;
  decryptedPlaintext: string;
  signatureHash: string;
  verifiedAt: string;
}
