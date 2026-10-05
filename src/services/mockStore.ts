import { DeliveryStop, ShiftLog, TelemetryState, PushNotification, ChatMessage } from '../types';

export const INITIAL_STOPS: DeliveryStop[] = [
  {
    id: '1',
    sequenceNumber: 1,
    orderId: 'DLV-1045',
    customerName: 'Sarah Johnson',
    customerPhone: '+61 411 234 567',
    address: '14 Barrier St',
    suburb: 'Fyshwick ACT',
    status: 'DELIVERED',
    eta: '09:15 AM',
    completedTime: '09:15 AM',
    deliveryWindow: '08:30 AM – 10:00 AM',
    gateCode: 'UNLOCKED',
    intercomNote: 'Front porch drop authorized if no response. Side gate latch is UNLOCKED.',
    items: [
      { id: 'item-1', name: 'Oak Dining Table', description: '6-Seater Solid Oak · 45 kg', weight: '45 kg', checked: true, category: 'furniture' },
      { id: 'item-2', name: 'Dining Chairs Set (x4)', description: 'Upholstered Fabric · 28 kg', weight: '28 kg', checked: true, category: 'furniture' }
    ],
    location: { lat: -35.3287, lng: 149.1764 },
    deliveryInstruction: 'Authorized safe drop at side gate if customer unavailable.',
    proofOfDelivery: {
      signedBy: 'Sarah Johnson (Signature Verified)',
      timestamp: '09:15:22 AM AEST',
      verifiedHash: 'SHA256:7B88A01C92EF4011',
      isEncrypted: true
    }
  },
  {
    id: '2',
    sequenceNumber: 2,
    orderId: 'DLV-1047',
    customerName: 'Marcus Brody',
    customerPhone: '+61 422 345 678',
    address: '74 Denison St',
    suburb: 'Deakin ACT',
    status: 'DELIVERED',
    eta: '10:25 AM',
    completedTime: '10:25 AM',
    deliveryWindow: '10:00 AM – 11:30 AM',
    intercomNote: 'Security desk check-in MANDATORY. Photo ID and manifest sheet required before access.',
    conciergeName: 'Security Desk (Ext: 4409)',
    conciergePhone: '+61 2 6210 0000',
    items: [
      { id: 'item-3', name: 'Executive Ergonomic Chair', description: 'High-back mesh · 22 kg', weight: '22 kg', checked: true, category: 'furniture' },
      { id: 'item-4', name: 'Standing Motorized Desk', description: 'Dual motor 160x80cm · 48 kg', weight: '48 kg', checked: true, category: 'furniture' }
    ],
    location: { lat: -35.3194, lng: 149.1022 },
    deliveryInstruction: 'Deliver to 3rd floor commercial suite after security clearance.',
    proofOfDelivery: {
      signedBy: 'Marcus Brody',
      timestamp: '10:25:04 AM AEST',
      verifiedHash: 'SHA256:4C99D38FA01077EA',
      isEncrypted: true
    }
  },
  {
    id: '3',
    sequenceNumber: 3,
    orderId: 'DLV-1049',
    customerName: 'James Wilson',
    customerPhone: '+61 400 123 456',
    customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ7Sjr5y2lwbiZE9J8buH7CzhmopikPPMJpRztlsH4_rrZV0jdpcMk8YqlyBef-KiQa9iR8eu2PfKcyndA5xC6bK1pfbtiX9htbNEF6z8nFJZNIeh0dh2o3KEJK_cRq22J5oVNHvgIelYfg-3KYrlaZ7Iyb6hicfAGYK3bUa60CxZxYnmPfkZuDbsaNI8PIjaFy8YnvLccekvpYfv1lApsUiaX0o00mz9HoidreF50plFRZ6ZZDmrk',
    address: '42 Constitution Ave',
    suburb: 'Canberra ACT 2601',
    status: 'ACTIVE',
    priority: 'HIGH',
    eta: '11:15 AM',
    deliveryWindow: '11:00 AM – 1:00 PM',
    gateCode: '#402',
    keybox: '9921',
    intercomNote: 'Ring buzzer 12 then press #. Elevator physical key required on 2nd level.',
    loadingBayNote: 'Rear alleyway dock clearance 3.2m. Authorized double parking for 20m with hazard lights active.',
    conciergeName: 'David K.',
    conciergePhone: '+61 2 6200 0000',
    gatePhotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfeBYMlpd7y-dgtnvceBo8gVet5RhT5rEIGetzs6Me6_ZWNUvvYzBf_oZYjSOYUpVKGMoPm1i76dZllpnIWS1-4GDf95UtP-kAqV2p_l1x36y4DlkbAGlFGVBI8LnBX7vTdW-brHGIOdFcBxd98BzgqozI71pmum-GKZx2H3B-Nw167VCjGCl0qCtV9_ldDms4WJzZmxlOp_L6byqEwkJyB_22ua162PtyNZsnt1PevGWzOgq73FX8',
    deliveryInstruction: 'Front door ground level delivery requested.',
    items: [
      { id: 'item-5', name: 'King Bed Frame', description: 'Headboard & Slats · 85 kg', weight: '85 kg', checked: true, category: 'furniture' },
      { id: 'item-6', name: 'Premium Latex Mattress', description: 'Rolled Heavy Care · 55 kg', weight: '55 kg', checked: true, category: 'mattress' }
    ],
    location: { lat: -35.2858, lng: 149.1362 }
  },
  {
    id: '4',
    sequenceNumber: 4,
    orderId: 'DLV-1050',
    customerName: 'Olivia Martin',
    customerPhone: '+61 433 456 789',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    address: '25 Simpson St',
    suburb: 'Watson ACT 2602',
    status: 'UPCOMING',
    priority: 'HIGH',
    eta: '01:30 PM',
    deliveryWindow: '1:30 PM – 3:30 PM',
    gateCode: '8841*',
    intercomNote: 'Rear loading bay at 25 Simpson St. Punch code 8841* to open roller shutter.',
    items: [
      { id: 'item-7', name: 'Modern Velvet 3-Seater Sofa', description: 'Navy Blue Velvet · 72 kg', weight: '72 kg', checked: false, category: 'furniture' },
      { id: 'item-8', name: 'Matching Velvet Ottoman', description: 'Cushioned Top · 18 kg', weight: '18 kg', checked: false, category: 'furniture' },
      { id: 'item-9', name: 'Glass Coffee Table', description: 'Tempered Glass · 30 kg', weight: '30 kg', checked: false, category: 'furniture' }
    ],
    location: { lat: -35.2348, lng: 149.1556 },
    deliveryInstruction: 'Ring intercom upon arrival at 25 Simpson St, Watson. Service lift is reserved.'
  },
  {
    id: '5',
    sequenceNumber: 5,
    orderId: 'DLV-1051',
    customerName: 'Daniel Smith',
    customerPhone: '+61 444 567 890',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    address: '28 Stuart St',
    suburb: 'Griffith ACT 2603',
    status: 'UPCOMING',
    eta: '03:00 PM',
    deliveryWindow: '3:00 PM – 5:00 PM',
    gateCode: 'Unit 4 Intercom',
    intercomNote: 'Ring unit 4 directly. Customer works from home and will release lower lobby magnetic glass door instantly.',
    items: [
      { id: 'item-10', name: 'Solid Walnut Bookshelf', description: '5-Tier Modular Shelf · 64 kg', weight: '64 kg', checked: false, category: 'furniture' }
    ],
    location: { lat: -35.3242, lng: 149.1368 },
    deliveryInstruction: 'Signature and photo of apartment entry required.'
  }
];

