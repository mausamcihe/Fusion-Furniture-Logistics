import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

// RESTful API Mock Backend Plugin for Mobile Integration & Real Network Calls
function mobileApiPlugin(): Plugin {
  return {
    name: 'mobile-rest-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Encrypted-Payload');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        const url = new URL(req.url, 'http://localhost:3000');
        const pathname = url.pathname;

        // GET /api/fleet/status
        if (pathname === '/api/fleet/status' && req.method === 'GET') {
          res.statusCode = 200;
          res.end(JSON.stringify({
            status: 'online',
            network: 'FL-NET',
            tls: 'TLS_1_3',
            depot: 'Canberra Depot 01 (FL-AU-409)',
            activeVans: [
              { id: 'VAN-01', model: 'Ford Transit 350', driver: 'Michael Chen', status: 'ACTIVE_EN_ROUTE', speedKmh: 48, fuelPercent: 78, lat: -35.2809, lng: 149.1300 },
              { id: 'VAN-02', model: 'Mercedes Sprinter', driver: 'Sarah Jenkins', status: 'STANDBY_DEPOT', speedKmh: 0, fuelPercent: 92, lat: -35.3050, lng: 149.1450 },
              { id: 'VAN-03', model: 'Iveco Daily', driver: 'Alex Rivera', status: 'ACTIVE_DELIVERING', speedKmh: 24, fuelPercent: 65, lat: -35.2500, lng: 149.1100 }
            ],
            timestamp: new Date().toISOString()
          }));
          return;
        }

        // GET /api/manifest/today
        if (pathname === '/api/manifest/today' && req.method === 'GET') {
          res.statusCode = 200;
          res.end(JSON.stringify({
            manifestId: 'MNF-2024-10-02-01',
            date: 'Thursday, 2 Oct',
            driverId: 'DRV-4092',
            vehicleId: 'VAN-01',
            stopsTotal: 5,
            stopsCompleted: 2,
            stops: [
              { id: '1', orderId: 'DLV-1045', recipient: 'Sarah Johnson', address: '18 Northbourne Ave, Fyshwick ACT', status: 'DELIVERED', time: '09:15 AM' },
              { id: '2', orderId: 'DLV-1047', recipient: 'Marcus Brody', address: '7 London Cct, Deakin ACT', status: 'DELIVERED', time: '10:25 AM' },
              { id: '3', orderId: 'DLV-1049', recipient: 'James Wilson', address: '42 Constitution Ave, Canberra ACT', status: 'ACTIVE', time: '11:15 AM', gateCode: '#402', keybox: '9921', items: [{ name: 'King Bed Frame', weight: '85 kg' }, { name: 'Premium Latex Mattress', weight: '55 kg' }] },
              { id: '4', orderId: 'DLV-1050', recipient: 'Olivia Martin', address: '12 Eyre St, Kingston ACT', status: 'UPCOMING', time: '01:30 PM', gateCode: '8841*' },
              { id: '5', orderId: 'DLV-1051', recipient: 'Daniel Smith', address: '28 Stuart St, Griffith ACT', status: 'UPCOMING', time: '03:00 PM', gateCode: 'Unit 4 Intercom' }
            ]
          }));
          return;
        }

        // POST /api/telemetry/location
        if (pathname === '/api/telemetry/location' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                message: 'Telemetry synchronized with dispatch server',
                geofenceStatus: 'INSIDE_ZONE_4B',
                receivedAt: new Date().toISOString(),
                payload: data
              }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });
          return;
        }

        // POST /api/notifications/push
        if (pathname === '/api/notifications/push' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              broadcastId: 'PUSH-' + Date.now(),
              deliveredToDevices: 1,
              encrypted: true,
              algorithm: 'AES-256-GCM',
              timestamp: new Date().toISOString()
            }));
          });
          return;
        }

        // Default 404 for unknown API
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Endpoint not found', path: pathname }));
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), mobileApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

