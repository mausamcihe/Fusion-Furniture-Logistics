import { EncryptedPayloadView } from '../types';

// Real Web Crypto AES-GCM 256-bit Encryption Engine
const MASTER_FLEET_KEY_HEX = 'e1a49f82bc92305aefb681e89c3d4f5263a17e0892bf45cd870192e4ab6109ce';

async function getKey(): Promise<CryptoKey> {
  const rawKey = new Uint8Array(
    MASTER_FLEET_KEY_HEX.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
  );
  return await window.crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function encryptPayload(data: unknown): Promise<EncryptedPayloadView> {
  const plaintext = JSON.stringify(data);
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(plaintext);

  // Generate 12-byte initialization vector (IV) for AES-GCM
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey();

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128
    },
    key,
    encodedData
  );

  // Compute SHA-256 integrity hash
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', encryptedBuffer);
  const signatureHash = '0x' + bufferToHex(hashBuffer).slice(0, 32);

  const fullHex = bufferToHex(encryptedBuffer);
  // Last 16 bytes (32 hex chars) is the GCM Authentication Tag
  const ciphertext = fullHex.slice(0, -32);
  const authTag = fullHex.slice(-32);

  return {
    iv: bufferToHex(iv.buffer),
    algorithm: 'AES-256-GCM (NIST SP 800-38D)',
    ciphertext,
    authTag,
    decryptedPlaintext: plaintext,
    signatureHash,
    verifiedAt: new Date().toISOString()
  };
}

export async function computeProofOfDeliveryHash(stopId: string, timestamp: string, recipient: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`POD:${stopId}:${recipient}:${timestamp}:FUSION_DEPOT_01`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return 'SHA256:' + bufferToHex(hashBuffer).slice(0, 24).toUpperCase();
}