export const CANBERRA_ROUTES: Record<string, { lat: number; lng: number; instruction: string; distanceM: number }[]> = {
  // Route to Stop 1: 14 Barrier St, Fyshwick ACT
  '1': [
    { lat: -35.3180, lng: 149.1620, instruction: 'Depart Canberra Depot onto Canberra Ave', distanceM: 2400 },
    { lat: -35.3230, lng: 149.1690, instruction: 'In 500 m Turn left onto Newcastle St', distanceM: 1600 },
    { lat: -35.3265, lng: 149.1730, instruction: 'In 250 m Turn right onto Barrier St', distanceM: 600 },
    { lat: -35.3287, lng: 149.1764, instruction: 'Destination: 14 Barrier St, Fyshwick ACT', distanceM: 0 }
  ],
  // Route to Stop 2: 74 Denison St, Deakin ACT
  '2': [
    { lat: -35.3287, lng: 149.1764, instruction: 'Depart 14 Barrier St via Newcastle St', distanceM: 6200 },
    { lat: -35.3210, lng: 149.1450, instruction: 'Take Hindmarsh Dr towards Deakin', distanceM: 4100 },
    { lat: -35.3180, lng: 149.1120, instruction: 'Turn right onto Denison St', distanceM: 800 },
    { lat: -35.3194, lng: 149.1022, instruction: 'Destination: 74 Denison St, Deakin ACT (Security Desk)', distanceM: 0 }
  ],
  // Route to Stop 3: 42 Constitution Ave, Canberra ACT 2601
  '3': [
    { lat: -35.2805, lng: 149.1290, instruction: 'Continue on London Circuit towards City East', distanceM: 950 },
    { lat: -35.2818, lng: 149.1305, instruction: 'In 240 m Turn right onto Constitution Ave', distanceM: 680 },
    { lat: -35.2835, lng: 149.1325, instruction: 'In 180 m Pass City Square on left', distanceM: 450 },
    { lat: -35.2848, lng: 149.1345, instruction: 'In 100 m Slow down, turn right into Rear Dock B', distanceM: 180 },
    { lat: -35.2858, lng: 149.1362, instruction: 'Destination on right: 42 Constitution Ave Dock B', distanceM: 0 }
  ],
  // Route to Stop 4: 25 Simpson St, Watson ACT 2602 (North Canberra)
  '4': [
    { lat: -35.2858, lng: 149.1362, instruction: 'Depart 42 Constitution Ave onto Coranderrk St', distanceM: 7200 },
    { lat: -35.2825, lng: 149.1338, instruction: 'Turn right onto Cooyong St heading toward Northbourne Ave', distanceM: 6400 },
    { lat: -35.2765, lng: 149.1310, instruction: 'Turn right onto Northbourne Ave heading north toward Watson', distanceM: 5600 },
    { lat: -35.2680, lng: 149.1318, instruction: 'Continue north on Northbourne Ave past Braddon & Haig Park', distanceM: 4500 },
    { lat: -35.2570, lng: 149.1342, instruction: 'Continue north past Dickson Light Rail Interchange', distanceM: 3200 },
    { lat: -35.2470, lng: 149.1410, instruction: 'In 400 m Take slight right onto Antill St toward Watson', distanceM: 1900 },
    { lat: -35.2415, lng: 149.1485, instruction: 'Follow Antill St for 800 m past Watson Shops', distanceM: 1100 },
    { lat: -35.2372, lng: 149.1538, instruction: 'In 150 m Turn left onto Simpson St, Watson', distanceM: 420 },
    { lat: -35.2356, lng: 149.1550, instruction: 'Proceed down Simpson St to 25 Simpson St', distanceM: 120 },
    { lat: -35.2348, lng: 149.1556, instruction: 'Arrived at 25 Simpson St, Watson ACT 2602 (Dock Gate 8841*)', distanceM: 0 }
  ],
  // Route to Stop 5: 28 Stuart St, Griffith ACT 2603 (South Canberra)
  '5': [
    { lat: -35.2348, lng: 149.1556, instruction: 'Depart 25 Simpson St, Watson via Antill St', distanceM: 9200 },
    { lat: -35.2470, lng: 149.1410, instruction: 'Turn left onto Federal Hwy / Northbourne Ave southbound', distanceM: 7800 },
    { lat: -35.2750, lng: 149.1310, instruction: 'Continue south on Northbourne Ave through City Centre', distanceM: 5200 },
    { lat: -35.2980, lng: 149.1290, instruction: 'Cross Commonwealth Ave Bridge over Lake Burley Griffin', distanceM: 2800 },
    { lat: -35.3180, lng: 149.1340, instruction: 'Turn left toward Manuka / Griffith', distanceM: 1100 },
    { lat: -35.3220, lng: 149.1378, instruction: 'In 200 m Turn left onto Stuart St', distanceM: 300 },
    { lat: -35.3242, lng: 149.1368, instruction: 'Destination: 28 Stuart St, Griffith ACT (Unit 4 Intercom)', distanceM: 0 }
  ]
};

export const INITIAL_SHIFT_LOGS: ShiftLog[] = [
  {
    id: 'SR-8921',
    date: '2024-10-01',
    displayDate: 'Wednesday, 1 Oct',
    vehicle: 'Van 01 (Ford Transit)',
    stopsCompleted: 6,
    stopsTotal: 6,
    duration: '8h 12m',
    mileage: '142.4 mi',
    status: 'All Complete',
    podsCount: 6,
    notes: '100% Clean Drop · Zero damages',
    depot: 'Depot SE Metro #4402',
    verifiedPODsSnippet: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBEAUlGNKG3Wo4gEB8nOU9CjBZIpO9tPiHY8yAETLuPGAXUsN4HTpuvAMe9bCNgyhe72z2hHlXfjDYDH_NgdHUapuJcIoPXzcDmx_2OPCdL4ccsIy4Y2iiYmLGOydxTZm7H-AmPw4EqO-Jj9FbWG5wUnCeXNglnJCPPPzkfJX1d8nrf6dgTlzv2GU9djD7tpLhxOwo_pFWAFrcLHN7-NXfaurroRCp-HCZmTp3qhNUJot7T91-Y7Zd6',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB9io9JPDsF14ff3FU3Rxrz1zOOudZn5aglREF8OiJYCWHb8_kdpzu6faCyvR8fpXWP_cmSojRrmCtLwN_3yTGrRTeYFjNfX-JPlmA7cxSxLZ107uB_z5FGLNtM3LeinjqR91TswXTIysT89BdjUi1szpxmBQ0hr5eHHfOsmcfx3X866Y9dCjWRxSdL_y98vReVA-l4fFIjB0bZ6FSTeIhDYUUZIFDWn3ZkN-ni-Oi8qsdqNiT1QhqZ'
    ]
  },
  {
    id: 'SR-8904',
    date: '2024-09-30',
    displayDate: 'Tuesday, 30 Sep',
    vehicle: 'Van 01 (Ford Transit)',
    stopsCompleted: 5,
    stopsTotal: 5,
    duration: '7h 45m',
    mileage: '118.9 mi',
    status: 'All Complete',
    podsCount: 5,
    notes: 'Standard Handover · On-time Tier 1',
    depot: 'Depot SE Metro #4402'
  },
  {
    id: 'SR-8877',
    date: '2024-09-29',
    displayDate: 'Monday, 29 Sep',
    vehicle: 'Van 03 (Iveco Daily)',
    stopsCompleted: 6,
    stopsTotal: 7,
    duration: '8h 30m',
    mileage: '164.2 mi',
    status: '1 Rescheduled',
    podsCount: 6,
    notes: 'Stop 4: Re-routed due to gated commercial code issue',
    depot: 'Depot North #2108'
  },
  {
    id: 'SR-8812',
    date: '2024-09-26',
    displayDate: 'Friday, 26 Sep',
    vehicle: 'Van 01 (Ford Transit)',
    stopsCompleted: 8,
    stopsTotal: 8,
    duration: '8h 05m',
    mileage: '152.0 mi',
    status: 'All Complete',
    podsCount: 8,
    notes: 'Heavy Metro Traffic Route · 100% verified',
    depot: 'Depot SE Metro #4402'
  }
];

export const INITIAL_TELEMETRY: TelemetryState = {
  speedKmh: 48,
  heading: 142,
  odometer: 42891,
  fuelPercent: 78,
  networkStatus: 'FL-NET CONNECTED',
  encryptionStatus: 'TLS 1.3 SECURE',
  geofenceStatus: '100m Arrival Zone Near',
  currentLocation: { lat: -35.2818, lng: 149.1305 },
  gpsLock: true,
  isStationary: false,
  distanceRemainingMeters: 520,
  timeRemainingMinutes: 2,
  nextInstruction: 'In 240 m Turn right onto Constitution Ave',
  nextDistanceMeters: 240,
  isSimulating: true,
  useRealGps: false
};

export const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif-1',
    title: 'Traffic Obstruction Alert',
    message: 'Road closure on Parkes Way (+18m delay). Suggested swap: Stop #4 before Stop #3.',
    timestamp: '10:40 AM',
    type: 'TRAFFIC',
    read: false,
    actionText: 'Review Sequence',
    actionScreen: 'PLANNER'
  },
  {
    id: 'notif-2',
    title: 'Geofence Proximity Alert',
    message: 'Van 01 entered 100m geofence for Stop 03 (James Wilson - 42 Constitution Ave).',
    timestamp: '10:38 AM',
    type: 'INFO',
    read: false,
    actionText: 'View Map',
    actionScreen: 'MAP'
  },
  {
    id: 'notif-3',
    title: 'Dispatch Clearance Synced',
    message: 'Stop 01 & Stop 02 proof of delivery cryptographically verified with Canberra Depot.',
    timestamp: '10:27 AM',
    type: 'SUCCESS',
    read: true
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'chat-1',
    sender: 'DISPATCH',
    senderName: 'Sarah Jenkins (Dispatch Lead)',
    text: 'Hi Michael, Parkes Way has heavy construction delays. Feel free to re-order stop 4 if gate access is ready.',
    timestamp: '10:15 AM'
  },
  {
    id: 'chat-2',
    sender: 'CUSTOMER',
    senderName: 'James Wilson',
    text: 'Hi driver, I am home at 42 Constitution Ave. Let me know when you arrive at Dock B!',
    timestamp: '10:32 AM'
  },
  {
    id: 'chat-3',
    sender: 'DRIVER',
    senderName: 'Michael Chen (Van 01)',
    text: 'Copy that James! Turning onto Cameron Way now. ETA roughly 8 minutes.',
    timestamp: '10:35 AM'
  }
];
